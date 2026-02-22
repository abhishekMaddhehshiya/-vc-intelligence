import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedContent } from '../types/index.js';
import { cleanText, truncateText } from '../utils/helpers.js';

const MAX_CONTENT_LENGTH = 8000; // Limit content to avoid token limits
const TIMEOUT = 15000; // 15 second timeout

export const scrapeWebsite = async (url: string): Promise<ScrapedContent> => {
  try {
    const response = await axios.get(url, {
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);

    // Remove script tags, style tags, and other non-content elements
    $('script, style, noscript, iframe, nav, footer, header, aside, [role="navigation"], [role="banner"], .nav, .navbar, .footer, .header, .sidebar, .menu, .ad, .advertisement, .social-share').remove();

    // Get title
    const title = $('title').first().text() || 
                  $('h1').first().text() || 
                  $('meta[property="og:title"]').attr('content') || 
                  '';

    // Get meta description
    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       '';

    // Get main content
    // Try to find main content areas first
    let content = '';
    
    const contentSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.main-content',
      '.content',
      '#main',
      '#content',
      '.post-content',
      '.entry-content',
    ];

    for (const selector of contentSelectors) {
      const el = $(selector);
      if (el.length > 0) {
        content = el.text();
        break;
      }
    }

    // Fallback to body if no main content found
    if (!content) {
      content = $('body').text();
    }

    // Clean and truncate content
    const cleanedContent = cleanText(content);
    const truncatedContent = truncateText(cleanedContent, MAX_CONTENT_LENGTH);

    return {
      title: cleanText(title),
      description: cleanText(description),
      content: truncatedContent,
      url,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - website took too long to respond');
      }
      if (error.response?.status === 403) {
        throw new Error('Access forbidden - website blocked the request');
      }
      if (error.response?.status === 404) {
        throw new Error('Page not found');
      }
      throw new Error(`Failed to fetch website: ${error.message}`);
    }
    throw error;
  }
};
