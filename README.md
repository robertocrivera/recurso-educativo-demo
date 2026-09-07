# Plataforma Web Interactiva & Recursos Educativos

[![Estado](https://img.shields.io/badge/Estado-Producción-emerald.svg)](#)
[![Tecnología](https://img.shields.io/badge/Stack-JavaScript%20|%20HTML5%20|%20Tailwind%20CSS-cyan.svg)](#)
[![Seguridad](https://img.shields.io/badge/Ciberseguridad-OWASP%20Defensiva-blue.svg)](#)

Aplicación interactiva y prototipos web ligeros construidos con JavaScript moderno, interfaces adaptables y lógica modular para entornos de aprendizaje dinámico.

---

## 1. Justificación Pedagógica y de Telemetría
La plataforma implementa un modelo de observabilidad educativa:
- **Toma de decisiones informadas:** Demuestra empíricamente la relación entre rendimiento técnico (latencia, rendering) y éxito pedagógico (retención, abandono de sesión).
- **Simulación activa:** Permite a docentes y alumnos interactuar con variables de complejidad cognitiva y medir la eficacia resultante en tiempo real.

## 2. Principios de Ingeniería y Código Limpio
- **Arquitectura Desacoplada:** `state.js` aísla los datos; `engine.js` ejecuta cálculos matemáticos puros libres de efectos secundarios; `app.js` gestiona el DOM y los eventos.
- **Micro-diseño Responsivo:** Integración visual oscura optimizada con Tailwind CSS para visualización clara de gráficos estadísticos complejos.
- **WCAG 2.1 AA:** Esquema de color de alto contraste con etiquetas semánticas y compatibilidad con lectores de pantalla.

## 3. Seguridad Defensiva en el Cliente
- **Prevención de XSS:** Se erradica por completo `innerHTML` o funciones dinámicas no seguras. Todos los nodos y valores se procesan con `textContent` y creación nativa mediante `createElementNS`.
- **Content Security Policy (CSP):** Configuración estricta de encabezados de seguridad impidiendo recursos de orígenes no confiables.
- **Validación de Datos:** Persistencia higienizada en `localStorage` con validación de rangos enteros y esquemas estrictos.

## 4. Despliegue Local
Debido a la modularidad ES6 (`type="module"`), ejecute con cualquier servidor HTTP estático:

```bash
# Con Python 3
python -m http.server 3000

# O con Node.js
npx serve .