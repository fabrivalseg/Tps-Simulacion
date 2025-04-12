export function uniform(min, max, count) {
  if (
    typeof min !== "number" ||
    typeof max !== "number" ||
    typeof count !== "number"
  ) {
    throw new Error("Los parámetros min, max y count deben ser números.");
  }
  if (min >= max) {
    throw new Error("El parámetro min debe ser menor que max.");
  }
  if (count <= 0 || !Number.isInteger(count)) {
    throw new Error("El parámetro count debe ser un entero positivo.");
  }

  const data = Array.from({ length: count }, () => {
    const r = Math.random();
    return r * (max - min) + min;
  });
  return data;
}

export function exponential(lambda, count) {
  if (typeof lambda !== "number" || typeof count !== "number") {
    throw new Error("Los parámetros lambda y count deben ser números.");
  }
  if (lambda <= 0) {
    throw new Error("El parámetro lambda debe ser mayor que 0.");
  }
  if (count <= 0 || !Number.isInteger(count)) {
    throw new Error("El parámetro count debe ser un entero positivo.");
  }

  const data = Array.from({ length: count }, () => {
    const r = Math.random();
    return -Math.log(1 - r) / lambda;
  });
  return data;
}

export function poisson(lambda, count) {
  if (typeof lambda !== "number" || typeof count !== "number") {
    throw new Error("Los parámetros lambda y count deben ser números.");
  }
  if (lambda <= 0) {
    throw new Error("El parámetro lambda debe ser mayor que 0.");
  }
  if (count <= 0 || !Number.isInteger(count)) {
    throw new Error("El parámetro count debe ser un entero positivo.");
  }

  const data = Array.from({ length: count }, () => {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    while (true) {
      const r = Math.random();
      k++;
      p *= r;
      if (!(p > L)) break;
    }
    return k - 1;
  });
  return data;
}

export function normal(mean, stdDev, count) {
  if (
    typeof mean !== "number" ||
    typeof stdDev !== "number" ||
    typeof count !== "number"
  ) {
    throw new Error("Los parámetros mean, stdDev y count deben ser números.");
  }
  if (stdDev <= 0) {
    throw new Error("El parámetro stdDev debe ser mayor que 0.");
  }
  if (count <= 0 || !Number.isInteger(count)) {
    throw new Error("El parámetro count debe ser un entero positivo.");
  }

  const results = [];

  for (let j = 0; j < count; j++) {
    let u1, u2, z;

    do {
      u1 = Math.random();
      u2 = Math.random();
    } while (u1 === 0);

    z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    results.push(mean + z * stdDev);
  }

  return results;
}
