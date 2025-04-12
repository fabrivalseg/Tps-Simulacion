import jStatPkg from "jstat";
const { jStat } = jStatPkg;

//crea los intervalos para la prueba de chi cuadrado
export function createInterval(data, k) {
  const min = Math.min(...data);
  const max = Math.max(...data);

  const intervalSize = (max - min) / k;
  const intervals = [];

  for (let i = 0; i < k; i++) {
    const start = min + i * intervalSize;
    const end = min + (i + 1) * intervalSize;
    intervals.push([start, end]);
  }

  return intervals;
}

//cuenta las frecuencas observadas de los intervalos
export function calculateFrequencies(data, intervals) {
  const frequencies = new Array(intervals.length).fill(0);

  data.forEach((value) => {
    intervals.forEach((interval, index) => {
      if (value >= interval[0] && value < interval[1]) {
        frequencies[index]++;
      }
    });
  });

  return frequencies;
}

//calcula las frecuencias esperadas para una distribucion uniforme
export function expectedFrequenciesUniform(data, intervals) {
  const N = data.length;
  const intervalProb = 1 / intervals.length;

  return intervals.map(() => N * intervalProb);
}

//calcula las frecuencias esperadas para una distribucion exponencial
export function expectedFrequenciesExponential(data, intervals) {
  const N = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / N;
  const lambda = 1 / mean;

  return intervals.map(([start, end]) => {
    const prob = Math.exp(-lambda * start) - Math.exp(-lambda * end);
    return N * prob;
  });
}

//calcula las frecuencias esperadas para una distribucion normal
function normalCDF(x, mean, std) {
  return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
}

function erf(x) {
  // Aproximación de Abramowitz y Stegun
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

export function expectedFrequenciesNormal(data, intervals) {
  const N = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / N;
  const variance = data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / N;
  const std = Math.sqrt(variance);

  return intervals.map(([start, end]) => {
    const prob = normalCDF(end, mean, std) - normalCDF(start, mean, std);
    return N * prob;
  });
}

//calcula las frecuencas esperadas para una distribucion de poisson
export function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

export function expectedFrequenciesPoisson(data) {
  const N = data.length;
  const lambda = data.reduce((a, b) => a + b, 0) / N;
  const max = Math.max(...data);

  const expected = [];
  for (let k = 0; k <= max; k++) {
    const prob = (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
    expected.push(N * prob);
  }

  return expected;
}

//calcula el estadistico de chi cuadrado
export function chiSquared(observed, expected) {
  if (observed.length !== expected.length) {
    throw new Error("Observed and expected arrays must have the same length.");
  }

  let chi2 = 0;
  for (let i = 0; i < observed.length; i++) {
    if (expected[i] > 0) {
      chi2 += Math.pow(observed[i] - expected[i], 2) / expected[i];
    }
  }

  return chi2;
}

export function calculateDegreesOfFreedom(numClasses, numParamsEstimated) {
  return numClasses - numParamsEstimated - 1;
}

export function chiSquaredTestResult(
  observed,
  expected,
  numParamsEstimated = 0
) {
  const chi2 = chiSquared(observed, expected);
  const df = calculateDegreesOfFreedom(observed.length, numParamsEstimated);
  const critical = jStat.chisquare.inv(0.95, df); // alpha = 0.05

  const passed = chi2 < critical;

  return {
    chi2: chi2,
    df: df,
    critical: critical,
    passed: passed,
    conclusion: passed
      ? "No se rechaza la hipótesis nula (ajuste adecuado)"
      : "Se rechaza la hipótesis nula (mal ajuste)",
  };
}

// Datos supuestamente uniformes
// const data = [12, 14, 13, 11, 15, 14, 13, 16, 12, 13];
// const k = 4;
// const intervals = createInterval(data, k);
// const observed = calculateFrequencies(data, intervals);
// const expected = expectedFrequenciesNormal(data, intervals);
// const result = chiSquaredTestResult(observed, expected, 0);
// console.log(result);

// Datos supuestamente exponenciales
// const data = [0.3, 0.7, 0.5, 1.2, 0.9, 0.4, 0.6, 0.8, 1.1, 0.2];
// const k = 5;
// const intervals = createInterval(data, k);
// const observed = calculateFrequencies(data, intervals);
// const expected = expectedFrequenciesExponential(data, intervals);
// const result = chiSquaredTestResult(observed, expected, 0);
// console.log("Exponencial:", result);

// Datos supuestamente normales
// const data = [10, 11, 12, 11, 13, 14, 13, 12, 11];
// const k = 4;
// const intervals = createInterval(data, k);
// const observed = calculateFrequencies(data, intervals);
// const expected = expectedFrequenciesNormal(data, intervals);
// const result = chiSquaredTestResult(observed, expected, 0);
// console.log("Normal:", result);

// Datos supuestamente Poisson
// Poisson no necesita intervalos, solo cuentas discretas
// const data = [0, 1, 1, 2, 1, 3, 2, 2, 0, 1];
// const maxValue = Math.max(...data);
// const observed = new Array(maxValue + 1).fill(0);
// data.forEach((x) => observed[x]++);
// const expected = expectedFrequenciesPoisson(data);
// const result = chiSquaredTestResult(observed, expected, 0);
// console.log("Poisson:", result);
