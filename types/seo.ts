export interface SEOData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'book' | 'video';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  keywords?: string;
  category?: string;
}
