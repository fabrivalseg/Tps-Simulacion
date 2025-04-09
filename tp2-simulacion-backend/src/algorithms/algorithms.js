import jStat from 'jstat';


export default class RandomDistributions {
    static randoms = [];
    static distribucion = '';

    static uniform(min, max, count) {
      this.distribucion = 'uniform';
      this.randoms = [];
      const data = Array.from({ length: count }, () => {
          const r = Math.random();
          this.randoms.push(r);
          return r * (max - min) + min;
      });
      return data;
    }
  
    static exponential(lambda, count) {
      this.distribucion = 'exponential';
      this.randoms = [];
      const data = Array.from({ length: count }, () => {
        const r = Math.random();
        this.randoms.push(r);
        return -Math.log(1 - r) / lambda;
      });
      return data;
    }


    static poisson(lambda, count) {
      this.distribucion = 'poisson';
      this.randoms = [];
      const data = Array.from({ length: count }, () => {
        let L = Math.exp(-lambda);
        let k = 0;
        let p = 1;
        while (true) {
          const r = Math.random();
          this.randoms.push(r);
          k++;
          p *= r;
          if (!(p > L)) break;
        }
        return k - 1;
      });
      return data;
    }

    static normal(mean, stdDev, count) {
      this.distribucion = 'normal';
      this.randoms = [];
      const data = Array.from({ length: count }, () => {
        let u1 = Math.random();
        let u2 = Math.random();
        this.randoms.push(u1, u2);
        if (u1 === 0) u1 = Number.EPSILON;
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return mean + z * stdDev;
      });
      return data;
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


    static chiSquaredTest() {
      const n = this.randoms.length;
      const k = Math.round(Math.sqrt(n));
      const intervalWidth = 1 / k;
  

      const fo = new Array(k).fill(0);

      this.randoms.forEach(value => {
          let index = Math.floor(value / intervalWidth);
          if (index >= k) index = k - 1; 
          fo[index]++;
      });
  
      const fe = n / k;
  
      const cValues = fo.map(obs => Math.pow(obs - fe, 2) / fe);
      const chi = cValues.reduce((acc, c) => acc + c, 0);

      const degreesOfFreedom = k - 1;

      const { chisquare } = jStat;

      const criticalValue05 = chisquare.inv(0.95, degreesOfFreedom);


  
      return {
          chiSquared: chi,
          expected: fe,
          observed: fo,
          cValues,
          degreesOfFreedom,
          criticalValue05,
          hypothesisRejected: chi > criticalValue05
      };
  }
  
}
