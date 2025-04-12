import { Router } from "express";
import {
  uniform,
  exponential,
  poisson,
  normal,
} from "../algorithms/algorithms.js";

import {
  createInterval,
  calculateFrequencies,
  expectedFrequenciesUniform,
  expectedFrequenciesExponential,
  expectedFrequenciesNormal,
  expectedFrequenciesPoisson,
  chiSquaredTestResult,
} from "../algorithms/chi-cuadrado.js";

const router = Router();

router.post("/uniform", (req, res) => {
  try {
    const min = parseFloat(req.body.min);
    const max = parseFloat(req.body.max);
    const count = parseInt(req.body.count);
    const k = parseInt(req.body.k);

    const data = uniform(min, max, count);
    const intervals = createInterval(data, k);
    const observed = calculateFrequencies(data, intervals);
    const expected = expectedFrequenciesUniform(data, intervals);
    const result = chiSquaredTestResult(observed, expected, 0);

    res.json({
      data,
      observed,
      expected,
      intervals,
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/exponencial", (req, res) => {
  try {
    const lambda = parseFloat(req.body.lambda);
    const count = parseInt(req.body.count);
    const k = parseInt(req.body.k);

    const data = exponential(lambda, count);
    const intervals = createInterval(data, k);
    const observed = calculateFrequencies(data, intervals);
    const expected = expectedFrequenciesExponential(data, intervals);
    const result = chiSquaredTestResult(observed, expected, 1);

    res.json({
      data,
      observed,
      expected,
      intervals,
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/poisson", (req, res) => {
  try {
    const lambda = parseFloat(req.body.lambda);
    const count = parseInt(req.body.count);

    const data = poisson(lambda, count);
    const maxValue = Math.max(...data);
    const observed = new Array(maxValue + 1).fill(0);
    data.forEach((x) => observed[x]++);
    const expected = expectedFrequenciesPoisson(data);
    const result = chiSquaredTestResult(observed, expected, 1);

    res.json({
      data,
      observed,
      expected,
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/normal", (req, res) => {
  try {
    const mean = parseFloat(req.body.mean);
    const stdDev = parseFloat(req.body.stdDev);
    const count = parseInt(req.body.count);
    const k = parseInt(req.body.k);

    const data = normal(mean, stdDev, count);
    const intervals = createInterval(data, k);
    const observed = calculateFrequencies(data, intervals);
    const expected = expectedFrequenciesNormal(data, intervals);
    const result = chiSquaredTestResult(observed, expected, 2);

    res.json({
      data,
      observed,
      expected,
      intervals,
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
