import { Router } from 'express';
import RandomDistributions from '../algorithms/algorithms.js';

const router = Router();


router.post('/uniform', (req, res) => {
  const min = parseFloat(req.body.min);
  const max = parseFloat(req.body.max);
  const count = parseInt(req.body.count);
  
  const result = RandomDistributions.uniform(min, max, count);
  res.json(result);
});

router.post('/exponencial', (req, res) => {
  const lambda = parseFloat(req.body.lambda);
  const count = parseInt(req.body.count);

  const result = RandomDistributions.exponential(lambda, count);
  res.json(result);
});

router.post('/poisson', (req, res) => {
  const lambda = parseFloat(req.body.lambda);
  const count = parseInt(req.body.count);

  const result = RandomDistributions.poisson(lambda, count);
  res.json(result);
});

router.post('/normal', (req, res) => {
  const mean = parseFloat(req.body.mean);
  const stdDev = parseFloat(req.body.stdDev);
  const count = parseInt(req.body.count);
  const result = RandomDistributions.normal(mean, stdDev, count);
  res.json(result);
});

router.post('/chi-cuadrado', (req, res) => {
  const result = RandomDistributions.chiSquaredTest();
  res.json(result);
});

export default router;
