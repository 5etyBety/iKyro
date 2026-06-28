@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: 'CustomFont', ui-sans-serif, system-ui, sans-serif;
  --color-ikyro-blue: #34C5EF;
  --color-ikyro-light: #A7F4FF;
  --color-dark-bg: #090909;
  --color-dark-surface: #111111;
  --color-dark-elevated: #161616;
  --color-dark-card: #1E1E1E;
  
  --color-light-bg: #FFFFFF;
  --color-light-surface: #FDFDFD;
  --color-light-elevated: #F7FBFF;
  --color-light-card: #EEF9FF;
}

@font-face {
  font-family: 'CustomFont';
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/خطي الرسمي.ttf') format('truetype');
}

@layer base {
  body {
    @apply font-sans bg-[#FFFFFF] dark:bg-[#090909] text-[#090909] dark:text-[#FFFFFF] transition-colors duration-300 selection:bg-ikyro-blue/30 antialiased;
    direction: rtl;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    touch-action: manipulation;
  }

  img {
    pointer-events: none;
    -webkit-user-drag: none;
  }

  input, textarea {
    user-select: auto;
    -webkit-user-select: auto;
  }
}

.glass-panel {
  @apply bg-white/40 dark:bg-white/[0.05] backdrop-blur-[64px] backdrop-saturate-[300%] shadow-[0_16px_40px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,255,255,0.5),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.2)];
}

.ikyro-gradient {
  background: linear-gradient(135deg, #34C5EF 0%, #A7F4FF 100%);
}

.ikyro-gradient-text {
  background: linear-gradient(135deg, #34C5EF 0%, #A7F4FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ikyro-glow {
  box-shadow: 0 8px 24px rgba(52, 197, 239, 0.4);
}

.dark .ikyro-glow {
  box-shadow: 0 8px 24px rgba(52, 197, 239, 0.6);
}

::-webkit-scrollbar {
  display: none;
}
* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
