import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";
import translate from "google-translate-api-x";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
  };

  const getCatArabic = (cat: string) => {
    const cats: Record<string, string> = {
      'Games': 'الألعاب', 'Apps': 'التطبيقات', 
      'Action': 'أكشن', 'Arcade': 'أركيد',
      'Racing': 'سباق', 'Simulation': 'محاكاة', 'Simulations': 'محاكاة', 'Sports': 'رياضة',
      'Strategy': 'استراتيجية', 'Role Playing': 'تقمص أدوار', 'Puzzle': 'ألغاز',
      'Casual': 'ألعاب خفيفة', 'Adventure': 'مغامرة', 'Board': 'لوحة',
      'Card': 'ورق', 'Casino': 'كازينو', 'Educational': 'تعليم', 'Education': 'تعليم',
      'Music': 'موسيقى', 'Music & Audio': 'موسيقى', 'Audio': 'موسيقى',
      'Word': 'كلمات', 'Tools': 'أدوات', 'Social': 'تواصل', 'Communication': 'تواصل',
      'Photography': 'تصوير', 'Video Players': 'فيديو', 'Video': 'فيديو',
      'Productivity': 'إنتاجية', 'Personalization': 'تخصيص', 'Lifestyle': 'نمط حياة',
      'Art & Design': 'فن وتصميم', 'Design': 'تصميم', 'Security': 'أمن',
      'System': 'نظام', 'Emulators': 'محاكيات', 'Browsers': 'متصفحات', 'Storage': 'تخزين',
      'Business': 'أعمال', 'Entertainment': 'ترفيه', 'Finance': 'مال', 
      'Health & Fitness': 'صحة ولياقة', 'Medical': 'طب', 'News & Magazines': 'أخبار',
      'Shopping': 'تسوّق', 'Travel & Local': 'سفر', 'Weather': 'طقس'
    };
    return cats[cat] || cat;
  };

  app.get("/api/home", async (req, res) => {
    try {
      const [resHome, resGames, resApps] = await Promise.all([
        fetch('https://5play.org/en/', { headers }),
        fetch('https://5play.org/en/games/', { headers }),
        fetch('https://5play.org/en/apps/', { headers })
      ]);

      const htmlHome = await resHome.text();
      const htmlGames = await resGames.text();
      const htmlApps = await resApps.text();

      const parseAppsList = (html: string) => {
        const $ = cheerio.load(html);
        const results: any[] = [];
        $('.item').each((_, el) => {
           const titleRaw = $(el).find('.title').text().trim() || $(el).find('h3').text().trim();
           const isMod = $(el).find('.card-bubble').text().toLowerCase().includes('mod') || titleRaw.toLowerCase().includes('(mod');
           const cleanTitle = titleRaw.replace(/\s*\(MOD.*?\)\s*/i, '').trim();
           
           const link = $(el).find('a.item-link').attr('href') || $(el).find('a').attr('href') || '';
           const imageRaw = $(el).find('.cover img').attr('src') || $(el).find('.cover img').attr('data-src') || '';
           const iconRaw = $(el).find('.appicon img').attr('src') || $('img[itemprop="image"]').attr('src') || $(el).find('img').attr('src') || '';
           
           const image = imageRaw || iconRaw;
           const icon = iconRaw || imageRaw;
           
           let developer = 'Unknown';
           if (cleanTitle.toLowerCase().includes('minecraft')) developer = 'Mojang';

           if (cleanTitle && link) {
              results.push({
                id: link,
                title: cleanTitle,
                name: cleanTitle,
                image: image ? (image.startsWith('http') ? image : `https://5play.org${image}`) : '',
                icon: icon ? (icon.startsWith('http') ? icon : `https://5play.org${icon}`) : '',
                developer: developer,
                category: link.includes('/games/') ? 'الألعاب' : 'التطبيقات',
                link,
                version: '',
                size: '',
                downloads: '10K+',
                modLabel: isMod ? 'مهكرة' : '',
                description: '',
                screenshots: []
              });
           }
        });
        return results;
      };

      let rawHome = parseAppsList(htmlHome);
      let rawGames = parseAppsList(htmlGames);
      let rawApps = parseAppsList(htmlApps);

      const aiApps: any[] = [];
      const offlineGames: any[] = [];
      const onlineGames: any[] = [];
      
      const homeItems = rawHome;
      const games = rawGames;
      const apps = rawApps;
      
      const modded = homeItems.filter(item => item.modLabel === 'مهكرة');
      const popular = homeItems;

      res.json({ success: true, games, apps, popular, modded, aiApps, offlineGames, onlineGames });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/list", async (req, res) => {
    try {
      const type = req.query.type as string || 'games';
      const page = req.query.page as string || '1';
      const subcategory = req.query.subcategory as string || '';
      
      const baseUrl = type === 'apps' ? 'https://5play.org/en/apps/' : 'https://5play.org/en/games/';
      let url = baseUrl;
      if (subcategory) {
        url = `${baseUrl}${subcategory}/`;
      }
      if (parseInt(page) > 1) {
        url = `${url}page/${page}/`;
      }
      
      const response = await fetch(url, { headers });
      const html = await response.text();
      
      const parseAppsList = (html: string) => {
        const $ = cheerio.load(html);
        const results: any[] = [];
        $('.item').each((_, el) => {
           const titleRaw = $(el).find('.title').text().trim() || $(el).find('h3').text().trim();
           const isMod = $(el).find('.card-bubble').text().toLowerCase().includes('mod') || titleRaw.toLowerCase().includes('(mod');
           const cleanTitle = titleRaw.replace(/\s*\(MOD.*?\)\s*/i, '').trim();
           
           const link = $(el).find('a.item-link').attr('href') || $(el).find('a').attr('href') || '';
           const imageRaw = $(el).find('.cover img').attr('src') || $(el).find('.cover img').attr('data-src') || '';
           const iconRaw = $(el).find('.appicon img').attr('src') || $('img[itemprop="image"]').attr('src') || $(el).find('img').attr('src') || '';
           
           const image = imageRaw || iconRaw;
           const icon = iconRaw || imageRaw;
           
           let developer = 'Unknown';
           if (cleanTitle.toLowerCase().includes('minecraft')) developer = 'Mojang';

           if (cleanTitle && link) {
              results.push({
                id: link,
                title: cleanTitle,
                name: cleanTitle,
                image: image ? (image.startsWith('http') ? image : `https://5play.org${image}`) : '',
                icon: icon ? (icon.startsWith('http') ? icon : `https://5play.org${icon}`) : '',
                developer: developer,
                category: link.includes('/games/') ? 'الألعاب' : 'التطبيقات',
                link,
                version: '',
                size: '',
                downloads: '10K+',
                modLabel: isMod ? 'مهكرة' : '',
                description: '',
                screenshots: []
              });
           }
        });
        return results;
      };

      let rawList = parseAppsList(html);
      let items = rawList;

      res.json({ success: true, items });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/details", async (req, res) => {
    try {
      const url = req.query.url as string;
      const lang = req.query.lang as string || 'ar';
      
      if (!url) {
         return res.status(400).json({ success: false, error: "URL is required" });
      }
      
      const response = await fetch(url, { headers });
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const titleRaw = $('h1').text().trim() || $('title').text().trim();
      const cleanTitle = titleRaw.replace(/\s*\(MOD.*?\)\s*/i, '').replace(/Download\s+/i, '').replace(/\s+for Android.*?$/i, '').trim();
      const isMod = titleRaw.toLowerCase().includes('(mod') || url.includes('mod');
      const modLabel = isMod ? 'مهكرة' : '';

      const iconPath = $('.appview-intro-cont .appicon img').attr('src') || $('img[itemprop="image"]').attr('src') || '';
      const icon = iconPath ? (iconPath.startsWith('http') ? iconPath : `https://5play.org${iconPath}`) : '';
      
      let version = '';
      let reqs = 'Android 5.0+';
      let genreRaw = '';
      
      $('.appview-spec .specs-item').each((i, el) => {
         const label = $(el).find('.spec-label').text().toLowerCase();
         const val = $(el).find('.spec-cont').text().trim();
         if (label.includes('version')) version = val;
         if (label.includes('requirements') || label.includes('android')) reqs = val;
         if (label.includes('genre')) genreRaw = val;
      });
      
      let downloadPageLink = '';
      $('a[href*="do=cdn"]').each((i, el) => {
        downloadPageLink = $(el).attr('href') || '';
      });
      if (downloadPageLink && !downloadPageLink.startsWith('http')) {
         downloadPageLink = `https://5play.org${downloadPageLink}`;
      }

      if (!downloadPageLink) {
          downloadPageLink = $('a.download-btn').attr('href') || '';
      }

      let size = '';
      $('a').each((i, el) => {
         const t = $(el).text();
         if (t.includes(' Mb') || t.includes(' Gb') || t.includes('MB') || t.includes('GB')) {
            const match = t.match(/([\d\.]+\s*(?:Mb|Gb|MB|GB))/i);
            if (match) size = match[1];
         }
      });
      
      let developer = $('span[itemprop="publisher"]').text().trim() || 'Unknown';
      if (developer === 'Unknown') {
         const playUrl = $('meta[itemprop="url"][content*="play.google.com"]').attr('content') || '';
         if (playUrl) {
            const match = playUrl.match(/id=([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/);
            if (match && match[2]) {
               developer = match[2].charAt(0).toUpperCase() + match[2].slice(1);
            }
         }
      }
      if (cleanTitle.toLowerCase().includes('minecraft')) developer = 'Mojang';

      let catRaw = genreRaw;
      if (!catRaw) {
        $('ul[itemtype="https://schema.org/BreadcrumbList"] li').each((i, el) => {
          catRaw = $(el).text().trim();
        });
      }
      const category = getCatArabic(catRaw) || 'التطبيقات';

      let descriptionEn = $('.appview-text').text() || $('div[itemprop="description"]').text() || '';
      descriptionEn = descriptionEn.replace(/\s+/g, ' ').trim();
      let descriptionTrans = descriptionEn;
      let reqsTrans = reqs;
      
      if (lang !== 'en') {
        if (descriptionEn) {
            try {
                const transRes = await translate(descriptionEn, {to: lang});
                descriptionTrans = transRes.text;
            } catch (e) {
                console.error("Translation error", e);
            }
        }
        if (reqs && reqs.toLowerCase() !== 'android' && reqs !== 'Android 5.0+') {
            try {
                const transResReq = await translate(reqs, {to: lang});
                reqsTrans = transResReq.text;
            } catch (e) {
                console.error("Translation error", e);
            }
        }
      }

      const screenshots: string[] = [];
      $('.screenshots img, .screen-list img').each((_, el) => {
         let src = $(el).attr('src');
         if (src) {
           screenshots.push(src.startsWith('http') ? src : `https://5play.org${src}`);
         }
      });
      
      let downloads = '10K+';
      let votesText = '';
      $('span, div, li').each((_, el) => {
         const t = $(el).text();
         if (t.includes('Votes:')) {
            votesText = t;
         }
      });
      const votesMatch = votesText.match(/Votes:\s*(\d+)/i);
      if (votesMatch) {
         let num = parseInt(votesMatch[1]);
         if (num > 1000000) {
            downloads = (num / 1000000).toFixed(1) + 'M+';
         } else if (num > 1000) {
            downloads = (num / 1000).toFixed(1) + 'K+';
         } else {
            downloads = num + '+';
         }
      }

      const responsePayload: any = {
        title: cleanTitle,
        name: cleanTitle,
        description: descriptionTrans,
        screenshots: screenshots.slice(0, 5),
        downloadPageLink,
        modLabel,
        size: size || '',
        downloads,
        version,
        requirements: reqsTrans,
        developer,
        category
      };
      if (icon) responsePayload.icon = icon;
      
      res.json({
        success: true,
        data: responsePayload
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/download", async (req, res) => {
     try {
        const url = req.query.url as string;
        if (!url) {
           return res.status(400).json({ success: false, error: "URL is required" });
        }
        
        const response = await fetch(url, { headers });
        const html = await response.text();
        const $ = cheerio.load(html);
        
        let apkLink = '';
        $('a').each((i, el) => {
           const href = $(el).attr('href');
           const text = $(el).text();
           if (href && href.includes('cloudflarestorage.com') && text.includes('Download')) {
              apkLink = href;
           }
           if (href && href.includes('5play') && href.endsWith('.apk')) {
              apkLink = href;
           }
        });
        
        if (!apkLink) {
           // fallback logic
           apkLink = $('a.btn-fill').attr('href') || $('a.offcounter').attr('href') || '';
        }
        
        if (apkLink) {
           res.json({
              success: true,
              link: apkLink.startsWith('http') ? apkLink : `https://5play.org${apkLink}`
           });
        } else {
           res.json({ success: false, error: "Direct download link not found." });
        }
     } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
     }
  });

  app.get("/api/search", async (req, res) => {
    try {
      let q = req.query.q as string;
      if (!q) return res.json({ success: true, results: [] });

      const hasArabic = /[\u0600-\u06FF]/.test(q);
      if (hasArabic) {
        try {
          const transRes = await translate(q, { to: 'en' });
          q = transRes.text;
        } catch (e) {
          console.error("Translation error for search query", e);
        }
      }

      const response = await fetch(`https://5play.org/index.php?do=search&subaction=search&story=${encodeURIComponent(q)}`, { headers });
      const html = await response.text();
      const $ = cheerio.load(html);

      const results: any[] = [];
      const seenIds = new Set();
      $('.item').each((_, el) => {
         const titleRaw = $(el).find('.title').text().trim() || $(el).find('h3').text().trim();
         const isMod = $(el).find('.card-bubble').text().toLowerCase().includes('mod') || titleRaw.toLowerCase().includes('(mod');
         const cleanTitle = titleRaw.replace(/\s*\(MOD.*?\)\s*/i, '').trim();
         
         const link = $(el).find('a.item-link').attr('href') || $(el).find('a').attr('href') || '';
         const imageRaw = $(el).find('.cover img').attr('src') || $(el).find('.cover img').attr('data-src') || '';
         const iconRaw = $(el).find('.appicon img').attr('src') || $('img[itemprop="image"]').attr('src') || $(el).find('img').attr('src') || '';
         const image = imageRaw || iconRaw;
         const icon = iconRaw || imageRaw;
         let developer = 'Unknown';
         if (cleanTitle.toLowerCase().includes('minecraft')) developer = 'Mojang';

         if (cleanTitle && link && !seenIds.has(link)) {
            seenIds.add(link);
            results.push({
              id: link,
              title: cleanTitle,
              name: cleanTitle,
              image: image ? (image.startsWith('http') ? image : `https://5play.org${image}`) : '',
              icon: icon ? (icon.startsWith('http') ? icon : `https://5play.org${icon}`) : '',
              category: link.includes('game') || link.includes('-games') || link.includes('/games/') ? 'الألعاب' : 'التطبيقات',
              developer: developer,
              link,
              version: '',
              size: '',
              downloads: '10K+',
              modLabel: isMod ? 'مهكرة' : '',
              description: '',
              screenshots: []
            });
         }
      });
      
      res.json({ success: true, results });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
