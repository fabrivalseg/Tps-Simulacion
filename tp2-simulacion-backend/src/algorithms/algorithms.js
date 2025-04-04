export default class RandomDistributions {
  static uniform(min, max, count) {
      return Array.from({ length: count }, () => Math.random() * (max - min) + min);
  }

  static exponential(lambda, count) {
      return Array.from({ length: count }, () => -Math.log(1 - Math.random()) / lambda);
  }

  static poisson(lambda, count) {
      return Array.from({ length: count }, () => {
          let L = Math.exp(-lambda);
          let k = 0;
          let p = 1;
          do {
              k++;
              p *= Math.random();
          } while (p > L);
          return k - 1;
      });
  }

  static normal(mean, stdDev, count) {
      return Array.from({ length: count }, () => {
          let u1 = Math.random();
          let u2 = Math.random();
          let z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          return mean + z * stdDev;
      });
  }
}
