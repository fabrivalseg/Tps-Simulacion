import jStatPkg from "jstat";
const { jStat } = jStatPkg;

// Agrupa intervalos con frecuencias esperadas < 5 hacia abajo
export function groupLowExpectedFrequencies(observed, expected, intervals) {
  const groupedObserved = [];
  const groupedExpected = [];
  const groupedIntervals = [];

  let tempObs = 0;
  let tempExp = 0;
  let tempStart = intervals[0][0];

  for (let i = 0; i < expected.length; i++) {
    tempObs += observed[i];
    tempExp += expected[i];

    if (tempExp >= 5) {
      groupedObserved.push(tempObs);
      groupedExpected.push(tempExp);
      groupedIntervals.push([tempStart, intervals[i][1]]);
      // reiniciar acumuladores
      tempObs = 0;
      tempExp = 0;
      tempStart = intervals[i + 1]?.[0]; // inicio del siguiente
    }
  }

  // Si quedó algo sin agrupar, se lo suma al último grupo
  if (tempExp > 0) {
    if (groupedObserved.length === 0) {
      throw new Error(
        "No se puede agrupar adecuadamente para cumplir con la prueba."
      );
    }

    groupedObserved[groupedObserved.length - 1] += tempObs;
    groupedExpected[groupedExpected.length - 1] += tempExp;
    groupedIntervals[groupedIntervals.length - 1][1] = intervals.at(-1)[1];
  }

  return { groupedObserved, groupedExpected, groupedIntervals };
}

// Crea intervalos
export function createInterval(data, k) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Los datos deben ser un arreglo no vacío.");
  }
  if (!data.every((value) => typeof value === "number")) {
    throw new Error("Todos los elementos de los datos deben ser números.");
  }
  if (typeof k !== "number" || k <= 0 || !Number.isInteger(k)) {
    throw new Error("k debe ser un número entero positivo.");
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  if (min === max) {
    throw new Error(
      "Los datos deben tener valores distintos para crear intervalos."
    );
  }

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
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Los datos deben ser un arreglo no vacío.");
  }
  if (!Array.isArray(intervals) || intervals.length === 0) {
    throw new Error("Los intervalos deben ser un arreglo no vacío.");
  }
  if (
    !intervals.every(
      (interval) => Array.isArray(interval) && interval.length === 2
    )
  ) {
    throw new Error(
      "Cada intervalo debe ser un arreglo con dos valores [inicio, fin]."
    );
  }

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
  if (typeof N !== "number" || N <= 0 || !Number.isInteger(N)) {
    throw new Error("N debe ser un número entero positivo.");
  }
  if (!Array.isArray(intervals) || intervals.length === 0) {
    throw new Error("Los intervalos deben ser un arreglo no vacío.");
  }

  const p = 1 / intervals.length;
  return intervals.map(() => N * p);
}

// Exponencial
export function expectedFrequenciesExponential(N, intervals, lambda) {
  if (typeof N !== "number" || N <= 0 || !Number.isInteger(N)) {
    throw new Error("N debe ser un número entero positivo.");
  }
  if (!Array.isArray(intervals) || intervals.length === 0) {
    throw new Error("Los intervalos deben ser un arreglo no vacío.");
  }
  if (typeof lambda !== "number" || lambda <= 0) {
    throw new Error("Lambda debe ser un número positivo.");
  }

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
  if (typeof N !== "number" || N <= 0 || !Number.isInteger(N)) {
    throw new Error("N debe ser un número entero positivo.");
  }
  if (!Array.isArray(intervals) || intervals.length === 0) {
    throw new Error("Los intervalos deben ser un arreglo no vacío.");
  }
  if (typeof mean !== "number") {
    throw new Error("La media debe ser un número.");
  }
  if (typeof std !== "number" || std <= 0) {
    throw new Error("La desviación estándar debe ser un número positivo.");
  }

  return intervals.map(([start, end]) => {
    const prob = normalCDF(end, mean, std) - normalCDF(start, mean, std);
    return N * prob;
  });
}

// Poisson
export function factorial(n) {
  if (typeof n !== "number" || n < 0 || !Number.isInteger(n)) {
    throw new Error("n debe ser un número entero no negativo.");
  }
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

export function expectedFrequenciesPoisson(N, lambda, maxValue) {
  if (typeof N !== "number" || N <= 0 || !Number.isInteger(N)) {
    throw new Error("N debe ser un número entero positivo.");
  }
  if (typeof lambda !== "number" || lambda <= 0) {
    throw new Error("Lambda debe ser un número positivo.");
  }
  if (
    typeof maxValue !== "number" ||
    maxValue < 0 ||
    !Number.isInteger(maxValue)
  ) {
    throw new Error("maxValue debe ser un número entero no negativo.");
  }

  const expected = [];
  for (let k = 0; k <= maxValue; k++) {
    const prob = (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
    expected.push(N * prob);
  }
  return expected;
}
// --- calculo de chi2 ---
// Chi cuadrado
export function chiSquared(observed, expected) {
  if (!Array.isArray(observed) || !Array.isArray(expected)) {
    throw new Error("Observadas y esperadas deben ser arreglos.");
  }
  if (observed.length !== expected.length) {
    throw new Error("Longitudes distintas entre observadas y esperadas.");
  }
  if (!observed.every((value) => typeof value === "number" && value >= 0)) {
    throw new Error(
      "Todos los valores observados deben ser números no negativos."
    );
  }
  if (!expected.every((value) => typeof value === "number" && value > 0)) {
    throw new Error("Todos los valores esperados deben ser números positivos.");
  }

  let chi2 = 0;
  for (let i = 0; i < observed.length; i++) {
    chi2 += Math.pow(observed[i] - expected[i], 2) / expected[i];
  }
  return chi2;
}
// grados de libertad
export function calculateDegreesOfFreedom(numClasses, numParamsEstimated) {
  if (
    typeof numClasses !== "number" ||
    numClasses <= 0 ||
    !Number.isInteger(numClasses)
  ) {
    throw new Error("numClasses debe ser un número entero positivo.");
  }
  if (
    typeof numParamsEstimated !== "number" ||
    numParamsEstimated < 0 ||
    !Number.isInteger(numParamsEstimated)
  ) {
    throw new Error(
      "numParamsEstimated debe ser un número entero no negativo."
    );
  }

  return numClasses - numParamsEstimated - 1;
}

// Prueba chi cuadrado
export function chiSquaredTestResult(
  observed,
  expected,
  numParamsEstimated = 0,
  intervals = null
) {
  const df = calculateDegreesOfFreedom(observed.length, numParamsEstimated);
  if (df <= 0) {
    return {
      chi2: null,
      df: null,
      critical: null,
      passed: false,
      conclusion:
        "No se puede aplicar la prueba chi-cuadrado: los grados de libertad son menores o iguales a 0.",
    };
  }

  const chi2 = chiSquared(observed, expected);
  const critical = jStat.chisquare.inv(0.95, df);
  const passed = chi2 < critical;

  return {
    chi2,
    df,
    critical,
    passed,
    conclusion: passed
      ? "No se rechaza la hipótesis nula (ajuste adecuado)"
      : "Se rechaza la hipótesis nula (ajuste inadecuado)",
  };
}
