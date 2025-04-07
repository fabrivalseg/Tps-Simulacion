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
      
            // Asegurarse de que u1 no sea cero para evitar log(0)
            if (u1 === 0) u1 = Number.EPSILON;
      
            let z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            return mean + z * stdDev;
        });
      }
      
  
    // // Método de Box-Muller (genera pares)
    // static normalBoxMuller(mean, stdDev, count) {
    //   const results = [];
    //   for (let i = 0; i < Math.ceil(count / 2); i++) {
    //     let u1 = Math.random();
    //     let u2 = Math.random();
    //     let z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    //     let z2 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    //     results.push(mean + z1 * stdDev);
    //     if (results.length < count) {
    //       results.push(mean + z2 * stdDev);
    //     }
    //   }
    //   return results;
    // }
  
    // // Método de Convolución
    // static normalConvolution(mean, stdDev, count) {
    //   return Array.from({ length: count }, () => {
    //     let sum = 0;
    //     for (let i = 0; i < 12; i++) {
    //       sum += Math.random();
    //     }
    //     let z = sum - 6;
    //     return mean + stdDev * z;
    //   });
    // }
  
    // // Método general para normal, elige método
    // static normal(mean, stdDev, count, method = 'boxMuller') {
    //   return method === 'convolution'
    //     ? this.normalConvolution(mean, stdDev, count)
    //     : this.normalBoxMuller(mean, stdDev, count);
    // }
  }
  
