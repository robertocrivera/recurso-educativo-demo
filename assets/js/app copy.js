/**
 * @file app.js
 * @description Plataforma Web Interactiva & Recursos Educativos.
 * Versión Humanizada: Tonos editoriales cálidos, gráficos orgánicos y dictamen pedagógico en lenguaje cercano.
 */

// ==========================================
// 1. MOTOR ESTADÍSTICO Y MATEMÁTICO PURO
// ==========================================
class AnalyticsEngine {
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
        obj[h] = (!isNaN(val) && val !== '') ? Number(val) : val;
      });

      records.push({
        id: String(obj.id || obj.estudiante || `EST-${i}`),
        tiempo: Number(obj.tiempo || obj.duration || 0),
        intentos: Number(obj.intentos || obj.attempts || 1),
        puntaje: Number(obj.puntaje || obj.score || 0),
        estado: String(obj.estado || (obj.puntaje > 0 ? 'completado' : 'abandonado')).toLowerCase()
      });
    }

    return records;
  }

  static computeDatasetStatistics(records) {
    if (!records || records.length === 0) {
      return { total: 0, medianTime: 0, meanTime: 0, bounceRate: 0, avgScore: 0, histogram: [], scatter: [] };
    }

    const times = records.map(r => r.tiempo).sort((a, b) => a - b);
    const total = records.length;
    const mid = Math.floor(times.length / 2);
    const medianTime = times.length % 2 !== 0 ? times[mid] : (times[mid - 1] + times[mid]) / 2;

    const abandoned = records.filter(r => r.estado.includes('abandon') || r.puntaje === 0).length;
    const bounceRate = Number(((abandoned / total) * 100).toFixed(1));

    const totalScore = records.reduce((acc, r) => acc + r.puntaje, 0);
    const avgScore = Number((totalScore / total).toFixed(1));

    const minTime = times[0] || 0;
    const maxTime = times[times.length - 1] || 1;
    const bucketSize = (maxTime - minTime) / 16 || 1;
    const histogram = new Array(16).fill(0);

    records.forEach(r => {
      const idx = Math.min(15, Math.floor((r.tiempo - minTime) / bucketSize));
      histogram[idx] += 1;
    });

    const scatter = records.map(r => ({
      x: Math.min(480, Math.max(20, (r.intentos / 5) * 450)),
      y: Math.min(135, Math.max(15, 140 - (r.puntaje / 100) * 120)),
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

// ==========================================
// 2. GESTOR DE ESTADO REACTIVO
// ==========================================
class DataStateManager {
  constructor() {
    this.records = [];
    this.filterText = '';
    this.filterStatus = 'all';
    this.currentPage = 1;
    this.pageSize = 8;
    this.listeners = [];
  }

  setRecords(newRecords) {
    this.records = Array.isArray(newRecords) ? newRecords : [];
    this.currentPage = 1;
    this.notify();
  }

  setFilter(text, status) {
    this.filterText = (text || '').toLowerCase();
    this.filterStatus = status || 'all';
    this.currentPage = 1;
    this.notify();
  }

  setPage(page) {
    this.currentPage = page;
    this.notify();
  }

  getFilteredRecords() {
    return this.records.filter(r => {
      const matchText = r.id.toLowerCase().includes(this.filterText);
      const matchStatus = this.filterStatus === 'all' || r.estado === this.filterStatus;
      return matchText && matchStatus;
    });
  }

  getPaginatedData() {
    const filtered = this.getFilteredRecords();
    const totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    const items = filtered.slice(start, start + this.pageSize);

    return { items, currentPage: this.currentPage, totalPages, totalCount: filtered.length };
  }

  subscribe(callback) {
    if (typeof callback === 'function') this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.records));
  }
}

// ==========================================
// 3. DICTAMEN PEDAGÓGICO HUMANIZADO
// ==========================================
function buildPedagogicalReportHTML(records, stats) {
  const completed = records.filter(r => r.estado === 'completado');
  const abandoned = records.filter(r => r.estado !== 'completado');
  
  let deserconDiagnosis = "";
  if (stats.bounceRate > 30) {
    deserconDiagnosis = `Observamos una tasa de abandono considerable del <strong>${stats.bounceRate}%</strong> (${abandoned.length} de ${stats.total} alumnos). En términos didácticos, esto suele reflejar una barrera inicial: el estudiante se siente desorientado al principio o percibe el problema como inalcanzable. Es prioritario simplificar las instrucciones iniciales y acompañar los primeros pasos.`;
  } else if (stats.bounceRate > 15) {
    deserconDiagnosis = `Se evidencia una deserción moderada del <strong>${stats.bounceRate}%</strong> (${abandoned.length} casos). La mayoría del grupo avanza favorablemente, pero una parte significativa tropieza con dificultades intermedias. Se recomienda brindar pistas dosificadas cuando un estudiante permanezca más de unos segundos inactivo.`;
  } else {
    deserconDiagnosis = `Excelente nivel de perseverancia: La deserción es muy baja (<strong>${stats.bounceRate}%</strong>, apenas ${abandoned.length} casos). La actividad resulta motivadora, fluida y comprensible para prácticamente toda la cohorte.`;
  }

  const avgTimeCompleted = completed.length ? (completed.reduce((a, b) => a + b.tiempo, 0) / completed.length).toFixed(1) : 0;
  const highPerformers = completed.filter(r => r.puntaje >= 85);
  const midPerformers = completed.filter(r => r.puntaje >= 60 && r.puntaje < 85);
  const atRisk = abandoned.length + completed.filter(r => r.puntaje < 60).length;

  return `
    <div class="space-y-6">
      <!-- Ficha de Síntesis -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-warm-card rounded-xl border border-warm-border text-center">
        <div>
          <span class="text-[10px] text-warm-muted uppercase font-bold tracking-wider">Grupo Evaluado</span>
          <p class="text-xl font-bold text-warm-ink font-serif mt-1">${stats.total} alumnos</p>
        </div>
        <div>
          <span class="text-[10px] text-warm-forest uppercase font-bold tracking-wider">Tasa de Éxito</span>
          <p class="text-xl font-bold text-warm-forest font-serif mt-1">${(100 - stats.bounceRate).toFixed(1)}%</p>
        </div>
        <div>
          <span class="text-[10px] text-warm-muted uppercase font-bold tracking-wider">Tiempo Mediano</span>
          <p class="text-xl font-bold text-warm-ink font-serif mt-1">${stats.medianTime} s</p>
        </div>
        <div>
          <span class="text-[10px] text-warm-ochre uppercase font-bold tracking-wider">Nota Promedio</span>
          <p class="text-xl font-bold text-warm-ink font-serif mt-1">${stats.avgScore} / 100</p>
        </div>
      </div>

      <!-- 1. Análisis de Perseverancia -->
      <div class="p-4 bg-warm-surface rounded-xl border border-warm-border space-y-1.5 shadow-sm">
        <h3 class="text-xs font-bold text-warm-forest uppercase tracking-wider flex items-center gap-2">
          <span>🌿</span> 1. Análisis de Perseverancia y Compromiso Estudiantil
        </h3>
        <p class="text-warm-ink/90 leading-relaxed text-xs">${deserconDiagnosis}</p>
      </div>

      <!-- 2. Proceso de Resolución -->
      <div class="p-4 bg-warm-surface rounded-xl border border-warm-border space-y-1.5 shadow-sm">
        <h3 class="text-xs font-bold text-warm-terracotta uppercase tracking-wider flex items-center gap-2">
          <span>⏳</span> 2. Dinámica de Tiempo y Comprensión Conceptual
        </h3>
        <p class="text-warm-ink/90 leading-relaxed text-xs">
          Quienes completaron la actividad requirieron en promedio <strong>${avgTimeCompleted} segundos</strong>. Quienes resolvieron en 1 o 2 intentos muestran una transferencia matemática ágil, mientras que aquellos que necesitaron 3 o más intentos manifestaron una valiosa constancia para corregir sus propios errores y alcanzar el resultado.
        </p>
      </div>

      <!-- 3. Segmentación del Aula -->
      <div class="space-y-2">
        <h3 class="text-xs font-bold text-warm-ink uppercase tracking-wider font-serif">
          3. Distribución del Grupo por Niveles de Logro
        </h3>
        <div class="overflow-x-auto border border-warm-border rounded-xl">
          <table class="w-full text-left text-xs text-warm-ink">
            <thead class="bg-warm-card text-[10px] uppercase text-warm-muted border-b border-warm-border">
              <tr>
                <th class="p-3">Grupo de Aprendizaje</th>
                <th class="p-3 text-center">N° Alumnos</th>
                <th class="p-3 text-center">% del Grupo</th>
                <th class="p-3">Orientación Pedagógica</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-warm-border/60">
              <tr class="hover:bg-warm-card/30">
                <td class="p-3 font-semibold text-warm-forest">Destacados (≥ 85 pts)</td>
                <td class="p-3 text-center font-mono font-bold">${highPerformers.length}</td>
                <td class="p-3 text-center font-mono">${((highPerformers.length / (stats.total || 1)) * 100).toFixed(1)}%</td>
                <td class="p-3 text-warm-muted">Proponer retos de profundización o apoyo a compañeros.</td>
              </tr>
              <tr class="hover:bg-warm-card/30">
                <td class="p-3 font-semibold text-warm-ink">En Desarrollo (60 - 84 pts)</td>
                <td class="p-3 text-center font-mono font-bold">${midPerformers.length}</td>
                <td class="p-3 text-center font-mono">${((midPerformers.length / (stats.total || 1)) * 100).toFixed(1)}%</td>
                <td class="p-3 text-warm-muted">Reforzar soltura con actividades prácticas similares.</td>
              </tr>
              <tr class="hover:bg-warm-card/30">
                <td class="p-3 font-semibold text-warm-terracotta">Requieren Acompañamiento (&lt; 60 pts)</td>
                <td class="p-3 text-center font-mono font-bold">${atRisk}</td>
                <td class="p-3 text-center font-mono">${((atRisk / (stats.total || 1)) * 100).toFixed(1)}%</td>
                <td class="p-3 text-warm-muted">Revisión personalizada de prerrequisitos y consignas guiadas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. Recomendaciones Docentes -->
      <div class="p-4 bg-warm-card rounded-xl border border-warm-border space-y-2">
        <h3 class="text-xs font-bold text-warm-ochre uppercase tracking-wider flex items-center gap-2">
          <span>💡</span> 4. Sugerencias de Acción Didáctica
        </h3>
        <ul class="list-disc pl-5 space-y-1 text-xs text-warm-ink/90">
          <li><strong>Pistas formativas:</strong> Habilitar ayudas discretas si un alumno demora más de 5 segundos sin interactuar.</li>
          <li><strong>Explicación del error:</strong> Mostrar por qué una respuesta no fue óptima en lugar de limitarse a marcarla como incorrecta.</li>
          <li><strong>Ritmo adaptativo:</strong> Si la deserción del grupo supera el 20%, desglosar el ejercicio en pasos más breves y guiados.</li>
        </ul>
      </div>
    </div>
  `;
}

// ==========================================
// 4. APLICACIÓN PRINCIPAL
// ==========================================
class EducationalPlatformApp {
  constructor() {
    this.state = new DataStateManager();
    this.dom = {
      dropZone: document.getElementById('drop-zone'),
      fileInput: document.getElementById('file-input'),
      fileFeedback: document.getElementById('file-feedback'),
      btnDemoMath: document.getElementById('btn-load-demo1'),
      btnDemoSTEM: document.getElementById('btn-load-demo2'),
      btnExport: document.getElementById('btn-export-csv'),
      btnReport: document.getElementById('btn-generate-report'),
      modalReport: document.getElementById('modal-report'),
      reportContent: document.getElementById('report-content'),
      btnCloseReport: document.getElementById('btn-close-report'),
      btnPrintReport: document.getElementById('btn-print-report'),
      
      statTotal: document.getElementById('stat-total-records'),
      statMedianTime: document.getElementById('stat-median-time'),
      statBounceRate: document.getElementById('stat-bounce-rate'),
      statAvgScore: document.getElementById('stat-avg-score'),
      
      chartLoadTime: document.getElementById('chart-load-time'),
      chartScatter: document.getElementById('chart-start-render'),
      
      tableBody: document.getElementById('table-body'),
      tableSearch: document.getElementById('table-search'),
      tableFilterStatus: document.getElementById('table-filter-status'),
      paginationInfo: document.getElementById('table-pagination-info'),
      paginationControls: document.getElementById('pagination-controls')
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.state.subscribe(() => this.render());

    const initialData = AnalyticsEngine.getSampleData('math');
    this.state.setRecords(initialData);
  }

  bindEvents() {
    // Blindaje Firefox/Chromium
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      window.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    this.dom.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dom.dropZone.classList.add('border-warm-forest', 'bg-warm-card/80');
    });

    this.dom.dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dom.dropZone.classList.remove('border-warm-forest', 'bg-warm-card/80');
    });

    this.dom.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dom.dropZone.classList.remove('border-warm-forest', 'bg-warm-card/80');

      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        this.processFile(dt.files[0]);
      }
    });

    this.dom.fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.processFile(e.target.files[0]);
        this.dom.fileInput.value = '';
      }
    });

    this.dom.btnDemoMath.addEventListener('click', () => {
      const data = AnalyticsEngine.getSampleData('math');
      this.showFeedback('Cohorte de Matemáticas (50 Alumnos) cargada con éxito.');
      this.state.setRecords(data);
    });

    this.dom.btnDemoSTEM.addEventListener('click', () => {
      const data = AnalyticsEngine.getSampleData('stem');
      this.showFeedback('Laboratorio STEM (100 Sesiones) cargado con éxito.');
      this.state.setRecords(data);
    });

    this.dom.tableSearch.addEventListener('input', () => {
      this.state.setFilter(this.dom.tableSearch.value, this.dom.tableFilterStatus.value);
    });

    this.dom.tableFilterStatus.addEventListener('change', () => {
      this.state.setFilter(this.dom.tableSearch.value, this.dom.tableFilterStatus.value);
    });

    this.dom.btnExport.addEventListener('click', () => this.exportCurrentCSV());

    this.dom.btnReport.addEventListener('click', () => {
      const allRecords = this.state.records;
      const stats = AnalyticsEngine.computeDatasetStatistics(allRecords);
      this.dom.reportContent.innerHTML = buildPedagogicalReportHTML(allRecords, stats);
      this.dom.modalReport.classList.remove('hidden');
    });

    this.dom.btnCloseReport.addEventListener('click', () => {
      this.dom.modalReport.classList.add('hidden');
    });

    this.dom.modalReport.addEventListener('click', (e) => {
      if (e.target === this.dom.modalReport) {
        this.dom.modalReport.classList.add('hidden');
      }
    });

    this.dom.btnPrintReport.addEventListener('click', () => {
      window.print();
    });
  }

  processFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        let parsed = [];
        if (file.name.endsWith('.json')) {
          parsed = JSON.parse(text);
        } else {
          parsed = AnalyticsEngine.parseCSV(text);
        }

        if (parsed.length === 0) {
          this.showFeedback('El archivo no contiene registros legibles o el formato es incorrecto.', true);
          return;
        }

        this.showFeedback(`Archivo procesado con éxito: ${file.name} (${parsed.length} registros cargados).`);
        this.state.setRecords(parsed);
      } catch (err) {
        this.showFeedback('Error al procesar el archivo. Verifique el formato CSV/JSON.', true);
      }
    };
    reader.readAsText(file);
  }

  showFeedback(msg, isError = false) {
    this.dom.fileFeedback.classList.remove('hidden', 'text-warm-forest', 'text-warm-terracotta');
    this.dom.fileFeedback.classList.add(isError ? 'text-warm-terracotta' : 'text-warm-forest');
    this.dom.fileFeedback.textContent = msg;
  }

  render() {
    const allRecords = this.state.records;
    const stats = AnalyticsEngine.computeDatasetStatistics(allRecords);

    this.dom.statTotal.textContent = stats.total.toString();
    this.dom.statMedianTime.textContent = `${stats.medianTime}s`;
    this.dom.statBounceRate.textContent = `${stats.bounceRate}%`;
    this.dom.statAvgScore.textContent = `${stats.avgScore}`;

    this.renderHistogram(stats.histogram);
    this.renderScatter(stats.scatter);
    this.renderTable();
  }

  renderHistogram(bins) {
    const svg = this.dom.chartLoadTime;
    svg.replaceChildren();
    if (!bins || bins.length === 0) return;

    const maxVal = Math.max(...bins, 1);
    const barWidth = 24;
    const gap = (500 - (bins.length * barWidth)) / (bins.length - 1);

    // Barras en verde bosque editorial
    bins.forEach((count, i) => {
      const height = Math.max(4, (count / maxVal) * 120);
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', (i * (barWidth + gap)).toFixed(1));
      rect.setAttribute('y', (150 - height).toFixed(1));
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', height.toString());
      rect.setAttribute('fill', '#2d5a43');
      rect.setAttribute('rx', '3');
      rect.classList.add('chart-bar');
      svg.appendChild(rect);
    });

    // Línea de tendencia en arcilla terracota suave
    const points = bins.map((c, i) => {
      const x = (i * (barWidth + gap)) + (barWidth / 2);
      const y = 150 - Math.max(4, (c / maxVal) * 120);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#c86446');
    polyline.setAttribute('stroke-width', '2.5');
    svg.appendChild(polyline);
  }

  renderScatter(points) {
    const svg = this.dom.chartScatter;
    svg.replaceChildren();

    points.forEach(p => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', p.x.toString());
      circle.setAttribute('cy', p.y.toString());
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', p.score >= 60 ? '#2d5a43' : '#c86446');
      circle.setAttribute('opacity', '0.8');
      svg.appendChild(circle);
    });
  }

  renderTable() {
    const { items, currentPage, totalPages, totalCount } = this.state.getPaginatedData();
    this.dom.tableBody.replaceChildren();

    if (items.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 6;
      td.className = 'px-4 py-8 text-center text-warm-muted';
      td.textContent = 'No se encontraron registros con los filtros seleccionados.';
      tr.appendChild(td);
      this.dom.tableBody.appendChild(tr);
      this.dom.paginationInfo.textContent = 'Mostrando 0 de 0 registros';
      this.dom.paginationControls.replaceChildren();
      return;
    }

    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-warm-card/40 transition';

      const isCompleted = item.estado === 'completado';
      const statusBadge = isCompleted 
        ? '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-warm-forest/10 text-warm-forest border border-warm-forest/20">Completado</span>'
        : '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-warm-terracotta/10 text-warm-terracotta border border-warm-terracotta/20">Abandonado</span>';

      const efficacyPct = Math.min(100, Math.round((item.puntaje / (item.tiempo || 1)) * 10));

      tr.innerHTML = `
        <td class="px-4 py-3 font-semibold text-warm-ink">${item.id}</td>
        <td class="px-4 py-3 font-mono text-warm-forest font-medium">${item.tiempo}s</td>
        <td class="px-4 py-3 font-mono text-warm-ink">${item.intentos}</td>
        <td class="px-4 py-3 font-bold ${item.puntaje >= 60 ? 'text-warm-forest' : 'text-warm-muted'}">${item.puntaje} pts</td>
        <td class="px-4 py-3">${statusBadge}</td>
        <td class="px-4 py-3 text-right font-mono text-warm-muted">${efficacyPct} pts/s</td>
      `;

      this.dom.tableBody.appendChild(tr);
    });

    this.dom.paginationInfo.textContent = `Mostrando ${items.length} de ${totalCount} registros (Página ${currentPage} de ${totalPages})`;

    this.dom.paginationControls.replaceChildren();
    for (let p = 1; p <= totalPages; p++) {
      if (totalPages > 7 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== totalPages) continue;

      const btn = document.createElement('button');
      btn.className = `px-2.5 py-1 text-xs rounded-md border cursor-pointer ${p === currentPage ? 'bg-warm-forest text-white font-bold border-warm-forest' : 'bg-warm-surface text-warm-ink border-warm-border hover:bg-warm-card'}`;
      btn.textContent = p.toString();
      btn.addEventListener('click', () => this.state.setPage(p));
      this.dom.paginationControls.appendChild(btn);
    }
  }

  exportCurrentCSV() {
    const records = this.state.records;
    if (records.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    let csvContent = 'id,tiempo,intentos,puntaje,estado\n';
    records.forEach(r => {
      csvContent += `${r.id},${r.tiempo},${r.intentos},${r.puntaje},${r.estado}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_telemetria_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new EducationalPlatformApp());
} else {
  new EducationalPlatformApp();
}