import { Router } from 'express';
import { enrichCompany } from '../controllers/enrichment.js';

const router = Router();

// POST /api/enrich - Enrich a company based on their website URL
router.post('/enrich', enrichCompany);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router;
