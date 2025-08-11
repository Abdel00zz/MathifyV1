
import { Document, AppSettings, ExportOptions, Exercise } from '../types';

const MATHJAX_SCRIPT = `
<script>
  window.MathJax = {
    tex: {
      inlineMath: [['\\\\(', '\\\\)']],
      displayMath: [['\\\\[', '\\\\]']],
      processEscapes: true,
      packages: ['base', 'ams', 'noerrors', 'noundefined']
    },
    chtml: {
      fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
    },
    startup: {
      ready: () => {
        window.MathJax.startup.defaultReady();
        window.MathJax.startup.promise.then(() => {
          console.log('MathJax initial typesetting complete');
        });
      }
    }
  };
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
`;

const getStyles = (options: ExportOptions) => {
  let themeStyles = '';
  if (options.theme === 'ink-saver') {
    themeStyles = `
      body { color: #404040; }
      .doc-title { color: #000000; }
      .doc-meta { color: #6b7280; }
      .exercise { border-top-color: #e5e7eb; }
      .exercise-tag, h3.exercise-title { color: #111827; }
      .star-rating span { color: #a1a1aa; }
      .keyword-tag { background-color: transparent; color: #525252; border: 1px solid #d4d4d8; }
      .exercise-content ol > li::before { color: #525252; border-color: #a1a1aa; background-color: transparent; }
      .exercise-content ol ol > li::before { color: #737373; border-color: #d4d4d8; background-color: transparent; }
    `;
  } else if (options.theme === 'high-contrast') {
    // A high-contrast light theme is generally better for printing.
    themeStyles = `
      body { background-color: #ffffff; color: #000000; font-weight: 600; }
      .doc-title { color: #000000; }
      .doc-meta { color: #000000; }
      .exercise { border-top: 2px solid #000000; }
      .exercise-tag, h3.exercise-title { color: #000000; }
      .star-rating span { color: #000000; }
      .keyword-tag { background-color: transparent; color: #000000; border: 1px solid #000000; font-weight: 600;}
      .exercise-content ol > li::before { color: #000000; border-color: #000000; border-width: 2px; background-color: transparent; }
      .exercise-content ol ol > li::before { color: #000000; border-color: #000000; border-width: 1px; background-color: transparent; }
    `;
  }

  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');
      body {
        font-family: 'Inter', sans-serif;
        line-height: 1.5;
        margin: 0;
        padding: 2cm;
        font-size: ${options.fontSize}pt;
        background-color: #ffffff;
        color: #1f2937;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      .container { max-width: 21cm; margin: 0 auto; }
      header { text-align: center; margin-bottom: 2.5rem; }
      .doc-title { font-family: 'Manrope', sans-serif; font-size: 2.2em; font-weight: 800; margin: 0; color: #111827; }
      .doc-meta { display: flex; justify-content: space-between; width: 100%; max-width: 400px; margin: 0.5rem auto 0; font-size: 0.9em; color: #4b5563; }
      .content { 
        column-count: ${options.columns}; 
        column-gap: 1.5cm;
        ${options.columns > 1 ? 'column-rule: 1px solid #d1d5db; /* slate-300 */' : ''}
      }
      .exercise {
        /* Removed 'break-inside: avoid' to allow exercises to flow across columns and pages */
        margin-bottom: 1.2rem;
        padding-top: 1.2rem;
        border-top: 1px solid #e5e7eb;
      }
      .exercise:first-child { border-top: none; padding-top: 0; }
      .exercise-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.6rem;
        break-after: avoid; /* Prevent breaking page right after the header */
      }
      .exercise-title-block { display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; line-height: 1.3; }
      .exercise-tag {
        font-size: 1em;
        font-weight: 800;
        color: #111827;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      h3.exercise-title {
        font-family: 'Manrope', sans-serif;
        font-size: 0.9em;
        margin: 0;
        font-weight: 600;
        font-style: italic;
        color: #374151;
      }
      .star-rating { font-size: 1em; letter-spacing: 2px; white-space: nowrap; }
      .star-rating span { display: inline-block; color: #f59e0b; }
      .keywords {
        margin-top: 0.25rem;
        margin-bottom: 0.75rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        break-after: avoid; /* Prevent breaking page right after keywords */
      }
      .keyword-tag { font-size: 0.75em; background-color: #f3f4f6; color: #4b5563; padding: 0.15rem 0.5rem; border-radius: 4px; }
      .exercise-content p, .exercise-content ul { margin-top: 0.4rem; margin-bottom: 0.4rem; }
      .exercise-content ul { list-style-position: outside; padding-left: 1.5em; }
      
      .exercise-content ol {
        list-style-type: none;
        counter-reset: item;
        padding-left: 0;
        margin-top: 0.4rem;
        margin-bottom: 0.4rem;
      }
      .exercise-content ol > li {
        display: block;
        position: relative;
        padding-left: 3.2em; /* space for counter */
        margin-bottom: 0.7em;
        /* 'break-inside: avoid' was here. Removed to allow long list items to split across pages/columns. */
      }
      .exercise-content ol > li > p:first-child {
        display: inline;
      }
      .exercise-content ol > li::before {
        content: counter(item);
        counter-increment: item;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.2em;
        height: 2.2em;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.85em;
        color: #1d4ed8; /* blue-700 */
        border: 2px solid #93c5fd; /* blue-300 */
        background-color: transparent;
      }

      .exercise-content ol ol {
        counter-reset: subitem;
        margin-top: 0.6em;
        margin-left: 0;
      }
      .exercise-content ol ol > li {
        padding-left: 3.2em;
      }
      .exercise-content ol ol > li::before {
        content: counter(subitem, lower-alpha);
        counter-increment: subitem;
        color: #1e40af; /* blue-800 */
        border-color: #bfdbfe; /* blue-200 */
      }
      .exercise-content ol ol ol {
        counter-reset: subsubitem;
      }
      .exercise-content ol ol ol > li::before {
        content: counter(subsubitem, lower-roman);
        counter-increment: subsubitem;
        border-style: dashed;
      }
      
      @media print {
        @page { size: A4; margin: 2cm; }
        body { padding: 0; font-weight: normal !important; } /* override high-contrast bold for print */
      }
      ${themeStyles}
    </style>
  `;
};

const renderStar = (isFilled: boolean) => `<span class="star">${isFilled ? '★' : '☆'}</span>`;

const renderExercise = (exercise: Exercise, index: number, options: ExportOptions) => {
  const starsHtml = Array.from({length: 5}, (_, i) => renderStar(i < exercise.difficulty)).join('');

  return `
    <div class="exercise">
      <div class="exercise-header">
        <div class="exercise-title-block">
          <span class="exercise-tag">EXERCICE ${index + 1}</span>
          ${options.showTitles ? `<h3 class="exercise-title">${exercise.title}</h3>` : ''}
        </div>
        ${options.showDifficulty ? `<div class="star-rating">${starsHtml}</div>` : ''}
      </div>
      ${options.showKeywords && exercise.keywords && exercise.keywords.length > 0 ? `
        <div class="keywords">
          ${exercise.keywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
        </div>` : ''}
      <div class="exercise-content tex2jax_process">
        ${exercise.content}
      </div>
    </div>
  `;
};

export const generateHtmlForExport = (
  doc: Document,
  settings: AppSettings,
  options: ExportOptions
): string => {
  const formattedDate = new Date(doc.date).toLocaleDateString(settings.language, { year: 'numeric', month: 'long', day: 'numeric' });

  return `
    <!DOCTYPE html>
    <html lang="${settings.language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${doc.title}</title>
      ${getStyles(options)}
      ${MATHJAX_SCRIPT}
    </head>
    <body>
      <div class="container">
        <header>
          <h1 class="doc-title">${doc.title}</h1>
          <div class="doc-meta">
            <span>${settings.teacherName || doc.className}</span>
            <span>${doc.schoolYear}</span>
            <span>${formattedDate}</span>
          </div>
        </header>
        <main class="content">
          ${doc.exercises.map((ex, i) => renderExercise(ex, i, options)).join('')}
        </main>
      </div>
    </body>
    </html>
  `;
};
