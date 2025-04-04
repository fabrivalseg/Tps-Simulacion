import { Router } from 'express';
import RandomDistributions from '../algorithms/algorithms.js';

const router = Router();


router.post('/uniform', (req, res) => {
  const { count, min, max } = req.body;
  const result = RandomDistributions.uniform(min, max, count);
  res.json(result);
});

router.post('/exponential', (req, res) => {
  const { count, lambda } = req.body;
  const result = RandomDistributions.exponential(lambda, count);
  res.json(result);
});

router.post('/poisson', (req, res) => {
  const { count, lambda } = req.body;
  const result = RandomDistributions.poisson(lambda, count);
  res.json(result);
});

router.post('/normal', (req, res) => {
  const { count, mean, stdDev } = req.body;
  const result = RandomDistributions.normal(mean, stdDev, count);
  res.json(result);
});

export default router;
