export interface AppItem {
  id: string;
  name: string;
  version: string;
  size: string;
  downloads: string;
  lastUpdate: string;
  developer: string;
  icon: string;
  description: string;
  category: string;
  screenshots: string[];
  features: string[];
  changelog: string[];
  requirements: string;
  permissions: string[];
  downloadLink: string;
  isPremium?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
