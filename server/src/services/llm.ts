import { GoogleGenerativeAI } from '@google/generative-ai';
import { EnrichmentData, ScrapedContent } from '../types/index.js';

// Only initialize Gemini if API key is available
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'your-gemini-api-key-here') {
    return new GoogleGenerativeAI(apiKey);
  }
  return null;
};

const ENRICHMENT_PROMPT = `You are an expert business analyst. Analyze the following company website content and extract structured information.

Website Content:
Title: {title}
Description: {description}
Content: {content}

Provide a JSON response with the following structure:
{
  "summary": "A concise 1-2 sentence summary of what the company does",
  "whatTheyDo": ["Array of 3-6 bullet points describing their main products/services/offerings"],
  "keywords": ["Array of 5-10 relevant keywords/tags that describe the company"],
  "signals": ["Array of 2-4 inferred business signals like growth indicators, market position, competitive advantages"]
}

Focus on:
- Being accurate and factual based on the content provided
- Highlighting key value propositions
- Identifying industry and market positioning
- Extracting actionable business intelligence

Respond ONLY with valid JSON, no additional text or markdown formatting.`;

export const enrichWithLLM = async (scrapedContent: ScrapedContent): Promise<EnrichmentData> => {
  const genAI = getGeminiClient();
  if (!genAI) {
    throw new Error('Gemini client not available');
  }

  const prompt = ENRICHMENT_PROMPT
    .replace('{title}', scrapedContent.title)
    .replace('{description}', scrapedContent.description)
    .replace('{content}', scrapedContent.content);

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    if (!content) {
      throw new Error('No response from Gemini');
    }

    // Clean up response - remove markdown code blocks if present
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanedContent);

    // Validate and ensure all fields exist
    const enrichmentData: EnrichmentData = {
      summary: parsed.summary || 'Unable to generate summary',
      whatTheyDo: Array.isArray(parsed.whatTheyDo) ? parsed.whatTheyDo : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      signals: Array.isArray(parsed.signals) ? parsed.signals : [],
      sources: [
        {
          url: scrapedContent.url,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    return enrichmentData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse LLM response as JSON');
    }
    throw error;
  }
};

// Fallback enrichment for when API is not available
export const mockEnrichment = (scrapedContent: ScrapedContent): EnrichmentData => {
  // Generate mock data based on scraped content
  return {
    summary: `${scrapedContent.title} is a technology company focused on innovative solutions. They provide products and services that help businesses and individuals achieve their goals.`,
    whatTheyDo: [
      'Provides cloud-based software solutions',
      'Offers enterprise-grade security and compliance',
      'Delivers exceptional customer support and onboarding',
      'Integrates with popular third-party tools and platforms',
      'Enables teams to collaborate more effectively',
    ],
    keywords: [
      'SaaS',
      'enterprise',
      'cloud',
      'automation',
      'productivity',
      'collaboration',
      'analytics',
    ],
    signals: [
      'Strong market positioning in their segment',
      'Growing customer base with enterprise focus',
      'Active product development and innovation',
      'Expanding partnerships ecosystem',
    ],
    sources: [
      {
        url: scrapedContent.url,
        timestamp: new Date().toISOString(),
      },
    ],
  };
};
