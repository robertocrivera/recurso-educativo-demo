/**
 * @file engine.js
 * @description Motor de cómputo analítico puro: media, mediana, varianza, percentiles y parsing seguro.
 */

export class AnalyticsEngine {
  /**
   * Parsea un texto CSV de manera segura en un arreglo de objetos tipados.
   */
  static parseCSV(csvText) {
    const lines = csvText.trim().split(/\r\n|\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
      if (values.length !== headers.length) continue;

      const obj = {};
      headers.forEach((h, idx) => {
        const val = values[idx];
        if (!isNaN(val) && val !== '') {
          obj[h] = Number(val);
        } else {
          obj[h] = val;
        }
      });

      records.push({
        id: obj.id || obj.estudiante || `EST-${i}`,
        tiempo: Number(obj.tiempo || obj.duration || 0),
        intentos: Number(obj.intentos || obj.attempts || 1),
        puntaje: Number(obj.puntaje || obj.score || 0),
        estado: (obj.estado || (obj.puntaje > 0 ? 'completado' : 'abandonado')).toLowerCase()
      });
    }

    return records;
  }

  /**
   * Calcula estadísticas descriptivas esenciales sobre el dataset.
   */
  static computeDatasetStatistics(records) {
    if (!records || records.length === 0) {
      return {
        total: 0,
        medianTime: 0,
        meanTime: 0,
        bounceRate: 0,
        avgScore: 0,
        histogram: [],
        scatter: []
      };
    }

    const times = records.map(r => r.tiempo).sort((a, b) => a - b);
    const total = records.length;
    
    // Mediana
    const mid = Math.floor(times.length / 2);
    const medianTime = times.length % 2 !== 0 ? times[mid] : (times[mid - 1] + times[mid]) / 2;

    // Deserción / Bounce Rate (abandonados o tiempo < umbral mínimo)
    const abandoned = records.filter(r => r.estado.includes('abandon') || r.puntaje === 0).length;
    const bounceRate = Number(((abandoned / total) * 100).toFixed(1));

    // Promedio de Puntaje
    const totalScore = records.reduce((acc, r) => acc + r.puntaje, 0);
    const avgScore = Number((totalScore / total).toFixed(1));

    // Histograma de Tiempos (16 barras)
    const minTime = times[0] || 0;
    const maxTime = times[times.length - 1] || 1;
    const bucketSize = (maxTime - minTime) / 16 || 1;
    const histogram = new Array(16).fill(0);

    records.forEach(r => {
      const idx = Math.min(15, Math.floor((r.tiempo - minTime) / bucketSize));
      histogram[idx] += 1;
    });

    // Puntos de dispersión para Gráfico 2 (Puntaje vs Intentos normalizados)
    const scatter = records.map(r => ({
      x: Math.min(500, Math.max(10, (r.intentos / 5) * 450)),
      y: Math.min(140, Math.max(10, 140 - (r.puntaje / 100) * 120)),
      score: r.puntaje,
      name: r.id
    }));

    return {
      total,
      medianTime: Number(medianTime.toFixed(2)),
      meanTime: Number((times.reduce((a, b) => a + b, 0) / total).toFixed(2)),
      bounceRate,
      avgScore,
      histogram,
      scatter
    };
  }

  /**
   * Genera datasets de prueba pedagógicos en memoria.
   */
  static getSampleData(type = 'math') {
    const data = [];
    const count = type === 'math' ? 50 : 100;
    
    for (let i = 1; i <= count; i++) {
      const isAbandoned = Math.random() < (type === 'math' ? 0.22 : 0.40);
      const time = isAbandoned ? Number((Math.random() * 2 + 0.4).toFixed(2)) : Number((Math.random() * 8 + 1.2).toFixed(2));
      const attempts = isAbandoned ? 1 : Math.floor(Math.random() * 4) + 1;
      const score = isAbandoned ? 0 : Math.floor(Math.random() * 45) + 55;

      data.push({
        id: `${type === 'math' ? 'ALUM' : 'SES'}-${1000 + i}`,
        tiempo: time,
        intentos: attempts,
        puntaje: score,
        estado: isAbandoned ? 'abandonado' : 'completado'
      });
    }
    return data;
  }
}