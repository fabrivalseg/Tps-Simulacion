import jStatPkg from "jstat";
const { jStat } = jStatPkg;

// Crea intervalos
export function createInterval(data, k) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Los datos deben ser un arreglo no vacío.");
  }
  if (typeof k !== "number" || k <= 0 || !Number.isInteger(k)) {
    throw new Error("k debe ser un número entero positivo.");
  }

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

// Calcula frecuencias observadas
export function calculateFrequencies(data, intervals) {
  const frequencies = new Array(intervals.length).fill(0);
  data.forEach((value) => {
    for (let i = 0; i < intervals.length; i++) {
      const [start, end] = intervals[i];
      if (value >= start && value < end) {
        frequencies[i]++;
        break;
      }
    }
  });
  return frequencies;
}

// --- Frecuencias esperadas ---
// Uniforme
export function expectedFrequenciesUniform(N, intervals) {
  const p = 1 / intervals.length;
  return intervals.map(() => N * p);
}

// Exponencial
export function expectedFrequenciesExponential(N, intervals, lambda) {
  return intervals.map(([start, end]) => {
    const prob = Math.exp(-lambda * start) - Math.exp(-lambda * end);
    return N * prob;
  });
}

// Normal
function normalCDF(x, mean, std) {
  return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
}

function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

export function expectedFrequenciesNormal(N, intervals, mean, std) {
  return intervals.map(([start, end]) => {
    const prob = normalCDF(end, mean, std) - normalCDF(start, mean, std);
    return N * prob;
  });
}

// Poisson
export function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

export function expectedFrequenciesPoisson(N, lambda, maxValue) {
  const expected = [];
  for (let k = 0; k <= maxValue; k++) {
    const prob = (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
    expected.push(N * prob);
  }
  return expected;
}

// Chi cuadrado
export function chiSquared(observed, expected) {
  if (observed.length !== expected.length) {
    throw new Error("Longitudes distintas entre observadas y esperadas.");
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
  const critical = jStat.chisquare.inv(0.95, df);
  const passed = chi2 < critical;

  return {
    chi2,
    df,
    critical,
    passed,
    conclusion: passed
      ? "No se rechaza la hipótesis nula"
      : "Se rechaza la hipótesis nula",
  };
}
