/**
 * @file state.js
 * @description Almacena registros activos, filtros y persistencia segura.
 */

export class DataStateManager {
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

    return {
      items,
      currentPage: this.currentPage,
      totalPages,
      totalCount: filtered.length
    };
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.records));
  }
}