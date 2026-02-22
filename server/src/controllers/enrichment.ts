import { Request, Response } from 'express';
import { EnrichmentRequest } from '../types/index.js';
import { isValidUrl, normalizeUrl } from '../utils/helpers.js';
import { scrapeWebsite } from '../services/scraper.js';
import { enrichWithLLM, mockEnrichment } from '../services/llm.js';

export const enrichCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body as EnrichmentRequest;

    // Validate URL
    if (!url) {
      res.status(400).json({
        success: false,
        error: 'URL is required',
      });
      return;
    }

    if (!isValidUrl(url)) {
      res.status(400).json({
        success: false,
        error: 'Invalid URL format. Please provide a valid HTTP or HTTPS URL.',
      });
      return;
    }

    const normalizedUrl = normalizeUrl(url);
    console.log(`[Enrichment] Starting enrichment for: ${normalizedUrl}`);

    // Step 1: Scrape the website
    console.log('[Enrichment] Scraping website...');
    const scrapedContent = await scrapeWebsite(normalizedUrl);
    console.log(`[Enrichment] Scraped ${scrapedContent.content.length} characters`);

    // Step 2: Enrich with LLM
    console.log('[Enrichment] Enriching with LLM...');
    
    let enrichmentData;
    
    // Check if Gemini API key is configured
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
      try {
        enrichmentData = await enrichWithLLM(scrapedContent);
      } catch (llmError) {
        console.warn('[Enrichment] LLM failed, using mock data:', llmError);
        enrichmentData = mockEnrichment(scrapedContent);
      }
    } else {
      console.log('[Enrichment] No Gemini API key, using mock enrichment');
      enrichmentData = mockEnrichment(scrapedContent);
    }

    console.log('[Enrichment] Success!');

    res.json(enrichmentData);
  } catch (error) {
    console.error('[Enrichment] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};
