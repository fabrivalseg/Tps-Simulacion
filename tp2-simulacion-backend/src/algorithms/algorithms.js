export function uniform(min, max, count) {
  const data = Array.from({ length: count }, () => {
    const r = Math.random();
    return r * (max - min) + min;
  });
  return data;
}

export function exponential(lambda, count) {
  const data = Array.from({ length: count }, () => {
    const r = Math.random();
    return -Math.log(1 - r) / lambda;
  });
  return data;
}

export function poisson(lambda, count) {
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
