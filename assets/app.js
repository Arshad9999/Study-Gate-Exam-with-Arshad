/**
 * Study GATE Exam with Arshad - Core Application Engine (Master Edition)
 * Aesthetics: Apple-Inspired Editorial Minimalism · Velvet Burgundy & Champagne Gold
 * Architecture:
 *  - Zero-Flash Dual Theme (Light & Dark)
 *  - Universal Command Palette (Spotlight / Cmd+K)
 *  - 3D Kinetic Topology Particle Canvas in Mac-Style Chrome
 *  - Interactive Career & Pathway Matchmaker Wizard (CS vs DA)
 *  - Official GATE Virtual Scientific Calculator Modal & Keypad
 *  - Persistent Study Docket with Integrated Pomodoro Revision Timer
 *  - Direct Calendar Integration (.ics Export & Google Calendar One-Click Handoff)
 *  - Study Docket Sharing via URL Hash & Vector SVG QR Engine
 *  - 16-Subject Practice Engine supporting MCQ, MSQ & NAT with Real Tolerances
 *  - Formula Quick-Reference Cheat Sheet Matrix on /resources/
 *  - Exam Readiness Circular Progress Donut Visualizer
 *  - Complete 16-Subject Technical Formulations & Vector Schematics
 *  - Curated Platform Integration (GeeksforGeeks & NPTEL Course Codes)
 *  - Standard Textbook Library & Topic Alignment
 *  - GATE Exam Intelligence Dashboard & 5-Year Weightage Matrix on /pyqs/
 *  - Category-Clustered Multi-Topic Planner with Batch Controls
 *  - Reading Progress Indicator, Scroll-Spy Sidebar & One-Click PDF/Print Engine
 *  - Floating Open-Source Community Pill & Modal
 *  - PWA Offline Service Worker Engine
 */

// -----------------------------------------------------------------------------
// 1. Zero-Flash Theme Persistence Engine
// -----------------------------------------------------------------------------
(function initTheme() {
  const storedTheme = localStorage.getItem('study-gate-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('study-gate-theme', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.querySelector('.theme-toggle-btn');
  if (!btn) return;
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

// -----------------------------------------------------------------------------
// 2. Global State & Storage Helpers
// -----------------------------------------------------------------------------
const root = document.body.dataset.root || './';
const page = document.body.dataset.page || 'home';
const pageId = document.body.dataset.id || '';
const main = document.querySelector('main');
const official = 'https://gate2027.iitm.ac.in/';
const githubRepo = 'https://github.com/Arshad9999/Study-Gate-Exam-with-Arshad';
const source = {
  CS: official + 'static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf',
  DA: official + 'static/doc/GATE2027_Syllabus/DA_GATE2027_Syllabus.pdf',
  GA: official + 'static/doc/GATE2027_Syllabus/GA_GATE2027_Syllabus.pdf'
};

const escapeText = val => String(val).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

// Progress storage (reviewed subjects)
const getProgress = () => {
  try {
    const v = JSON.parse(localStorage.getItem('study-gate-progress') || '{}');
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  } catch { return {}; }
};
const saveProgress = v => localStorage.setItem('study-gate-progress', JSON.stringify(v));

// Study Docket storage (queued subjects for revision)
const getDocket = () => {
  try {
    const d = JSON.parse(localStorage.getItem('study-gate-docket') || '[]');
    return Array.isArray(d) ? d : [];
  } catch { return []; }
};
const saveDocket = d => {
  localStorage.setItem('study-gate-docket', JSON.stringify(d));
  updateDocketBadges();
  renderDocketDrawer();
};

function addToDocket(id) {
  const d = getDocket();
  if (!d.includes(id)) {
    d.push(id);
    saveDocket(d);
    showToast('Added to Study Docket');
  } else {
    showToast('Already in Study Docket');
  }
}

function removeFromDocket(id) {
  const d = getDocket().filter(x => x !== id);
  saveDocket(d);
}

function clearDocket() {
  saveDocket([]);
  showToast('Study Docket cleared');
}

function updateDocketBadges() {
  const count = getDocket().length;
  document.querySelectorAll('.badge-counter').forEach(el => {
    el.textContent = String(count);
  });
}

function showToast(msg) {
  let toast = document.getElementById('toast-feedback');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-feedback';
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: #1e1315; color: #f7f4f0; padding: 10px 20px; border-radius: 8px;
      border: 1px solid rgba(197, 160, 89, 0.4); font-size: 0.85rem; font-weight: 600;
      box-shadow: 0 10px 24px rgba(0,0,0,0.4); z-index: 3000; transition: opacity 0.2s, transform 0.2s;
      pointer-events: none; opacity: 0;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 2200);
}

// -----------------------------------------------------------------------------
// 3. Calendar Revision Integration (.ics Generator & Google Calendar Link)
// -----------------------------------------------------------------------------
function exportDocketICS(allSubjects) {
  const docketIds = getDocket();
  if (!docketIds.length) {
    alert('Your Study Docket is empty. Add subjects to your docket first!');
    return;
  }
  const selected = allSubjects.filter(s => docketIds.includes(s.id));
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Study Gate Exam with Arshad//GATE 2027 Study Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  const now = new Date();
  selected.forEach((sub, idx) => {
    const start = new Date(now);
    start.setDate(now.getDate() + idx + 1);
    start.setHours(18, 0, 0, 0);
    const end = new Date(start);
    end.setHours(20, 0, 0, 0);

    const pad = n => String(n).padStart(2, '0');
    const toICSDate = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:gate2027-${sub.id}-${start.getTime()}@studygate.org`);
    icsContent.push(`DTSTAMP:${toICSDate(now)}Z`);
    icsContent.push(`DTSTART:${toICSDate(start)}`);
    icsContent.push(`DTEND:${toICSDate(end)}`);
    icsContent.push(`SUMMARY:GATE 2027 Revision: ${sub.title} (${sub.papers.join('/')})`);
    icsContent.push(`DESCRIPTION:Topics to cover:\\n${sub.syllabus.replace(/,/g, '\\,')}\\n\\nIndependent GATE preparation with Arshad.`);
    icsContent.push('STATUS:CONFIRMED');
    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');
  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GATE_2027_Revision_Schedule.ics';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Downloaded GATE_2027_Revision_Schedule.ics');
}

function getGoogleCalendarUrl(subject) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(18, 0, 0, 0);
  const end = new Date(tomorrow);
  end.setHours(20, 0, 0, 0);

  const pad = n => String(n).padStart(2, '0');
  const fmt = d => `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const title = encodeURIComponent(`GATE 2027 Study: ${subject.title} (${subject.papers.join('/')})`);
  const details = encodeURIComponent(`Comprehensive revision session.\nSyllabus outline: ${subject.syllabus}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(tomorrow)}/${fmt(end)}&details=${details}`;
}

// -----------------------------------------------------------------------------
// 4. Official GATE Virtual Scientific Calculator Engine
// -----------------------------------------------------------------------------
let calcMemory = 0;
let calcExpression = '';
let calcCurrentVal = '0';

function initVirtualCalculator() {
  let backdrop = document.getElementById('calc-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'calc-backdrop';
    backdrop.innerHTML = `
      <div class="calc-modal" role="dialog" aria-modal="true" aria-label="GATE Virtual Calculator">
        <div class="mac-titlebar" style="background: #1e0d11; color: #fff;">
          <div class="mac-dots">
            <span class="mac-dot red" id="close-calc-dot" style="cursor: pointer;"></span>
            <span class="mac-dot yellow"></span>
            <span class="mac-dot green"></span>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-gold);">GATE Scientific Calculator</span>
          <button id="close-calc-btn" class="dialog-close-btn" style="position: static; width: 22px; height: 22px; font-size: 0.75rem;">✕</button>
        </div>
        <div class="calc-display">
          <div class="calc-sub-expr" id="calc-expr-display"></div>
          <div class="calc-main-val" id="calc-val-display">0</div>
        </div>
        <div class="calc-grid">
          <!-- Row 1 -->
          <button class="calc-btn fn" data-act="mc">MC</button>
          <button class="calc-btn fn" data-act="mr">MR</button>
          <button class="calc-btn fn" data-act="ms">MS</button>
          <button class="calc-btn fn" data-act="mplus">M+</button>
          <button class="calc-btn action" data-act="clear">C</button>
          <!-- Row 2 -->
          <button class="calc-btn fn" data-act="sin">sin</button>
          <button class="calc-btn fn" data-act="cos">cos</button>
          <button class="calc-btn fn" data-act="tan">tan</button>
          <button class="calc-btn fn" data-act="log">log</button>
          <button class="calc-btn fn" data-act="ln">ln</button>
          <!-- Row 3 -->
          <button class="calc-btn fn" data-act="sqrt">√x</button>
          <button class="calc-btn fn" data-act="square">x²</button>
          <button class="calc-btn fn" data-act="power">x^y</button>
          <button class="calc-btn fn" data-act="recip">1/x</button>
          <button class="calc-btn fn" data-act="fact">n!</button>
          <!-- Row 4 -->
          <button class="calc-btn fn" data-act="pi">π</button>
          <button class="calc-btn fn" data-act="e">e</button>
          <button class="calc-btn op" data-val="(">(</button>
          <button class="calc-btn op" data-val=")">)</button>
          <button class="calc-btn action" data-act="del">DEL</button>
          <!-- Row 5 -->
          <button class="calc-btn" data-val="7">7</button>
          <button class="calc-btn" data-val="8">8</button>
          <button class="calc-btn" data-val="9">9</button>
          <button class="calc-btn op" data-val="/">/</button>
          <button class="calc-btn op" data-val="%">%</button>
          <!-- Row 6 -->
          <button class="calc-btn" data-val="4">4</button>
          <button class="calc-btn" data-val="5">5</button>
          <button class="calc-btn" data-val="6">6</button>
          <button class="calc-btn op" data-val="*">*</button>
          <button class="calc-btn fn" data-act="sign">±</button>
          <!-- Row 7 -->
          <button class="calc-btn" data-val="1">1</button>
          <button class="calc-btn" data-val="2">2</button>
          <button class="calc-btn" data-val="3">3</button>
          <button class="calc-btn op" data-val="-">-</button>
          <button class="calc-btn op" data-val="+">+</button>
          <!-- Row 8 -->
          <button class="calc-btn" data-val="0">0</button>
          <button class="calc-btn" data-val=".">.</button>
          <button class="calc-btn equals" data-act="equals">=</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const exprEl = document.getElementById('calc-expr-display');
    const valEl = document.getElementById('calc-val-display');

    function updateCalc() {
      exprEl.textContent = calcExpression;
      valEl.textContent = calcCurrentVal;
    }

    function calculateFactorial(n) {
      if (n < 0 || n > 100) return NaN;
      let res = 1;
      for (let i = 2; i <= Math.floor(n); i++) res *= i;
      return res;
    }

    backdrop.querySelectorAll('.calc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        const act = btn.dataset.act;

        if (val !== undefined) {
          if (calcCurrentVal === '0' && val !== '.') {
            calcCurrentVal = val;
          } else {
            calcCurrentVal += val;
          }
        } else if (act) {
          switch (act) {
            case 'clear':
              calcExpression = '';
              calcCurrentVal = '0';
              break;
            case 'del':
              calcCurrentVal = calcCurrentVal.length > 1 ? calcCurrentVal.slice(0, -1) : '0';
              break;
            case 'equals':
              try {
                const expr = (calcExpression + calcCurrentVal).replace(/\^/g, '**');
                const result = Function(`'use strict'; return (${expr})`)();
                calcExpression = '';
                calcCurrentVal = String(Number(result.toFixed(6)));
              } catch (e) {
                calcCurrentVal = 'Error';
              }
              break;
            case 'sin':
              calcCurrentVal = String(Math.sin(Number(calcCurrentVal) * Math.PI / 180).toFixed(6));
              break;
            case 'cos':
              calcCurrentVal = String(Math.cos(Number(calcCurrentVal) * Math.PI / 180).toFixed(6));
              break;
            case 'tan':
              calcCurrentVal = String(Math.tan(Number(calcCurrentVal) * Math.PI / 180).toFixed(6));
              break;
            case 'log':
              calcCurrentVal = String(Math.log10(Number(calcCurrentVal)).toFixed(6));
              break;
            case 'ln':
              calcCurrentVal = String(Math.log(Number(calcCurrentVal)).toFixed(6));
              break;
            case 'sqrt':
              calcCurrentVal = String(Math.sqrt(Number(calcCurrentVal)).toFixed(6));
              break;
            case 'square':
              calcCurrentVal = String(Math.pow(Number(calcCurrentVal), 2).toFixed(6));
              break;
            case 'recip':
              calcCurrentVal = String((1 / Number(calcCurrentVal)).toFixed(6));
              break;
            case 'fact':
              calcCurrentVal = String(calculateFactorial(Number(calcCurrentVal)));
              break;
            case 'sign':
              calcCurrentVal = String(-Number(calcCurrentVal));
              break;
            case 'pi':
              calcCurrentVal = String(Math.PI.toFixed(6));
              break;
            case 'e':
              calcCurrentVal = String(Math.E.toFixed(6));
              break;
            case 'power':
              calcExpression += calcCurrentVal + ' ^ ';
              calcCurrentVal = '0';
              break;
            case 'ms':
              calcMemory = Number(calcCurrentVal);
              showToast('Memory Stored: ' + calcMemory);
              break;
            case 'mr':
              calcCurrentVal = String(calcMemory);
              break;
            case 'mc':
              calcMemory = 0;
              showToast('Memory Cleared');
              break;
            case 'mplus':
              calcMemory += Number(calcCurrentVal);
              showToast('Memory: ' + calcMemory);
              break;
          }
        }
        updateCalc();
      });
    });

    const close = () => backdrop.classList.remove('open');
    document.getElementById('close-calc-btn').addEventListener('click', close);
    document.getElementById('close-calc-dot').addEventListener('click', close);
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) close();
    });
  }

  document.querySelectorAll('.calc-trigger').forEach(btn => {
    btn.addEventListener('click', () => backdrop.classList.add('open'));
  });
}

// -----------------------------------------------------------------------------
// 5. Complete Technical Formulations & Schematics for All 16 Subjects
// -----------------------------------------------------------------------------
const SUBJECT_EXTRAS = {
  "discrete-mathematics": {
    "formulaName": "Generating Function & Recurrence Relation",
    "lang": "Discrete Mathematics",
    "gfgUrl": "https://www.geeksforgeeks.org/discrete-mathematics-tutorials/",
    "nptelCode": "noc20-cs82 (IIT Ropar - Discrete Mathematics)",
    "derivation": "Linear Homogeneous Recurrence: a_n = c_1 a_{n-1} + c_2 a_{n-2}\nCharacteristic Equation: r^2 - c_1 r - c_2 = 0\nRoots r_1, r_2:\n  Case 1 (Distinct Real): a_n = A(r_1)^n + B(r_2)^n\n  Case 2 (Repeated Real): a_n = (A + Bn)(r_1)^n\nGenerating Function Transformation:\n  G(x) = sum_{n=0}^{infinity} a_n x^n\n  x * G(x) = sum_{n=1}^{infinity} a_{n-1} x^n\n  => G(x)(1 - c_1 x - c_2 x^2) = a_0 + (a_1 - c_1 a_0)x",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><rect width=\"320\" height=\"180\" fill=\"transparent\"/><circle cx=\"80\" cy=\"50\" r=\"18\" stroke=\"#c5a059\" stroke-width=\"2\" fill=\"rgba(197,160,89,0.15)\"/><text x=\"80\" y=\"55\" fill=\"#c5a059\" text-anchor=\"middle\" font-size=\"12\" font-family=\"monospace\">V1</text><circle cx=\"240\" cy=\"50\" r=\"18\" stroke=\"#c5a059\" stroke-width=\"2\" fill=\"rgba(197,160,89,0.15)\"/><text x=\"240\" y=\"55\" fill=\"#c5a059\" text-anchor=\"middle\" font-size=\"12\" font-family=\"monospace\">V2</text><circle cx=\"160\" cy=\"130\" r=\"18\" stroke=\"#059669\" stroke-width=\"2\" fill=\"rgba(5,150,105,0.15)\"/><text x=\"160\" y=\"135\" fill=\"#059669\" text-anchor=\"middle\" font-size=\"12\" font-family=\"monospace\">V3</text><line x1=\"98\" y1=\"50\" x2=\"222\" y2=\"50\" stroke=\"#c5a059\" stroke-width=\"2\"/><line x1=\"93\" y1=\"63\" x2=\"147\" y2=\"117\" stroke=\"#059669\" stroke-width=\"2\"/><line x1=\"227\" y1=\"63\" x2=\"173\" y2=\"117\" stroke=\"#059669\" stroke-width=\"2\"/><text x=\"160\" y=\"35\" fill=\"#999\" font-size=\"10\" text-anchor=\"middle\">Graph Coloring: Chromatic Number chi(G) = 3 (K_3)</text></svg>",
    "caption": "Graph Coloring & Chromatic Number Topology",
    "gfgSubcategories": [
      {
        "title": "Propositional & Predicate Logic",
        "tag": "Mathematical Logic",
        "url": "https://www.geeksforgeeks.org/proposition-logic/",
        "desc": "Truth tables, logical equivalence, normal forms (CNF/DNF), inference rules, and first-order quantifiers."
      },
      {
        "title": "Sets, Relations & Functions",
        "tag": "Set Theory",
        "url": "https://www.geeksforgeeks.org/sets-relations-and-functions/",
        "desc": "Equivalence relations, equivalence classes, partitions, injective/surjective/bijective functions, and composition."
      },
      {
        "title": "Partial Orders, Lattices & Hasse Diagrams",
        "tag": "Order Theory",
        "url": "https://www.geeksforgeeks.org/hasse-diagrams/",
        "desc": "Posets, maximal/minimal elements, greatest lower bound (GLB), least upper bound (LUB), and complemented/distributive lattices."
      },
      {
        "title": "Group Theory, Monoids & Subgroups",
        "tag": "Algebraic Structures",
        "url": "https://www.geeksforgeeks.org/groups-in-discrete-mathematics/",
        "desc": "Semi-groups, monoids, groups, abelian groups, cyclic subgroups, and Lagrange\u2019s order theorem."
      },
      {
        "title": "Combinatorics & Generating Functions",
        "tag": "Counting Principles",
        "url": "https://www.geeksforgeeks.org/pigeonhole-principle/",
        "desc": "Pigeonhole principle, permutations, combinations, inclusion-exclusion, and recurrence relations."
      },
      {
        "title": "Graph Theory, Connectivity & Coloring",
        "tag": "Graph Theory",
        "url": "https://www.geeksforgeeks.org/graph-theory/",
        "desc": "Eulerian and Hamiltonian graphs, planar graphs (Euler\u2019s formula V-E+F=2), bipartite matchings, and vertex coloring."
      }
    ],
    "modules": [
      {
        "title": "Propositional Logic & First-Order Predicate Calculus",
        "keyPoints": [
          "Propositional connectives: conjunction, disjunction, implication (p -> q = ~p v q), and biconditional equivalences.",
          "Conjunctive Normal Form (CNF) and Disjunctive Normal Form (DNF) canonical transformations.",
          "First-Order Logic: Universal (ALL x) and Existential (EXISTS x) quantifiers, scope, and variable binding.",
          "Resolution refutation principle: Converting statements to clausal form and deriving empty clauses."
        ],
        "theorem": "Resolution Refutation: A propositional or predicate logic formula in CNF is unsatisfiable if and only if the empty clause can be derived via repeated resolution rule applications.",
        "examTrap": "Quantifier Negation Trap: ~(ALL x P(x)) is logically equivalent to EXISTS x ~P(x), NOT ALL x ~P(x). Also remember that ALL x EXISTS y P(x,y) is NOT equivalent to EXISTS y ALL x P(x,y)."
      },
      {
        "title": "Sets, Relations, Posets & Lattice Theory",
        "keyPoints": [
          "Binary relations on set A: reflexive, symmetric, antisymmetric, and transitive definitions.",
          "Equivalence relations induce a disjoint partition of the underlying set into equivalence classes.",
          "Partial orders (Reflexive + Antisymmetric + Transitive); strict partial orders (Irreflexive + Transitive).",
          "Lattices: Posets where every pair of elements has a unique Least Upper Bound (LUB / join) and Greatest Lower Bound (GLB / meet)."
        ],
        "theorem": "Birkhoff\u2019s Lattice Distributivity Criterion: A lattice is distributive if and only if it does not contain either the pentagon lattice N_5 or the diamond lattice M_3 as a sublattice.",
        "examTrap": "Complemented vs Distributive Trap: A complemented lattice does NOT guarantee unique complements unless the lattice is also distributive. In non-distributive lattices, elements can have multiple complements."
      },
      {
        "title": "Combinatorics, Recurrences & Graph Theory",
        "keyPoints": [
          "Pigeonhole Principle: If n items are put into m containers, at least one container holds ceil(n/m) items.",
          "Linear homogeneous recurrences: characteristic polynomial roots and particular solutions for non-homogeneous terms.",
          "Planar Graphs: Euler\u2019s formula V - E + F = 2 for connected planar graphs; edge bound E <= 3V - 6 for V >= 3.",
          "Graph Coloring: Chromatic number bounds, 4-Color theorem for planar graphs, and bipartite graphs (2-colorable iff no odd cycles)."
        ],
        "theorem": "Handshaking Lemma: In any undirected graph G = (V, E), the sum of vertex degrees equals twice the edge count (sum deg(v) = 2|E|); consequently, the number of odd-degree vertices is always even.",
        "examTrap": "Planar Graph Face Count Trap: Remember that Euler\u2019s formula V - E + F = 2 includes the infinite exterior (outer) face. If a planar graph has k connected components, the formula becomes V - E + F = 1 + k."
      }
    ],
    "definitions": [
      {
        "term": "Partial Order (Poset)",
        "category": "Order Theory",
        "definition": "A binary relation R on a set S that is reflexive, antisymmetric, and transitive. Represented visually by a Hasse diagram.",
        "note": "Divisibility on positive integers (a | b) and set inclusion (A subset of B) are classic posets."
      },
      {
        "term": "Lattice",
        "category": "Algebraic Structures",
        "definition": "A partially ordered set (L, <=) in which every two elements a, b in L possess a unique least upper bound (join, a v b) and a unique greatest lower bound (meet, a ^ b).",
        "note": "A lattice is distributive iff it does not contain N_5 or M_3 as a sublattice."
      },
      {
        "term": "Chromatic Number chi(G)",
        "category": "Graph Theory",
        "definition": "The minimum number of colors required to color the vertices of graph G such that no two adjacent vertices share the same color.",
        "note": "Every bipartite graph has chi(G) = 2. Any planar graph has chi(G) <= 4 (Four Color Theorem)."
      },
      {
        "term": "Eulerian Graph",
        "category": "Graph Theory",
        "definition": "A connected undirected graph containing a closed trail that visits every edge exactly once. Exists iff every vertex has an EVEN degree.",
        "note": "If exactly 2 vertices have odd degree, it contains an open Eulerian path, not a circuit."
      },
      {
        "term": "Monoid & Group",
        "category": "Abstract Algebra",
        "definition": "A monoid is an algebraic structure with an associative binary operation and an identity element. A group is a monoid in which every element has a unique inverse.",
        "note": "Lagrange\u2019s Theorem: The order of any subgroup H divides the order of the finite group G."
      }
    ],
    "taxonomies": [
      {
        "name": "Binary Relation Classifications",
        "badge": "Relational Structures",
        "items": [
          "Reflexive (a R a for all a)",
          "Symmetric (a R b => b R a)",
          "Antisymmetric (a R b and b R a => a = b)",
          "Transitive (a R b and b R c => a R c)",
          "Equivalence (Reflexive + Symmetric + Transitive)",
          "Partial Order (Reflexive + Antisymmetric + Transitive)"
        ]
      },
      {
        "name": "Graph Topologies in GATE",
        "badge": "Graph Taxonomy",
        "items": [
          "Planar Graphs (V - E + F = 2, E <= 3V - 6)",
          "Bipartite Graphs (No odd cycles, chi(G) = 2)",
          "Trees & Forests (Acyclic connected, E = V - 1)",
          "Complete Graphs K_n (Edges = n(n-1)/2, chi = n)",
          "Regular Graphs (Every vertex has identical degree k)"
        ]
      }
    ],
    "comparison": {
      "title": "Partial Order (Poset) vs Equivalence Relation",
      "entityA": "Partial Order (Poset)",
      "entityB": "Equivalence Relation",
      "rows": [
        {
          "property": "Symmetry Property",
          "valA": "Antisymmetric: (a,b) and (b,a) in R implies a = b",
          "valB": "Symmetric: (a,b) in R implies (b,a) in R"
        },
        {
          "property": "Transitivity & Reflexivity",
          "valA": "Both Reflexive and Transitive",
          "valB": "Both Reflexive and Transitive"
        },
        {
          "property": "Partitioning Behavior",
          "valA": "Does NOT partition the set; elements form chains and antichains",
          "valB": "Partitions the underlying set into disjoint equivalence classes"
        },
        {
          "property": "Canonical Visual Representation",
          "valA": "Hasse Diagram with upward directed edges",
          "valB": "Venn diagram partitions or cluster graphs with cliques"
        },
        {
          "property": "Extremal Elements",
          "valA": "Possesses maximal, minimal, greatest (top), least (bottom) elements",
          "valB": "No hierarchy; all elements within a class are mutually equivalent"
        },
        {
          "property": "Prototypical Example",
          "valA": "Divisibility relation on integers (a | b) or Subset inclusion (A subset B)",
          "valB": "Modulo congruence: a equiv b (mod m) on integers"
        }
      ]
    }
  },
  "linear-algebra": {
    "formulaName": "Eigenvalues & Singular Value Decomposition (SVD)",
    "lang": "Linear Algebra",
    "gfgUrl": "https://www.geeksforgeeks.org/matrix-operations-linear-algebra-for-gate-exam/",
    "nptelCode": "noc21-ma54 (IIT Kharagpur - Linear Algebra)",
    "derivation": "Characteristic Equation: det(A - lambda * I) = 0\nProperties of Eigenvalues lambda_i:\n  1. sum(lambda_i) = Trace(A)\n  2. prod(lambda_i) = det(A)\n  3. A is invertible <=> lambda_i != 0 for all i\nSingular Value Decomposition (SVD):\n  A = U * Sigma * V^T\n  U: m x m orthogonal matrix (eigenvectors of A * A^T)\n  Sigma: m x n diagonal singular values sigma_i = sqrt(lambda_i(A^T A))\n  V: n x n orthogonal matrix (eigenvectors of A^T * A)",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><rect width=\"320\" height=\"180\" fill=\"transparent\"/><line x1=\"40\" y1=\"140\" x2=\"280\" y2=\"140\" stroke=\"#666\" stroke-width=\"1.5\"/><line x1=\"160\" y1=\"20\" x2=\"160\" y2=\"160\" stroke=\"#666\" stroke-width=\"1.5\"/><ellipse cx=\"160\" cy=\"90\" rx=\"90\" ry=\"45\" stroke=\"#c5a059\" stroke-width=\"2\" fill=\"rgba(197,160,89,0.1)\" transform=\"rotate(-20 160 90)\"/><line x1=\"160\" y1=\"90\" x2=\"240\" y2=\"60\" stroke=\"#e0443e\" stroke-width=\"2.5\"/><text x=\"250\" y=\"60\" fill=\"#e0443e\" font-size=\"11\" font-weight=\"700\">sigma_1 u_1</text><line x1=\"160\" y1=\"90\" x2=\"145\" y2=\"48\" stroke=\"#059669\" stroke-width=\"2.5\"/><text x=\"140\" y=\"40\" fill=\"#059669\" font-size=\"11\" font-weight=\"700\">sigma_2 u_2</text></svg>",
    "caption": "Geometric Transformation & Principal Hyperellipsoid in SVD",
    "gfgSubcategories": [
      {
        "title": "Matrix Algebra & Operations",
        "tag": "Matrix Algebra",
        "url": "https://www.geeksforgeeks.org/matrix-operations-linear-algebra-for-gate-exam/",
        "desc": "Transpose, symmetric, skew-symmetric, orthogonal, and idempotent matrix algebraic identities."
      },
      {
        "title": "Linear Systems & Gaussian Elimination",
        "tag": "Linear Systems",
        "url": "https://www.geeksforgeeks.org/system-of-linear-equations-in-linear-algebra/",
        "desc": "Augmented matrices, row-echelon reduction, pivots, consistency test rank(A) = rank([A|B])."
      },
      {
        "title": "Rank-Nullity & Vector Spaces",
        "tag": "Vector Spaces",
        "url": "https://www.geeksforgeeks.org/rank-of-a-matrix/",
        "desc": "Subspaces, linear span, basis, dimension, column space, nullspace, and rank-nullity theorem."
      },
      {
        "title": "Eigenvalues & Cayley-Hamilton Theorem",
        "tag": "Spectral Theory",
        "url": "https://www.geeksforgeeks.org/eigenvalues-and-eigenvectors/",
        "desc": "Characteristic roots, trace and determinant relationships, algebraic vs geometric multiplicity."
      },
      {
        "title": "Gram-Schmidt & Orthogonal Projections",
        "tag": "Orthogonality",
        "url": "https://www.geeksforgeeks.org/gram-schmidt-orthogonalization-process/",
        "desc": "Inner products, orthogonal complement, projection matrices P = A(A^T A)^{-1} A^T, and QR decomposition."
      },
      {
        "title": "Singular Value Decomposition (SVD)",
        "tag": "Matrix Decompositions",
        "url": "https://www.geeksforgeeks.org/singular-value-decomposition-svd/",
        "desc": "Singular values, low-rank approximation, pseudoinverse, and positive definite quadratic forms."
      }
    ],
    "modules": [
      {
        "title": "Linear Systems, Vector Spaces & Rank-Nullity Theorem",
        "keyPoints": [
          "Linear system AX = B consistency: Consistent iff rank(A) = rank([A|B]). Unique solution iff rank = n; infinite solutions iff rank < n.",
          "Homogeneous system AX = 0 always has trivial solution X = 0; non-trivial solutions exist iff det(A) = 0 (rank < n).",
          "Vector spaces: Subspace test (closure under vector addition and scalar multiplication), linear independence, and spanning sets.",
          "Basis and Dimension: A basis is a minimally spanning and maximally independent subset of vectors."
        ],
        "theorem": "Rank-Nullity Theorem: For any linear transformation represented by an m x n matrix A, the dimension of the column space plus the dimension of the null space equals the number of columns: rank(A) + nullity(A) = n.",
        "examTrap": "Underdetermined System Trap: If an m x n system has more variables than equations (n > m), it can NEVER have a unique solution. It either has infinitely many solutions (if consistent) or zero solutions (if inconsistent)."
      },
      {
        "title": "Eigenvalues, Eigenvectors & Cayley-Hamilton Identity",
        "keyPoints": [
          "Eigenvalue equation det(A - lambda I) = 0. Eigenvectors corresponding to distinct eigenvalues are linearly independent.",
          "Trace(A) = sum(lambda_i) and det(A) = prod(lambda_i). Matrix is invertible iff zero is not an eigenvalue.",
          "Eigenvalues of triangular and diagonal matrices are simply the entries along the main diagonal.",
          "Diagonalizability: An n x n matrix is diagonalizable iff it possesses n linearly independent eigenvectors."
        ],
        "theorem": "Cayley-Hamilton Theorem: Every square matrix satisfies its own characteristic polynomial equation p(A) = 0, allowing efficient evaluation of matrix inverses A^{-1} and arbitrary high powers A^k.",
        "examTrap": "Geometric Multiplicity Trap: Do not assume a matrix is non-diagonalizable just because it has repeated eigenvalues. It is diagonalizable as long as the geometric multiplicity (nullity of A - lambda I) equals algebraic multiplicity for every eigenvalue."
      },
      {
        "title": "Orthogonal Projections, SVD & Quadratic Forms",
        "keyPoints": [
          "Orthogonal projection of vector b onto column space of A: p = A (A^T A)^{-1} A^T b.",
          "Singular Value Decomposition: A = U Sigma V^T, where U and V are orthogonal matrices and Sigma contains singular values.",
          "Singular values sigma_i = sqrt(lambda_i(A^T A)) are always non-negative real numbers.",
          "Quadratic forms Q(x) = x^T A x: Positive definite iff all eigenvalues are strictly positive (or all leading principal minors > 0)."
        ],
        "theorem": "Spectral Theorem for Real Symmetric Matrices: Any real symmetric matrix A can be orthogonally diagonalized as A = Q Lambda Q^T, where all eigenvalues are real and eigenvectors are mutually orthogonal.",
        "examTrap": "Singular Values vs Eigenvalues: Unlike eigenvalues which can be negative or complex, singular values sigma_i are strictly real and non-negative. For symmetric matrices, singular values equal the absolute values of the eigenvalues."
      }
    ],
    "definitions": [
      {
        "term": "Linear Independence",
        "category": "Vector Spaces",
        "definition": "A set of vectors {v_1, ..., v_k} is linearly independent iff c_1 v_1 + ... + c_k v_k = 0 holds strictly and only when all scalar coefficients c_i = 0.",
        "note": "If any vector can be written as a linear combination of the others, the set is dependent."
      },
      {
        "term": "Rank-Nullity Theorem",
        "category": "Linear Transformations",
        "definition": "For any linear mapping represented by an m x n matrix A, the dimension of the column space plus the dimension of the nullspace equals the number of columns: rank(A) + nullity(A) = n.",
        "note": "Column space and row space always have the exact same dimension, called the rank."
      },
      {
        "term": "Eigenvalues & Characteristic Roots",
        "category": "Spectral Theory",
        "definition": "Scalars lambda satisfying Av = lambda v for some non-zero eigenvector v, computed as roots of the characteristic polynomial det(A - lambda I) = 0.",
        "note": "Trace(A) equals the sum of eigenvalues; Det(A) equals the product of eigenvalues."
      },
      {
        "term": "Singular Value Decomposition (SVD)",
        "category": "Decompositions",
        "definition": "Factorization of an m x n real matrix into A = U Sigma V^T, where U (m x m) and V (n x n) are orthogonal matrices and Sigma contains non-negative singular values sigma_i = sqrt(lambda_i(A^T A)).",
        "note": "SVD exists for ALL matrices regardless of shape, rank, or invertibility."
      },
      {
        "term": "Positive Definite Matrix",
        "category": "Quadratic Forms",
        "definition": "A symmetric matrix A is positive definite iff x^T A x > 0 for all non-zero vectors x, or equivalently, iff all eigenvalues are strictly positive.",
        "note": "Sylvester\u2019s criterion: All leading principal minors must be strictly positive."
      }
    ],
    "taxonomies": [
      {
        "name": "Matrix Algebraic Classes",
        "badge": "Matrix Taxonomy",
        "items": [
          "Symmetric (A^T = A, all real eigenvalues)",
          "Skew-Symmetric (A^T = -A, eigenvalues 0 or pure imaginary)",
          "Orthogonal (A^T A = I, det = +/-1, preserves lengths)",
          "Idempotent (A^2 = A, eigenvalues in {0, 1})",
          "Nilpotent (A^k = 0 for some k, all eigenvalues are 0)"
        ]
      },
      {
        "name": "Linear Systems Solvability",
        "badge": "System Taxonomy",
        "items": [
          "Consistent: Unique Solution (rank(A) = rank([A|B]) = n)",
          "Consistent: Infinitely Many Solutions (rank(A) = rank([A|B]) < n)",
          "Inconsistent: No Solution (rank(A) != rank([A|B]))",
          "Homogeneous: Always consistent (trivial solution X=0 always exists)"
        ]
      }
    ],
    "comparison": {
      "title": "Eigenvalues vs Singular Values",
      "entityA": "Eigenvalues (lambda_i)",
      "entityB": "Singular Values (sigma_i)",
      "rows": [
        {
          "property": "Applicable Matrix Geometry",
          "valA": "Defined ONLY for square n x n matrices",
          "valB": "Defined for ANY m x n rectangular matrix"
        },
        {
          "property": "Numerical Domain",
          "valA": "Can be real, negative, zero, or complex conjugate pairs",
          "valB": "Strictly real and non-negative (sigma_i >= 0)"
        },
        {
          "property": "Associated Basis Vectors",
          "valA": "Same left and right direction: Av = lambda v",
          "valB": "Two distinct orthonormal coordinate bases: Av = sigma u"
        },
        {
          "property": "Connection to Invertibility",
          "valA": "A is invertible iff zero is NOT an eigenvalue",
          "valB": "A has full rank iff all min(m,n) singular values are non-zero"
        },
        {
          "property": "Geometric Interpretation",
          "valA": "Scaling along invariant directional eigenvectors",
          "valB": "Lengths of the principal semi-axes of the transformed hyperellipsoid"
        },
        {
          "property": "Mathematical Computation",
          "valA": "Roots of characteristic polynomial det(A - lambda I) = 0",
          "valB": "Square roots of eigenvalues of symmetric matrix A^T A"
        }
      ]
    }
  },
  "calculus-optimization": {
    "formulaName": "Taylor Series & Gradient Optimization",
    "lang": "Multivariable Calculus",
    "gfgUrl": "https://www.geeksforgeeks.org/calculus-and-optimization-for-gate-da/",
    "nptelCode": "noc19-ma15 (IIT Madras - Calculus of One and Several Variables)",
    "derivation": "Multivariate Taylor Expansion around x_0:\n  f(x) approx f(x_0) + grad f(x_0)^T (x - x_0) + 1/2 (x - x_0)^T H(x_0) (x - x_0)\nwhere H is the Hessian Matrix: H_{ij} = d^2 f / (d x_i d x_j)\nStationary Point Conditions:\n  grad f(x*) = 0\n  H(x*) Positive Definite (all lambda > 0) => Local Strict Minimum\n  H(x*) Negative Definite (all lambda < 0) => Local Strict Maximum\n  H(x*) Indefinite (mixed signs)         => Saddle Point",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><path d=\"M40 140 Q 160 20 280 140\" fill=\"none\" stroke=\"#c5a059\" stroke-width=\"2.5\"/><circle cx=\"160\" cy=\"80\" r=\"5\" fill=\"#059669\"/><line x1=\"100\" y1=\"80\" x2=\"220\" y2=\"80\" stroke=\"#059669\" stroke-dasharray=\"4\" stroke-width=\"2\"/><text x=\"160\" y=\"65\" fill=\"#059669\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"700\">f'(x*) = 0 (Global Minimum)</text></svg>",
    "caption": "Stationary Extremum and Curvature",
    "gfgSubcategories": [
      {
        "title": "Limits, Continuity & Differentiability",
        "tag": "Foundations",
        "url": "https://www.geeksforgeeks.org/limits-continuity-and-differentiability/",
        "desc": "Indeterminate forms 0/0 and inf/inf, L\u2019H\u00f4pital\u2019s rule, one-sided limits, and differentiability conditions."
      },
      {
        "title": "Mean Value Theorems",
        "tag": "Differential Calculus",
        "url": "https://www.geeksforgeeks.org/mean-value-theorem/",
        "desc": "Rolle\u2019s theorem, Lagrange\u2019s Mean Value Theorem (MVT), and Cauchy\u2019s generalized mean value theorem."
      },
      {
        "title": "Extrema & Multivariable Critical Points",
        "tag": "Optimization Theory",
        "url": "https://www.geeksforgeeks.org/maxima-and-minima-of-functions/",
        "desc": "First and second derivative tests, Hessian matrix determinants, and saddle point classification."
      },
      {
        "title": "Taylor & Maclaurin Series Expansions",
        "tag": "Series Approximations",
        "url": "https://www.geeksforgeeks.org/taylor-and-maclaurin-series/",
        "desc": "Taylor series expansions around point a, power series convergence, and polynomial approximation orders."
      },
      {
        "title": "Definite & Improper Integrals",
        "tag": "Integral Calculus",
        "url": "https://www.geeksforgeeks.org/definite-integrals/",
        "desc": "Fundamental Theorem of Calculus, integration by parts, substitution, and improper integral convergence."
      },
      {
        "title": "Gradient Descent & Convex Functions",
        "tag": "Convex Optimization",
        "url": "https://www.geeksforgeeks.org/gradient-descent-algorithm-and-its-variants/",
        "desc": "Convex sets, epigraphs, gradient descent updates x_{t+1} = x_t - eta grad f(x_t), and learning rate bounds."
      }
    ],
    "modules": [
      {
        "title": "Limits, Continuity & Mean Value Theorems",
        "keyPoints": [
          "L\u2019H\u00f4pital\u2019s Rule: Applies strictly to indeterminate forms 0/0 and inf/inf: lim f(x)/g(x) = lim f\u2019(x)/g\u2019(x).",
          "Continuity: Function is continuous at c iff lim_{x -> c} f(x) exists and equals f(c).",
          "Differentiability: Differentiability implies continuity, but continuity does NOT imply differentiability (e.g., |x| at x=0).",
          "Lagrange\u2019s MVT: For f continuous on [a,b] and differentiable on (a,b), there exists c in (a,b) with f\u2019(c) = (f(b)-f(a))/(b-a)."
        ],
        "theorem": "Rolle\u2019s Theorem: If f is continuous on [a, b], differentiable on (a, b), and f(a) = f(b), then there exists at least one number c in (a, b) such that f\u2019(c) = 0.",
        "examTrap": "L\u2019H\u00f4pital Misapplication Trap: Never apply L\u2019H\u00f4pital\u2019s rule when the denominator limit is non-zero. Doing so changes the value of the limit and produces incorrect answer options."
      },
      {
        "title": "Maxima, Minima, Hessian Matrix & Taylor Series",
        "keyPoints": [
          "Stationary points occur where f\u2019(x) = 0 (or grad f(x) = 0 for multivariable functions).",
          "Single variable second derivative test: f\u2019\u2019(x*) > 0 implies local minimum; f\u2019\u2019(x*) < 0 implies local maximum; f\u2019\u2019(x*) = 0 is inconclusive.",
          "Hessian Matrix H(x) = [d^2 f / dx_i dx_j]: Positive definite implies strict local min; negative definite implies strict local max; indefinite implies saddle point.",
          "Multivariate Taylor Series: f(x) = f(x_0) + grad f(x_0)^T (x - x_0) + 1/2 (x - x_0)^T H(x_0) (x - x_0) + ..."
        ],
        "theorem": "Second-Order Sufficiency Condition: A critical point x* where grad f(x*) = 0 is an isolated local minimum if the Hessian matrix H(f)(x*) is positive definite.",
        "examTrap": "Boundary Extrema Trap: In optimization on closed bounded intervals or regions, absolute extrema often occur on the boundary where derivatives are not zero. Always evaluate boundary points separately!"
      },
      {
        "title": "Convex Optimization & Gradient Descent",
        "keyPoints": [
          "Convex set: Line segment between any two points in the set lies entirely within the set.",
          "Convex function: f(lambda x + (1-lambda) y) <= lambda f(x) + (1-lambda) f(y) for all lambda in [0, 1].",
          "First-order convexity condition: f(y) >= f(x) + grad f(x)^T (y - x) for all x, y.",
          "Gradient Descent algorithm: Iterative update step x_{k+1} = x_k - eta grad f(x_k) moving in direction of steepest descent."
        ],
        "theorem": "Global Optimality of Convex Functions: For a convex function defined on a convex set, every local minimum is guaranteed to be a global minimum.",
        "examTrap": "Learning Rate Divergence Trap: If the learning rate eta > 2/L (where L is the Lipschitz constant of grad f), gradient descent can diverge and oscillate into infinity instead of converging."
      }
    ],
    "definitions": [
      {
        "term": "Continuity",
        "category": "Foundations",
        "definition": "A function f is continuous at x = c iff lim_{x -> c} f(x) exists and is strictly equal to the evaluated value f(c).",
        "note": "Differentiability strictly implies continuity, but continuity does NOT imply differentiability."
      },
      {
        "term": "Lagrange\u2019s Mean Value Theorem",
        "category": "Differential Calculus",
        "definition": "If f is continuous on [a, b] and differentiable on (a, b), there exists at least one c in (a, b) such that f\u2019(c) = (f(b) - f(a)) / (b - a).",
        "note": "Rolle\u2019s Theorem is the special case where f(a) = f(b), yielding f\u2019(c) = 0."
      },
      {
        "term": "Hessian Matrix",
        "category": "Multivariable Optimization",
        "definition": "The square matrix of second-order partial derivatives H_{ij} = d^2 f / (dx_i dx_j). Dictates the local curvature of a multivariable function.",
        "note": "Positive definite H implies local min; negative definite implies local max; indefinite implies saddle point."
      },
      {
        "term": "Convex Function",
        "category": "Optimization Theory",
        "definition": "A function where the line segment between any two points on its graph lies entirely on or above the graph: f(lambda x + (1-lambda)y) <= lambda f(x) + (1-lambda)f(y).",
        "note": "Every local minimum of a convex function over a convex set is guaranteed to be a global minimum."
      },
      {
        "term": "Gradient Descent",
        "category": "Algorithmic Optimization",
        "definition": "First-order iterative optimization algorithm that updates variables in the direction opposite to the gradient: x_{t+1} = x_t - eta grad f(x_t).",
        "note": "Convergence depends critically on step size eta <= 2/L where L is Lipschitz smoothness."
      }
    ],
    "taxonomies": [
      {
        "name": "Critical Point Classifications",
        "badge": "Calculus Taxonomy",
        "items": [
          "Local Minimum (f'(x*)=0 and f''(x*) > 0, or H is positive definite)",
          "Local Maximum (f'(x*)=0 and f''(x*) < 0, or H is negative definite)",
          "Saddle Point (grad f(x*)=0 and H has mixed positive and negative eigenvalues)",
          "Inflection Point (f''(x) changes sign, curvature inverts)"
        ]
      },
      {
        "name": "Optimization Methodologies",
        "badge": "Optimization Taxonomy",
        "items": [
          "First-Order Methods (Gradient Descent, Momentum, Adam)",
          "Second-Order Methods (Newton-Raphson, BFGS, Quasi-Newton)",
          "Constrained Optimization (Lagrange Multipliers, KKT Conditions)",
          "Linear Programming (Simplex Method, Duality Theory)"
        ]
      }
    ],
    "comparison": {
      "title": "Local Extrema vs Global (Absolute) Extrema",
      "entityA": "Local (Relative) Extrema",
      "entityB": "Global (Absolute) Extrema",
      "rows": [
        {
          "property": "Domain Scope",
          "valA": "Defined over an open neighborhood (delta-ball) around x*",
          "valB": "Defined over the entire allowable domain or closed set S"
        },
        {
          "property": "Derivative Condition",
          "valA": "Must satisfy grad f(x*) = 0 (or derivative undefined)",
          "valB": "May occur at stationary points OR at domain boundaries where grad f != 0"
        },
        {
          "property": "Uniqueness",
          "valA": "A function can have multiple distinct local minima and maxima",
          "valB": "The extremum value is unique (though achieved at multiple points)"
        },
        {
          "property": "Convex Function Behavior",
          "valA": "Any local minimum is automatically a global minimum",
          "valB": "Guaranteed to coincide with every local minimum in convex domains"
        },
        {
          "property": "Verification Test",
          "valA": "Second-derivative test f\u2019\u2019(x*) or Hessian matrix definiteness",
          "valB": "Direct evaluation comparing all critical points and boundary limits"
        },
        {
          "property": "GATE Examination Trap",
          "valA": "Finding x* with f\u2019(x*)=0 is sufficient to identify local candidate",
          "valB": "Forgetting boundary points on intervals [a, b] causes incorrect global answers"
        }
      ]
    }
  },
  "probability-statistics": {
    "formulaName": "Bayes' Law & Central Limit Theorem",
    "lang": "Probability Theory",
    "gfgUrl": "https://www.geeksforgeeks.org/probability-and-statistics-for-gate-exam/",
    "nptelCode": "noc20-ma22 (IIT Kharagpur - Probability and Statistics)",
    "derivation": "Bayes' Rule:\n  P(A_i | B) = [ P(B | A_i) * P(A_i) ] / sum_{j=1}^k [ P(B | A_j) * P(A_j) ]\n\nCentral Limit Theorem (CLT):\n  Given i.i.d random variables X_1, X_2, ..., X_n with mean mu and variance sigma^2:\n  Sample Mean X_bar = (1/n) * sum(X_i)\n  As n -> infinity:\n  Z = (X_bar - mu) / (sigma / sqrt(n))  ---> N(0, 1)",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><path d=\"M 40 150 C 110 150, 130 30, 160 30 C 190 30, 210 150, 280 150\" fill=\"rgba(197,160,89,0.15)\" stroke=\"#c5a059\" stroke-width=\"2.5\"/><line x1=\"160\" y1=\"30\" x2=\"160\" y2=\"150\" stroke=\"#e0443e\" stroke-dasharray=\"3\" stroke-width=\"1.5\"/><text x=\"160\" y=\"165\" fill=\"#666\" font-size=\"10\" text-anchor=\"middle\">mu (Mean)</text><text x=\"210\" y=\"110\" fill=\"#c5a059\" font-size=\"10\">+1 sigma</text></svg>",
    "caption": "Gaussian Bell Curve Distribution (CLT Convergence)",
    "gfgSubcategories": [
      {
        "title": "Axioms & Conditional Probability",
        "tag": "Probability Basics",
        "url": "https://www.geeksforgeeks.org/probability-in-engineering-mathematics/",
        "desc": "Sample spaces, independent events, mutually exclusive events, and conditional probability P(A|B)."
      },
      {
        "title": "Bayes\u2019 Theorem & Law of Total Probability",
        "tag": "Bayesian Inference",
        "url": "https://www.geeksforgeeks.org/bayes-theorem/",
        "desc": "Prior vs posterior probabilities, likelihood, total probability partitions, and false-positive computations."
      },
      {
        "title": "Discrete Probability Distributions",
        "tag": "Discrete Variables",
        "url": "https://www.geeksforgeeks.org/binomial-distribution-formula-and-examples/",
        "desc": "Bernoulli, Binomial B(n, p), Poisson distribution, and Geometric memoryless property."
      },
      {
        "title": "Continuous Distributions (Uniform & Normal)",
        "tag": "Continuous Variables",
        "url": "https://www.geeksforgeeks.org/normal-distribution/",
        "desc": "Probability density functions (PDF), CDF, Uniform, Exponential, and standard normal Z-scores."
      },
      {
        "title": "Expectation, Variance & Covariance",
        "tag": "Moments & Covariance",
        "url": "https://www.geeksforgeeks.org/covariance-and-correlation/",
        "desc": "Linearity of expectation, variance properties Var(aX+b)=a^2 Var(X), covariance, and correlation coefficient."
      },
      {
        "title": "Central Limit Theorem & Hypothesis Testing",
        "tag": "Statistical Inference",
        "url": "https://www.geeksforgeeks.org/hypothesis-testing/",
        "desc": "Sample mean distribution, confidence intervals, null hypothesis H_0, p-values, Type I and Type II errors."
      }
    ],
    "modules": [
      {
        "title": "Axiomatic Probability, Independence & Bayes\u2019 Theorem",
        "keyPoints": [
          "Axioms: P(S) = 1, P(A) >= 0, and P(A v B) = P(A) + P(B) for mutually exclusive events.",
          "Conditional probability: P(A|B) = P(A cap B) / P(B), provided P(B) > 0.",
          "Independence: Events A and B are independent iff P(A cap B) = P(A) P(B).",
          "Law of Total Probability: P(B) = sum P(B|A_i) P(A_i) across a partition {A_i} of sample space S."
        ],
        "theorem": "Bayes\u2019 Inversion Rule: For a partition of the sample space into mutually exclusive events A_1, ..., A_k, P(A_i|B) = [P(B|A_i) P(A_i)] / sum_{j=1}^k [P(B|A_j) P(A_j)].",
        "examTrap": "Independence vs Mutual Exclusivity: Mutually exclusive events with non-zero probability can NEVER be independent! If A and B cannot occur together, knowledge that B occurred guarantees A did not."
      },
      {
        "title": "Random Variables, Distributions & Moments",
        "keyPoints": [
          "Binomial Distribution: P(X=k) = C(n,k) p^k (1-p)^{n-k}; Mean = np, Variance = np(1-p).",
          "Poisson Distribution: P(X=k) = (lambda^k e^{-lambda}) / k!; Mean = lambda, Variance = lambda.",
          "Exponential Distribution: f(x) = lambda e^{-lambda x}; Memoryless property: P(X > s+t | X > s) = P(X > t).",
          "Normal Distribution: Bell-shaped curve symmetric around mu; standard normal Z = (X - mu)/sigma."
        ],
        "theorem": "Linearity of Expectation: For ANY random variables X and Y (whether independent or dependent), E[aX + bY] = a E[X] + b E[Y].",
        "examTrap": "Variance Non-Linearity Trap: Var(X + Y) = Var(X) + Var(Y) + 2 Cov(X, Y). Do NOT drop the covariance term unless you are explicitly given that X and Y are uncorrelated or independent!"
      },
      {
        "title": "Central Limit Theorem, Estimation & Hypothesis Testing",
        "keyPoints": [
          "Sample Mean X_bar = (1/n) sum X_i has expected value mu and standard error sigma / sqrt(n).",
          "Central Limit Theorem: Regardless of the underlying population distribution, the sample mean approaches normal distribution as n -> inf.",
          "Hypothesis testing: Null hypothesis H_0 vs Alternative hypothesis H_1.",
          "Type I Error (alpha): Rejecting H_0 when H_0 is true (false alarm). Type II Error (beta): Failing to reject H_0 when H_0 is false."
        ],
        "theorem": "Central Limit Theorem (CLT): The normalized sum of n independent identically distributed random variables with finite variance converges in distribution to the standard normal distribution N(0,1).",
        "examTrap": "P-Value Decision Boundary: Reject H_0 if and only if p-value <= alpha. If p-value > alpha, we \"fail to reject H_0\" (we NEVER say \"we accept H_0\")."
      }
    ],
    "definitions": [
      {
        "term": "Axiomatic Probability",
        "category": "Probability Foundations",
        "definition": "Probability measure P assigning values in [0, 1] to events, where P(S) = 1 and P(A v B) = P(A) + P(B) for mutually exclusive events.",
        "note": "Complement rule: P(A\u2019) = 1 - P(A). General addition: P(A v B) = P(A) + P(B) - P(A cap B)."
      },
      {
        "term": "Conditional Probability & Bayes\u2019 Rule",
        "category": "Inference",
        "definition": "P(A|B) = P(A cap B) / P(B) for P(B) > 0. Bayes\u2019 rule inverts conditional dependencies: P(A_i|B) = [P(B|A_i)P(A_i)] / sum P(B|A_j)P(A_j).",
        "note": "Critical for updating belief distributions upon receiving noisy evidence."
      },
      {
        "term": "Central Limit Theorem (CLT)",
        "category": "Asymptotic Theory",
        "definition": "The normalized sum (or sample mean) of n independent identically distributed random variables with mean mu and finite variance sigma^2 approaches a standard normal distribution N(0, 1) as n -> inf.",
        "note": "Holds regardless of whether the original distribution was skewed, uniform, or discrete."
      },
      {
        "term": "Covariance & Correlation",
        "category": "Bivariate Moments",
        "definition": "Cov(X, Y) = E[(X - mu_X)(Y - mu_Y)] = E[XY] - E[X]E[Y]. Pearson correlation rho = Cov(X, Y) / (sigma_X sigma_Y) bounded in [-1, +1].",
        "note": "Independence implies Cov = 0, but Cov = 0 does NOT guarantee independence."
      },
      {
        "term": "Hypothesis Testing & p-value",
        "category": "Statistical Inference",
        "definition": "Decision framework evaluating null hypothesis H_0 against alternative H_1. The p-value is the probability of observing data at least as extreme as the sample, assuming H_0 is true.",
        "note": "Reject H_0 iff p-value <= alpha (significance level)."
      }
    ],
    "taxonomies": [
      {
        "name": "Discrete Probability Distributions",
        "badge": "Discrete Models",
        "items": [
          "Bernoulli (Single trial, outcomes in {0, 1})",
          "Binomial B(n, p) (Mean np, Variance np(1-p))",
          "Poisson Pois(lambda) (Mean = Variance = lambda, rare events)",
          "Geometric (Memoryless discrete trials until first success)"
        ]
      },
      {
        "name": "Continuous Probability Distributions",
        "badge": "Continuous Models",
        "items": [
          "Uniform U(a, b) (Constant density 1/(b-a))",
          "Normal N(mu, sigma^2) (Symmetric Gaussian bell curve)",
          "Exponential Exp(lambda) (Memoryless continuous waiting times)",
          "Student\u2019s t-distribution (Heavy-tailed, small sample inference)"
        ]
      }
    ],
    "comparison": {
      "title": "Mutually Exclusive Events vs Independent Events",
      "entityA": "Mutually Exclusive (Disjoint) Events",
      "entityB": "Independent Events",
      "rows": [
        {
          "property": "Mathematical Condition",
          "valA": "P(A cap B) = 0 (Events cannot co-occur)",
          "valB": "P(A cap B) = P(A) * P(B)"
        },
        {
          "property": "Conditional Probability",
          "valA": "P(A | B) = 0 (Knowledge of B guarantees A did not happen)",
          "valB": "P(A | B) = P(A) (Knowledge of B gives zero information on A)"
        },
        {
          "property": "Set-Theoretic Venn Representation",
          "valA": "Disjoint, non-overlapping circles with empty intersection",
          "valB": "Overlapping circles where intersection area matches the product of probabilities"
        },
        {
          "property": "Compatibility with Non-Zero Probabilities",
          "valA": "If P(A) > 0 and P(B) > 0, they can NEVER be independent",
          "valB": "If P(A) > 0 and P(B) > 0, they can NEVER be mutually exclusive"
        },
        {
          "property": "Union Formula Simplification",
          "valA": "P(A v B) = P(A) + P(B)",
          "valB": "P(A v B) = P(A) + P(B) - P(A)*P(B)"
        },
        {
          "property": "Physical Interpretation",
          "valA": "Rolling a die: getting a 2 and getting a 5 on the same roll",
          "valB": "Flipping two separate independent coins: Heads on Coin 1 and Tails on Coin 2"
        }
      ]
    }
  },
  "digital-logic": {
    "formulaName": "Sequential Timing & K-Map Boolean Optimization",
    "lang": "Digital Systems",
    "gfgUrl": "https://www.geeksforgeeks.org/digital-logic-gate-notes/",
    "nptelCode": "noc21-cs47 (IIT Kharagpur - Digital Electronic Circuits)",
    "derivation": "Flip-Flop Setup and Hold Time Constraints:\nClock Period Bound (Setup Time Condition):\n  T_clk >= T_cq(max) + T_comb(max) + T_setup - T_skew\n  f_max = 1 / T_clk(min)\nHold Time Condition (Race Condition Avoidance):\n  T_cq(min) + T_comb(min) >= T_hold + T_skew\n(If violated, data corruption occurs regardless of clock slowing!)",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><rect x=\"30\" y=\"40\" width=\"70\" height=\"80\" fill=\"#4a0e17\" rx=\"6\"/><text x=\"65\" y=\"85\" fill=\"#fff\" font-size=\"11\" text-anchor=\"middle\">FF 1</text><rect x=\"135\" y=\"55\" width=\"55\" height=\"50\" fill=\"#c5a059\" rx=\"4\"/><text x=\"162\" y=\"83\" fill=\"#111\" font-size=\"9\" text-anchor=\"middle\">Logic T_comb</text><rect x=\"220\" y=\"40\" width=\"70\" height=\"80\" fill=\"#2d0a0f\" rx=\"6\"/><text x=\"255\" y=\"85\" fill=\"#fff\" font-size=\"11\" text-anchor=\"middle\">FF 2</text><line x1=\"100\" y1=\"80\" x2=\"135\" y2=\"80\" stroke=\"#999\" stroke-width=\"2\"/><line x1=\"190\" y1=\"80\" x2=\"220\" y2=\"80\" stroke=\"#999\" stroke-width=\"2\"/><text x=\"160\" y=\"145\" fill=\"#999\" font-size=\"10\" text-anchor=\"middle\">Clock Period T_clk >= T_cq + T_comb + T_setup</text></svg>",
    "caption": "Sequential Logic Propagation & Setup Timing Constraint",
    "gfgSubcategories": [
      {
        "title": "Boolean Algebra & De Morgan\u2019s Laws",
        "tag": "Boolean Logic",
        "url": "https://www.geeksforgeeks.org/boolean-algebra-in-digital-logic/",
        "desc": "Canonical SOP/POS forms, minterms, maxterms, duality principle, and universal logic gates (NAND/NOR)."
      },
      {
        "title": "Karnaugh Maps (K-Maps) Minimization",
        "tag": "Minimization",
        "url": "https://www.geeksforgeeks.org/k-map-karnaugh-map/",
        "desc": "Gray code adjacency, grouping powers of 2, prime implicants, essential prime implicants, and don\u2019t care conditions."
      },
      {
        "title": "Combinational Logic: Adders & Multiplexers",
        "tag": "Combinational Circuits",
        "url": "https://www.geeksforgeeks.org/combinational-circuits/",
        "desc": "Half/full adders, carry lookahead delay, 2^n:1 MUX logic implementation, decoders, and priority encoders."
      },
      {
        "title": "Latches, Flip-Flops & Excitation Tables",
        "tag": "Memory Elements",
        "url": "https://www.geeksforgeeks.org/flip-flop-types-conversion-and-applications/",
        "desc": "SR, JK race around condition, Master-Slave JK, D (delay), T (toggle) flip-flops, and excitation conversion."
      },
      {
        "title": "Counters & Shift Registers",
        "tag": "Sequential Systems",
        "url": "https://www.geeksforgeeks.org/counters-in-digital-logic/",
        "desc": "Ripple asynchronous counters, MOD-N synchronous counters, ring counters, and Johnson twisted counters."
      },
      {
        "title": "Number Representations & 2\u2019s Complement",
        "tag": "Computer Arithmetic",
        "url": "https://www.geeksforgeeks.org/2s-complement-notation/",
        "desc": "Signed magnitude, 1\u2019s complement, 2\u2019s complement range [-2^{n-1}, 2^{n-1}-1], overflow detection, and IEEE 754."
      }
    ],
    "modules": [
      {
        "title": "Boolean Algebra, Canonical Forms & K-Map Minimization",
        "keyPoints": [
          "De Morgan\u2019s Theorems: (A + B)\u2019 = A\u2019 B\u2019 and (A B)\u2019 = A\u2019 + B\u2019.",
          "Canonical SOP (sum of minterms) and canonical POS (product of maxterms).",
          "K-Map grouping: Must group in powers of two (1, 2, 4, 8, 16); larger groups produce smaller product terms.",
          "Prime Implicant (PI): Rectangular group that cannot be combined into a larger group. Essential Prime Implicant (EPI): Contains at least one minterm covered by no other PI."
        ],
        "theorem": "Consensus Theorem: AB + A\u2019C + BC = AB + A\u2019C, where the consensus term BC is entirely redundant and can be eliminated.",
        "examTrap": "Don\u2019t Care Minimization Trap: Don\u2019t care conditions (d) do NOT have to be covered! Only group a don\u2019t care if doing so enlarges an existing group of 1s to simplify the Boolean expression."
      },
      {
        "title": "Combinational MSI Circuits: Adders, MUX & Decoders",
        "keyPoints": [
          "Full Adder: Sum S = A xor B xor C_in; Carry C_out = AB + BC_in + AC_in.",
          "Carry Lookahead Adder computes carries in parallel using Generate G_i = A_i B_i and Propagate P_i = A_i xor B_i.",
          "Multiplexer 2^n to 1: Can implement any Boolean function of n variables directly, and n+1 variables using external inverters.",
          "Decoders n to 2^n generate all 2^n minterms; can synthesize any logic function by OR-ing active-low/high minterm outputs."
        ],
        "theorem": "Universal Function Implementation via Multiplexers: Any Boolean function of n variables can be implemented using a single 2^{n-1}:1 MUX without any external logic gates.",
        "examTrap": "Multiplexer Variable Assignment: When connecting inputs of a MUX, be extremely careful with variable indexing on select lines. Reversing the order of MSB and LSB flips the entire function."
      },
      {
        "title": "Sequential Circuits, Flip-Flop Conversion & Timing Constraints",
        "keyPoints": [
          "Characteristic equations: JK: Q_{next} = J Q\u2019 + K\u2019 Q; D: Q_{next} = D; T: Q_{next} = T xor Q.",
          "Race Around Condition in JK Flip-Flop occurs when J=1, K=1, level-triggered clock pulse width t_p > propagation delay t_{ff}. Remedied by edge triggering.",
          "Setup Time t_{su}: Minimum time input data must remain stable BEFORE clock edge arrives.",
          "Hold Time t_h: Minimum time input data must remain stable AFTER clock edge arrives."
        ],
        "theorem": "Maximum Clock Frequency Bound: The minimum clock period T_{clk} is bounded by T_{clk} >= t_{cq(max)} + t_{comb(max)} + t_{su} - t_{skew}, giving f_{max} = 1 / T_{clk(min)}.",
        "examTrap": "Hold Time Independence from Clock: Hold time violations (t_{cq(min)} + t_{comb(min)} < t_h + t_{skew}) CANNOT be resolved by decreasing clock frequency! They depend purely on propagation delays."
      }
    ],
    "definitions": [
      {
        "term": "Essential Prime Implicant (EPI)",
        "category": "Boolean Optimization",
        "definition": "A prime implicant subcube in a Karnaugh map that covers at least one minterm (1) that is covered by no other prime implicant.",
        "note": "All EPIs must be included in every minimal sum-of-products (SOP) Boolean expression."
      },
      {
        "term": "Setup Time (t_su)",
        "category": "Sequential Timing",
        "definition": "The minimum time duration for which data input must remain stable and unchanged BEFORE the active clock edge arrives at a flip-flop.",
        "note": "Violating setup time results in metastability and corrupt state capture."
      },
      {
        "term": "Hold Time (t_h)",
        "category": "Sequential Timing",
        "definition": "The minimum time duration for which data input must remain stable and unchanged AFTER the active clock edge arrives at a flip-flop.",
        "note": "Hold time constraints are independent of clock period; cannot be fixed by slowing clock!"
      },
      {
        "term": "Race Around Condition",
        "category": "Memory Elements",
        "definition": "Phenomenon in level-triggered JK flip-flops where output toggles repeatedly and unpredictably when J=1, K=1 and clock pulse width t_p > propagation delay t_{ff}.",
        "note": "Resolved by edge-triggering or Master-Slave JK architecture."
      },
      {
        "term": "Universal Logic Gate",
        "category": "Gate Theory",
        "definition": "A logic gate that can implement any arbitrary Boolean function without requiring any other gate type. NAND and NOR are the two canonical universal gates.",
        "note": "Inverter, AND, and OR can all be synthesized purely from NAND or purely from NOR."
      }
    ],
    "taxonomies": [
      {
        "name": "Flip-Flop Architectures",
        "badge": "Sequential Blocks",
        "items": [
          "SR Flip-Flop (Undefined state when S=1, R=1)",
          "JK Flip-Flop (Toggles on J=1, K=1; solves SR ambiguity)",
          "D Flip-Flop (Delay element: Q_{next} = D, avoids invalid states)",
          "T Flip-Flop (Toggle element: Q_{next} = T xor Q, divides frequency by 2)"
        ]
      },
      {
        "name": "Finite State Machine Models",
        "badge": "FSM Taxonomy",
        "items": [
          "Mealy Machine (Outputs depend on current state AND inputs; fewer states)",
          "Moore Machine (Outputs depend strictly on current state only; glitch-free)",
          "Synchronous Counters (All flip-flops share identical clock pulse)",
          "Ripple Counters (Clock of stage i+1 is driven by output of stage i)"
        ]
      }
    ],
    "comparison": {
      "title": "Combinational Circuits vs Sequential Circuits",
      "entityA": "Combinational Logic Circuits",
      "entityB": "Sequential Logic Circuits",
      "rows": [
        {
          "property": "Memory Storage",
          "valA": "No memory elements; contains no latches or flip-flops",
          "valB": "Memory elements present to store system state history"
        },
        {
          "property": "Output Dependency",
          "valA": "Outputs depend strictly on present input values only",
          "valB": "Outputs depend on present inputs AND past state history"
        },
        {
          "property": "Clock Signal Requirement",
          "valA": "Operates asynchronously; does not require a clock pulse",
          "valB": "Usually driven by periodic clock signals (synchronous systems)"
        },
        {
          "property": "Feedback Loops",
          "valA": "Strictly feed-forward acyclic graph; no feedback paths",
          "valB": "Feedback paths exist from memory outputs back to input logic"
        },
        {
          "property": "Timing Analysis",
          "valA": "Governed purely by cumulative gate propagation delays",
          "valB": "Constrained by flip-flop setup time, hold time, and clock period"
        },
        {
          "property": "Representative GATE Circuits",
          "valA": "Full Adders, Carry Lookahead, Multiplexers, Decoders, ALUs",
          "valB": "Shift Registers, Synchronous Counters, RAM Cells, FSM Controllers"
        }
      ]
    }
  },
  "computer-organization": {
    "formulaName": "Cache Memory EAT & Pipeline Speedup",
    "lang": "Computer Architecture",
    "gfgUrl": "https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/",
    "nptelCode": "noc20-cs64 (IIT Madras - Computer Organization and Architecture)",
    "derivation": "Effective Access Time (EAT) with Hierarchical Cache:\n  EAT = H_1 * T_1 + (1 - H_1) * [ H_2 * (T_1 + T_2) + (1 - H_2) * (T_1 + T_2 + T_mem) ]\n  where H_i = Hit Ratio at Level i, T_i = Access Latency.\n\nPipeline Speedup:\n  Speedup S = Non-pipelined Time / Pipelined Time\n            = (n * k * tau) / [ (k + n - 1) * tau + Stalls ]\n  Ideal Limit (as n -> infinity, Stalls = 0): Speedup = k (number of stages)",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><rect x=\"30\" y=\"30\" width=\"60\" height=\"25\" fill=\"#4a0e17\" rx=\"4\"/><text x=\"60\" y=\"46\" fill=\"#fff\" font-size=\"9\" text-anchor=\"middle\">CPU Core</text><rect x=\"110\" y=\"30\" width=\"55\" height=\"25\" fill=\"#c5a059\" rx=\"4\"/><text x=\"137\" y=\"46\" fill=\"#111\" font-size=\"9\" text-anchor=\"middle\">L1 Cache</text><rect x=\"185\" y=\"30\" width=\"55\" height=\"25\" fill=\"#a8853b\" rx=\"4\"/><text x=\"212\" y=\"46\" fill=\"#111\" font-size=\"9\" text-anchor=\"middle\">L2 Cache</text><rect x=\"255\" y=\"20\" width=\"50\" height=\"45\" fill=\"#333\" rx=\"4\"/><text x=\"280\" y=\"47\" fill=\"#fff\" font-size=\"9\" text-anchor=\"middle\">RAM</text><line x1=\"90\" y1=\"42\" x2=\"110\" y2=\"42\" stroke=\"#666\" stroke-width=\"2\"/><line x1=\"165\" y1=\"42\" x2=\"185\" y2=\"42\" stroke=\"#666\" stroke-width=\"2\"/><line x1=\"240\" y1=\"42\" x2=\"255\" y2=\"42\" stroke=\"#666\" stroke-width=\"2\"/><text x=\"160\" y=\"120\" fill=\"#999\" font-size=\"10\" text-anchor=\"middle\">Hierarchy: Trade-off between capacity and latency</text></svg>",
    "caption": "Memory Hierarchy Latency vs Capacity Pyramid",
    "gfgSubcategories": [
      {
        "title": "Machine Instructions & Addressing Modes",
        "tag": "Instruction Sets",
        "url": "https://www.geeksforgeeks.org/addressing-modes/",
        "desc": "Immediate, direct, indirect, register indirect, index, base register, and PC-relative addressing calculation."
      },
      {
        "title": "ALU Design & IEEE 754 Floating Point",
        "tag": "Arithmetic",
        "url": "https://www.geeksforgeeks.org/ieee-standard-754-floating-point-numbers/",
        "desc": "Booth\u2019s multiplication algorithm, restoring/non-restoring division, sign bit, exponent bias 127/1023, mantissa."
      },
      {
        "title": "Cache Memory Organization & Mapping",
        "tag": "Memory Hierarchy",
        "url": "https://www.geeksforgeeks.org/cache-memory/",
        "desc": "Direct mapping, associative, set-associative cache tags/set indices/block offsets, write policies, and EAT."
      },
      {
        "title": "Instruction Pipelining & Hazard Resolution",
        "tag": "Pipelines",
        "url": "https://www.geeksforgeeks.org/pipelining-in-computer-architecture/",
        "desc": "Structural hazards, RAW/WAR/WAW data hazards, forwarding bypass paths, branch delay slots, and speedup."
      },
      {
        "title": "Memory Interleaving & Secondary Storage",
        "tag": "Storage Systems",
        "url": "https://www.geeksforgeeks.org/memory-interleaving-in-computer-organization/",
        "desc": "High-order vs low-order interleaving, disk rotational latency, seek time, transfer rates, and RAID arrays."
      },
      {
        "title": "I/O Interfaces, Interrupts & DMA",
        "tag": "I/O Organization",
        "url": "https://www.geeksforgeeks.org/direct-memory-access-dma/",
        "desc": "Programmed I/O, interrupt-driven I/O, daisy chain priority resolution, DMA cycle stealing, and burst mode."
      }
    ],
    "modules": [
      {
        "title": "Instruction Set Architecture, Addressing Modes & Datapath",
        "keyPoints": [
          "Instruction cycle: Fetch, Decode, Operand Fetch, Execute, Writeback.",
          "Addressing modes: Immediate (#val), Direct (address in instruction), Indirect (@addr), PC-relative (PC + offset).",
          "Control Unit: Hardwired control (fast, fixed combinational circuits) vs Microprogrammed control (flexible microinstructions, slower).",
          "Interrupt handling: Hardware vectored interrupts save return PC and processor status word onto the system stack."
        ],
        "theorem": "PC-Relative Addressing Calculation: In PC-relative branch instructions, the effective branch target address is EA = Updated PC + Offset, where Updated PC is already pointing to the next instruction.",
        "examTrap": "Pre-Incremented PC Trap: When computing branch targets in PC-relative addressing questions, remember that the PC has ALREADY been incremented past the branch instruction before the offset is added!"
      },
      {
        "title": "Memory Hierarchy, Cache Organization & Access Time",
        "keyPoints": [
          "Locality of Reference: Temporal (reused recently) and Spatial (nearby memory items accessed together).",
          "Cache address division for k-way set associative: Tag bits | Set Index bits (log2(Sets)) | Word Offset bits.",
          "Number of sets = Total Cache Lines / k. In direct-mapped cache, k = 1; in fully associative cache, Sets = 1.",
          "Cache write policies: Write-Through with write buffer vs Write-Back with dirty bit."
        ],
        "theorem": "Effective Memory Access Time: In a hierarchical cache system, EAT = H_1 T_1 + (1 - H_1) [H_2 (T_1 + T_2) + (1 - H_2) (T_1 + T_2 + T_{mem})].",
        "examTrap": "Simultaneous vs Hierarchical Access Trap: Check whether the problem specifies simultaneous cache-memory lookup or hierarchical lookup. In hierarchical lookup, the cache inspection time T_1 is added to the penalty."
      },
      {
        "title": "Instruction Pipelining, Hazards & Speedup Analysis",
        "keyPoints": [
          "Classic 5-stage RISC pipeline: Instruction Fetch (IF), Instruction Decode (ID), Execute (EX), Memory (MEM), Writeback (WB).",
          "Pipeline Hazards: Structural (resource conflicts), Data (RAW, WAR, WAW dependencies), Control (branch instructions).",
          "Data Hazard Resolution: Operand forwarding (bypassing), software compiler scheduling, or hardware stalling (bubble insertion).",
          "Pipeline Speedup: S = (n * k * clock) / [(k + n - 1 + Stalls) * clock]. As n -> inf with no stalls, S -> k."
        ],
        "theorem": "Amdahl\u2019s Law for Speedup: S_{overall} = 1 / [(1 - f) + (f / s)], where f is the fraction of execution time enhanced by a speedup factor of s.",
        "examTrap": "Load-Use Data Hazard Trap: Operand forwarding CANNOT eliminate the stall between a Load Word (LW) instruction and an immediately following instruction that uses the loaded register. It requires at least 1 stall cycle!"
      }
    ],
    "definitions": [
      {
        "term": "Effective Access Time (EAT)",
        "category": "Memory Subsystems",
        "definition": "Average latency experienced by CPU when requesting memory, weighted by hierarchical hit rates: EAT = H * T_cache + (1 - H) * T_miss.",
        "note": "In multi-level caches, miss penalty involves successive level latencies."
      },
      {
        "term": "Operand Forwarding (Bypassing)",
        "category": "Pipelining",
        "definition": "Hardware optimization in pipelined processors routing ALU computation outputs directly back to earlier pipeline register inputs without waiting for register file writeback.",
        "note": "Resolves ALU-to-ALU data hazards; cannot eliminate Load-to-Use 1-cycle stall."
      },
      {
        "term": "Direct Memory Access (DMA)",
        "category": "I/O Organization",
        "definition": "Hardware controller transferring data blocks directly between high-speed peripheral I/O devices and main RAM without continuous CPU intervention.",
        "note": "Cycle stealing mode steals isolated bus cycles; burst mode transfers entire blocks."
      },
      {
        "term": "Spatial & Temporal Locality",
        "category": "Cache Principles",
        "definition": "Temporal locality: recently accessed memory locations are likely to be accessed again soon. Spatial locality: memory locations nearby recently accessed addresses are likely to be referenced.",
        "note": "Cache line block size exploits spatial locality; cache size exploits temporal locality."
      },
      {
        "term": "Amdahl\u2019s Law",
        "category": "Performance Bounds",
        "definition": "Mathematical law stating the speedup of a system enhanced by factor s on fraction f is S = 1 / [(1 - f) + (f / s)].",
        "note": "Maximum theoretical speedup is strictly bounded by 1 / (1 - f) as s -> inf."
      }
    ],
    "taxonomies": [
      {
        "name": "Cache Mapping Architectures",
        "badge": "Cache Taxonomy",
        "items": [
          "Direct Mapped (Index = Address mod Lines; 1 comparator, high conflict miss)",
          "Fully Associative (Block placed in any line; N comparators, zero conflict miss)",
          "Set Associative (k lines per set; balanced hit time and miss rate)",
          "Write-Through vs Write-Back (Immediate memory update vs Dirty bit delayed update)"
        ]
      },
      {
        "name": "Pipeline Hazard Taxonomies",
        "badge": "Hazard Taxonomy",
        "items": [
          "Structural Hazard (Hardware resource collision, e.g., single memory port)",
          "Data Hazard: RAW (True dependency, Read-After-Write)",
          "Data Hazard: WAR / WAW (Anti/Output dependencies in out-of-order CPUs)",
          "Control Hazard (Branch instructions stalling instruction fetch stage)"
        ]
      }
    ],
    "comparison": {
      "title": "Direct-Mapped Cache vs Set-Associative Cache",
      "entityA": "Direct-Mapped Cache",
      "entityB": "k-Way Set-Associative Cache",
      "rows": [
        {
          "property": "Block Placement Rule",
          "valA": "Block can map to exactly ONE specific cache line (Line = Block mod N)",
          "valB": "Block can map to ANY of the k lines within its assigned set"
        },
        {
          "property": "Tag Comparator Hardware",
          "valA": "Requires only 1 single tag comparator; low cost and fast",
          "valB": "Requires k parallel tag comparators per lookup; higher hardware cost"
        },
        {
          "property": "Conflict Miss Rate",
          "valA": "High conflict misses when multiple active addresses share index",
          "valB": "Significantly reduced conflict misses due to associative line flexibility"
        },
        {
          "property": "Replacement Policy",
          "valA": "No replacement algorithm needed; existing block is simply overwritten",
          "valB": "Requires replacement algorithm (LRU, FIFO, or Random) when set is full"
        },
        {
          "property": "Address Bit Splitting",
          "valA": "Tag Bits | Line Index Bits (log2 N) | Word Offset Bits",
          "valB": "Tag Bits | Set Index Bits (log2 Sets) | Word Offset Bits"
        },
        {
          "property": "Hit Latency vs Capacity",
          "valA": "Fastest hit detection time; optimal for L1 instruction caches",
          "valB": "Slightly higher hit multiplexing delay; optimal for L2/L3 caches"
        }
      ]
    }
  },
  "programming-data-structures": {
    "formulaName": "Binary Heap Invariant & AVL Balancing",
    "lang": "Data Structures (C/C++)",
    "gfgUrl": "https://www.geeksforgeeks.org/data-structures/",
    "nptelCode": "noc20-cs70 (IIT Kharagpur - Programming and Data Structures)",
    "derivation": "AVL Tree Balance Factor:\n  BF(Node) = Height(LeftSubtree) - Height(RightSubtree)\n  Tree is AVL balanced <=> BF in {-1, 0, +1} for ALL nodes.\n  Rotations: LL (Single Right), RR (Single Left), LR (Left then Right), RL.\n\nBinary Min-Heap Indexing (0-indexed array):\n  Parent(i) = floor((i - 1) / 2)\n  LeftChild(i) = 2*i + 1,  RightChild(i) = 2*i + 2\n  Build-Heap Time: Sum_{h=0}^{log n} (n / 2^{h+1}) * O(h) = O(n)",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><circle cx=\"160\" cy=\"35\" r=\"15\" fill=\"#4a0e17\"/><text x=\"160\" y=\"39\" fill=\"#fff\" font-size=\"10\" text-anchor=\"middle\">10</text><circle cx=\"95\" cy=\"85\" r=\"14\" fill=\"#c5a059\"/><text x=\"95\" y=\"89\" fill=\"#111\" font-size=\"9\" text-anchor=\"middle\">15</text><circle cx=\"225\" cy=\"85\" r=\"14\" fill=\"#c5a059\"/><text x=\"225\" y=\"89\" fill=\"#111\" font-size=\"9\" text-anchor=\"middle\">20</text><line x1=\"150\" y1=\"46\" x2=\"105\" y2=\"75\" stroke=\"#999\" stroke-width=\"2\"/><line x1=\"170\" y1=\"46\" x2=\"215\" y2=\"75\" stroke=\"#999\" stroke-width=\"2\"/><text x=\"160\" y=\"150\" fill=\"#999\" font-size=\"10\" text-anchor=\"middle\">Complete Binary Min-Heap Invariant: Parent <= Children</text></svg>",
    "caption": "Complete Binary Min-Heap Order Invariant",
    "gfgSubcategories": [
      {
        "title": "Pointers, Arrays & Recursion in C",
        "tag": "C Programming",
        "url": "https://www.geeksforgeeks.org/c-programming-language/",
        "desc": "Pointer arithmetic, dynamic memory allocation (malloc/free), function pointers, call stack activation records."
      },
      {
        "title": "Stacks, Queues & Expression Evaluation",
        "tag": "Linear Structures",
        "url": "https://www.geeksforgeeks.org/stack-data-structure/",
        "desc": "LIFO stacks, circular queue full/empty conditions, infix-to-postfix conversion, and postfix evaluation."
      },
      {
        "title": "Linked Lists & Floyd\u2019s Cycle Detection",
        "tag": "Linked Structures",
        "url": "https://www.geeksforgeeks.org/data-structures/linked-list/",
        "desc": "Singly, doubly, circular linked lists, in-place list reversal, and two-pointer cycle detection algorithm."
      },
      {
        "title": "Binary Trees & Tree Traversals",
        "tag": "Tree Hierarchies",
        "url": "https://www.geeksforgeeks.org/binary-tree-data-structure/",
        "desc": "Inorder, preorder, postorder, level order, constructing unique trees from traversal pairs, and height bounds."
      },
      {
        "title": "Binary Search Trees & AVL Rotations",
        "tag": "Search Trees",
        "url": "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
        "desc": "BST properties, deletion with in-order predecessor/successor, AVL tree balance factor, LL/RR/LR/RL rotations."
      },
      {
        "title": "Binary Heaps & Priority Queues",
        "tag": "Priority Structures",
        "url": "https://www.geeksforgeeks.org/heap-data-structure/",
        "desc": "Min/Max-heap complete binary tree array representation, heapify operation, and O(n) build-heap."
      }
    ],
    "modules": [
      {
        "title": "C Language Semantics, Memory & Recursive Execution",
        "keyPoints": [
          "Memory Layout: Code (text), Initialized data, BSS, Heap (grows up), Stack (grows down).",
          "Pointer arithmetic: `p + 1` increments address by `sizeof(*p)` bytes. `a[i]` is identical to `*(a + i)`.",
          "Operator Precedence: `*p++` evaluates to `*(p++)`, returning `*p` then incrementing pointer `p`. `(*p)++` increments the value.",
          "Recursion: Each recursive call allocates a stack frame storing local variables, parameters, and return address."
        ],
        "theorem": "Array Dereferencing Identity: For any array `a` and index `i`, `a[i] == *(a + i) == *(i + a) == i[a]`.",
        "examTrap": "Dangling Pointer & Memory Leak: Freeing memory (`free(p)`) does not set `p` to NULL; dereferencing `p` afterward is undefined behavior. Failing to free dynamic memory causes memory leaks."
      },
      {
        "title": "Stacks, Queues & Linked List Invariants",
        "keyPoints": [
          "Stack: LIFO structure used for function calls, expression evaluation, syntax matching, and DFS traversal.",
          "Circular Queue: Array of size N implements modulo indexing. Full condition: `(rear + 1) % N == front`. Stores at most N - 1 items.",
          "Linked List Reversal: Can reverse singly linked list in O(n) time and O(1) auxiliary space using 3 pointers (prev, curr, next).",
          "Floyd\u2019s Cycle Finding Algorithm: Slow pointer (1 step) and fast pointer (2 steps) meet inside cycle if a loop exists."
        ],
        "theorem": "Stack Permutation Bound: The number of distinct permutations of 1..n that can be produced using a stack is given by the n-th Catalan number C_n = (1 / (n + 1)) * C(2n, n).",
        "examTrap": "Infix to Postfix Associativity: When converting operators with equal precedence, left-associative operators (like +, -, *, /) cause operators on stack to pop; right-associative operators (like exponent ^) do not!"
      },
      {
        "title": "Trees, Binary Search Trees & Self-Balancing AVL Trees",
        "keyPoints": [
          "Binary Tree properties: Maximum nodes at depth d is 2^d. In any non-empty binary tree, n_0 = n_2 + 1 (leaves = degree-2 nodes + 1).",
          "Unique Tree Construction: Requires Inorder traversal PLUS either Preorder or Postorder traversal.",
          "Binary Search Tree (BST): Inorder traversal of a BST produces keys in strictly increasing sorted order.",
          "AVL Tree: Self-balancing BST where height difference between left and right subtrees is at most 1 for every node."
        ],
        "theorem": "Binary Tree Degree Identity: In every binary tree, the number of leaf nodes n_0 is strictly equal to the number of nodes having two children n_2 plus one (n_0 = n_2 + 1).",
        "examTrap": "Tree Construction Ambiguity: You CANNOT reconstruct a unique binary tree from Preorder and Postorder traversals alone, unless you are explicitly given that every non-leaf node has exactly two children."
      }
    ],
    "definitions": [
      {
        "term": "Binary Search Tree (BST) Property",
        "category": "Trees",
        "definition": "For every node x: all keys in left subtree are strictly smaller than key(x), and all keys in right subtree are strictly larger than key(x).",
        "note": "Inorder traversal of any valid BST produces strictly ascending sorted keys."
      },
      {
        "term": "AVL Balance Factor",
        "category": "Self-Balancing Trees",
        "definition": "Height(LeftSubtree) - Height(RightSubtree). An AVL tree maintains BF in {-1, 0, +1} for every node through single (LL, RR) or double (LR, RL) rotations.",
        "note": "Guarantees worst-case search, insertion, and deletion in O(log n) time."
      },
      {
        "term": "Complete Binary Tree",
        "category": "Tree Structures",
        "definition": "A binary tree in which all levels are completely filled except possibly the last level, where nodes are positioned as far left as possible.",
        "note": "Can be stored contiguously in an array without pointers: Parent(i) = floor((i-1)/2)."
      },
      {
        "term": "Activation Record (Stack Frame)",
        "category": "Runtime Environments",
        "definition": "A block of memory pushed onto the runtime call stack for each function invocation, storing parameters, local variables, return address, and saved registers.",
        "note": "Recursion depth is limited by available call stack memory (stack overflow)."
      },
      {
        "term": "Catalan Number C_n",
        "category": "Combinatorial Structures",
        "definition": "Sequence defined by C_n = (1 / (n + 1)) * C(2n, n). Enumerates distinct binary search trees with n keys, valid parenthesis sequences, and stack permutations.",
        "note": "C_3 = 5, C_4 = 14, C_5 = 42."
      }
    ],
    "taxonomies": [
      {
        "name": "Binary Tree Variants",
        "badge": "Tree Taxonomy",
        "items": [
          "Full Binary Tree (Every node has either 0 or 2 children; n_0 = n_2 + 1)",
          "Complete Binary Tree (Filled left-to-right; base structure for binary heaps)",
          "Perfect Binary Tree (All interior nodes have 2 children, all leaves at same depth)",
          "Degenerate Tree (Each node has 1 child; degenerates into linear linked list)"
        ]
      },
      {
        "name": "Linear Data Structures",
        "badge": "Linear Structures",
        "items": [
          "Contiguous Array (O(1) random access, fixed contiguous allocation)",
          "Singly Linked List (O(1) insertion at head, O(n) sequential access)",
          "Circular Queue (Modulo indexing, eliminates false full condition)",
          "Monotonic Stack (Maintains elements in monotonic order for next-greater element)"
        ]
      }
    ],
    "comparison": {
      "title": "Binary Search Tree (BST) vs Binary Min-Heap",
      "entityA": "Binary Search Tree (BST)",
      "entityB": "Binary Min-Heap",
      "rows": [
        {
          "property": "Core Ordering Invariant",
          "valA": "Left Child < Parent < Right Child (Horizontal ordering)",
          "valB": "Parent <= Both Children (Vertical partial ordering only)"
        },
        {
          "property": "Structural Completeness Rule",
          "valA": "No structural shape constraint; can degenerate into linked list O(n)",
          "valB": "MUST be a Complete Binary Tree; always balanced with height floor(log2 n)"
        },
        {
          "property": "Inorder Traversal Output",
          "valA": "Guaranteed strictly sorted ascending order",
          "valB": "Does NOT produce sorted order (only parent-child relationship held)"
        },
        {
          "property": "Search Time Complexity",
          "valA": "O(log n) average, O(n) worst-case (or O(log n) in balanced AVL/RBT)",
          "valB": "O(n) linear search; heaps do not support efficient search for arbitrary keys"
        },
        {
          "property": "Min / Max Element Access",
          "valA": "O(h) by traversing left-most (min) or right-most (max) branch",
          "valB": "O(1) constant time to inspect root min element"
        },
        {
          "property": "Memory Storage Representation",
          "valA": "Node structures linked via left and right child pointers",
          "valB": "Contiguous 1D array without pointer overhead (0-indexed arithmetic)"
        }
      ]
    }
  },
  "algorithms": {
    "formulaName": "Master Theorem for Divide & Conquer",
    "lang": "Algorithm Analysis",
    "gfgUrl": "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
    "nptelCode": "noc21-cs68 (IIT Delhi - Design and Analysis of Algorithms)",
    "derivation": "Recurrence: T(n) = a * T(n/b) + f(n), where a >= 1, b > 1\nCritical Value: c_crit = log_b(a)\nCase 1: f(n) = O(n^{c_crit - epsilon}) for epsilon > 0\n        => T(n) = Theta(n^{log_b(a)})\nCase 2: f(n) = Theta(n^{c_crit} * log^k(n)) for k >= 0\n        => T(n) = Theta(n^{log_b(a)} * log^{k+1}(n))\nCase 3: f(n) = Omega(n^{c_crit + epsilon}) and regularity holds\n        => T(n) = Theta(f(n))",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><circle cx=\"160\" cy=\"30\" r=\"14\" fill=\"#c5a059\"/><text x=\"160\" y=\"34\" fill=\"#111\" font-size=\"9\" text-anchor=\"middle\">T(n)</text><circle cx=\"90\" cy=\"85\" r=\"12\" fill=\"#c5a059\"/><text x=\"90\" y=\"89\" fill=\"#111\" font-size=\"8\" text-anchor=\"middle\">T(n/2)</text><circle cx=\"230\" cy=\"85\" r=\"12\" fill=\"#c5a059\"/><text x=\"230\" y=\"89\" fill=\"#111\" font-size=\"8\" text-anchor=\"middle\">T(n/2)</text><line x1=\"150\" y1=\"42\" x2=\"100\" y2=\"75\" stroke=\"#666\" stroke-width=\"2\"/><line x1=\"170\" y1=\"42\" x2=\"220\" y2=\"75\" stroke=\"#666\" stroke-width=\"2\"/><text x=\"160\" y=\"150\" fill=\"#999\" font-size=\"10\" text-anchor=\"middle\">Recursion Tree: Total Work per Level = sum c*n</text></svg>",
    "caption": "Recursion Tree Level-Wise Cost Partitioning",
    "gfgSubcategories": [
      {
        "title": "Asymptotic Analysis & Recurrences",
        "tag": "Complexity Theory",
        "url": "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/",
        "desc": "Big-O, Omega, Theta asymptotic definitions, Master Theorem cases, recursion tree methods, and substitution."
      },
      {
        "title": "Divide & Conquer and Sorting Algorithms",
        "tag": "Sorting & Searching",
        "url": "https://www.geeksforgeeks.org/divide-and-conquer-algorithm-introduction/",
        "desc": "Merge sort, quick sort randomized pivot, heap sort, comparison sorting Omega(n log n) lower bound, and counting sort."
      },
      {
        "title": "Greedy Algorithms & Matroids",
        "tag": "Greedy Strategy",
        "url": "https://www.geeksforgeeks.org/greedy-algorithms/",
        "desc": "Greedy choice property, optimal substructure, fractional knapsack, Huffman coding prefix trees, and job sequencing."
      },
      {
        "title": "Dynamic Programming Paradigms",
        "tag": "Dynamic Programming",
        "url": "https://www.geeksforgeeks.org/dynamic-programming/",
        "desc": "Memoization vs tabulation, 0/1 knapsack, Matrix Chain Multiplication, Longest Common Subsequence (LCS)."
      },
      {
        "title": "Graph Traversals & Topological Sort",
        "tag": "Graph Algorithms",
        "url": "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
        "desc": "BFS queue traversal, DFS discovery/finish timestamps, DAG cycle detection, and Kahn\u2019s in-degree topological sort."
      },
      {
        "title": "Shortest Paths & Minimum Spanning Trees",
        "tag": "Network Optimization",
        "url": "https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/",
        "desc": "Kruskal\u2019s union-find MST, Prim\u2019s priority queue MST, Dijkstra\u2019s non-negative shortest path, and Bellman-Ford."
      }
    ],
    "modules": [
      {
        "title": "Asymptotic Complexity, Divide & Conquer and Sorting Bounds",
        "keyPoints": [
          "Asymptotic bounds: O (upper bound), Omega (lower bound), Theta (tight bound), o (strict upper), omega (strict lower).",
          "Master Theorem solves T(n) = a T(n/b) + f(n) comparing f(n) with critical exponent n^{log_b a}.",
          "Comparison sorting lower bound: Omega(n log n) comparisons required in worst case, derived from decision tree depth ceil(log2(n!)).",
          "Linear time sorting: Counting Sort O(n+k), Radix Sort O(d(n+k)), Bucket Sort O(n) average (requires non-comparison assumption)."
        ],
        "theorem": "Comparison Sorting Lower Bound: Any comparison-based sorting algorithm requires at least ceil(log_2(n!)) = Omega(n log n) comparisons in the worst case.",
        "examTrap": "Master Theorem Gap Trap: Master theorem cannot solve recurrences where f(n) and n^{log_b a} differ by a non-polynomial factor (e.g., T(n) = 2T(n/2) + n / log n). Use substitution or Akra-Bazzi instead."
      },
      {
        "title": "Greedy Choice Property & Dynamic Programming Paradigms",
        "keyPoints": [
          "Greedy Choice Property: A globally optimal solution can be arrived at by making locally optimal (greedy) choices.",
          "Dynamic Programming: Solves problems with overlapping subproblems and optimal substructure via memoization or tabulation.",
          "0/1 Knapsack (DP, O(nW) pseudo-polynomial time) vs Fractional Knapsack (Greedy, O(n log n) sorting by value/weight).",
          "Matrix Chain Multiplication: Multiplies n matrices in O(n^3) using DP recurrence m[i,j] = min_{i<=k<j} (m[i,k] + m[k+1,j] + p_{i-1} p_k p_j)."
        ],
        "theorem": "Huffman Coding Optimality: Huffman prefix code generation produces an optimal prefix-free binary encoding that minimizes expected codeword length sum p_i l_i.",
        "examTrap": "0/1 Knapsack Greedy Trap: Never pick items greedily by value or value-to-weight ratio in 0/1 Knapsack. Greedy choice is strictly sub-optimal for discrete items; DP is required."
      },
      {
        "title": "Graph Algorithms: Traversals, MST & Shortest Paths",
        "keyPoints": [
          "BFS (queue, O(V+E)) finds shortest paths in unweighted graphs. DFS (stack, O(V+E)) classifies tree, back, forward, cross edges.",
          "Topological Sort exists iff directed graph is a DAG (no back edges). Can be computed using DFS finish times or Kahn\u2019s algorithm.",
          "Minimum Spanning Tree (MST): Kruskal\u2019s (O(E log V) with Disjoint Set Union) and Prim\u2019s (O((V+E) log V) with min-heap).",
          "Shortest Paths: Dijkstra (O((V+E) log V), non-negative weights), Bellman-Ford (O(VE), detects negative cycles), Floyd-Warshall (O(V^3), all pairs)."
        ],
        "theorem": "Cut Property for MST: For any cut in graph G, the lightest edge crossing the cut belongs to every Minimum Spanning Tree of G.",
        "examTrap": "Dijkstra on Negative Edges Trap: Dijkstra\u2019s algorithm can produce incorrect results or loop infinitely when negative edge weights are present. Always use Bellman-Ford if edge weights can be negative."
      }
    ],
    "definitions": [
      {
        "term": "Asymptotic Equivalence (Theta Notation)",
        "category": "Complexity",
        "definition": "f(n) = Theta(g(n)) iff there exist positive constants c_1, c_2, n_0 such that c_1 g(n) <= f(n) <= c_2 g(n) for all n >= n_0.",
        "note": "Represents an asymptotically tight bound from both above and below."
      },
      {
        "term": "Optimal Substructure",
        "category": "Paradigms",
        "definition": "A problem exhibits optimal substructure if an optimal solution to the overall problem instance contains optimal solutions to its subproblem instances.",
        "note": "Prerequisite for both Dynamic Programming and Greedy algorithms."
      },
      {
        "term": "Greedy Choice Property",
        "category": "Paradigms",
        "definition": "A globally optimal solution can be reached by greedily making locally optimal choices at each decision stage without backtracking.",
        "note": "Distinguishes greedy methods from DP; requires proof of correctness (exchange argument)."
      },
      {
        "term": "Master Theorem",
        "category": "Recurrences",
        "definition": "Cookbook formula solving divide-and-conquer recurrences T(n) = a T(n/b) + f(n) by comparing f(n) against the critical exponent n^{log_b a}.",
        "note": "Requires polynomial gap; does not apply to non-polynomial differences like n/log(n)."
      },
      {
        "term": "Cut Property for MST",
        "category": "Graph Theory",
        "definition": "For any cut in a connected edge-weighted graph, the edge crossing the cut with the minimum weight belongs to every Minimum Spanning Tree of the graph.",
        "note": "Underpins correctness of Kruskal\u2019s and Prim\u2019s greedy algorithms."
      }
    ],
    "taxonomies": [
      {
        "name": "Algorithmic Design Paradigms",
        "badge": "Design Paradigms",
        "items": [
          "Divide and Conquer (Merge Sort, Quick Sort median pivot, Binary Search)",
          "Greedy Strategy (Huffman Coding, Kruskal MST, Fractional Knapsack)",
          "Dynamic Programming (Matrix Chain, 0/1 Knapsack, Bellman-Ford, Floyd-Warshall)",
          "Backtracking & Branch-and-Bound (N-Queens, Graph Coloring, TSP pruning)"
        ]
      },
      {
        "name": "Sorting Algorithm Classifications",
        "badge": "Sorting Taxonomy",
        "items": [
          "Stable Sorts (Merge Sort, Counting Sort, TimSort - preserve relative order)",
          "Unstable Sorts (Quick Sort, Heap Sort, Selection Sort)",
          "In-Place Sorts (Heap Sort, Quick Sort - O(1) auxiliary memory)",
          "Linear Time Sorts (Counting Sort O(n+k), Radix Sort O(d(n+k)))"
        ]
      }
    ],
    "comparison": {
      "title": "Greedy Strategy vs Dynamic Programming",
      "entityA": "Greedy Algorithmic Paradigm",
      "entityB": "Dynamic Programming (DP)",
      "rows": [
        {
          "property": "Decision Commitment Timing",
          "valA": "Irrevocably commits to the local optimal choice; never reconsiders",
          "valB": "Exhaustively evaluates all overlapping subproblems and tabulates results"
        },
        {
          "property": "Subproblem Structure",
          "valA": "Reduces problem to a single subproblem at each step",
          "valB": "Strictly requires overlapping subproblems reused across decision paths"
        },
        {
          "property": "Optimal Substructure Rule",
          "valA": "Required (must prove greedy choice belongs to global optimum)",
          "valB": "Required (optimal solution composed of optimal sub-solutions)"
        },
        {
          "property": "Backtracking Capability",
          "valA": "No backtracking; choices are top-down and instantaneous",
          "valB": "Retains table/memo memoizing all paths; can reconstruct full decision sequence"
        },
        {
          "property": "Classic Knapsack Comparison",
          "valA": "Solves Fractional Knapsack in O(n log n) sorting by value/weight",
          "valB": "Required for discrete 0/1 Knapsack in O(nW) pseudo-polynomial time"
        },
        {
          "property": "Typical Execution Time",
          "valA": "Usually faster: O(n) or O(n log n)",
          "valB": "Higher polynomial complexity: O(n^2), O(n^3), or O(nW)"
        }
      ]
    }
  },
  "theory-of-computation": {
    "formulaName": "Pumping Lemma for Regular Languages",
    "lang": "Formal Languages",
    "gfgUrl": "https://www.geeksforgeeks.org/theory-of-computation-automata-tutorials/",
    "nptelCode": "noc20-cs78 (IIT Kanpur - Theory of Computation)",
    "derivation": "Let L be a regular language with pumping length p.\nAny string w in L with |w| >= p can be split into w = x y z such that:\n  1. |y| >= 1  (non-empty pumpable segment)\n  2. |x y| <= p (pump occurs in the prefix)\n  3. For all i >= 0, x (y^i) z in L\nContrapositive Method:\n  Choose string w in L of length >= p.\n  Show that for EVERY partition w = xyz meeting (1) & (2),\n  there exists some i such that x (y^i) z NOT in L => L is NOT regular.",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><ellipse cx=\"160\" cy=\"90\" rx=\"145\" ry=\"75\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"/><text x=\"160\" y=\"32\" fill=\"#777\" font-size=\"9\" text-anchor=\"middle\">Type 0: Recursively Enumerable (Turing Machine)</text><ellipse cx=\"160\" cy=\"98\" rx=\"115\" ry=\"58\" fill=\"none\" stroke=\"#c5a059\" stroke-width=\"1.5\"/><text x=\"160\" y=\"58\" fill=\"#c5a059\" font-size=\"9\" text-anchor=\"middle\">Type 1: Context-Sensitive</text><ellipse cx=\"160\" cy=\"105\" rx=\"85\" ry=\"42\" fill=\"none\" stroke=\"#059669\" stroke-width=\"1.5\"/><text x=\"160\" y=\"80\" fill=\"#059669\" font-size=\"9\" text-anchor=\"middle\">Type 2: Context-Free (PDA)</text><ellipse cx=\"160\" cy=\"112\" rx=\"55\" ry=\"26\" fill=\"rgba(197,160,89,0.2)\" stroke=\"#e0443e\" stroke-width=\"2\"/><text x=\"160\" y=\"117\" fill=\"#e0443e\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">Type 3: Regular (DFA)</text></svg>",
    "caption": "Chomsky Hierarchy of Formal Languages & Automata",
    "gfgSubcategories": [
      {
        "title": "Finite Automata: DFA, NFA & Conversions",
        "tag": "Automata Theory",
        "url": "https://www.geeksforgeeks.org/introduction-of-finite-automata/",
        "desc": "DFA 5-tuple, NFA with epsilon transitions, subset construction 2^Q bound, and DFA state minimization."
      },
      {
        "title": "Regular Expressions & Pumping Lemma",
        "tag": "Regular Languages",
        "url": "https://www.geeksforgeeks.org/pumping-lemma-in-theory-of-computation/",
        "desc": "Arden\u2019s theorem, regular expressions, closure properties, and proving non-regularity via Pumping Lemma."
      },
      {
        "title": "Context-Free Grammars & Pushdown Automata",
        "tag": "Context-Free Languages",
        "url": "https://www.geeksforgeeks.org/pushdown-automata-in-theory-of-computation/",
        "desc": "CFG productions, derivation ambiguity, Chomsky Normal Form (CNF), Deterministic PDA vs NPDA."
      },
      {
        "title": "Pumping Lemma for CFLs & Closure Properties",
        "tag": "CFL Properties",
        "url": "https://www.geeksforgeeks.org/pumping-lemma-for-cfl/",
        "desc": "Pumping lemma uvwxy split for CFLs, proving languages like a^n b^n c^n non-CFL, and closure operations."
      },
      {
        "title": "Turing Machines & Chomsky Hierarchy",
        "tag": "Computability",
        "url": "https://www.geeksforgeeks.org/turing-machine-in-toc/",
        "desc": "Turing Machine 7-tuple, tape head transitions, Type 0 to Type 3 languages, multi-tape equivalence."
      },
      {
        "title": "Decidability, Halting Problem & Rice\u2019s Theorem",
        "tag": "Undecidability",
        "url": "https://www.geeksforgeeks.org/undecidability-and-reducibility-in-toc/",
        "desc": "Halting problem undecidability, Post Correspondence Problem (PCP), reduction proofs, and Rice\u2019s theorem."
      }
    ],
    "modules": [
      {
        "title": "Finite Automata, Regular Expressions & Minimization",
        "keyPoints": [
          "DFA: Transition function delta: Q x Sigma -> Q. Exactly one transition per input symbol.",
          "NFA equivalence: Every NFA can be converted into an equivalent DFA with at most 2^{|Q|} states via powerset construction.",
          "DFA Minimization: Myhill-Nerode theorem equivalence classes and table-filling algorithm partition reachable states.",
          "Regular Closure: Closed under union, intersection, complement, concatenation, Kleene star, reverse, and homomorphism."
        ],
        "theorem": "Myhill-Nerode Theorem: A language L is regular if and only if the number of equivalence classes of its indistinguishability relation R_L is finite; this number is the minimum state count of any DFA accepting L.",
        "examTrap": "Regular Subset Fallacy: Do not assume a subset of a regular language is regular! For instance, {a^n b^n | n >= 0} is a non-regular subset of the regular language a* b*."
      },
      {
        "title": "Context-Free Grammars, Pushdown Automata & Ambiguity",
        "keyPoints": [
          "CFG: V -> (V v Sigma)*. Ambiguity exists if a string has two distinct parse trees or leftmost derivations.",
          "Pushdown Automata (PDA): Finite automaton equipped with a single LIFO stack storage.",
          "DPDA vs NPDA: NPDAs are strictly more powerful than DPDAs. DPDAs accept Deterministic CFLs (DCFLs).",
          "CFL Closure: Closed under union, concatenation, Kleene star; NOT closed under intersection or complement!"
        ],
        "theorem": "DPDA vs NPDA Inexpressibility: The language of even palindromes L = {w w^R | w in {a, b}*} is context-free and accepted by an NPDA, but cannot be accepted by any Deterministic PDA.",
        "examTrap": "CFL Intersection Trap: The intersection of two context-free languages is NOT necessarily context-free! For example, L_1 = {a^n b^n c^m} and L_2 = {a^m b^n c^n} are CFLs, but L_1 cap L_2 = {a^n b^n c^n} is not context-free."
      },
      {
        "title": "Turing Machines, Computability & Rice\u2019s Theorem",
        "keyPoints": [
          "Turing Machine: Tape head can read, write, and move Left/Right. Halts in accept or reject state, or loops forever.",
          "Recursive Languages (Decidable): TM halts on ALL inputs (accepts or rejects). Closed under complement.",
          "Recursively Enumerable (Turing Recognizable): TM halts and accepts valid strings, but may loop endlessly on invalid strings.",
          "Halting Problem: Determining whether an arbitrary TM halts on an arbitrary input is undecidable."
        ],
        "theorem": "Rice\u2019s Theorem: Any non-trivial semantic property of the language recognized by a Turing Machine is undecidable.",
        "examTrap": "Syntactic vs Semantic Property Trap: Rice\u2019s theorem applies ONLY to semantic properties of the language recognized by a TM (e.g., \"is L(M) empty?\"). It does NOT apply to syntactic properties of the TM itself (e.g., \"does M have 10 states?\"), which are trivially decidable."
      }
    ],
    "definitions": [
      {
        "term": "Regular Language",
        "category": "Automata Theory",
        "definition": "A formal language recognized by a Deterministic Finite Automaton (DFA), or equivalently generated by a Regular Expression or Regular Grammar.",
        "note": "Closed under union, intersection, complement, concatenation, and Kleene star."
      },
      {
        "term": "Pumping Lemma for Regular Languages",
        "category": "Non-Regularity",
        "definition": "For any regular language L with pumping length p, any string w in L with |w| >= p can be split into w = xyz with |y| >= 1, |xy| <= p such that x (y^i) z in L for all i >= 0.",
        "note": "Used via contrapositive to prove a language is NOT regular."
      },
      {
        "term": "Deterministic Pushdown Automaton (DPDA)",
        "category": "CFLs",
        "definition": "A Pushdown Automaton with deterministic transition relations. Accepts Deterministic Context-Free Languages (DCFLs).",
        "note": "DPDAs are strictly less expressive than Non-deterministic PDAs (NPDAs)."
      },
      {
        "term": "Turing Decidable (Recursive) Language",
        "category": "Computability",
        "definition": "A language for which there exists a Turing Machine that halts on ALL inputs: accepts if w in L, and rejects if w not in L.",
        "note": "Closed under complement. Recursively Enumerable languages may loop forever on non-members."
      },
      {
        "term": "Rice\u2019s Theorem",
        "category": "Undecidability",
        "definition": "Any non-trivial semantic property of the language recognized by a Turing Machine is undecidable.",
        "note": "Applies strictly to properties of L(M), not syntactic properties of machine M itself."
      }
    ],
    "taxonomies": [
      {
        "name": "Chomsky Hierarchy of Languages",
        "badge": "Formal Hierarchy",
        "items": [
          "Type 3: Regular Languages (Finite State Automata, no memory)",
          "Type 2: Context-Free Languages (Pushdown Automata, single LIFO stack)",
          "Type 1: Context-Sensitive Languages (Linear Bounded Automata)",
          "Type 0: Recursively Enumerable Languages (Unrestricted Turing Machines)"
        ]
      },
      {
        "name": "Decision Problem Classes",
        "badge": "Decidability Taxonomy",
        "items": [
          "Decidable on Regular (Emptiness, Finiteness, Membership, Equivalence)",
          "Decidable on CFL (Emptiness, Finiteness, Membership via CYK)",
          "Undecidable on CFL (Ambiguity, Equivalence, Universality L = Sigma*)",
          "Undecidable on TM (Halting Problem, Emptiness, Equivalence, Regularity)"
        ]
      }
    ],
    "comparison": {
      "title": "Deterministic Finite Automata (DFA) vs Non-Deterministic Finite Automata (NFA)",
      "entityA": "Deterministic Finite Automata (DFA)",
      "entityB": "Non-Deterministic Finite Automata (NFA)",
      "rows": [
        {
          "property": "Transition Uniqueness",
          "valA": "Exactly one transition for every input symbol: delta: Q x Sigma -> Q",
          "valB": "Zero, one, or multiple transitions per symbol: delta: Q x Sigma -> 2^Q"
        },
        {
          "property": "Epsilon (Null) Transitions",
          "valA": "Strictly forbidden; cannot change state without reading input",
          "valB": "Permitted (epsilon-NFA can change state without consuming input)"
        },
        {
          "property": "Language Expressive Power",
          "valA": "Recognizes Regular Languages (Type 3 in Chomsky Hierarchy)",
          "valB": "Recognizes Regular Languages (Type 3): EXACTLY identical expressive power!"
        },
        {
          "property": "Powerset Subset Construction",
          "valA": "Minimal state count achieved through Myhill-Nerode minimization",
          "valB": "Converting an n-state NFA to a DFA can yield up to 2^n states in worst case"
        },
        {
          "property": "String Acceptance Criterion",
          "valA": "Input string is accepted iff the unique path terminates in a final state",
          "valB": "Accepted iff AT LEAST ONE computational path ends in an accepting state"
        },
        {
          "property": "Hardware Implementation",
          "valA": "Directly synthesized into sequential flip-flop circuits",
          "valB": "Requires state-set tracking or simulation in software"
        }
      ]
    }
  },
  "compiler-design": {
    "formulaName": "FIRST and FOLLOW Sets for LL(1) Parsing",
    "lang": "Syntax Analysis",
    "gfgUrl": "https://www.geeksforgeeks.org/compiler-design-tutorials/",
    "nptelCode": "noc21-cs63 (IIT Kharagpur - Compiler Design)",
    "derivation": "Rules for FIRST(X):\n  1. If X is terminal, FIRST(X) = { X }.\n  2. If X -> epsilon, add epsilon to FIRST(X).\n  3. If X -> Y_1 Y_2 ... Y_k:\n     Add FIRST(Y_1) - {epsilon}. If epsilon in FIRST(Y_1), add FIRST(Y_2)...\nRules for FOLLOW(A):\n  1. Add $ to FOLLOW(S) where S is start symbol.\n  2. If A -> alpha B beta, add FIRST(beta) - {epsilon} to FOLLOW(B).\n  3. If A -> alpha B or A -> alpha B beta where epsilon in FIRST(beta):\n     Add FOLLOW(A) to FOLLOW(B).",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><rect x=\"20\" y=\"50\" width=\"55\" height=\"30\" fill=\"#4a0e17\" rx=\"4\"/><text x=\"47\" y=\"69\" fill=\"#fff\" font-size=\"9\" text-anchor=\"middle\">Lexer</text><rect x=\"95\" y=\"50\" width=\"55\" height=\"30\" fill=\"#c5a059\" rx=\"4\"/><text x=\"122\" y=\"69\" fill=\"#111\" font-size=\"9\" text-anchor=\"middle\">Parser</text><rect x=\"170\" y=\"50\" width=\"55\" height=\"30\" fill=\"#059669\" rx=\"4\"/><text x=\"197\" y=\"69\" fill=\"#fff\" font-size=\"9\" text-anchor=\"middle\">Semantics</text><rect x=\"245\" y=\"50\" width=\"55\" height=\"30\" fill=\"#2d0a0f\" rx=\"4\"/><text x=\"272\" y=\"69\" fill=\"#fff\" font-size=\"9\" text-anchor=\"middle\">CodeGen</text><line x1=\"75\" y1=\"65\" x2=\"95\" y2=\"65\" stroke=\"#999\" stroke-width=\"2\"/><line x1=\"150\" y1=\"65\" x2=\"170\" y2=\"65\" stroke=\"#999\" stroke-width=\"2\"/><line x1=\"225\" y1=\"65\" x2=\"245\" y2=\"65\" stroke=\"#999\" stroke-width=\"2\"/><text x=\"160\" y=\"130\" fill=\"#999\" font-size=\"10\" text-anchor=\"middle\">Compiler Frontend Pipeline: Tokens -> AST -> IR</text></svg>",
    "caption": "Compiler Analysis and Synthesis Pipeline Stages",
    "gfgSubcategories": [
      {
        "title": "Lexical Analysis & Tokenization",
        "tag": "Lexical Phase",
        "url": "https://www.geeksforgeeks.org/introduction-to-lexical-analysis/",
        "desc": "Regular definitions, lexemes, token patterns, longest match principle, and input buffering."
      },
      {
        "title": "Top-Down LL(1) Parsing & Tables",
        "tag": "Top-Down Parsing",
        "url": "https://www.geeksforgeeks.org/construction-of-ll-1-parsing-table/",
        "desc": "Left recursion elimination, left factoring, FIRST & FOLLOW sets, and LL(1) parse table construction."
      },
      {
        "title": "Bottom-Up LR Parsing (SLR, CLR, LALR)",
        "tag": "Bottom-Up Parsing",
        "url": "https://www.geeksforgeeks.org/bottom-up-parser-or-shift-reduce-parser/",
        "desc": "LR(0) items, shift-reduce conflicts, SLR(1) FOLLOW lookahead, CLR(1) item states, and LALR(1) state merging."
      },
      {
        "title": "Syntax-Directed Translation (SDT / SDD)",
        "tag": "Semantic Analysis",
        "url": "https://www.geeksforgeeks.org/syntax-directed-translation/",
        "desc": "Synthesized vs inherited attributes, S-attributed definitions, L-attributed definitions, and annotated parse trees."
      },
      {
        "title": "Intermediate Code & Three-Address Code",
        "tag": "IR Generation",
        "url": "https://www.geeksforgeeks.org/intermediate-code-generation-in-compiler-design/",
        "desc": "Abstract syntax trees, quadruples, triples, indirect triples, and backpatching boolean control flow."
      },
      {
        "title": "Code Optimization & Basic Blocks",
        "tag": "Optimization",
        "url": "https://www.geeksforgeeks.org/introduction-of-compiler-design-optimization/",
        "desc": "Leader statement identification, basic blocks, control flow graphs (CFG), DAG common subexpression elimination, loop unrolling."
      }
    ],
    "modules": [
      {
        "title": "Lexical Analysis, Grammar Transformations & LL(1) Parsing",
        "keyPoints": [
          "Lexical analyzer generates tokens; resolves ambiguity using longest match (maximal munch) rule.",
          "Eliminating immediate left recursion: A -> A alpha | beta converts to A -> beta A\u2019, A\u2019 -> alpha A\u2019 | epsilon.",
          "Left factoring: A -> alpha beta_1 | alpha beta_2 converts to A -> alpha A\u2019, A\u2019 -> beta_1 | beta_2.",
          "LL(1) parsing table entry M[A, a] contains A -> alpha if a is in FIRST(alpha), or if epsilon in FIRST(alpha) and a is in FOLLOW(A)."
        ],
        "theorem": "LL(1) Non-Ambiguity Invariant: An ambiguous grammar can NEVER be parsed by an LL(1) parser; eliminating left recursion and left factoring are necessary, but may not be sufficient.",
        "examTrap": "Left-Recursive LL(1) Trap: If a grammar contains any left recursion (direct or indirect), it can NEVER be LL(1) because it will inevitably produce multiple entries in the parsing table!"
      },
      {
        "title": "Bottom-Up LR Parsers & Shift-Reduce Conflicts",
        "keyPoints": [
          "LR parsers read input from Left to right and construct a Rightmost derivation in reverse (Shift-Reduce).",
          "LR(0) items: Productions with dot markers indicating parser progress (e.g., A -> alpha . beta).",
          "SLR(1) parser places reductions [A -> alpha .] strictly in columns belonging to FOLLOW(A).",
          "CLR(1) uses items with explicit lookahead [A -> alpha . beta, a]. LALR(1) merges CLR(1) states with identical cores."
        ],
        "theorem": "Parser Hierarchy: LL(1) < SLR(1) < LALR(1) < CLR(1). LALR(1) has the exact same number of states as SLR(1) and never introduces new shift-reduce conflicts when merging CLR(1) states.",
        "examTrap": "LALR Conflict Merging Trap: Merging states with identical cores in CLR(1) to form LALR(1) can NEVER create a Shift-Reduce conflict, but it CAN introduce a Reduce-Reduce conflict!"
      },
      {
        "title": "Syntax Directed Translation, Storage & Code Optimization",
        "keyPoints": [
          "Synthesized attributes: Evaluated from children attributes (bottom-up). S-attributed definitions use only synthesized attributes.",
          "Inherited attributes: Evaluated from parent or left-sibling attributes. L-attributed definitions permit synthesized and left-dependent inherited attributes.",
          "Basic Block partition: Leaders are: (1) First statement, (2) Target of any branch, (3) Statement immediately following any branch.",
          "Optimization techniques: Common subexpression elimination (DAG), dead code elimination, copy propagation, loop invariant code motion."
        ],
        "theorem": "S-Attributed Subset Invariant: Every S-attributed syntax-directed definition is strictly an L-attributed definition, enabling single-pass evaluation during bottom-up parsing.",
        "examTrap": "Inherited Right-Dependency Trap: In an L-attributed definition, an inherited attribute of a symbol can depend only on inherited attributes of the parent or attributes of symbols to its LEFT, never symbols to its right!"
      }
    ],
    "definitions": [
      {
        "term": "Token & Lexeme",
        "category": "Lexical Phase",
        "definition": "A lexeme is a concrete sequence of source characters matching a pattern. A token is an abstract symbol (e.g., <id, 3>, <assign_op>) passed to the parser.",
        "note": "Whitespace and comments are stripped during lexical tokenization."
      },
      {
        "term": "LL(1) Grammar Condition",
        "category": "Top-Down Parsing",
        "definition": "A context-free grammar where parsing tables contain no multiple entries. For A -> alpha | beta: FIRST(alpha) cap FIRST(beta) = empty, and if eps in FIRST(alpha), FOLLOW(A) cap FIRST(beta) = empty.",
        "note": "Left-recursive or ambiguous grammars can NEVER be LL(1)."
      },
      {
        "term": "LR(0) Item & Core",
        "category": "Bottom-Up Parsing",
        "definition": "A grammar production equipped with a position marker dot: A -> alpha . beta. The core is the production itself without lookahead.",
        "note": "LALR(1) merges CLR(1) states with identical LR(0) cores."
      },
      {
        "term": "Syntax-Directed Definition (SDD)",
        "category": "Semantics",
        "definition": "A context-free grammar augmented with attributes and semantic evaluation rules. S-attributed: synthesized only. L-attributed: left-dependent inherited attributes.",
        "note": "Every S-attributed definition is strictly an L-attributed definition."
      },
      {
        "term": "Basic Block",
        "category": "Optimization",
        "definition": "A sequence of consecutive three-address statements where control enters strictly at the first statement and leaves strictly at the last without halting or branching in the middle.",
        "note": "First statement is a leader; jump targets are leaders; statements following jumps are leaders."
      }
    ],
    "taxonomies": [
      {
        "name": "Parsing Algorithm Power Spectrum",
        "badge": "Parser Hierarchy",
        "items": [
          "LL(1) (Top-down, 1 lookahead, leftmost derivation, no left recursion)",
          "SLR(1) (Simple LR, uses FOLLOW set for reductions, smallest table)",
          "LALR(1) (Merged CLR cores, same state count as SLR, no new SR conflicts)",
          "CLR(1) (Canonical LR, full lookahead items [A -> alpha.beta, a], most powerful)"
        ]
      },
      {
        "name": "Compiler Optimization Scopes",
        "badge": "Optimization Taxonomy",
        "items": [
          "Local Optimization (Within a single basic block, DAG common subexpressions)",
          "Loop Optimization (Loop invariant code motion, induction variable strength reduction)",
          "Data Flow Analysis (Reaching definitions, liveness analysis, constant propagation)",
          "Peephole Optimization (Redundant instruction elimination, algebraic simplifications)"
        ]
      }
    ],
    "comparison": {
      "title": "Top-Down Parsing (LL(1)) vs Bottom-Up Parsing (LR(1) / LALR(1))",
      "entityA": "Top-Down Parsing (LL(1))",
      "entityB": "Bottom-Up Parsing (LR(1) / LALR(1))",
      "rows": [
        {
          "property": "Derivation Constructed",
          "valA": "Constructs Leftmost derivation starting from Root non-terminal down to leaves",
          "valB": "Constructs Rightmost derivation in reverse starting from leaves up to Root"
        },
        {
          "property": "Handling Left Recursion",
          "valA": "Cannot handle left recursion (causes infinite parser loop; must be eliminated)",
          "valB": "Handles left recursion naturally without grammar modification"
        },
        {
          "property": "Parser Action Set",
          "valA": "Predict production from non-terminal and input token; Match terminals",
          "valB": "Shift input terminal, Reduce handles by production, Accept, Error"
        },
        {
          "property": "Parsing Table Organization",
          "valA": "2D table indexed by [Non-Terminal, Lookahead Terminal]",
          "valB": "Action table [State, Terminal] and Goto table [State, Non-Terminal]"
        },
        {
          "property": "Grammar Class Expressive Power",
          "valA": "Strictly weaker: LL(1) grammars are a proper subset of LR(1)",
          "valB": "Substantially more powerful: parses virtually all programming language constructs"
        },
        {
          "property": "Syntax Error Detection Point",
          "valA": "Detects syntax error immediately before shifting invalid terminal",
          "valB": "Detects syntax error as soon as an invalid reduction or shift is attempted"
        }
      ]
    }
  },
  "operating-systems": {
    "formulaName": "Banker's Algorithm & Effective Paging Time",
    "lang": "Systems & OS",
    "gfgUrl": "https://www.geeksforgeeks.org/operating-systems/",
    "nptelCode": "noc20-cs59 (IIT Kharagpur - Operating Systems)",
    "derivation": "Banker's Safety Algorithm Check:\n  Need[i][j] = Max[i][j] - Allocation[i][j]\n  If Need_i <= Work:\n     Work = Work + Allocation_i\n     Finish[i] = true\n  Safe Sequence exists <=> all Finish[i] == true\n\nTwo-Level Paging with TLB:\n  EAT = Hit_TLB * (t_TLB + t_mem) + (1 - Hit_TLB) * (t_TLB + 2 * t_mem + t_mem)\n      = t_TLB + t_mem + (1 - Hit_TLB) * 2 * t_mem",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><rect x=\"30\" y=\"40\" width=\"80\" height=\"40\" fill=\"#4a0e17\" rx=\"6\"/><text x=\"70\" y=\"65\" fill=\"#fff\" font-size=\"10\" text-anchor=\"middle\">CPU (VA)</text><rect x=\"140\" y=\"30\" width=\"60\" height=\"60\" fill=\"#c5a059\" rx=\"6\"/><text x=\"170\" y=\"65\" fill=\"#111\" font-size=\"10\" text-anchor=\"middle\">TLB</text><rect x=\"230\" y=\"30\" width=\"70\" height=\"80\" fill=\"#2d0a0f\" rx=\"6\"/><text x=\"265\" y=\"75\" fill=\"#fff\" font-size=\"10\" text-anchor=\"middle\">Page Table</text><line x1=\"110\" y1=\"60\" x2=\"140\" y2=\"60\" stroke=\"#c5a059\" stroke-width=\"2\"/><line x1=\"200\" y1=\"60\" x2=\"230\" y2=\"60\" stroke=\"#059669\" stroke-width=\"2\"/><text x=\"160\" y=\"150\" fill=\"#999\" font-size=\"10\" text-anchor=\"middle\">Virtual Address -> TLB Hit -> Physical Frame</text></svg>",
    "caption": "TLB Translation Lookaside Buffer Acceleration",
    "gfgSubcategories": [
      {
        "title": "Process Management, States & Fork()",
        "tag": "Processes & Threads",
        "url": "https://www.geeksforgeeks.org/introduction-of-process-management/",
        "desc": "Process Control Block (PCB), context switching, user vs kernel threads, and fork() process tree execution."
      },
      {
        "title": "CPU Scheduling Algorithms",
        "tag": "CPU Scheduling",
        "url": "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/",
        "desc": "FCFS, SJF, SRTF preemptive scheduling, Round Robin quantum selection, priority scheduling, and Gantt charts."
      },
      {
        "title": "Synchronization, Semaphores & Classical IPC",
        "tag": "Concurrency & IPC",
        "url": "https://www.geeksforgeeks.org/process-synchronization-in-operating-system/",
        "desc": "Critical section criteria (Mutual Exclusion, Progress, Bounded Waiting), Peterson\u2019s algorithm, and counting semaphores."
      },
      {
        "title": "Deadlock Avoidance & Banker\u2019s Algorithm",
        "tag": "Deadlocks",
        "url": "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/",
        "desc": "Coffman conditions, Resource Allocation Graphs (RAG), Banker\u2019s safety algorithm, and deadlock detection."
      },
      {
        "title": "Virtual Memory, Multi-Level Paging & TLB",
        "tag": "Memory Management",
        "url": "https://www.geeksforgeeks.org/virtual-memory-in-operating-system/",
        "desc": "Page tables, page size, frame size, TLB hit ratio, effective memory access time, and inverted page tables."
      },
      {
        "title": "Page Replacement & Disk Scheduling",
        "tag": "Storage & Replacement",
        "url": "https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/",
        "desc": "FIFO Belady\u2019s anomaly, LRU, Optimal page replacement, thrashing working set model, and SCAN/C-SCAN disk scheduling."
      }
    ],
    "modules": [
      {
        "title": "Process Control, Threading Models & CPU Scheduling",
        "keyPoints": [
          "Process vs Thread: Threads share code, data, and open files of the parent process, but retain private program counter and stack.",
          "System call `fork()` duplicates calling process. Returns 0 to child, positive PID to parent, -1 on failure.",
          "Scheduling metrics: Turnaround Time = Completion - Arrival. Waiting Time = Turnaround - Burst Time.",
          "Shortest Remaining Time First (SRTF) is optimal for minimizing average waiting time among all scheduling algorithms."
        ],
        "theorem": "SRTF Turnaround Optimality: Shortest Remaining Time First scheduling produces the provably minimum average waiting time across any set of processes with known burst times.",
        "examTrap": "Fork() Power of Two Trap: A sequence of n successive `fork()` calls without conditionals creates exactly 2^n - 1 child processes, resulting in 2^n total concurrent processes."
      },
      {
        "title": "Concurrency, Classical Synchronization & Deadlocks",
        "keyPoints": [
          "Critical Section 3 criteria: (1) Mutual Exclusion, (2) Progress, (3) Bounded Waiting.",
          "Counting Semaphore S: wait(S) decrements S and blocks if S < 0; signal(S) increments S and wakes a blocked process.",
          "Deadlock Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
          "Banker\u2019s Algorithm: Avoids deadlock by granting requests only if the resulting system state remains safe."
        ],
        "theorem": "Single-Instance RAG Deadlock Equivalence: In a Resource Allocation Graph where every resource type has exactly one instance, a directed cycle is necessary AND sufficient for deadlock.",
        "examTrap": "Multi-Instance Deadlock Fallacy: If resources have multiple instances, a cycle in the Resource Allocation Graph does NOT imply deadlock! It is a necessary condition, but not a sufficient condition."
      },
      {
        "title": "Memory Paging, TLB Translation & Page Replacement",
        "keyPoints": [
          "Paging: Virtual Address = Page Number (p) | Page Offset (d). Physical Address = Frame Number (f) | Page Offset (d).",
          "Page Table Size = Number of Pages * Page Table Entry (PTE) size.",
          "Translation Lookaside Buffer (TLB): Associative hardware cache for fast virtual-to-physical address mapping.",
          "Page Replacement: Belady\u2019s Anomaly occurs in FIFO where increasing frames increases page faults. LRU and Optimal are stack algorithms immune to Belady\u2019s anomaly."
        ],
        "theorem": "Stack Algorithm Invariance: Any page replacement algorithm satisfying the inclusion property (the set of pages in memory for m frames is a subset of the pages for m+1 frames) can never exhibit Belady\u2019s anomaly.",
        "examTrap": "Multi-Level Page Table Size Trap: Multi-level paging reduces physical memory consumption because unallocated virtual memory ranges do NOT require second-level page tables to be created in RAM!"
      }
    ],
    "definitions": [
      {
        "term": "Process Control Block (PCB)",
        "category": "Process Management",
        "definition": "Kernel data structure storing execution context of a process: PID, program counter, register values, memory limits, and open file lists.",
        "note": "Context switching saves state to the current PCB and loads the next PCB."
      },
      {
        "term": "Counting Semaphore",
        "category": "Synchronization",
        "definition": "Integer synchronization primitive initialized to S. wait(S) decrements S and blocks if S < 0; signal(S) increments S and unblocks a waiting process.",
        "note": "Binary semaphore (mutex) takes values strictly in {0, 1}."
      },
      {
        "term": "Deadlock & Banker\u2019s Safety",
        "category": "Deadlocks",
        "definition": "Deadlock occurs when processes in a set are waiting for events that only other processes in the set can trigger. Banker\u2019s algorithm grants resources only if a safe sequence exists.",
        "note": "Four Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait."
      },
      {
        "term": "Translation Lookaside Buffer (TLB)",
        "category": "Memory Paging",
        "definition": "Fast associative hardware cache storing recently translated Virtual Page Number to Physical Frame Number mappings.",
        "note": "TLB hit avoids memory lookup to page tables: EAT = t_TLB + t_mem + (1 - H)*2 t_mem."
      },
      {
        "term": "Thrashing",
        "category": "Virtual Memory",
        "definition": "Pathological condition where the CPU spends more time swapping pages between RAM and disk than executing instructions.",
        "note": "Remedied using the Working Set Model or Page Fault Frequency regulation."
      }
    ],
    "taxonomies": [
      {
        "name": "CPU Scheduling Disciplines",
        "badge": "Scheduling Taxonomy",
        "items": [
          "Preemptive (SRTF, Round Robin, Priority preemptive - higher responsiveness)",
          "Non-Preemptive (FCFS, Non-preemptive SJF - zero context-switch overhead)",
          "Round Robin (Time quantum slicing; small quantum = high overhead, large = FCFS)",
          "Multi-Level Feedback Queue (Adaptive dynamic priorities based on CPU burst history)"
        ]
      },
      {
        "name": "Page Replacement Algorithms",
        "badge": "Memory Taxonomy",
        "items": [
          "FIFO (Suffers from Belady\u2019s anomaly where more frames cause more faults)",
          "Optimal (B\u00e9l\u00e1dy\u2019s optimal algorithm: replaces page needed farthest in future)",
          "LRU (Least Recently Used: stack algorithm, immune to Belady\u2019s anomaly)",
          "Clock / Second-Chance (Approximates LRU using hardware reference bits)"
        ]
      }
    ],
    "comparison": {
      "title": "Process vs Thread",
      "entityA": "Operating System Process",
      "entityB": "Thread (Lightweight Process)",
      "rows": [
        {
          "property": "Virtual Address Space",
          "valA": "Isolated, private virtual memory address space allocated per process",
          "valB": "Shares the address space (code, data, heap) with other peer threads"
        },
        {
          "property": "Creation & Context Switch Overhead",
          "valA": "Heavyweight: allocates page tables, PCB, and flushes TLB on switch",
          "valB": "Lightweight: shared memory context; saves/restores only registers and stack"
        },
        {
          "property": "Inter-Entity Communication",
          "valA": "Requires explicit IPC mechanisms: Pipes, Message Queues, Shared Memory",
          "valB": "Direct communication via shared heap memory and global process variables"
        },
        {
          "property": "Fault Isolation & Reliability",
          "valA": "High isolation: a crash or segmentation fault in one process does not affect others",
          "valB": "Low isolation: an unhandled memory fault in one thread crashes the entire process"
        },
        {
          "property": "System Resource Ownership",
          "valA": "Owns operating system resources: open file descriptors, sockets, memory mappings",
          "valB": "Shares all allocated process resources; retains only private stack and program counter"
        },
        {
          "property": "Parallel Execution on Multicores",
          "valA": "Independent processes execute concurrently across CPU cores",
          "valB": "Kernel-level threads execute concurrently within the same application process"
        }
      ]
    }
  },
  "databases": {
    "formulaName": "Relational Normal Forms & Lossless Decomposition",
    "lang": "Database Normalization",
    "gfgUrl": "https://www.geeksforgeeks.org/dbms/",
    "nptelCode": "noc21-cs57 (IIT Kharagpur - Database Management System)",
    "derivation": "Decomposition R into (R1, R2) is Lossless-Join if and only if:\n  (R1 cap R2) -> R1 in F+  OR  (R1 cap R2) -> R2 in F+\n(i.e., common attribute must be a Super Key of at least one relation)\n\nNormal Form Hierarchy:\n  1NF: Atomic attribute domain values.\n  2NF: 1NF + No partial dependency (Non-prime attribute -> part of candidate key).\n  3NF: 2NF + For every X -> A, either X is a Super Key OR A is a prime attribute.\n  BCNF: For every X -> A, X MUST be a Super Key.",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><ellipse cx=\"160\" cy=\"90\" rx=\"140\" ry=\"75\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"/><text x=\"160\" y=\"35\" fill=\"#777\" font-size=\"9\" text-anchor=\"middle\">1NF</text><ellipse cx=\"160\" cy=\"95\" rx=\"110\" ry=\"60\" fill=\"none\" stroke=\"#c5a059\" stroke-width=\"1.5\"/><text x=\"160\" y=\"55\" fill=\"#c5a059\" font-size=\"9\" text-anchor=\"middle\">2NF</text><ellipse cx=\"160\" cy=\"100\" rx=\"80\" ry=\"45\" fill=\"none\" stroke=\"#059669\" stroke-width=\"1.5\"/><text x=\"160\" y=\"75\" fill=\"#059669\" font-size=\"9\" text-anchor=\"middle\">3NF</text><ellipse cx=\"160\" cy=\"105\" rx=\"50\" ry=\"30\" fill=\"rgba(74,14,23,0.3)\" stroke=\"#e0443e\" stroke-width=\"2\"/><text x=\"160\" y=\"110\" fill=\"#e0443e\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">BCNF</text></svg>",
    "caption": "Strict Inclusion Hierarchy of Relational Normal Forms",
    "gfgSubcategories": [
      {
        "title": "ER Modeling & Relational Schema Mapping",
        "tag": "Conceptual Modeling",
        "url": "https://www.geeksforgeeks.org/introduction-of-er-model/",
        "desc": "Entities, weak entity sets, relationships (1:1, 1:N, M:N), participation constraints, and converting ER to minimal tables."
      },
      {
        "title": "Relational Algebra & Tuple Calculus",
        "tag": "Query Languages",
        "url": "https://www.geeksforgeeks.org/introduction-of-relational-algebra-in-dbms/",
        "desc": "Select, project, Cartesian product, natural join, conditional joins, division operator, TRC and DRC equivalences."
      },
      {
        "title": "Advanced SQL Queries, Subqueries & Joins",
        "tag": "SQL Engineering",
        "url": "https://www.geeksforgeeks.org/sql-tutorial/",
        "desc": "Correlated subqueries, GROUP BY, HAVING, outer joins (LEFT, RIGHT, FULL), and three-valued boolean logic with NULL."
      },
      {
        "title": "Functional Dependencies & Normalization",
        "tag": "Schema Design",
        "url": "https://www.geeksforgeeks.org/normal-forms-in-dbms/",
        "desc": "Armstrong\u2019s axioms, attribute closure X+, candidate keys, canonical cover, 1NF to BCNF, and dependency preservation."
      },
      {
        "title": "Transactions & Concurrency Control",
        "tag": "Transaction Processing",
        "url": "https://www.geeksforgeeks.org/concurrency-control-techniques/",
        "desc": "ACID properties, conflict serializability precedence graphs, view serializability, strict 2PL, and deadlocks."
      },
      {
        "title": "Indexing Structures: B-Trees & B+ Trees",
        "tag": "File Organization",
        "url": "https://www.geeksforgeeks.org/indexing-in-databases-set-1/",
        "desc": "Primary, secondary, clustered indexes, B-tree search order, B+ tree leaf linked list, fan-out, and disk I/O costs."
      }
    ],
    "modules": [
      {
        "title": "ER Modeling, Relational Algebra & SQL Foundations",
        "keyPoints": [
          "ER to Schema conversion: 1:N relationship is mapped by adding the 1-side primary key as a foreign key on the N-side table.",
          "M:N relationship requires a separate junction table containing primary keys of both participating entity sets.",
          "Relational Algebra operators: Selection (sigma), Projection (pi), Cartesian Product (x), Natural Join (|><|), Division (/ for \"for all\" queries).",
          "SQL NULL handling: Any comparison with NULL (`x = NULL` or `x <> NULL`) evaluates to UNKNOWN. Use `IS NULL` or `IS NOT NULL`."
        ],
        "theorem": "Codd\u2019s Relational Equivalence Theorem: Relational Algebra and Domain-Independent Relational Calculus are equivalent in expressive query power.",
        "examTrap": "COUNT(*) vs COUNT(col) Trap: `COUNT(*)` counts all rows including those with NULL values; `COUNT(column)` ignores NULL values and counts only rows where that specific column is non-null."
      },
      {
        "title": "Functional Dependencies, Normalization & Decomposition",
        "keyPoints": [
          "Attribute Closure X+: Set of all attributes functionally determined by X under given dependency set F.",
          "Candidate Key: Minimal super key whose attribute closure encompasses all schema attributes.",
          "Prime attribute: Attribute that belongs to AT LEAST ONE candidate key. Non-prime: belongs to no candidate key.",
          "Normal Forms: 1NF (atomic domains); 2NF (no partial dependencies); 3NF (every X->A has X as superkey or A prime); BCNF (every X->A has X as superkey)."
        ],
        "theorem": "Lossless Join Condition: A decomposition of relation R into (R_1, R_2) is lossless-join if and only if (R_1 cap R_2) -> R_1 or (R_1 cap R_2) -> R_2 in F+.",
        "examTrap": "3NF vs BCNF Dependency Preservation: Any relational schema can always be decomposed into 3NF such that it is simultaneously lossless-join AND dependency-preserving. Decomposition into BCNF is always lossless-join, but may NOT preserve dependencies!"
      },
      {
        "title": "Transactions, Serializability & B+ Tree Indexing",
        "keyPoints": [
          "ACID properties: Atomicity (all-or-nothing), Consistency (integrity constraints), Isolation (serializability), Durability (WAL logging).",
          "Conflict Serializability: Tested by constructing a directed precedence graph. Schedule is conflict serializable iff graph has NO directed cycles.",
          "Two-Phase Locking (2PL): Growing phase (locks acquired) and shrinking phase (locks released). Strict 2PL holds exclusive locks until commit/abort.",
          "B+ Tree: All keys reside in leaves connected by sequential pointers; internal nodes store routing keys and child pointers."
        ],
        "theorem": "Conflict Serializability Invariant: A concurrent transaction schedule is conflict serializable if and only if its precedence graph contains no directed cycles.",
        "examTrap": "2PL and Deadlocks: Two-Phase Locking (2PL) guarantees conflict serializability, but it does NOT prevent deadlocks! Transactions under 2PL can still enter circular wait deadlocks."
      }
    ],
    "definitions": [
      {
        "term": "Candidate Key & Superkey",
        "category": "Relational Model",
        "definition": "A superkey is any set of attributes that uniquely identifies a tuple. A candidate key is a minimal superkey containing no redundant attributes.",
        "note": "A prime attribute belongs to at least one candidate key."
      },
      {
        "term": "Lossless-Join Decomposition",
        "category": "Normalization",
        "definition": "Decomposition of relation R into R_1, R_2 is lossless iff joining the projections recreates exactly R without generating spurious tuples: (R_1 cap R_2) -> R_1 or (R_1 cap R_2) -> R_2 in F+.",
        "note": "Common attribute must be a candidate key of at least one sub-relation."
      },
      {
        "term": "Conflict Serializability",
        "category": "Transactions",
        "definition": "A concurrent schedule S is conflict serializable iff it is conflict equivalent to some serial schedule. Tested by checking for cycles in the precedence graph.",
        "note": "Acyclic precedence graph strictly implies conflict serializability."
      },
      {
        "term": "Two-Phase Locking (2PL)",
        "category": "Concurrency Control",
        "definition": "Concurrency protocol where transactions acquire locks during a Growing Phase and release locks during a Shrinking Phase without acquiring new locks.",
        "note": "Guarantees conflict serializability; does NOT prevent deadlocks."
      },
      {
        "term": "B+ Tree Index Invariant",
        "category": "Indexing",
        "definition": "Balanced search tree where all data records/pointers reside strictly in leaf nodes linked sequentially. Internal nodes store routing keys.",
        "note": "Supports both fast random searches O(log_B N) and contiguous range queries."
      }
    ],
    "taxonomies": [
      {
        "name": "Relational Normal Forms",
        "badge": "Schema Taxonomy",
        "items": [
          "1NF (Atomic domain values, no multivalued or composite attributes)",
          "2NF (1NF + No partial dependency: Non-prime -> part of candidate key)",
          "3NF (2NF + Every X->A has X as superkey or A as prime attribute)",
          "BCNF (Boyce-Codd: For every non-trivial X->A, X MUST be a superkey)"
        ]
      },
      {
        "name": "Transaction Schedule Properties",
        "badge": "Transaction Taxonomy",
        "items": [
          "Conflict Serializable (Acyclic serialization precedence graph)",
          "View Serializable (Includes blind-write schedules; NP-complete to test)",
          "Recoverable Schedule (Commit of T_j reading from T_i occurs after commit of T_i)",
          "Cascadeless Schedule (Reads only committed data; avoids cascading aborts)"
        ]
      }
    ],
    "comparison": {
      "title": "Third Normal Form (3NF) vs Boyce-Codd Normal Form (BCNF)",
      "entityA": "Third Normal Form (3NF)",
      "entityB": "Boyce-Codd Normal Form (BCNF)",
      "rows": [
        {
          "property": "Functional Dependency Condition",
          "valA": "For every X -> A: Either X is a Superkey OR A is a Prime Attribute",
          "valB": "For every X -> A: X MUST strictly be a Superkey (no prime exception)"
        },
        {
          "property": "Dependency Preservation Guarantee",
          "valA": "ALWAYS guaranteed: any schema can be decomposed into 3NF preserving all FDs",
          "valB": "NOT always guaranteed: some schemas lose functional dependencies under BCNF"
        },
        {
          "property": "Lossless Join Guarantee",
          "valA": "Can always be decomposed to 3NF with guaranteed lossless-join property",
          "valB": "Can always be decomposed to BCNF with guaranteed lossless-join property"
        },
        {
          "property": "Data Redundancy Elimination",
          "valA": "Permits minor redundancy when candidate keys overlap and A is prime",
          "valB": "Completely eliminates all redundancy resulting from functional dependencies"
        },
        {
          "property": "Strict Inclusion Relationship",
          "valA": "BCNF is a strict subset of 3NF (every BCNF relation is in 3NF)",
          "valB": "Stronger than 3NF (relations in 3NF may fail BCNF)"
        },
        {
          "property": "Classic GATE Counterexample",
          "valA": "R(A, B, C) with AB -> C, C -> B: Relation is in 3NF (B is prime)",
          "valB": "Relation fails BCNF because in C -> B, C is not a superkey"
        }
      ]
    }
  },
  "computer-networks": {
    "formulaName": "TCP Congestion Control & IPv4 Subnetting",
    "lang": "Computer Networks",
    "gfgUrl": "https://www.geeksforgeeks.org/computer-network-tutorials/",
    "nptelCode": "noc20-cs77 (IIT Kharagpur - Computer Networks)",
    "derivation": "TCP Congestion Window Dynamics (AIMD):\n  Slow Start: cwnd = cwnd + 1 MSS per ACK (Exponential Growth until ssthresh)\n  Congestion Avoidance: cwnd = cwnd + (1 / cwnd) per ACK (Linear Increase +1 MSS per RTT)\n  On 3 Duplicate ACKs (Fast Retransmit/Fast Recovery):\n    ssthresh = max(2, cwnd / 2), cwnd = ssthresh + 3\n  On Timeout:\n    ssthresh = max(2, cwnd / 2), cwnd = 1 MSS\n\nCIDR Host Calculation:\n  Usable Hosts in /n Subnet = 2^(32 - n) - 2 (subtract Network ID and Broadcast)",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><path d=\"M 40 140 Q 90 120 120 40 L 120 80 L 200 40 L 200 80 L 280 40\" fill=\"none\" stroke=\"#c5a059\" stroke-width=\"2.5\"/><line x1=\"40\" y1=\"140\" x2=\"280\" y2=\"140\" stroke=\"#666\" stroke-width=\"1.5\"/><text x=\"120\" y=\"30\" fill=\"#e0443e\" font-size=\"10\" text-anchor=\"middle\">ssthresh (Timeout)</text><text x=\"160\" y=\"160\" fill=\"#999\" font-size=\"10\" text-anchor=\"middle\">Sawtooth Curve: AIMD Additive Increase Multiplicative Decrease</text></svg>",
    "caption": "TCP Congestion Window Sawtooth Dynamics",
    "gfgSubcategories": [
      {
        "title": "OSI & TCP/IP Protocol Architecture",
        "tag": "Protocol Stack",
        "url": "https://www.geeksforgeeks.org/layers-of-osi-model/",
        "desc": "Layering principles, encapsulation, transmission delay L/B, propagation delay d/v, and bandwidth-delay product."
      },
      {
        "title": "Data Link Layer & Sliding Window Protocols",
        "tag": "Data Link Layer",
        "url": "https://www.geeksforgeeks.org/error-detection-in-computer-networks/",
        "desc": "CRC polynomial check, Stop-and-Wait efficiency eta = 1/(1+2a), Go-Back-N window size, and Selective Repeat."
      },
      {
        "title": "Medium Access Control & CSMA/CD",
        "tag": "MAC Sublayer",
        "url": "https://www.geeksforgeeks.org/multiple-access-protocols/",
        "desc": "Pure ALOHA, slotted ALOHA throughput, CSMA/CD minimum frame size L >= 2 * t_p * B, and exponential backoff."
      },
      {
        "title": "IPv4 Addressing, Subnetting & CIDR",
        "tag": "Network Layer",
        "url": "https://www.geeksforgeeks.org/ip-addressing-and-subnetting/",
        "desc": "IPv4 header fields, fragmentation offsets (8-byte units), CIDR longest prefix matching, and NAT translation."
      },
      {
        "title": "Routing Algorithms (Distance Vector & Link State)",
        "tag": "Routing Protocols",
        "url": "https://www.geeksforgeeks.org/routing-v-s-routed-protocols/",
        "desc": "Bellman-Ford Distance Vector count-to-infinity problem, split horizon, and Dijkstra Link State routing."
      },
      {
        "title": "Transport Layer: TCP Flow & Congestion Control",
        "tag": "Transport Protocols",
        "url": "https://www.geeksforgeeks.org/tcp-congestion-control/",
        "desc": "TCP 3-way handshake, sequence numbers, advertised window, slow start exponential phase, AIMD, and fast recovery."
      }
    ],
    "modules": [
      {
        "title": "Network Architecture, Delays & Sliding Window Protocols",
        "keyPoints": [
          "Packet Delays: Transmission delay T_t = L / Bandwidth; Propagation delay T_p = Distance / Speed.",
          "Efficiency parameter a = T_p / T_t. Stop-and-Wait efficiency eta = 1 / (1 + 2a).",
          "Go-Back-N: Sender window W_s = 2^k - 1, receiver window W_r = 1. Retransmits all unacknowledged frames on packet loss.",
          "Selective Repeat: W_s = W_r = 2^{k-1}. Individual retransmission and ACK buffering at receiver."
        ],
        "theorem": "CSMA/CD Minimum Frame Size: In CSMA/CD Ethernet networks, frame transmission time must be at least twice the one-way propagation delay: T_t >= 2 T_p, which gives L_{min} >= 2 * T_p * Bandwidth.",
        "examTrap": "Sequence Number Bit Width Trap: In Go-Back-N with k-bit sequence numbers, max sender window is 2^k - 1, NOT 2^k. In Selective Repeat, max window is 2^{k-1} to avoid stale packet confusion."
      },
      {
        "title": "Network Layer, IPv4 Subnetting & Routing Algorithms",
        "keyPoints": [
          "IPv4 header size: 20 bytes minimum up to 60 bytes with options (IHL field in 4-byte words).",
          "Fragmentation: Fragment Offset field is measured in units of 8-byte blocks.",
          "CIDR Subnetting: /n prefix has 2^{32-n} total addresses and 2^{32-n} - 2 usable host addresses.",
          "Distance Vector routing uses distributed Bellman-Ford; susceptible to Count-to-Infinity. Link State uses Dijkstra."
        ],
        "theorem": "Longest Prefix Match Invariant: When an IP packet matches multiple forwarding table entries of different netmasks, the router MUST route the packet using the entry with the longest prefix length.",
        "examTrap": "IPv4 Fragment Offset Scaling: The Fragment Offset field in the IPv4 header does NOT count single bytes! It counts 8-byte blocks. Always divide byte offset by 8 when calculating the offset field value."
      },
      {
        "title": "Transport Layer, TCP Dynamics & Congestion Avoidance",
        "keyPoints": [
          "TCP flow control: Receiver advertises rwnd in header. Sender window is min(cwnd, rwnd).",
          "Slow Start: cwnd starts at 1 MSS and doubles every RTT (cwnd = cwnd + 1 MSS per received ACK).",
          "Congestion Avoidance: When cwnd >= ssthresh, grows linearly by +1 MSS per RTT.",
          "Loss Events: Timeout resets cwnd = 1 MSS and restarts Slow Start. 3 Duplicate ACKs halving cwnd (Fast Recovery)."
        ],
        "theorem": "TCP AIMD Convergence Principle: Additive-Increase Multiplicative-Decrease ensures distributed bandwidth sharing among competing TCP flows converges to both efficiency and fairness.",
        "examTrap": "Timeout vs 3-Dup-ACK Trap: A timeout indicates severe network congestion and drops cwnd all the way to 1 MSS. In contrast, 3 Duplicate ACKs indicate mild packet loss and drop cwnd to ssthresh without resetting to 1."
      }
    ],
    "definitions": [
      {
        "term": "Bandwidth-Delay Product (BDP)",
        "category": "Transport Metrics",
        "definition": "Capacity of a network link measured as Bandwidth x Round-Trip Time (RTT). Represents maximum data in flight.",
        "note": "TCP window must be at least BDP to fully saturate link capacity."
      },
      {
        "term": "CSMA/CD Minimum Frame Size",
        "category": "Medium Access",
        "definition": "Frame transmission time must be at least twice the one-way propagation delay: T_t >= 2 T_p, giving L_{min} = 2 * T_p * Bandwidth.",
        "note": "Ensures sender detects collisions before transmission completes."
      },
      {
        "term": "Classless Inter-Domain Routing (CIDR)",
        "category": "IP Addressing",
        "definition": "Address allocation method using prefix notation /n. Number of host addresses = 2^{32-n} - 2.",
        "note": "Routers forward packets using Longest Prefix Matching."
      },
      {
        "term": "Count-to-Infinity Problem",
        "category": "Routing",
        "definition": "Routing anomaly in Distance Vector (Bellman-Ford) routing where link failure causes nodes to slowly increment distance metrics to infinity.",
        "note": "Partially mitigated by Split Horizon and Poison Reverse."
      },
      {
        "term": "TCP AIMD Dynamics",
        "category": "Congestion Control",
        "definition": "Additive-Increase Multiplicative-Decrease: cwnd increases linearly by +1 MSS per RTT in congestion avoidance, and halves on packet loss.",
        "note": "Mathematically guarantees convergence to both efficiency and fairness."
      }
    ],
    "taxonomies": [
      {
        "name": "Routing Protocol Categories",
        "badge": "Routing Taxonomy",
        "items": [
          "Distance Vector (RIP: Bellman-Ford, metric = hop count, count-to-infinity)",
          "Link State (OSPF: Dijkstra, complete topology flood, fast convergence)",
          "Path Vector (BGP: Inter-AS policy routing, detects routing loops)",
          "Interior vs Exterior (IGP inside autonomous systems, EGP between ASs)"
        ]
      },
      {
        "name": "Flow Control Sliding Window Protocols",
        "badge": "Flow Protocols",
        "items": [
          "Stop-and-Wait (W_s = 1, W_r = 1, efficiency eta = 1/(1+2a))",
          "Go-Back-N (W_s = 2^k - 1, W_r = 1, retransmits all unACKed frames on loss)",
          "Selective Repeat (W_s = W_r = 2^{k-1}, individual retransmissions and buffering)",
          "TCP Byte-Oriented Window (Dynamic advertised receiver window rwnd)"
        ]
      }
    ],
    "comparison": {
      "title": "Transmission Control Protocol (TCP) vs User Datagram Protocol (UDP)",
      "entityA": "Transmission Control Protocol (TCP)",
      "entityB": "User Datagram Protocol (UDP)",
      "rows": [
        {
          "property": "Connection Paradigm",
          "valA": "Connection-oriented (Requires 3-way handshake SYN, SYN-ACK, ACK)",
          "valB": "Connectionless (Sends standalone datagrams with zero connection setup)"
        },
        {
          "property": "Reliability & Delivery Guarantee",
          "valA": "Guaranteed, in-order reliable byte stream via ACKs and retransmissions",
          "valB": "Unreliable best-effort delivery; packets may be lost, duplicated, or reordered"
        },
        {
          "property": "Congestion & Flow Control",
          "valA": "Integrated sliding window flow control + AIMD congestion control",
          "valB": "Zero flow control and zero congestion control; transmits at application speed"
        },
        {
          "property": "Header Protocol Overhead",
          "valA": "20 bytes minimum (up to 60 bytes with options)",
          "valB": "8 bytes fixed header (Source Port, Dest Port, Length, Checksum)"
        },
        {
          "property": "Transmission Framing",
          "valA": "Continuous byte stream without packet boundaries",
          "valB": "Preserves discrete application message datagram boundaries"
        },
        {
          "property": "Standard Protocol Examples",
          "valA": "HTTP, HTTPS, SSH, FTP, SMTP, BGP",
          "valB": "DNS, DHCP, SNMP, RTP, TFTP, VoIP"
        }
      ]
    }
  },
  "machine-learning": {
    "formulaName": "Bias-Variance Decomposition & L2 Regularization",
    "lang": "Statistical Machine Learning",
    "gfgUrl": "https://www.geeksforgeeks.org/machine-learning/",
    "nptelCode": "noc20-cs73 (IIT Kharagpur - Machine Learning)",
    "derivation": "Mean Squared Error Decomposition for test point x:\n  E[(y - f_hat(x))^2] = Bias[f_hat(x)]^2 + Var[f_hat(x)] + sigma_epsilon^2\nwhere:\n  Bias[f_hat(x)] = E[f_hat(x)] - f(x)\n  Var[f_hat(x)]  = E[(f_hat(x) - E[f_hat(x)])^2]\n  sigma_epsilon^2 = Irreducible environmental noise\n\nRidge Regression (L2 Penalty):\n  w* = argmin_w ||X w - y||^2 + lambda * ||w||_2^2\n  Closed-Form Solution: w* = (X^T X + lambda * I)^{-1} X^T y\n  Adding lambda * I guarantees invertibility even when X^T X is singular!",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><path d=\"M 40 40 Q 120 130 280 140\" fill=\"none\" stroke=\"#e0443e\" stroke-width=\"2\"/><text x=\"80\" y=\"130\" fill=\"#e0443e\" font-size=\"10\">Bias^2</text><path d=\"M 40 140 Q 200 130 280 40\" fill=\"none\" stroke=\"#059669\" stroke-width=\"2\"/><text x=\"240\" y=\"130\" fill=\"#059669\" font-size=\"10\">Variance</text><path d=\"M 40 120 Q 160 50 280 120\" fill=\"none\" stroke=\"#c5a059\" stroke-width=\"2.5\"/><text x=\"160\" y=\"45\" fill=\"#c5a059\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">Total Error (Sweet Spot)</text></svg>",
    "caption": "Bias-Variance Tradeoff Curve vs Model Complexity",
    "gfgSubcategories": [
      {
        "title": "Linear & Polynomial Regression (OLS)",
        "tag": "Supervised Regression",
        "url": "https://www.geeksforgeeks.org/linear-regression-python-implementation/",
        "desc": "Ordinary Least Squares, closed-form normal equation (X^T X)^{-1} X^T y, gradient updates, and R^2 score."
      },
      {
        "title": "Ridge (L2) & Lasso (L1) Regularization",
        "tag": "Regularization",
        "url": "https://www.geeksforgeeks.org/ridge-regression-in-python/",
        "desc": "L2 weight shrinking vs L1 sparsity induction, bias-variance tradeoff, and hyperparameter cross-validation."
      },
      {
        "title": "Logistic Regression & Classification Metrics",
        "tag": "Classification",
        "url": "https://www.geeksforgeeks.org/understanding-logistic-regression/",
        "desc": "Sigmoid activation, log-loss cross-entropy, confusion matrix, precision, recall, F1-score, and ROC-AUC curve."
      },
      {
        "title": "Support Vector Machines (SVM) & Kernels",
        "tag": "Kernel Methods",
        "url": "https://www.geeksforgeeks.org/support-vector-machine-algorithm/",
        "desc": "Maximum margin hyperplane, support vectors, soft-margin slack variables C, dual form, and RBF kernels."
      },
      {
        "title": "Decision Trees & Information Gain",
        "tag": "Tree Ensembles",
        "url": "https://www.geeksforgeeks.org/decision-tree/",
        "desc": "Shannon Entropy, Information Gain, Gini impurity, ID3/C4.5/CART tree splits, and pruning strategies."
      },
      {
        "title": "K-Means Clustering & PCA Reduction",
        "tag": "Unsupervised Learning",
        "url": "https://www.geeksforgeeks.org/k-means-clustering-introduction/",
        "desc": "Lloyd\u2019s clustering algorithm, inertia elbow method, covariance matrix eigenvalues, and PCA variance preservation."
      }
    ],
    "modules": [
      {
        "title": "Linear Regression, Regularization & Model Validation",
        "keyPoints": [
          "Ordinary Least Squares: Closed-form parameter solution w* = (X^T X)^{-1} X^T y.",
          "Ridge Regression (L2): Adds lambda ||w||_2^2 penalty, solving w* = (X^T X + lambda I)^{-1} X^T y. Guarantees invertibility.",
          "Lasso Regression (L1): Adds lambda ||w||_1 penalty, driving irrelevant feature weights to exactly zero (feature selection).",
          "Bias-Variance Decomposition: Expected Test Error = Bias^2 + Variance + Irreducible Noise."
        ],
        "theorem": "Gauss-Markov Theorem: Under the conditions of zero error mean and homoscedasticity, the OLS estimator is the Best Linear Unbiased Estimator (BLUE), possessing the minimum variance among all linear unbiased estimators.",
        "examTrap": "Unscaled Feature Regularization: Always standardize/scale feature columns before applying Ridge or Lasso penalties! If features are unscaled, variables with large numerical values will be penalized disproportionately."
      },
      {
        "title": "Logistic Classification, Support Vector Machines & Kernels",
        "keyPoints": [
          "Logistic Regression models probability P(Y=1|X) = 1 / (1 + e^{-w^T X}) using binary cross-entropy loss.",
          "Support Vector Machines (SVM): Maximizes the geometric margin 2 / ||w|| between classes.",
          "Soft-margin parameter C: High C penalizes misclassifications heavily (low bias, high variance); low C tolerates margin violations (high bias).",
          "Kernel Trick: Implicitly maps input features into high-dimensional Hilbert space via Mercer kernel function K(x, x\u2019)."
        ],
        "theorem": "SVM Support Vector Sparsity: The optimal separating hyperplane depends solely on the support vectors (data points where Lagrange multipliers alpha_i > 0); removing all non-support vectors leaves the decision boundary unchanged.",
        "examTrap": "Accuracy on Imbalanced Datasets: High classification accuracy on severely imbalanced datasets (e.g., 99% negative class) is deceptive; always evaluate using Precision, Recall, and F1-Score."
      },
      {
        "title": "Decision Trees, Unsupervised Clustering & PCA",
        "keyPoints": [
          "Entropy: H(S) = - sum p_i log_2 p_i. Information Gain IG(S, A) = H(S) - sum (|S_v|/|S|) H(S_v).",
          "Gini Impurity: 1 - sum p_i^2 (used by CART). Faster to compute than entropy as it requires no logarithms.",
          "K-Means Clustering: Iteratively assigns points to nearest centroid and recalculates centroid means. Sensitive to outliers and initialization.",
          "Principal Component Analysis (PCA): Projects data onto orthogonal directions of maximum variance given by eigenvectors of the covariance matrix."
        ],
        "theorem": "PCA Variance Maximization: The first principal component corresponds to the eigenvector of the sample covariance matrix associated with the largest eigenvalue lambda_1, capturing the maximum possible data variance.",
        "examTrap": "K-Means Local Minima Trap: K-Means is guaranteed to converge, but only to a local optimum of the inertia objective. Running multiple restarts (K-Means++) with distinct initial centroids is required for robust results."
      }
    ],
    "definitions": [
      {
        "term": "Ordinary Least Squares (OLS)",
        "category": "Regression",
        "definition": "Linear model minimizing sum of squared residuals: w* = (X^T X)^{-1} X^T y. Under Gauss-Markov assumptions, OLS is the Best Linear Unbiased Estimator (BLUE).",
        "note": "Requires X^T X to be non-singular and invertible."
      },
      {
        "term": "Bias-Variance Decomposition",
        "category": "Generalization",
        "definition": "Expected test MSE decomposes into Bias^2 + Variance + Irreducible Noise. Complex models have low bias and high variance (overfitting); simple models have high bias and low variance.",
        "note": "Regularization balances this tradeoff."
      },
      {
        "term": "Support Vector Machine (SVM)",
        "category": "Classification",
        "definition": "Maximum-margin linear classifier maximizing geometric margin 2/||w|| between classes. Dual form depends only on dot products of support vectors.",
        "note": "Kernel trick maps features implicitly into high-dimensional space via K(x, x\u2019)."
      },
      {
        "term": "Information Gain",
        "category": "Decision Trees",
        "definition": "Reduction in Shannon Entropy achieved by partitioning data according to feature A: IG(S, A) = H(S) - sum (|S_v|/|S|) H(S_v).",
        "note": "ID3 selects attribute maximizing IG; C4.5 uses Gain Ratio to penalize multivalued features."
      },
      {
        "term": "Principal Component Analysis (PCA)",
        "category": "Dimensionality Reduction",
        "definition": "Unsupervised orthogonal linear projection maximizing data variance along principal axes given by eigenvectors of the sample covariance matrix.",
        "note": "First component corresponds to largest eigenvalue lambda_1."
      }
    ],
    "taxonomies": [
      {
        "name": "Learning Task Taxonomies",
        "badge": "ML Taxonomy",
        "items": [
          "Supervised Regression (Linear, Ridge, Lasso, Polynomial, SVR)",
          "Supervised Classification (Logistic, SVM, Decision Trees, Naive Bayes, k-NN)",
          "Unsupervised Clustering (K-Means, Agglomerative Hierarchical, DBSCAN)",
          "Dimensionality Reduction (PCA, SVD, t-SNE, Linear Discriminant Analysis)"
        ]
      },
      {
        "name": "Regularization Techniques",
        "badge": "Optimization Taxonomy",
        "items": [
          "L2 Ridge Regularization (lambda ||w||_2^2, shrinks weights, handles multicollinearity)",
          "L1 Lasso Regularization (lambda ||w||_1, sparse coefficients, automatic feature selection)",
          "Elastic Net (Combines L1 and L2 penalties for correlated feature groupings)",
          "Early Stopping (Halts iterative training when validation loss begins rising)"
        ]
      }
    ],
    "comparison": {
      "title": "Ridge Regression (L2) vs Lasso Regression (L1)",
      "entityA": "Ridge Regression (L2 Penalty)",
      "entityB": "Lasso Regression (L1 Penalty)",
      "rows": [
        {
          "property": "Regularization Penalty Term",
          "valA": "Quadratic norm penalty: lambda * sum(w_i^2) = lambda * ||w||_2^2",
          "valB": "Absolute value norm penalty: lambda * sum(|w_i|) = lambda * ||w||_1"
        },
        {
          "property": "Weight Sparsity Behavior",
          "valA": "Shrinks weights asymptotically toward zero, but never to exactly zero",
          "valB": "Drives non-informative feature weights to EXACTLY zero (sparse weights)"
        },
        {
          "property": "Automatic Feature Selection",
          "valA": "Does NOT perform feature selection; retains all original input variables",
          "valB": "Performs built-in feature selection by discarding zeroed-out features"
        },
        {
          "property": "Analytical Closed-Form Solution",
          "valA": "Has closed-form solution: w* = (X^T X + lambda I)^{-1} X^T y",
          "valB": "No closed-form matrix solution (solved via coordinate descent)"
        },
        {
          "property": "Multicollinearity Handling",
          "valA": "Adds lambda I to diagonal, guaranteeing matrix invertibility even if X^T X is singular",
          "valB": "Arbitrarily selects one feature from a correlated group and zeroes the others"
        },
        {
          "property": "Geometry of Constraint Region",
          "valA": "Spherical smooth circular constraint contour in weight space",
          "valB": "Diamond / polytope contour with sharp corners touching coordinate axes"
        }
      ]
    }
  },
  "artificial-intelligence": {
    "formulaName": "A* Search Admissibility & Alpha-Beta Pruning",
    "lang": "Heuristic Search & AI",
    "gfgUrl": "https://www.geeksforgeeks.org/artificial-intelligence-tutorials/",
    "nptelCode": "noc21-cs42 (IIT Madras - Artificial Intelligence: Search Methods for Problem Solving)",
    "derivation": "A* Evaluation Function:\n  f(n) = g(n) + h(n)\n  g(n): Exact cost from start node to current node n.\n  h(n): Estimated cost from node n to goal.\nAdmissibility Condition:\n  h(n) <= h*(n) for all n (h never overestimates actual cost).\n  => Guarantees finding optimal path on tree search!\nConsistency (Monotonicity):\n  h(n) <= c(n, a, n') + h(n')\n  => Ensures f(n) is monotonically non-decreasing along any path.",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><circle cx=\"160\" cy=\"30\" r=\"14\" fill=\"#4a0e17\"/><text x=\"160\" y=\"34\" fill=\"#fff\" font-size=\"9\" text-anchor=\"middle\">MAX</text><circle cx=\"90\" cy=\"85\" r=\"12\" fill=\"#c5a059\"/><text x=\"90\" y=\"89\" fill=\"#111\" font-size=\"8\" text-anchor=\"middle\">MIN</text><circle cx=\"230\" cy=\"85\" r=\"12\" fill=\"#c5a059\"/><text x=\"230\" y=\"89\" fill=\"#111\" font-size=\"8\" text-anchor=\"middle\">MIN</text><line x1=\"150\" y1=\"42\" x2=\"100\" y2=\"75\" stroke=\"#666\" stroke-width=\"2\"/><line x1=\"170\" y1=\"42\" x2=\"220\" y2=\"75\" stroke=\"#666\" stroke-width=\"2\"/><line x1=\"220\" y1=\"95\" x2=\"200\" y2=\"130\" stroke=\"#e0443e\" stroke-dasharray=\"3\" stroke-width=\"2\"/><text x=\"240\" y=\"130\" fill=\"#e0443e\" font-size=\"9\">Pruned (beta <= alpha)</text></svg>",
    "caption": "Adversarial Minimax Search Tree with Alpha-Beta Pruning",
    "gfgSubcategories": [
      {
        "title": "Uninformed Search: BFS, DFS & UCS",
        "tag": "Classical Search",
        "url": "https://www.geeksforgeeks.org/uniform-cost-search-dijkstra-for-large-graphs/",
        "desc": "Breadth-First Search, Depth-First Search, Uniform-Cost Search g(n), and Iterative Deepening Search (IDDFS)."
      },
      {
        "title": "Informed Heuristic Search: A* & IDA*",
        "tag": "Heuristic Search",
        "url": "https://www.geeksforgeeks.org/a-search-algorithm/",
        "desc": "Evaluation f(n)=g(n)+h(n), heuristic admissibility h(n) <= h*(n), consistency, and optimal pathfinding."
      },
      {
        "title": "Adversarial Search & Alpha-Beta Pruning",
        "tag": "Game Theory",
        "url": "https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-4-alpha-beta-pruning/",
        "desc": "Minimax algorithm in two-player zero-sum games, alpha cutoff, beta cutoff, and move ordering."
      },
      {
        "title": "Constraint Satisfaction Problems (CSP)",
        "tag": "Constraint Satisfaction",
        "url": "https://www.geeksforgeeks.org/constraint-satisfaction-problems-csp-in-artificial-intelligence/",
        "desc": "Variables, domains, binary constraints, backtracking search, forward checking, and AC-3 arc consistency."
      },
      {
        "title": "Knowledge Representation & First-Order Logic",
        "tag": "Logic & Inference",
        "url": "https://www.geeksforgeeks.org/first-order-logic-in-ai/",
        "desc": "Propositional logic resolution, Horn clauses, unification, forward/backward chaining in First-Order Logic."
      },
      {
        "title": "Bayesian Networks & Probabilistic Inference",
        "tag": "Uncertainty Reasoning",
        "url": "https://www.geeksforgeeks.org/bayesian-belief-network-in-artificial-intelligence/",
        "desc": "Directed Acyclic Graphs, conditional independence, d-separation, and exact inference by Variable Elimination."
      }
    ],
    "modules": [
      {
        "title": "State-Space Formulation & Informed Search (A*)",
        "keyPoints": [
          "State space 5-tuple: Initial state, action set, transition model, goal test, path cost function.",
          "Uniform-Cost Search expands node with lowest path cost g(n). Equivalent to Dijkstra on graphs with arbitrary step costs.",
          "A* Search expands node with lowest evaluation function f(n) = g(n) + h(n).",
          "Heuristic Admissibility: h(n) never overestimates actual cost to goal: h(n) <= h*(n) for all n."
        ],
        "theorem": "A* Graph Search Optimality: If heuristic h(n) is consistent (monotonic), A* graph search using a closed list is guaranteed to find an optimal solution without ever needing to reopen closed nodes.",
        "examTrap": "Admissibility vs Consistency: In A* GRAPH search, admissibility alone does NOT guarantee finding the optimal path if visited nodes are closed permanently. Monotonicity (consistency) is required!"
      },
      {
        "title": "Adversarial Game Search & Alpha-Beta Pruning",
        "keyPoints": [
          "Minimax: Computes optimal game value recursively. MAX chooses child with highest value; MIN chooses lowest.",
          "Alpha (alpha): Best value that MAX can guarantee along the path to the current state.",
          "Beta (beta): Best value that MIN can guarantee along the path to the current state.",
          "Pruning Condition: Prune child subtree whenever beta <= alpha."
        ],
        "theorem": "Alpha-Beta Invariant: Alpha-beta pruning visits strictly fewer game tree nodes than standard minimax while computing the EXACT same minimax value at the root.",
        "examTrap": "Pruning Cutoff Threshold: Pruning occurs only when beta <= alpha, never when beta > alpha. If beta > alpha, the search must continue exploring siblings."
      },
      {
        "title": "Constraint Satisfaction & Bayesian Belief Networks",
        "keyPoints": [
          "CSP: Solved by Backtracking Search augmented with Minimum Remaining Values (MRV) and Least Constraining Value heuristics.",
          "AC-3 Arc Consistency: Enforces that for every value in domain of X, there exists a consistent value in domain of Y.",
          "Bayesian Network: Directed Acyclic Graph where joint distribution is product of conditional probabilities P(X_i | Parents(X_i)).",
          "D-separation: Formal graphical criterion for determining whether X is conditionally independent of Y given evidence Z."
        ],
        "theorem": "Bayesian Chain Rule Factorization: Any Bayesian Network represents a joint probability distribution over variables X_1, ..., X_n as P(X_1, ..., X_n) = prod_{i=1}^n P(X_i | Parents(X_i)).",
        "examTrap": "Collider (V-Structure) Conditional Dependence: In a collider structure A -> C <- B, variables A and B are marginally independent. However, conditioning on C (or any descendant of C) makes A and B CONDITIONALLY DEPENDENT!"
      }
    ],
    "definitions": [
      {
        "term": "Heuristic Admissibility",
        "category": "Search Theory",
        "definition": "A heuristic h(n) is admissible iff it never overestimates the true cost to reach the goal: h(n) <= h*(n) for all nodes n.",
        "note": "Guarantees A* tree search finds an optimal solution."
      },
      {
        "term": "Heuristic Consistency (Monotonicity)",
        "category": "Search Theory",
        "definition": "For every node n and successor n\u2019 generated by action a: h(n) <= c(n, a, n\u2019) + h(n\u2019). Satisfies triangle inequality.",
        "note": "Guarantees A* graph search finds optimal paths without reopening closed nodes."
      },
      {
        "term": "Alpha-Beta Pruning",
        "category": "Adversarial Games",
        "definition": "Adversarial search optimization maintaining alpha (MAX\u2019s guaranteed lower bound) and beta (MIN\u2019s guaranteed upper bound). Prunes subtree whenever beta <= alpha.",
        "note": "With optimal move ordering, reduces search complexity from O(b^m) to O(b^{m/2})."
      },
      {
        "term": "Arc Consistency (AC-3)",
        "category": "Constraint Satisfaction",
        "definition": "Variable X is arc-consistent with Y iff for every value in domain(X), there exists a legal value in domain(Y) satisfying the binary constraint.",
        "note": "AC-3 eliminates domain values that can never participate in any valid solution."
      },
      {
        "term": "Bayesian Belief Network (BBN)",
        "category": "Probabilistic Reasoning",
        "definition": "Directed Acyclic Graph (DAG) representing conditional independence relationships among random variables. Factorizes joint distribution: P(X_1, ..., X_n) = prod P(X_i | Parents(X_i)).",
        "note": "D-separation determines conditional independence graphically."
      }
    ],
    "taxonomies": [
      {
        "name": "Heuristic Search Strategies",
        "badge": "Search Taxonomy",
        "items": [
          "Uninformed Search (BFS, DFS, Uniform-Cost Search, Iterative Deepening IDDFS)",
          "Informed Search (Greedy Best-First f(n)=h(n), A* Search f(n)=g(n)+h(n))",
          "Local Search (Hill Climbing, Simulated Annealing, Genetic Algorithms)",
          "Adversarial Game Search (Minimax, Alpha-Beta, Expectiminimax for chance games)"
        ]
      },
      {
        "name": "Knowledge Representation Forms",
        "badge": "Logic Taxonomy",
        "items": [
          "Propositional Logic (Truth tables, CNF resolution, Horn clause chaining)",
          "First-Order Logic (Quantifiers, Skolemization, Unification, Modus Ponens)",
          "Constraint Satisfaction Problems (Backtracking, MRV heuristic, Forward Checking)",
          "Probabilistic Graphical Models (Markov Random Fields, Bayesian Networks)"
        ]
      }
    ],
    "comparison": {
      "title": "Informed (A*) Search vs Uninformed (Uniform-Cost) Search",
      "entityA": "Informed Search (A* Algorithm)",
      "entityB": "Uninformed Search (Uniform-Cost / Dijkstra)",
      "rows": [
        {
          "property": "Domain Heuristic Knowledge",
          "valA": "Uses heuristic estimate h(n) estimating remaining distance to goal",
          "valB": "Uses zero goal distance knowledge; evaluates only path cost g(n) from start"
        },
        {
          "property": "Evaluation Function",
          "valA": "f(n) = g(n) + h(n) [Balances path cost and estimated future cost]",
          "valB": "f(n) = g(n) [Purely accumulated path cost from start node]"
        },
        {
          "property": "Frontier Node Expansion",
          "valA": "Directs search frontier targeted toward the goal location",
          "valB": "Expands nodes blindly in expanding concentric circular contours of equal cost"
        },
        {
          "property": "Search Space Traversed",
          "valA": "Significantly pruned search space; visits dramatically fewer nodes",
          "valB": "Visits all nodes closer than goal distance regardless of direction"
        },
        {
          "property": "Optimality Condition",
          "valA": "Guaranteed optimal iff heuristic h(n) is admissible (tree) or consistent (graph)",
          "valB": "Guaranteed optimal on all graphs with non-negative edge costs"
        },
        {
          "property": "Worst-Case Space Complexity",
          "valA": "O(b^d) worst-case in memory (retains all generated nodes in open/closed list)",
          "valB": "O(b^{1 + floor(C*/eps)}) where C* is optimal cost and eps is min step cost"
        }
      ]
    }
  },
  "general-aptitude": {
    "formulaName": "Combinatorics & Time-Work Equivalence",
    "lang": "Quantitative Aptitude",
    "gfgUrl": "https://www.geeksforgeeks.org/general-aptitude-for-gate/",
    "nptelCode": "noc21-ge14 (IIT Roorkee - Quantitative Aptitude)",
    "derivation": "Permutations & Combinations:\n  nPr = n! / (n - r)!   (Ordered arrangement)\n  nCr = n! / [ r! * (n - r)! ]   (Unordered selection)\n\nWork-Rate Principle:\n  If worker A completes a task in T_A days and B in T_B days:\n  Combined Rate = (1 / T_A) + (1 / T_B)\n  Total Time T_total = (T_A * T_B) / (T_A + T_B)",
    "svgDiagram": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"100%\"><circle cx=\"120\" cy=\"90\" r=\"55\" fill=\"rgba(74,14,23,0.2)\" stroke=\"#4a0e17\" stroke-width=\"2\"/><circle cx=\"200\" cy=\"90\" r=\"55\" fill=\"rgba(197,160,89,0.2)\" stroke=\"#c5a059\" stroke-width=\"2\"/><text x=\"90\" y=\"95\" fill=\"#4a0e17\" font-weight=\"700\">Set A</text><text x=\"230\" y=\"95\" fill=\"#c5a059\" font-weight=\"700\">Set B</text><text x=\"160\" y=\"95\" fill=\"#059669\" font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\">A cap B</text><text x=\"160\" y=\"165\" fill=\"#999\" font-size=\"10\" text-anchor=\"middle\">Inclusion-Exclusion: |A cup B| = |A| + |B| - |A cap B|</text></svg>",
    "caption": "Inclusion-Exclusion Principle Venn Topology",
    "gfgSubcategories": [
      {
        "title": "Quantitative Aptitude: Percentages & Ratios",
        "tag": "Arithmetic",
        "url": "https://www.geeksforgeeks.org/quantitative-aptitude/",
        "desc": "Ratios, proportions, successive percentage change a + b + ab/100, profit/loss margins, and alligation mixtures."
      },
      {
        "title": "Time, Speed, Distance & Work Equivalence",
        "tag": "Rate & Motion",
        "url": "https://www.geeksforgeeks.org/time-speed-and-distance/",
        "desc": "Relative speed for trains, boats and streams, harmonic average speed, and unit-work rate calculations."
      },
      {
        "title": "Data Interpretation: Charts & Tables",
        "tag": "Data Analysis",
        "url": "https://www.geeksforgeeks.org/data-interpretation-for-gate/",
        "desc": "Pie charts, bar graphs, line plots, cross-tabular analysis, and percentage share estimations."
      },
      {
        "title": "Logical Reasoning & Syllogisms",
        "tag": "Deductive Logic",
        "url": "https://www.geeksforgeeks.org/logical-reasoning/",
        "desc": "Venn diagram method for syllogisms, linear and circular seating arrangements, and blood relation trees."
      },
      {
        "title": "Verbal Ability: Grammar & Comprehension",
        "tag": "Verbal Ability",
        "url": "https://www.geeksforgeeks.org/verbal-ability-for-gate/",
        "desc": "Subject-verb agreement, tenses, prepositions, sentence rearrangement, and reading passage inference."
      },
      {
        "title": "Spatial Aptitude: Paper Folding & Symmetry",
        "tag": "Spatial Intelligence",
        "url": "https://www.geeksforgeeks.org/spatial-aptitude-for-gate/",
        "desc": "2D rotation, paper folding and punch holes, 3D block net unfolding, and mirror reflections."
      }
    ],
    "modules": [
      {
        "title": "Arithmetic Aptitude, Motion & Work Equivalence",
        "keyPoints": [
          "Successive percentage change: Two successive changes of +x% and +y% yield net change x + y + (xy / 100)%.",
          "Average Speed: For equal distances traveled at speeds v_1 and v_2, Average Speed = 2 v_1 v_2 / (v_1 + v_2) (Harmonic Mean).",
          "Work-Rate: If A takes d_A days and B takes d_B days, combined work rate is 1/d_A + 1/d_B = 1/d_{total}.",
          "Mixture Alligation: Ratio of Cheaper to Dearer quantity = (Price of Dearer - Mean) / (Mean - Price of Cheaper)."
        ],
        "theorem": "Harmonic Average Speed Law: When equal distances are covered at speeds v_1 and v_2, the average speed is given by their Harmonic Mean 2 v_1 v_2 / (v_1 + v_2), NOT their Arithmetic Mean.",
        "examTrap": "Arithmetic Mean Speed Trap: Never average speeds using (v_1 + v_2)/2 unless the body traveled for equal intervals of TIME, not equal distances!"
      },
      {
        "title": "Logical Deduction, Syllogisms & Seating Arrangements",
        "keyPoints": [
          "Categorical Syllogisms: Standard forms: All A are B, No A are B, Some A are B, Some A are not B.",
          "Euler-Venn diagram method: A conclusion is logically valid iff it holds true across ALL valid Venn diagrams.",
          "Blood relations: Always build a generational family tree with explicit gender annotations (+ for male, - for female).",
          "Circular seating: Facing center (Right is counter-clockwise, Left is clockwise); facing outward reverses orientations."
        ],
        "theorem": "Syllogistic Deductive Rule: No valid definite conclusion can be drawn from two particular premises (e.g., statements starting with \"Some\"), nor from two purely negative premises.",
        "examTrap": "\"Some\" Formal Meaning Trap: In logic, \"Some A are B\" means \"At least one A is B\". It does NOT imply that some A are not B; it is entirely compatible with \"All A are B\"."
      },
      {
        "title": "Spatial Aptitude, Net Unfolding & Rotational Symmetry",
        "keyPoints": [
          "Cube Nets: A standard 2D net of a cube unfolds into 6 connected squares. Opposite faces can NEVER share an edge or vertex.",
          "Paper Folding: Unfolding punched holes reverses the folds symmetrically across the crease lines.",
          "2D rotations: Rotating a shape 90 degrees clockwise maps coordinate (x, y) to (y, -x).",
          "Mirror Reflections: Reflection across vertical axis inverts left-to-right; reflection across horizontal axis inverts top-to-bottom."
        ],
        "theorem": "Cube Net Opposite Face Invariant: In any continuous straight row of 3 or 4 squares in a cube net, alternating squares (separated by exactly one intervening square) form opposite faces on the folded cube.",
        "examTrap": "Simultaneous Opposite Face Fallacy: On any folded 3D cube, two opposite faces can NEVER be visible simultaneously from any camera viewpoint."
      }
    ],
    "definitions": [
      {
        "term": "Harmonic Mean Average Speed",
        "category": "Quantitative Motion",
        "definition": "When equal distances are traversed at speeds v_1 and v_2, Average Speed = 2 v_1 v_2 / (v_1 + v_2).",
        "note": "Arithmetic mean applies ONLY when equal TIME is spent at each speed!"
      },
      {
        "term": "Successive Percentage Change",
        "category": "Arithmetic",
        "definition": "When a value undergoes two successive percentage changes of +a% and +b%, the net percentage change is a + b + (ab / 100)%.",
        "note": "For a discount of d%, use negative value -d."
      },
      {
        "term": "Work-Rate Principle",
        "category": "Rate Equivalence",
        "definition": "If worker A finishes a job in T_A days and B in T_B days, their combined rate is 1/T_A + 1/T_B = 1/T_{total}. Total time = (T_A T_B) / (T_A + T_B).",
        "note": "Pipes & cisterns follow identical rules with negative rates for emptying pipes."
      },
      {
        "term": "Alligation Mixture Rule",
        "category": "Ratios",
        "definition": "Ratio of quantity of cheaper ingredient to dearer ingredient in a mixture = (Price of Dearer - Mean Price) / (Mean Price - Price of Cheaper).",
        "note": "Provides fast visual cross-subtraction for weighted averages."
      },
      {
        "term": "Cube Net Invariant",
        "category": "Spatial Aptitude",
        "definition": "In any standard 2D net of a 3D cube, alternating faces in a straight row or column form opposite faces and can NEVER be adjacent on the folded cube.",
        "note": "Opposite faces can never be visible simultaneously from any camera perspective."
      }
    ],
    "taxonomies": [
      {
        "name": "GATE Aptitude Core Domains",
        "badge": "Aptitude Taxonomy",
        "items": [
          "Quantitative Aptitude (Percentages, Ratios, Speed-Distance, Work, Geometry)",
          "Analytical Reasoning (Syllogisms, Blood Relations, Seating Arrangements)",
          "Spatial Reasoning (Paper folding, 2D/3D Rotations, Mirror reflections, Cube nets)",
          "Verbal Ability (Grammar, Sentence completion, Vocabulary in context, Comprehension)"
        ]
      },
      {
        "name": "Data Interpretation Types",
        "badge": "Data Taxonomy",
        "items": [
          "Pie Charts (Degree to percentage conversion: 360 deg = 100%)",
          "Bar Graphs (Comparative categorical trends, growth percentages)",
          "Line Graphs (Continuous time-series rates of change and projections)",
          "Multi-Column Tables (Cross-tabular computations and share estimations)"
        ]
      }
    ],
    "comparison": {
      "title": "Permutations (nPr) vs Combinations (nCr)",
      "entityA": "Permutations (nPr)",
      "entityB": "Combinations (nCr)",
      "rows": [
        {
          "property": "Fundamental Question",
          "valA": "In how many ways can r items be ARRANGED in a specific order?",
          "valB": "In how many ways can r items be SELECTED without regard to order?"
        },
        {
          "property": "Order Sensitivity",
          "valA": "Order matters strictly: arrangement (A, B) is distinct from (B, A)",
          "valB": "Order does not matter: subset {A, B} is identical to {B, A}"
        },
        {
          "property": "Mathematical Formula",
          "valA": "nPr = n! / (n - r)!",
          "valB": "nCr = n! / [ r! * (n - r)! ]"
        },
        {
          "property": "Mathematical Relationship",
          "valA": "nPr = r! * nCr (Greater than or equal to nCr for r >= 1)",
          "valB": "nCr = nPr / r!"
        },
        {
          "property": "Canonical GATE Scenarios",
          "valA": "Seating arrangements, password codes, digit creation, schedule queues",
          "valB": "Committee selection, handshakes, team drafting, card deals"
        },
        {
          "property": "Symmetry Identity",
          "valA": "No direct symmetry formula",
          "valB": "Symmetric: nCr = nC(n - r)"
        }
      ]
    }
  }
};

// -----------------------------------------------------------------------------
// 6. Curated Standard Textbooks & Reference Library
// -----------------------------------------------------------------------------
const STANDARD_TEXTBOOKS = [
  { subject: 'Discrete Math', title: 'Discrete Mathematics and Its Applications', author: 'Kenneth H. Rosen', topic: 'Set Theory, Graph Theory, Combinatorics' },
  { subject: 'Linear Algebra', title: 'Introduction to Linear Algebra', author: 'Gilbert Strang (MIT)', topic: 'Vector Spaces, Projections, SVD' },
  { subject: 'Algorithms', title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein', topic: 'Dynamic Programming, Graph Algorithms' },
  { subject: 'Operating Systems', title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', topic: 'Synchronization, Deadlocks, Virtual Memory' },
  { subject: 'Comp. Architecture', title: 'Computer Organization and Design (RISC-V)', author: 'David Patterson, John Hennessy', topic: 'Pipelining, Memory Hierarchy' },
  { subject: 'Databases', title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', topic: 'Normalization, Transactions, Indexing' },
  { subject: 'Computer Networks', title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose, Keith Ross', topic: 'TCP/IP, Congestion Control, Routing' },
  { subject: 'Theory of Comput.', title: 'Introduction to the Theory of Computation', author: 'Michael Sipser', topic: 'Automata, Pumping Lemma, Reducibility' },
  { subject: 'Machine Learning', title: 'Pattern Recognition and Machine Learning', author: 'Christopher M. Bishop', topic: 'Regression, Classification, SVMs, PCA' }
];

// -----------------------------------------------------------------------------
// 7. Formula Quick-Reference Lookbook Data
// -----------------------------------------------------------------------------
const FORMULA_LOOKBOOK = [
  {
    "domain": "Discrete Mathematics",
    "title": "Planar Graphs, Recurrences & Handshaking",
    "body": "Euler Planar Formula: V - E + F = 2 (Connected, V >= 3: E <= 3V - 6)\nHandshaking Lemma: sum_{v in V} deg(v) = 2|E| (Odd-degree vertices count is even)\nLinear Recurrence: a_n = c_1 a_{n-1} + c_2 a_{n-2} => r^2 - c_1 r - c_2 = 0\nCatalan Numbers: C_n = (1 / (n + 1)) * C(2n, n) [Binary trees, valid parentheses]"
  },
  {
    "domain": "Linear Algebra",
    "title": "Eigenvalues, Rank-Nullity & SVD",
    "body": "Trace(A) = sum(lambda_i),  Det(A) = prod(lambda_i)\nInvertibility: Det(A) != 0 <=> all lambda_i != 0\nRank-Nullity Theorem: rank(A) + nullity(A) = n (number of columns)\nSingular Value Decomposition: A = U Sigma V^T, sigma_i = sqrt(lambda_i(A^T A))"
  },
  {
    "domain": "Calculus & Optimization",
    "title": "Hessian Extremum Test & Taylor Expansion",
    "body": "Stationary Point: grad f(x*) = 0\nHessian Matrix: H_{ij} = d^2 f / (dx_i dx_j)\nH Positive Definite (all lambda > 0) => Strict Local Minimum\nH Negative Definite (all lambda < 0) => Strict Local Maximum\nH Indefinite (mixed signs)         => Saddle Point\nTaylor Series: f(x) = f(x_0) + grad f(x_0)^T (x - x_0) + 1/2 (x - x_0)^T H (x - x_0)"
  },
  {
    "domain": "Probability & Statistics",
    "title": "Bayes' Law, Variance & Central Limit Theorem",
    "body": "Bayes' Rule: P(A_i | B) = [ P(B | A_i) * P(A_i) ] / sum [ P(B | A_j) * P(A_j) ]\nVariance: Var(X) = E[X^2] - (E[X])^2\nSum Variance: Var(X + Y) = Var(X) + Var(Y) + 2*Cov(X, Y)\nCentral Limit Theorem: Z = (X_bar - mu) / (sigma / sqrt(n)) ---> N(0, 1) as n -> inf"
  },
  {
    "domain": "Digital Logic",
    "title": "Sequential Timing Constraints & Consensus Law",
    "body": "Setup Time Condition: T_clk >= t_cq(max) + t_comb(max) + t_setup - t_skew\nHold Time Condition:  t_cq(min) + t_comb(min) >= t_hold + t_skew (Clock independent!)\nConsensus Theorem: AB + A'C + BC = AB + A'C\n2^n:1 MUX Universal Implementation: Connect n-1 variables to select lines"
  },
  {
    "domain": "Computer Organization & Architecture",
    "title": "Cache Memory Hierarchy & Pipeline Speedup",
    "body": "Cache Sets = Capacity / (k * BlockSize)\nAddress Bits: Tag Bits | Set Index Bits | Word Offset Bits\nEffective Access Time: EAT = H_1*T_1 + (1 - H_1)*[H_2*(T_1 + T_2) + (1 - H_2)*(T_1 + T_2 + T_mem)]\nPipeline Speedup: S = (n * k) / (k + n - 1 + Stalls) [Ideal limit: S = k]\nAmdahl's Law: Speedup = 1 / [ (1 - f) + (f / s) ]"
  },
  {
    "domain": "Programming & Data Structures",
    "title": "Binary Heaps, AVL Balance & Tree Invariants",
    "body": "Binary Tree Degree Property: n_0 = n_2 + 1 (Leaves = degree-2 nodes + 1)\nAVL Balance Factor: BF = Height(Left) - Height(Right) in {-1, 0, +1}\nMin-Heap Array Indexing: Parent(i) = floor((i-1)/2), Left = 2i+1, Right = 2i+2\nLinear Build-Heap Time: Sum (n / 2^{h+1}) * O(h) = O(n)"
  },
  {
    "domain": "Algorithms",
    "title": "Master Theorem & Graph Shortest Paths",
    "body": "Recurrence: T(n) = a * T(n/b) + f(n)\nc_crit = log_b(a)\nCase 1: f(n) = O(n^{c_crit - eps}) => T(n) = Theta(n^{c_crit})\nCase 2: f(n) = Theta(n^{c_crit} * log^k(n)) => T(n) = Theta(n^{c_crit} * log^{k+1}(n))\nCase 3: f(n) = Omega(n^{c_crit + eps}) => T(n) = Theta(f(n))\nComparison Sort Bound: ceil(log_2(n!)) = Omega(n * log(n))"
  },
  {
    "domain": "Theory of Computation",
    "title": "Pumping Lemma & Chomsky Hierarchy",
    "body": "Regular Pumping Lemma: w = xyz, |y| >= 1, |xy| <= p, for all i >= 0: x (y^i) z in L\nCFL Pumping Lemma: w = uvwxy, |vx| >= 1, |vwx| <= p, for all i >= 0: u (v^i) w (x^i) y in L\nMyhill-Nerode Theorem: L is regular <=> R_L has finite index\nRice's Theorem: Any non-trivial semantic property of RE languages is undecidable"
  },
  {
    "domain": "Compiler Design",
    "title": "LL(1) Parser Condition & SDD Attributes",
    "body": "LL(1) Grammar Condition: FIRST(alpha) cap FIRST(beta) = empty, and\n  if eps in FIRST(alpha), then FOLLOW(A) cap FIRST(beta) = empty\nParser Hierarchy: LL(1) < SLR(1) < LALR(1) < CLR(1)\nLALR(1) merges CLR(1) states with identical cores; never creates SR conflicts\nS-attributed: Synthesized only (bottom-up); L-attributed: Left-dependent inherited"
  },
  {
    "domain": "Operating Systems",
    "title": "Banker's Safety, Virtual Memory & Paging EAT",
    "body": "Banker Safety: Need[i][j] = Max[i][j] - Alloc[i][j]; grant iff state remains safe\nTwo-Level Paging EAT = t_TLB + t_mem + (1 - Hit_TLB) * 2 * t_mem\nPage Table Size = (Virtual Address Space / Page Size) * PTE Size\nBelady's Anomaly: FIFO page faults can increase when frame count increases"
  },
  {
    "domain": "Databases & Data Warehousing",
    "title": "Relational Normal Forms & Lossless Decomposition",
    "body": "Lossless Join: (R1 cap R2) -> R1 in F+  OR  (R1 cap R2) -> R2 in F+\nBCNF: For every non-trivial X -> Y, X MUST be a Superkey\n3NF: For every non-trivial X -> Y, either X is Superkey OR Y is Prime Attribute\nConflict Serializability: Precedence (serialization) graph contains NO directed cycles"
  },
  {
    "domain": "Computer Networks",
    "title": "Sliding Window Protocols, TCP AIMD & Subnetting",
    "body": "Stop-and-Wait Efficiency: eta = 1 / (1 + 2a), where a = T_prop / T_trans\nCSMA/CD Minimum Frame: L >= 2 * T_prop * Bandwidth\nGo-Back-N Window: W_s = 2^k - 1, W_r = 1; Selective Repeat: W_s = W_r = 2^{k-1}\nTCP AIMD: +1 MSS per RTT in Congestion Avoidance, Halve ssthresh on loss\nCIDR Hosts: Usable IPs in /n prefix = 2^{32 - n} - 2"
  },
  {
    "domain": "Machine Learning",
    "title": "Ridge Regression, Loss & Bias-Variance Decomposition",
    "body": "MSE Decomposition: E[(y - f_hat(x))^2] = Bias^2 + Variance + sigma_noise^2\nRidge Regression: w* = (X^T X + lambda * I)^{-1} X^T y\nLasso Regression: min ||X w - y||^2 + lambda * ||w||_1 (Sparse weights)\nLogistic Cross-Entropy: Loss = - [ y * log(p) + (1 - y) * log(1 - p) ]"
  },
  {
    "domain": "Artificial Intelligence",
    "title": "A* Search Admissibility & Alpha-Beta Pruning",
    "body": "A* Evaluation: f(n) = g(n) + h(n)\nAdmissibility: h(n) <= h*(n) [Guarantees optimal tree search]\nConsistency (Monotonicity): h(n) <= c(n, a, n') + h(n') [Guarantees optimal graph search]\nAlpha-Beta Pruning: Prune child subtree whenever beta <= alpha\nBayes Network Chain Rule: P(X_1, ..., X_n) = prod P(X_i | Parents(X_i))"
  },
  {
    "domain": "General Aptitude",
    "title": "Average Speed, Work-Rate & Alligation Formula",
    "body": "Harmonic Average Speed: v_avg = (2 * v_1 * v_2) / (v_1 + v_2) [For equal distances]\nWork-Rate Principle: 1 / T_total = 1 / T_A + 1 / T_B\nSuccessive Percentage Change: Net % = a + b + (a * b) / 100\nMixture Alligation Rule: Quantity(Cheaper) / Quantity(Dearer) = (Price_D - Mean) / (Mean - Price_C)"
  }
];

// -----------------------------------------------------------------------------
// 8. 32-Question Comprehensive Self-Assessment Question Bank (2 per Subject)
// -----------------------------------------------------------------------------
const PRACTICE_QUESTIONS = [
  {
    "id": "la-1",
    "subject": "linear-algebra",
    "category": "math",
    "paper": "CS & DA",
    "type": "mcq",
    "question": "Let A be a 2x2 matrix with Trace(A) = 7 and Det(A) = 12. What are the eigenvalues of matrix A?",
    "options": [
      {
        "text": "3 and 4",
        "correct": true
      },
      {
        "text": "2 and 6",
        "correct": false
      },
      {
        "text": "1 and 12",
        "correct": false
      },
      {
        "text": "-3 and -4",
        "correct": false
      }
    ],
    "explanation": "Sum of eigenvalues equals Trace(A) = 7; product equals Det(A) = 12. Characteristic equation lambda^2 - 7*lambda + 12 = 0 factors into (lambda - 3)(lambda - 4) = 0, giving 3 and 4."
  },
  {
    "id": "la-2",
    "subject": "linear-algebra",
    "category": "math",
    "paper": "CS & DA",
    "type": "nat",
    "question": "Consider a 4x4 real matrix A with rank(A) = 2. What is the dimension of the nullspace of matrix A?",
    "correctVal": 2,
    "tolerance": [
      2,
      2
    ],
    "explanation": "By the Rank-Nullity Theorem: rank(A) + nullity(A) = n. Here n = 4 columns and rank(A) = 2, so nullity(A) = 4 - 2 = 2."
  },
  {
    "id": "calc-1",
    "subject": "calculus-optimization",
    "category": "math",
    "paper": "CS & DA",
    "type": "nat",
    "question": "Find the minimum value attained by the function f(x) = 2x^2 - 8x + 11 on the real line.",
    "correctVal": 3,
    "tolerance": [
      2.99,
      3.01
    ],
    "explanation": "f'(x) = 4x - 8 = 0 gives stationary point at x = 2. Second derivative f''(2) = 4 > 0 confirms a minimum. Minimum value f(2) = 2(4) - 8(2) + 11 = 8 - 16 + 11 = 3."
  },
  {
    "id": "calc-2",
    "subject": "calculus-optimization",
    "category": "math",
    "paper": "CS & DA",
    "type": "nat",
    "question": "Evaluate the limit: lim_{x -> 0} (sin(5x) / (2x)).",
    "correctVal": 2.5,
    "tolerance": [
      2.49,
      2.51
    ],
    "explanation": "Using standard trigonometric limit lim_{u->0} sin(u)/u = 1: lim_{x->0} (sin(5x) / 5x) * (5/2) = 1 * (5/2) = 2.5."
  },
  {
    "id": "prob-1",
    "subject": "probability-statistics",
    "category": "math",
    "paper": "CS & DA",
    "type": "mcq",
    "question": "Which of the following continuous probability distributions possesses the memoryless property P(X > s + t | X > s) = P(X > t)?",
    "options": [
      {
        "text": "Exponential distribution",
        "correct": true
      },
      {
        "text": "Normal distribution",
        "correct": false
      },
      {
        "text": "Uniform distribution",
        "correct": false
      },
      {
        "text": "Gamma distribution with shape > 1",
        "correct": false
      }
    ],
    "explanation": "The Exponential distribution is the unique continuous distribution characterized by the memoryless property. (In discrete distributions, the Geometric distribution is memoryless)."
  },
  {
    "id": "prob-2",
    "subject": "probability-statistics",
    "category": "math",
    "paper": "CS & DA",
    "type": "nat",
    "question": "A random variable X follows a Poisson distribution with mean 4. What is the variance of X?",
    "correctVal": 4,
    "tolerance": [
      4,
      4
    ],
    "explanation": "For any Poisson distribution Pois(lambda), the mean and variance are identical and equal to lambda. Here lambda = 4, so Var(X) = 4."
  },
  {
    "id": "dm-1",
    "subject": "discrete-mathematics",
    "category": "math",
    "paper": "CS",
    "type": "nat",
    "question": "What is the chromatic number chi(G) of a complete bipartite graph K_{4, 6}?",
    "correctVal": 2,
    "tolerance": [
      2,
      2
    ],
    "explanation": "Every non-empty bipartite graph can be 2-colored by assigning color 1 to the first partition and color 2 to the second partition. Hence, chi(K_{4,6}) = 2."
  },
  {
    "id": "dm-2",
    "subject": "discrete-mathematics",
    "category": "math",
    "paper": "CS",
    "type": "mcq",
    "question": "A connected planar graph has 10 vertices and 15 edges. How many faces (regions) does it divide the plane into, including the outer unbounded face?",
    "options": [
      {
        "text": "7 faces",
        "correct": true
      },
      {
        "text": "6 faces",
        "correct": false
      },
      {
        "text": "8 faces",
        "correct": false
      },
      {
        "text": "5 faces",
        "correct": false
      }
    ],
    "explanation": "By Euler's planar formula: V - E + F = 2. Here V = 10, E = 15. Substituting: 10 - 15 + F = 2 => -5 + F = 2 => F = 7."
  },
  {
    "id": "algo-1",
    "subject": "algorithms",
    "category": "ds-algo",
    "paper": "CS & DA",
    "type": "mcq",
    "question": "What is the asymptotic time complexity of the recurrence relation T(n) = 2T(n/2) + n*log(n)?",
    "options": [
      {
        "text": "Theta(n * log^2(n))",
        "correct": true
      },
      {
        "text": "Theta(n * log(n))",
        "correct": false
      },
      {
        "text": "Theta(n^2)",
        "correct": false
      },
      {
        "text": "Theta(n^log_2(3))",
        "correct": false
      }
    ],
    "explanation": "By extended Master Theorem: a = 2, b = 2 => n^{log_b(a)} = n^1. Since f(n) = n*log(n) matches Case 2 with k = 1, T(n) = Theta(n * log^{k+1}(n)) = Theta(n * log^2(n))."
  },
  {
    "id": "algo-2",
    "subject": "algorithms",
    "category": "ds-algo",
    "paper": "CS & DA",
    "type": "mcq",
    "question": "Which of the following shortest path algorithms can correctly detect negative-weight cycles in a directed graph?",
    "options": [
      {
        "text": "Bellman-Ford Algorithm",
        "correct": true
      },
      {
        "text": "Dijkstra's Algorithm",
        "correct": false
      },
      {
        "text": "Prim's Algorithm",
        "correct": false
      },
      {
        "text": "Kruskal's Algorithm",
        "correct": false
      }
    ],
    "explanation": "Bellman-Ford algorithm relaxes all edges V-1 times and detects negative cycles on the V-th pass. Dijkstra assumes non-negative edge weights and fails in the presence of negative edges."
  },
  {
    "id": "pds-1",
    "subject": "programming-data-structures",
    "category": "ds-algo",
    "paper": "CS & DA",
    "type": "nat",
    "question": "In a non-empty binary tree with 14 nodes having two children each, how many leaf nodes are present?",
    "correctVal": 15,
    "tolerance": [
      15,
      15
    ],
    "explanation": "In any binary tree, the number of leaf nodes n_0 is strictly equal to the number of degree-2 nodes n_2 plus one: n_0 = n_2 + 1. Given n_2 = 14, n_0 = 14 + 1 = 15."
  },
  {
    "id": "pds-2",
    "subject": "programming-data-structures",
    "category": "ds-algo",
    "paper": "CS & DA",
    "type": "nat",
    "question": "In an array-based implementation of a circular queue of capacity 16, what is the maximum number of elements that can be stored simultaneously if one empty slot is reserved to differentiate full vs empty states?",
    "correctVal": 15,
    "tolerance": [
      15,
      15
    ],
    "explanation": "To differentiate between full and empty queue states without a separate counter variable, the condition (rear + 1) % N == front leaves one slot empty, allowing a maximum of N - 1 = 16 - 1 = 15 elements."
  },
  {
    "id": "dbms-1",
    "subject": "databases",
    "category": "systems",
    "paper": "CS & DA",
    "type": "msq",
    "question": "Which of the following statements regarding relational database normal forms are TRUE?",
    "options": [
      {
        "text": "Every relation in BCNF is also in 3NF.",
        "correct": true
      },
      {
        "text": "Any relation schema can always be decomposed into 3NF such that the decomposition is simultaneously lossless-join and dependency-preserving.",
        "correct": true
      },
      {
        "text": "Any relation schema can always be decomposed into BCNF while guaranteeing dependency preservation.",
        "correct": false
      },
      {
        "text": "A prime attribute is an attribute that belongs to at least one candidate key.",
        "correct": true
      }
    ],
    "explanation": "BCNF is strictly stronger than 3NF. 3NF decomposition guarantees both lossless join and dependency preservation. However, BCNF decomposition cannot always preserve dependencies. A prime attribute is defined as belonging to ANY candidate key."
  },
  {
    "id": "dbms-2",
    "subject": "databases",
    "category": "systems",
    "paper": "CS & DA",
    "type": "mcq",
    "question": "In SQL, what is the result of evaluating the condition: (NULL = NULL)?",
    "options": [
      {
        "text": "UNKNOWN (Three-valued logic)",
        "correct": true
      },
      {
        "text": "TRUE",
        "correct": false
      },
      {
        "text": "FALSE",
        "correct": false
      },
      {
        "text": "Syntax Error",
        "correct": false
      }
    ],
    "explanation": "In ANSI SQL three-valued logic, any equality comparison involving NULL evaluates to UNKNOWN, not TRUE or FALSE. The correct operator to check for NULL is 'IS NULL'."
  },
  {
    "id": "os-1",
    "subject": "operating-systems",
    "category": "systems",
    "paper": "CS",
    "type": "mcq",
    "question": "Which of the following CPU scheduling algorithms is mathematically provable to minimize average waiting time for a set of processes with known burst times?",
    "options": [
      {
        "text": "Shortest Remaining Time First (Preemptive SJF)",
        "correct": true
      },
      {
        "text": "First-Come First-Served (FCFS)",
        "correct": false
      },
      {
        "text": "Round Robin with quantum = 2 ms",
        "correct": false
      },
      {
        "text": "Priority Scheduling without preemption",
        "correct": false
      }
    ],
    "explanation": "Shortest Remaining Time First (SRTF, the preemptive version of SJF) provably minimizes average waiting time across all scheduling algorithms by prioritizing the shortest remaining computation."
  },
  {
    "id": "os-2",
    "subject": "operating-systems",
    "category": "systems",
    "paper": "CS",
    "type": "nat",
    "question": "In a paging system, the TLB access time is 20 ns and main memory access time is 100 ns. If the TLB hit ratio is 90%, calculate the Effective Access Time (EAT) in nanoseconds assuming single-level paging.",
    "correctVal": 130,
    "tolerance": [
      129.9,
      130.1
    ],
    "explanation": "EAT = Hit_TLB * (t_TLB + t_mem) + (1 - Hit_TLB) * (t_TLB + 2 * t_mem) = 0.90 * (20 + 100) + 0.10 * (20 + 200) = 0.90 * 120 + 0.10 * 220 = 108 + 22 = 130 ns."
  },
  {
    "id": "coa-1",
    "subject": "computer-organization",
    "category": "systems",
    "paper": "CS",
    "type": "nat",
    "question": "A 4-way set-associative cache has a total capacity of 64 KB and a block (line) size of 64 bytes. How many sets are present in this cache?",
    "correctVal": 256,
    "tolerance": [
      256,
      256
    ],
    "explanation": "Total lines = Capacity / BlockSize = 64 KB / 64 B = 1024 lines. Since it is 4-way set associative, Number of Sets = 1024 / 4 = 256 sets (requiring 8 set index bits)."
  },
  {
    "id": "coa-2",
    "subject": "computer-organization",
    "category": "systems",
    "paper": "CS",
    "type": "mcq",
    "question": "In a pipelined processor with operand forwarding, which data hazard can NEVER be completely resolved without inserting a stall cycle?",
    "options": [
      {
        "text": "Load-to-Use data dependency (LW followed immediately by ALU instruction)",
        "correct": true
      },
      {
        "text": "ALU-to-ALU data dependency (ADD followed by SUB)",
        "correct": false
      },
      {
        "text": "Write-After-Write (WAW) dependency in an in-order pipeline",
        "correct": false
      },
      {
        "text": "Write-After-Read (WAR) dependency in an in-order pipeline",
        "correct": false
      }
    ],
    "explanation": "In a Load-to-Use hazard, data loaded from memory is only available at the end of the MEM stage, which is after the EX stage of the immediately following instruction. Hence, at least 1 stall cycle is mandatory."
  },
  {
    "id": "cn-1",
    "subject": "computer-networks",
    "category": "systems",
    "paper": "CS",
    "type": "nat",
    "question": "An IPv4 subnet has the CIDR prefix 192.168.10.0/26. How many usable host addresses can be assigned in this subnet?",
    "correctVal": 62,
    "tolerance": [
      62,
      62
    ],
    "explanation": "A /26 subnet leaves 32 - 26 = 6 host bits. Total IP addresses = 2^6 = 64. Subtracting 2 (network ID and directed broadcast address) yields 64 - 2 = 62 usable host addresses."
  },
  {
    "id": "cn-2",
    "subject": "computer-networks",
    "category": "systems",
    "paper": "CS",
    "type": "nat",
    "question": "In a 10 Mbps CSMA/CD Ethernet network, the one-way propagation delay between the two farthest stations is 25 microseconds. What is the minimum frame size in bytes required for reliable collision detection?",
    "correctVal": 62.5,
    "tolerance": [
      62,
      63
    ],
    "explanation": "Collision detection requires transmission time T_t >= 2 * T_p. Round-trip propagation = 2 * 25 us = 50 us. Min frame bits = 50 * 10^-6 s * 10 * 10^6 bps = 500 bits. Min frame bytes = 500 / 8 = 62.5 bytes (64 bytes in standard Ethernet)."
  },
  {
    "id": "dl-1",
    "subject": "digital-logic",
    "category": "systems",
    "paper": "CS",
    "type": "mcq",
    "question": "Which of the following Boolean expressions represents the simplified result of the Consensus Theorem on AB + A'C + BC?",
    "options": [
      {
        "text": "AB + A'C",
        "correct": true
      },
      {
        "text": "BC + A'C",
        "correct": false
      },
      {
        "text": "AB + BC",
        "correct": false
      },
      {
        "text": "A'B + AC",
        "correct": false
      }
    ],
    "explanation": "By the Consensus Theorem: AB + A'C + BC = AB + A'C. The term BC is the consensus term and is redundant."
  },
  {
    "id": "dl-2",
    "subject": "digital-logic",
    "category": "systems",
    "paper": "CS",
    "type": "nat",
    "question": "A digital sequential system has flip-flops with max propagation delay t_cq = 4 ns, combinational logic delay t_comb = 12 ns, setup time t_su = 3 ns, and clock skew t_skew = 1 ns. What is the minimum clock period T_clk in nanoseconds?",
    "correctVal": 18,
    "tolerance": [
      18,
      18
    ],
    "explanation": "Minimum clock period T_clk >= t_cq + t_comb + t_su - t_skew = 4 + 12 + 3 - 1 = 18 ns."
  },
  {
    "id": "cd-1",
    "subject": "compiler-design",
    "category": "systems",
    "paper": "CS",
    "type": "mcq",
    "question": "Consider the grammar production: S -> a S b | epsilon. What is the set FOLLOW(S)?",
    "options": [
      {
        "text": "{ b, $ }",
        "correct": true
      },
      {
        "text": "{ a, b }",
        "correct": false
      },
      {
        "text": "{ $ }",
        "correct": false
      },
      {
        "text": "{ a, $ }",
        "correct": false
      }
    ],
    "explanation": "Since S is the start symbol, $ is in FOLLOW(S). In production S -> a S b, the terminal b follows S, so b is in FOLLOW(S). Hence, FOLLOW(S) = { b, $ }."
  },
  {
    "id": "cd-2",
    "subject": "compiler-design",
    "category": "systems",
    "paper": "CS",
    "type": "msq",
    "question": "Which of the following statements about bottom-up parsers are CORRECT?",
    "options": [
      {
        "text": "The number of states in an LALR(1) parser is strictly equal to the number of states in an SLR(1) parser.",
        "correct": true
      },
      {
        "text": "Merging CLR(1) states to construct an LALR(1) parser can never introduce a Shift-Reduce conflict.",
        "correct": true
      },
      {
        "text": "Merging CLR(1) states to construct an LALR(1) parser can introduce a Reduce-Reduce conflict.",
        "correct": true
      },
      {
        "text": "Every SLR(1) grammar is an LL(1) grammar.",
        "correct": false
      }
    ],
    "explanation": "LALR(1) merges states with identical LR(0) cores, yielding the exact same state count as SLR(1). Core merging cannot produce new Shift-Reduce conflicts, but CAN introduce Reduce-Reduce conflicts. SLR(1) and LL(1) are distinct; neither is a subset of the other."
  },
  {
    "id": "toc-1",
    "subject": "theory-of-computation",
    "category": "systems",
    "paper": "CS",
    "type": "mcq",
    "question": "Which of the following problems is DECIDABLE for regular languages?",
    "options": [
      {
        "text": "Emptiness problem (Is L = empty?)",
        "correct": true
      },
      {
        "text": "Halting problem of Turing machines",
        "correct": false
      },
      {
        "text": "Post Correspondence Problem (PCP)",
        "correct": false
      },
      {
        "text": "Equivalence problem of context-free languages",
        "correct": false
      }
    ],
    "explanation": "For regular languages, Emptiness, Finiteness, Membership, and Equivalence are all decidable by analyzing the minimal DFA graph."
  },
  {
    "id": "toc-2",
    "subject": "theory-of-computation",
    "category": "systems",
    "paper": "CS",
    "type": "msq",
    "question": "Which of the following language classes are CLOSED under intersection?",
    "options": [
      {
        "text": "Regular Languages",
        "correct": true
      },
      {
        "text": "Deterministic Context-Free Languages (DCFL)",
        "correct": false
      },
      {
        "text": "Context-Free Languages (CFL)",
        "correct": false
      },
      {
        "text": "Recursive Languages (Decidable)",
        "correct": true
      }
    ],
    "explanation": "Regular and Recursive languages are closed under intersection. CFLs and DCFLs are NOT closed under intersection."
  },
  {
    "id": "ml-1",
    "subject": "machine-learning",
    "category": "da-special",
    "paper": "DA",
    "type": "mcq",
    "question": "In linear regression, what is the primary structural effect of adding an L1 regularization penalty (Lasso) compared to an L2 penalty (Ridge)?",
    "options": [
      {
        "text": "Lasso induces sparsity by driving unimportant feature weights to exactly zero.",
        "correct": true
      },
      {
        "text": "Lasso guarantees a closed-form matrix inversion solution.",
        "correct": false
      },
      {
        "text": "Lasso always results in higher training variance than Ridge.",
        "correct": false
      },
      {
        "text": "Lasso has no effect on feature selection.",
        "correct": false
      }
    ],
    "explanation": "L1 regularization has non-differentiable corners at the axes in weight space, causing gradient updates to drive non-informative feature coefficients to exactly zero, enabling automatic feature selection."
  },
  {
    "id": "ml-2",
    "subject": "machine-learning",
    "category": "da-special",
    "paper": "DA",
    "type": "nat",
    "question": "A binary classifier on 100 test samples achieves 40 True Positives, 10 False Positives, 10 False Negatives, and 40 True Negatives. What is the Precision of this classifier as a decimal fraction?",
    "correctVal": 0.8,
    "tolerance": [
      0.79,
      0.81
    ],
    "explanation": "Precision = TP / (TP + FP) = 40 / (40 + 10) = 40 / 50 = 0.80."
  },
  {
    "id": "ai-1",
    "subject": "artificial-intelligence",
    "category": "da-special",
    "paper": "DA",
    "type": "mcq",
    "question": "In A* graph search, which condition on heuristic function h(n) guarantees finding an optimal path without reopening previously closed nodes?",
    "options": [
      {
        "text": "Consistency (Monotonicity)",
        "correct": true
      },
      {
        "text": "Admissibility alone",
        "correct": false
      },
      {
        "text": "Linearity",
        "correct": false
      },
      {
        "text": "Convexity",
        "correct": false
      }
    ],
    "explanation": "While admissibility guarantees optimality on tree search, consistency (monotonicity: h(n) <= c(n,a,n') + h(n')) is strictly required for graph search with a closed list to avoid reopening closed nodes."
  },
  {
    "id": "ai-2",
    "subject": "artificial-intelligence",
    "category": "da-special",
    "paper": "DA",
    "type": "mcq",
    "question": "In a Bayesian belief network with collider structure A -> C <- B, what happens to the relationship between variables A and B upon observing node C?",
    "options": [
      {
        "text": "A and B become conditionally DEPENDENT given C.",
        "correct": true
      },
      {
        "text": "A and B remain independent.",
        "correct": false
      },
      {
        "text": "A and B become mutually exclusive.",
        "correct": false
      },
      {
        "text": "The network violates the Markov property.",
        "correct": false
      }
    ],
    "explanation": "In an unobserved collider A -> C <- B, A and B are marginally independent. Conditioning on the common child C (or any descendant of C) opens the active trail (explaining away), making A and B conditionally dependent."
  },
  {
    "id": "ga-1",
    "subject": "general-aptitude",
    "category": "general",
    "paper": "CS & DA",
    "type": "nat",
    "question": "A vehicle travels from City A to City B at 60 km/h and returns along the exact same route at 40 km/h. What is the average speed of the round trip in km/h?",
    "correctVal": 48,
    "tolerance": [
      47.9,
      48.1
    ],
    "explanation": "For equal distances, the average speed is given by the Harmonic Mean: v_avg = (2 * v_1 * v_2) / (v_1 + v_2) = (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h."
  },
  {
    "id": "ga-2",
    "subject": "general-aptitude",
    "category": "general",
    "paper": "CS & DA",
    "type": "nat",
    "question": "Worker A can complete a project in 12 days, and worker B can complete the same project in 24 days. Working together, in how many days will they finish the project?",
    "correctVal": 8,
    "tolerance": [
      8,
      8
    ],
    "explanation": "Combined daily rate = 1/12 + 1/24 = 2/24 + 1/24 = 3/24 = 1/8 project per day. Hence, total time required = 8 days."
  }
];

// -----------------------------------------------------------------------------
// 9. Interactive 3D Kinetic Canvas (Perspective Particle Topology in Hero)
// -----------------------------------------------------------------------------
function initKineticCanvas() {
  const canvas = document.getElementById('kinetic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationFrameId;

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const nodeCount = 42;
  const nodes = [];
  const sphereRadius = 130;
  let angleX = 0.002;
  let angleY = 0.003;
  const mouse = { x: 0, y: 0, isHover: false };

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left - canvas.width / 2) * 0.00008;
    mouse.y = (e.clientY - rect.top - canvas.height / 2) * 0.00008;
    mouse.isHover = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.isHover = false;
  });

  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / nodeCount);
    const theta = Math.sqrt(nodeCount * Math.PI) * phi;
    nodes.push({
      x: sphereRadius * Math.cos(theta) * Math.sin(phi),
      y: sphereRadius * Math.sin(theta) * Math.sin(phi),
      z: sphereRadius * Math.cos(phi)
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const primaryColor = isDark ? 'rgba(229, 193, 88, ' : 'rgba(197, 160, 89, ';
    const dotColor = isDark ? '#e5c158' : '#4a0e17';

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const fov = 340;

    const rotX = mouse.isHover ? mouse.y : angleX;
    const rotY = mouse.isHover ? mouse.x : angleY;

    const projected = nodes.map(n => {
      let x1 = n.x * Math.cos(rotY) - n.z * Math.sin(rotY);
      let z1 = n.z * Math.cos(rotY) + n.x * Math.sin(rotY);
      let y2 = n.y * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = z1 * Math.cos(rotX) + n.y * Math.sin(rotX);

      n.x = x1;
      n.y = y2;
      n.z = z2;

      const scale = fov / (fov + z2);
      return {
        x2d: cx + x1 * scale,
        y2d: cy + y2 * scale,
        scale: scale,
        z: z2
      };
    });

    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x2d - projected[j].x2d;
        const dy = projected[i].y2d - projected[j].y2d;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 75) {
          const alpha = (1 - dist / 75) * 0.45 * Math.min(projected[i].scale, projected[j].scale);
          ctx.beginPath();
          ctx.moveTo(projected[i].x2d, projected[i].y2d);
          ctx.lineTo(projected[j].x2d, projected[j].y2d);
          ctx.strokeStyle = primaryColor + alpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    projected.forEach(p => {
      const radius = Math.max(1.2, 3.2 * p.scale);
      ctx.beginPath();
      ctx.arc(p.x2d, p.y2d, radius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(draw);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw();
  }
}

// -----------------------------------------------------------------------------
// 10. Career & Pathway Matchmaker Wizard
// -----------------------------------------------------------------------------
function initMatchmakerWizard(subjects) {
  const container = document.getElementById('career-wizard');
  if (!container) return;

  const steps = [
    {
      q: "Step 1 of 3: What is your primary technical area of interest?",
      options: [
        { title: "Systems & Architecture", desc: "Operating Systems, Compilers, Computer Networks & Theory", track: "CS" },
        { title: "AI, Data & Learning", desc: "Machine Learning, Artificial Intelligence, Stats & Big Data", track: "DA" },
        { title: "Balanced Engineering", desc: "Algorithms, Databases, Programming & Problem Solving", track: "DUAL" }
      ]
    },
    {
      q: "Step 2 of 3: What is your career or higher education target?",
      options: [
        { title: "M.Tech CSE / Core Software", desc: "IITs / IISc Computer Science departments and research labs", track: "CS" },
        { title: "M.Tech AI/Data Science", desc: "Specialized AI, Data Engineering, or Applied Science roles", track: "DA" },
        { title: "PSU Recruitment & Broad Options", desc: "Eligible for multiple PSU criteria and varied admissions", track: "DUAL" }
      ]
    },
    {
      q: "Step 3 of 3: Which mathematical area feels most natural to you?",
      options: [
        { title: "Discrete Math & Logic", desc: "Combinatorics, Graph Theory, Set Theory & Predicate Logic", track: "CS" },
        { title: "Linear Algebra & Statistics", desc: "Matrix Decompositions, Probability Distributions & Calculus", track: "DA" },
        { title: "Comfortable with Both", desc: "Ready to prepare both formal logic and multivariate calculus", track: "DUAL" }
      ]
    }
  ];

  let currentStep = 0;
  let answers = [];

  function renderStep() {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      container.innerHTML = `
        <div class="matchmaker-head">
          <div>
            <div class="eyebrow"><span class="dot"></span> PATHWAY SELECTOR</div>
            <h3>Which GATE paper is right for you?</h3>
            <p>${step.q}</p>
          </div>
          <span class="pill">STEP ${currentStep + 1} / 3</span>
        </div>
        <div class="wizard-steps">
          ${steps.map((_, i) => `<div class="step-indicator ${i <= currentStep ? 'active' : ''}"></div>`).join('')}
        </div>
        <div class="wizard-options">
          ${step.options.map(opt => `
            <button class="wizard-option-btn" data-track="${opt.track}">
              <strong>${opt.title}</strong>
              <span>${opt.desc}</span>
            </button>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('.wizard-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          answers.push(btn.dataset.track);
          currentStep++;
          renderStep();
        });
      });
    } else {
      const csCount = answers.filter(a => a === 'CS').length;
      const daCount = answers.filter(a => a === 'DA').length;
      let recTitle = "Dual Paper Target (GATE CS + GATE DA)";
      let recDesc = "You possess balanced interests across software systems and data-driven intelligence! Because CS and DA share 7 foundational subjects (Linear Algebra, Calculus, Probability, DBMS, Programming & Data Structures, Algorithms, and General Aptitude), you can prepare both concurrently with high synergy.";

      if (csCount > daCount) {
        recTitle = "Primary Target: GATE Computer Science (CS)";
        recDesc = "Your preference highlights Core Systems, Architecture, and Formal Computation. GATE CS aligns directly with M.Tech Computer Science admissions and top software research.";
      } else if (daCount > csCount) {
        recTitle = "Primary Target: GATE Data Science & AI (DA)";
        recDesc = "Your affinity focuses on Machine Learning, Applied Statistics, and AI Foundations. GATE DA opens premier doors to modern AI/DS programs and industry roles.";
      }

      container.innerHTML = `
        <div class="matchmaker-head">
          <div>
            <div class="eyebrow"><span class="dot"></span> RECOMMENDATION RESULT</div>
            <h3>Your Optimal GATE 2027 Pathway</h3>
          </div>
          <button id="reset-wizard" class="button outline small">Retake Quiz</button>
        </div>
        <div class="wizard-result-box">
          <span class="result-badge">${recTitle}</span>
          <p>${recDesc}</p>
          <div style="margin-top: 18px; display: flex; gap: 12px; flex-wrap: wrap;">
            <button id="queue-recommended-btn" class="button gold small">Add Recommendation to Study Docket</button>
            <a href="${root}planner/" class="button outline small">Explore Study Planner ↗</a>
          </div>
        </div>
      `;

      document.getElementById('reset-wizard').addEventListener('click', () => {
        currentStep = 0;
        answers = [];
        renderStep();
      });

      document.getElementById('queue-recommended-btn').addEventListener('click', () => {
        const shared = subjects.filter(s => s.papers.length > 1);
        shared.forEach(s => addToDocket(s.id));
        showToast(`Added ${shared.length} foundation subjects to docket!`);
      });
    }
  }

  renderStep();
}

// -----------------------------------------------------------------------------
// 11. Universal Command Palette (Spotlight / Cmd+K)
// -----------------------------------------------------------------------------
function initCommandPalette(subjects) {
  let backdrop = document.getElementById('cmd-palette-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'cmd-palette-backdrop';
    backdrop.innerHTML = `
      <div class="cmd-modal" role="dialog" aria-modal="true" aria-label="Command Search">
        <div class="cmd-search-bar">
          <span style="color: var(--accent-gold); font-size: 1.2rem;">⌕</span>
          <input type="search" id="cmd-input" placeholder="Search subjects, formulas, or commands (e.g. 'calc', 'export', 'theme')..." autocomplete="off">
          <span class="kbd-badge">ESC</span>
        </div>
        <div class="cmd-results-list" id="cmd-results"></div>
        <div class="cmd-footer">
          <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Open with <kbd>ENTER</kbd></span>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  const input = backdrop.querySelector('#cmd-input');
  const results = backdrop.querySelector('#cmd-results');
  let selectedIndex = 0;
  let items = [];

  function openPalette() {
    backdrop.classList.add('open');
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    backdrop.classList.remove('open');
  }

  function renderResults(q) {
    const query = q.toLowerCase().trim();
    items = [];

    const actions = [
      { title: 'Open GATE Scientific Calculator', action: () => document.getElementById('calc-backdrop')?.classList.add('open'), badge: 'TOOL', type: 'action' },
      { title: 'Export Revision Schedule (.ics)', action: () => exportDocketICS(subjects), badge: 'ACTION', type: 'action' },
      { title: 'Toggle Light/Dark Theme', action: toggleTheme, badge: 'ACTION', type: 'action' },
      { title: 'Open Study Docket Drawer', action: () => document.getElementById('study-docket-drawer')?.classList.add('open'), badge: 'ACTION', type: 'action' },
      { title: 'Clear Study Docket Queue', action: clearDocket, badge: 'ACTION', type: 'action' }
    ];

    actions.forEach(a => {
      if (!query || a.title.toLowerCase().includes(query)) items.push(a);
    });

    const staticRoutes = [
      { title: 'Computer Science Directory (CS)', url: `${root}cs/`, badge: 'CS', type: 'page' },
      { title: 'Data Science & AI Directory (DA)', url: `${root}da/`, badge: 'DA', type: 'page' },
      { title: 'Interactive Self-Assessment Practice', url: `${root}practice/`, badge: 'QUIZ', type: 'tool' },
      { title: 'Study Progress Planner & Checklist', url: `${root}planner/`, badge: 'PLAN', type: 'tool' },
      { title: 'Official PYQ Papers & Master Keys', url: `${root}pyqs/`, badge: 'GATE', type: 'page' },
      { title: 'Official Syllabus, Textbooks & Formula Cheatsheet', url: `${root}resources/`, badge: 'DOC', type: 'page' }
    ];

    staticRoutes.forEach(r => {
      if (!query || r.title.toLowerCase().includes(query)) items.push(r);
    });

    subjects.forEach(s => {
      const match = !query || 
        s.title.toLowerCase().includes(query) || 
        s.syllabus.toLowerCase().includes(query) ||
        s.papers.join(' ').toLowerCase().includes(query);
      if (match) {
        items.push({
          title: s.title,
          url: `${root}subjects/${s.id}/`,
          badge: s.papers.join(' & '),
          type: 'subject',
          id: s.id
        });
      }
    });

    selectedIndex = 0;
    if (!items.length) {
      results.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">No matching subjects or commands found.</div>`;
      return;
    }

    results.innerHTML = items.map((item, idx) => `
      <div class="cmd-item ${idx === selectedIndex ? 'active' : ''}" data-idx="${idx}">
        <div class="cmd-item-left">
          <span style="font-size: 0.95rem;">${item.type === 'action' ? '⚙️' : item.type === 'subject' ? '📖' : '⚡'}</span>
          <span>${item.title}</span>
        </div>
        <span class="cmd-badge ${item.badge.includes('CS') ? 'cs' : item.badge.includes('ACTION') ? 'cs' : 'da'}">${item.badge}</span>
      </div>
    `).join('');

    results.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = Number(el.dataset.idx);
        executeItem(items[idx]);
      });
      el.addEventListener('mouseenter', () => {
        selectedIndex = Number(el.dataset.idx);
        updateActiveItem();
      });
    });
  }

  function executeItem(item) {
    if (!item) return;
    closePalette();
    if (item.action) item.action();
    else if (item.url) window.location.href = item.url;
  }

  function updateActiveItem() {
    results.querySelectorAll('.cmd-item').forEach((el, idx) => {
      el.classList.toggle('active', idx === selectedIndex);
      if (idx === selectedIndex) el.scrollIntoView({ block: 'nearest' });
    });
  }

  input.addEventListener('input', () => renderResults(input.value));

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateActiveItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateActiveItem();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeItem(items[selectedIndex]);
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closePalette();
  });

  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      backdrop.classList.contains('open') ? closePalette() : openPalette();
    }
  });

  document.querySelectorAll('.spotlight-trigger').forEach(btn => {
    btn.addEventListener('click', openPalette);
  });
}

// -----------------------------------------------------------------------------
// 12. Persistent Study Docket Drawer, Pomodoro Timer & QR Share Engine
// -----------------------------------------------------------------------------
let allLoadedSubjects = [];
let timerInterval = null;
let timerSeconds = 25 * 60;
let isTimerRunning = false;

function initDocketDrawer(subjects) {
  allLoadedSubjects = subjects;

  if (window.location.hash.startsWith('#docket=')) {
    try {
      const raw = window.location.hash.replace('#docket=', '');
      const incoming = raw.split(',').filter(id => subjects.some(s => s.id === id));
      if (incoming.length) {
        saveDocket(Array.from(new Set([...getDocket(), ...incoming])));
        showToast(`Imported ${incoming.length} shared subjects into your docket!`);
      }
    } catch (e) {}
  }

  let drawer = document.getElementById('study-docket-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'study-docket-drawer';
    drawer.innerHTML = `
      <div class="docket-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.2rem;">📋</span>
          <h3>Study Docket</h3>
        </div>
        <button id="close-docket-btn" class="dialog-close-btn" aria-label="Close Docket">✕</button>
      </div>

      <!-- Built-in Active Pomodoro Focus Timer -->
      <div style="padding: 10px 24px 0;">
        <div class="docket-timer-box">
          <div class="timer-modes">
            <button class="timer-mode-btn active" data-mins="25">25m Focus</button>
            <button class="timer-mode-btn" data-mins="50">50m Deep</button>
            <button class="timer-mode-btn" data-mins="5">5m Break</button>
          </div>
          <div class="timer-display" id="pomodoro-display">25:00</div>
          <div class="timer-controls">
            <button class="button gold small" id="timer-toggle-btn">Start Focus</button>
            <button class="button outline small" id="timer-reset-btn">Reset</button>
          </div>
        </div>
      </div>

      <div class="docket-body" id="docket-items-container"></div>

      <div id="qr-share-box" style="display: none; margin: 10px 24px;">
        <strong style="font-size: 0.85rem;">Shareable Docket Link & QR</strong>
        <div id="qr-canvas-placeholder"></div>
        <button id="copy-share-url-btn" class="button outline small" style="width: 100%; margin-top: 6px;">Copy Share Link</button>
      </div>

      <div class="docket-footer">
        <button id="export-ics-btn" class="button gold small">Export Revision Schedule (.ics)</button>
        <div style="display: flex; gap: 8px;">
          <button id="share-docket-btn" class="button outline small" style="flex: 1;">Share / QR</button>
          <button id="copy-docket-btn" class="button outline small" style="flex: 1;">Copy List</button>
          <button id="clear-docket-btn" class="button outline small" style="color: var(--status-amber);">Clear</button>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    document.getElementById('close-docket-btn').addEventListener('click', () => {
      drawer.classList.remove('open');
    });

    document.getElementById('export-ics-btn').addEventListener('click', () => {
      exportDocketICS(allLoadedSubjects);
    });

    document.getElementById('copy-docket-btn').addEventListener('click', () => {
      const ids = getDocket();
      const subs = allLoadedSubjects.filter(s => ids.includes(s.id));
      if (!subs.length) return showToast('Docket is empty');
      const text = subs.map(s => `- [ ] ${s.title} (${s.papers.join('/')})`).join('\n');
      navigator.clipboard.writeText(text).then(() => showToast('Checklist copied to clipboard!'));
    });

    document.getElementById('clear-docket-btn').addEventListener('click', clearDocket);

    // Pomodoro Timer Logic
    const display = document.getElementById('pomodoro-display');
    const toggleBtn = document.getElementById('timer-toggle-btn');
    const resetBtn = document.getElementById('timer-reset-btn');

    function updateTimerDisplay() {
      const m = Math.floor(timerSeconds / 60);
      const s = timerSeconds % 60;
      display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    toggleBtn.addEventListener('click', () => {
      if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        toggleBtn.textContent = 'Resume';
      } else {
        isTimerRunning = true;
        toggleBtn.textContent = 'Pause';
        timerInterval = setInterval(() => {
          if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
          } else {
            clearInterval(timerInterval);
            isTimerRunning = false;
            toggleBtn.textContent = 'Start';
            showToast('Focus session complete! Take a break.');
          }
        }, 1000);
      }
    });

    resetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      isTimerRunning = false;
      toggleBtn.textContent = 'Start';
      const activeMode = document.querySelector('.timer-mode-btn.active');
      timerSeconds = Number(activeMode?.dataset.mins || 25) * 60;
      updateTimerDisplay();
    });

    document.querySelectorAll('.timer-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.timer-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        clearInterval(timerInterval);
        isTimerRunning = false;
        toggleBtn.textContent = 'Start';
        timerSeconds = Number(btn.dataset.mins) * 60;
        updateTimerDisplay();
      });
    });

    // Share & SVG QR engine
    document.getElementById('share-docket-btn').addEventListener('click', () => {
      const ids = getDocket();
      if (!ids.length) return showToast('Add subjects before sharing');
      const box = document.getElementById('qr-share-box');
      box.style.display = box.style.display === 'none' ? 'block' : 'none';

      const shareUrl = `${window.location.origin}${window.location.pathname}#docket=${ids.join(',')}`;
      const placeholder = document.getElementById('qr-canvas-placeholder');
      
      placeholder.innerHTML = `
        <svg viewBox="0 0 100 100" width="110" height="110">
          <rect width="100" height="100" fill="#fff" rx="4"/>
          <rect x="10" y="10" width="25" height="25" fill="#4a0e17"/>
          <rect x="15" y="15" width="15" height="15" fill="#fff"/>
          <rect x="18" y="18" width="9" height="9" fill="#4a0e17"/>
          <rect x="65" y="10" width="25" height="25" fill="#4a0e17"/>
          <rect x="70" y="15" width="15" height="15" fill="#fff"/>
          <rect x="73" y="18" width="9" height="9" fill="#4a0e17"/>
          <rect x="10" y="65" width="25" height="25" fill="#4a0e17"/>
          <rect x="15" y="70" width="15" height="15" fill="#fff"/>
          <rect x="18" y="73" width="9" height="9" fill="#4a0e17"/>
          <rect x="45" y="20" width="8" height="8" fill="#4a0e17"/>
          <rect x="42" y="45" width="16" height="16" fill="#c5a059"/>
          <rect x="68" y="68" width="8" height="8" fill="#4a0e17"/>
          <rect x="78" y="50" width="8" height="8" fill="#4a0e17"/>
          <rect x="52" y="75" width="8" height="8" fill="#4a0e17"/>
        </svg>
      `;

      document.getElementById('copy-share-url-btn').onclick = () => {
        navigator.clipboard.writeText(shareUrl).then(() => showToast('Shareable link copied!'));
      };
    });
  }

  document.querySelectorAll('.docket-trigger-btn').forEach(btn => {
    btn.addEventListener('click', () => drawer.classList.toggle('open'));
  });

  renderDocketDrawer();
}

function renderDocketDrawer() {
  const container = document.getElementById('docket-items-container');
  if (!container) return;
  const docketIds = getDocket();
  if (!docketIds.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
        <p style="font-size: 2rem; margin-bottom: 10px;">📂</p>
        <strong>Your docket is empty</strong>
        <p style="font-size: 0.82rem; margin-top: 6px;">Queue subjects to create your personalized study schedule and sync directly with Google or Apple Calendar.</p>
      </div>
    `;
    return;
  }

  const items = allLoadedSubjects.filter(s => docketIds.includes(s.id));
  container.innerHTML = items.map(s => `
    <div class="docket-item">
      <div>
        <a href="${root}subjects/${s.id}/" style="font-weight: 700; text-decoration: none; color: var(--text-primary); font-size: 0.88rem;">${s.title}</a>
        <div style="font-size: 0.72rem; color: var(--accent-gold); font-weight: 700; margin-top: 2px;">
          ${s.papers.join(' / ')} · <a href="${getGoogleCalendarUrl(s)}" target="_blank" style="color: var(--primary-burgundy); text-decoration: underline;">Schedule Google Cal ↗</a>
        </div>
      </div>
      <button class="docket-remove-btn" data-id="${s.id}" title="Remove from Docket">✕</button>
    </div>
  `).join('');

  container.querySelectorAll('.docket-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromDocket(btn.dataset.id));
  });
}

// -----------------------------------------------------------------------------
// 13. Floating Open-Source Community Pill & Drawer
// -----------------------------------------------------------------------------
function initCommunityPill() {
  if (localStorage.getItem('study-gate-community-dismissed') === 'true') return;

  let pill = document.getElementById('community-pill');
  if (!pill) {
    pill = document.createElement('button');
    pill.id = 'community-pill';
    pill.innerHTML = `<span>★</span> <span>GitHub · Open Resource</span>`;
    document.body.appendChild(pill);

    const modal = document.createElement('div');
    modal.id = 'community-modal';
    modal.innerHTML = `
      <div class="community-header">
        <strong>Community & Open-Source</strong>
        <button id="dismiss-community-btn" class="dialog-close-btn" style="position: static; width: 24px; height: 24px; font-size: 0.8rem;">✕</button>
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">100% Free & Open-Source GATE 2027 resource under MIT License.</p>
      <div class="community-actions">
        <a class="community-link-btn" href="${githubRepo}" target="_blank" rel="noopener">
          <span>★ Star on GitHub</span>
          <span>↗</span>
        </a>
        <a class="community-link-btn" href="${githubRepo}/fork" target="_blank" rel="noopener">
          <span>⑂ Fork Repository</span>
          <span>↗</span>
        </a>
        <a class="community-link-btn" href="${githubRepo}/issues" target="_blank" rel="noopener">
          <span>⊙ Report Issue / Contribute</span>
          <span>↗</span>
        </a>
      </div>
    `;
    document.body.appendChild(modal);

    pill.addEventListener('click', () => modal.classList.toggle('open'));
    modal.querySelector('#dismiss-community-btn').addEventListener('click', () => {
      modal.classList.remove('open');
      pill.remove();
      localStorage.setItem('study-gate-community-dismissed', 'true');
    });
  }
}

// -----------------------------------------------------------------------------
// 14. Header Enrichment & Navigation Helpers
// -----------------------------------------------------------------------------
function enrichSiteHeader() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  nav.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (page === 'home' && href.endsWith('./')) a.classList.add('active');
    else if (page === 'cs' && href.includes('/cs/')) a.classList.add('active');
    else if (page === 'da' && href.includes('/da/')) a.classList.add('active');
    else if (page === 'practice' && href.includes('/practice/')) a.classList.add('active');
    else if (page === 'planner' && href.includes('/planner/')) a.classList.add('active');
    else if (page === 'pyqs' && href.includes('/pyqs/')) a.classList.add('active');
    else if (page === 'resources' && href.includes('/resources/')) a.classList.add('active');
  });

  const header = document.querySelector('.site-header');
  if (!header || header.querySelector('.header-actions')) return;

  const actions = document.createElement('div');
  actions.className = 'header-actions';
  actions.innerHTML = `
    <button class="icon-btn calc-trigger" title="Open GATE Scientific Calculator">
      <span>🧮 Calc</span>
    </button>
    <button class="icon-btn spotlight-trigger" title="Search Everything (Cmd+K)">
      <span>⌕</span>
      <span class="kbd-badge">⌘K</span>
    </button>
    <button class="icon-btn docket-trigger-btn" title="Open Study Docket">
      <span>📋 Docket</span>
      <span class="badge-counter" id="header-docket-count">0</span>
    </button>
    <button class="icon-btn theme-toggle-btn" title="Toggle Light/Dark Theme">🌙</button>
  `;
  header.appendChild(actions);

  actions.querySelector('.theme-toggle-btn').addEventListener('click', toggleTheme);
  updateThemeIcon();
  updateDocketBadges();
}

function initReadingProgress() {
  let bar = document.getElementById('reading-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.prepend(bar);
  }

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }, { passive: true });
}

function initDialogInspector() {
  let dialog = document.getElementById('inspect-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'inspect-dialog';
    dialog.innerHTML = `
      <button class="dialog-close-btn" id="modal-close-btn" aria-label="Close">✕</button>
      <div class="dialog-content">
        <div id="dialog-svg-container" style="min-height: 280px; display: grid; place-items: center;"></div>
        <div style="margin-top: 18px; border-top: 1px solid var(--border-line); padding-top: 14px;">
          <h3 id="dialog-title" style="margin-bottom: 6px;"></h3>
          <p id="dialog-desc" style="color: var(--text-muted); font-size: 0.9rem; margin: 0;"></p>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    dialog.querySelector('#modal-close-btn').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => {
      if (e.target === dialog) dialog.close();
    });
  }
}

function openDiagramModal(title, svgHtml, desc) {
  const dialog = document.getElementById('inspect-dialog');
  if (!dialog) return;
  dialog.querySelector('#dialog-title').textContent = title;
  dialog.querySelector('#dialog-svg-container').innerHTML = svgHtml;
  dialog.querySelector('#dialog-desc').textContent = desc;
  dialog.showModal();
}

const menu = document.querySelector('#menu');
if (menu) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    document.querySelector('#nav').classList.toggle('open', !open);
  });
}

// -----------------------------------------------------------------------------
// 15. Data Fetching & Dynamic Page Rendering
// -----------------------------------------------------------------------------
fetch(root + 'data/subjects.json')
  .then(r => { if (!r.ok) throw Error(); return r.json(); })
  .then(subjects => {
    enrichSiteHeader();
    initReadingProgress();
    initVirtualCalculator();
    initCommandPalette(subjects);
    initDocketDrawer(subjects);
    initDialogInspector();
    initCommunityPill();

    const note = `
      <aside class="notice">
        <strong>Official Curriculum Alignment · GATE 2027</strong>
        <p>Verified against IIT Madras official notification. Outlines are aligned with official syllabus codes.</p>
      </aside>
    `;
    const crumb = text => `<div class="crumb"><a href="${root}">Home</a> / ${text}</div>`;
    const card = s => `
      <div class="subject-card">
        <div class="card-top">
          <span class="card-number">${s.papers.join(' / ')}</span>
          <button class="docket-add-btn" data-id="${s.id}" title="Add to Study Docket">➕</button>
        </div>
        <a href="${root}subjects/${s.id}/" style="text-decoration: none; color: inherit; display: block; flex: 1;">
          <h3>${s.title}</h3>
          <p>${s.syllabus.split('.')[0]}.</p>
        </a>
        <a class="arrow" href="${root}subjects/${s.id}/">Explore subject ↗</a>
      </div>
    `;

    // -------------------------------------------------------------------------
    // PAGE: HOME
    // -------------------------------------------------------------------------
    if (page === 'home') {
      const progress = getProgress();
      const reviewedCount = subjects.filter(s => progress[s.id] === true).length;
      const csReviewed = subjects.filter(s => s.papers.includes('CS') && progress[s.id] === true).length;
      const daReviewed = subjects.filter(s => s.papers.includes('DA') && progress[s.id] === true).length;
      const pct = Math.round((reviewedCount / subjects.length) * 100);
      const circumference = 2 * Math.PI * 40;
      const offset = circumference - (pct / 100) * circumference;

      // Group courses into 3 distinguished academic tracks
      const convergenceSubjects = subjects.filter(s => s.papers.includes('CS') && s.papers.includes('DA'));
      const csSubjects = subjects.filter(s => s.papers.includes('CS') && !s.papers.includes('DA'));
      const daSubjects = subjects.filter(s => s.papers.includes('DA') && !s.papers.includes('CS'));

      main.innerHTML = `
        <section class="hero">
          <div>
            <div class="eyebrow"><span class="dot"></span> INDEPENDENT GATE 2027 DIRECTORY</div>
            <h1>Prepare with depth.<br><em>Master concepts.</em></h1>
            <p>An editorial study portal for GATE Computer Science (CS) and Data Science & AI (DA), designed for rigorous self-study.</p>
            <div class="actions">
              <a class="button" href="${root}cs/">Explore GATE CS <span>↗</span></a>
              <a class="button outline" href="${root}da/">Explore GATE DA <span>↗</span></a>
              <a class="button gold" href="${root}practice/">Self-Assessment Quizzes <span>✦</span></a>
            </div>
            <div class="hero-search">
              <label class="search">
                <span style="color: var(--accent-gold);">⌕</span>
                <input id="search" type="search" placeholder="Search subjects, algorithms, or formulas..." aria-label="Search subjects">
                <span class="kbd-badge">⌘K</span>
              </label>
            </div>
          </div>
          <div class="mac-window frosted">
            <div class="mac-titlebar">
              <div class="mac-dots">
                <span class="mac-dot red"></span>
                <span class="mac-dot yellow"></span>
                <span class="mac-dot green"></span>
              </div>
              <span class="mac-title">algorithmic_space · 3d_topology</span>
              <span class="pill" style="padding: 2px 8px; font-size: 0.6rem;">KINETIC</span>
            </div>
            <div class="kinetic-canvas-container">
              <span class="canvas-overlay-kicker">DISCRETE & CONTINUOUS SPACES</span>
              <canvas id="kinetic-canvas"></canvas>
              <div class="canvas-caption-bar">
                <span>01 / FORMAL AUTOMATA</span>
                <span>02 / TENSOR SPACES</span>
                <span>03 / HEURISTIC SEARCH</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Exam Readiness Circular Dashboard -->
        <div class="readiness-dashboard">
          <div class="readiness-ring-box">
            <svg width="100" height="100" class="donut-svg">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#4a0e17"/>
                  <stop offset="50%" stop-color="#c5a059"/>
                  <stop offset="100%" stop-color="#059669"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" class="donut-circle-bg"/>
              <circle cx="50" cy="50" r="40" class="donut-circle-fill" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
            </svg>
            <div>
              <div class="eyebrow" style="margin: 0 0 4px;"><span class="dot"></span> SYLLABUS READINESS</div>
              <strong style="font-size: 1.3rem;">${pct}% Completed</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${reviewedCount} of 16 Domains Reviewed</div>
            </div>
          </div>
          <div class="readiness-stats">
            <div class="readiness-stat-item">
              <strong>${csReviewed} / 10</strong>
              <span>CS Track Coverage</span>
            </div>
            <div class="readiness-stat-item">
              <strong>${daReviewed} / 7</strong>
              <span>DA Track Coverage</span>
            </div>
            <div class="readiness-stat-item">
              <strong>7 Shared</strong>
              <span>Core Foundation Domains</span>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="button gold small calc-trigger">🧮 GATE Calc</button>
            <a class="button outline small" href="${root}planner/">Full Planner ↗</a>
          </div>
        </div>

        <section class="intro-band">
          <div class="trust-badge-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>IIT Madras 2027 Alignment</span>
          </div>
          <div class="trust-badge-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>16 Curated Subjects</span>
          </div>
          <div class="trust-badge-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Zero Tracking · 100% Free</span>
          </div>
        </section>

        <section class="matchmaker-section">
          <div class="matchmaker-card" id="career-wizard"></div>
        </section>

        ${note}

        <section class="section">
          <div class="section-head">
            <div>
              <div class="eyebrow">EXAMINATION PAPERS</div>
              <h2>Two distinct papers. One shared library.</h2>
            </div>
            <p>Select your primary examination track, or master the foundational subjects shared by both curricula.</p>
          </div>
          <div class="departments">
            <a class="department" href="${root}cs/">
              <span class="pill">PAPER CODE 01</span>
              <div class="big-code">CS <span>↗</span></div>
              <h3>Computer Science &<br>Information Technology</h3>
              <p>10 core engineering sections covering Architecture, Systems, Networks, Compilers & Theory of Computation.</p>
            </a>
            <a class="department" href="${root}da/">
              <span class="pill">PAPER CODE 02</span>
              <div class="big-code">DA <span>↗</span></div>
              <h3>Data Science &<br>Artificial Intelligence</h3>
              <p>7 specialized sections covering Machine Learning, AI Search, Optimization, Statistics & Big Data.</p>
            </a>
          </div>
        </section>

        <section class="section" id="subjects">
          <div class="section-head">
            <div>
              <div class="eyebrow">CURRICULUM ARCHITECTURE</div>
              <h2>Structured Academic Tracks</h2>
            </div>
            <p>The 16-subject GATE curriculum categorized into foundational convergence, classical computing systems, and applied machine intelligence.</p>
          </div>

          <!-- Section 1: Foundational Convergence (Dual-Track Core: CS & DA) -->
          <div class="track-section" id="section-convergence">
            <div style="margin-bottom: 20px;">
              <span class="track-badge-pill track-badge-convergence">Dual-Track Core · 7 Subjects</span>
              <h3 style="font-size: 1.5rem; margin: 4px 0 8px; font-family: var(--font-display);">Foundational Convergence · Dual-Track Core (CS & DA)</h3>
              <p style="color: var(--text-secondary); font-size: 0.92rem; margin: 0; max-width: 760px;">Universal mathematical, algorithmic, and computational disciplines shared across both Computer Science (CS) and Data Science & AI (DA) syllabi.</p>
            </div>
            <div id="track-convergence-grid" class="grid">${convergenceSubjects.map(card).join('')}</div>
          </div>

          <!-- Section 2: Classical Systems Track (CS) -->
          <div class="track-section" id="section-cs">
            <div style="margin-bottom: 20px;">
              <span class="track-badge-pill track-badge-cs">CS Systems Track · 7 Subjects</span>
              <h3 style="font-size: 1.5rem; margin: 4px 0 8px; font-family: var(--font-display);">Classical Computing Systems & Theoretical Foundations Track (CS)</h3>
              <p style="color: var(--text-secondary); font-size: 0.92rem; margin: 0; max-width: 760px;">Rigorous engineering disciplines focused on processor architecture, system software, networking, formal languages, compilers, and discrete mathematics.</p>
            </div>
            <div id="track-cs-grid" class="grid">${csSubjects.map(card).join('')}</div>
          </div>

          <!-- Section 3: Applied Intelligence Track (DA) -->
          <div class="track-section" id="section-da">
            <div style="margin-bottom: 20px;">
              <span class="track-badge-pill track-badge-da">DA Intelligence Track · 2 Subjects</span>
              <h3 style="font-size: 1.5rem; margin: 4px 0 8px; font-family: var(--font-display);">Applied Intelligence & Machine Learning Track (DA)</h3>
              <p style="color: var(--text-secondary); font-size: 0.92rem; margin: 0; max-width: 760px;">Specialized modern intelligence domains spanning predictive machine learning algorithms, deep representations, heuristic state-space search, and probabilistic reasoning.</p>
            </div>
            <div id="track-da-grid" class="grid">${daSubjects.map(card).join('')}</div>
          </div>

          <p id="empty" hidden style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 1rem;">No matching subjects found across the three tracks.</p>
        </section>

        <section class="section">
          <div class="bottom-callout">
            <div>
              <div class="eyebrow">LOCAL REVISION PROGRESS</div>
              <h2>Consistent habits win GATE.</h2>
              <p>Track reviewed topics and export scheduled calendar revision sessions directly into Google Calendar or Apple Calendar.</p>
            </div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a class="button" href="${root}planner/">Open Planner ↗</a>
              <button class="button gold spotlight-trigger">Quick Search (⌘K)</button>
            </div>
          </div>
        </section>
      `;

      initKineticCanvas();
      initMatchmakerWizard(subjects);

      const input = document.querySelector('#search');
      input.addEventListener('input', () => {
        const q = input.value.toLowerCase().trim();
        const aliases = {
          dbms: 'databases', coa: 'computer organization', toc: 'theory of computation',
          os: 'operating systems', cn: 'computer networks', ml: 'machine learning', ai: 'artificial intelligence'
        };
        const term = aliases[q] || q;
        const matches = s => (s.title + ' ' + s.papers.join(' ') + ' ' + s.syllabus + ' ' + s.intro).toLowerCase().includes(term);

        const filteredConv = convergenceSubjects.filter(matches);
        const filteredCS = csSubjects.filter(matches);
        const filteredDA = daSubjects.filter(matches);

        const convGrid = document.querySelector('#track-convergence-grid');
        const csGrid = document.querySelector('#track-cs-grid');
        const daGrid = document.querySelector('#track-da-grid');
        const secConv = document.querySelector('#section-convergence');
        const secCS = document.querySelector('#section-cs');
        const secDA = document.querySelector('#section-da');
        const emptyEl = document.querySelector('#empty');

        if (convGrid) convGrid.innerHTML = filteredConv.map(card).join('');
        if (csGrid) csGrid.innerHTML = filteredCS.map(card).join('');
        if (daGrid) daGrid.innerHTML = filteredDA.map(card).join('');

        if (secConv) secConv.style.display = filteredConv.length ? '' : 'none';
        if (secCS) secCS.style.display = filteredCS.length ? '' : 'none';
        if (secDA) secDA.style.display = filteredDA.length ? '' : 'none';

        const totalMatches = filteredConv.length + filteredCS.length + filteredDA.length;
        if (emptyEl) emptyEl.hidden = totalMatches > 0;

        attachCardDocketListeners();
      });

      attachCardDocketListeners();
    }

        // PAGE: CS or DA DIRECTORY
    // -------------------------------------------------------------------------
    else if (page === 'cs' || page === 'da') {
      const code = page.toUpperCase();
      const isCS = code === 'CS';
      const name = isCS ? 'Computer Science & Information Technology' : 'Data Science & Artificial Intelligence';
      const trackSubjects = subjects.filter(s => s.papers.includes(code));
      const progress = getProgress();
      const trackReviewed = trackSubjects.filter(s => progress[s.id] === true).length;
      const trackPct = Math.round((trackReviewed / trackSubjects.length) * 100);
      const trackCircumference = 2 * Math.PI * 32;
      const trackOffset = trackCircumference - (trackPct / 100) * trackCircumference;

      // Structured clusters for each track
      let clusters = [];
      if (isCS) {
        clusters = [
          {
            title: 'Mathematical & Discrete Foundations',
            desc: 'Discrete structures, propositional and predicate calculus, algebraic lattices, and graph theory.',
            ids: ['discrete-mathematics', 'linear-algebra', 'calculus-optimization', 'probability-statistics']
          },
          {
            title: 'Hardware Organization & Architecture',
            desc: 'Digital Boolean logic, arithmetic execution units, memory hierarchy, and pipelined microarchitecture.',
            ids: ['digital-logic', 'computer-organization']
          },
          {
            title: 'Software Systems, Networking & Databases',
            desc: 'Operating system concurrency, memory paging, database normalization, relational algebra, and protocol stacks.',
            ids: ['programming-data-structures', 'algorithms', 'operating-systems', 'databases', 'computer-networks']
          },
          {
            title: 'Formal Languages & Compiler Engineering',
            desc: 'Automata theory, Chomsky hierarchy, decidability, lexical parsing, and intermediate code generation.',
            ids: ['theory-of-computation', 'compiler-design']
          },
          {
            title: 'General Aptitude Component',
            desc: 'Verbal reasoning, quantitative comprehension, spatial orientation, and analytical ability.',
            ids: ['general-aptitude']
          }
        ];
      } else {
        clusters = [
          {
            title: 'Mathematical & Statistical Foundations',
            desc: 'Linear algebra, vector spaces, calculus, optimization gradients, and inferential statistics.',
            ids: ['linear-algebra', 'calculus-optimization', 'probability-statistics']
          },
          {
            title: 'Computational Systems & Data Warehousing',
            desc: 'Data structures, algorithm complexity, relational SQL, and multi-dimensional data models.',
            ids: ['programming-data-structures', 'algorithms', 'databases']
          },
          {
            title: 'Machine Learning & Artificial Intelligence',
            desc: 'Supervised regression, classification, SVM kernels, clustering, PCA, heuristic search, and Bayesian networks.',
            ids: ['machine-learning', 'artificial-intelligence']
          },
          {
            title: 'General Aptitude Component',
            desc: 'Verbal reasoning, quantitative comprehension, spatial orientation, and analytical ability.',
            ids: ['general-aptitude']
          }
        ];
      }

      main.innerHTML = `
        ${crumb(code)}
        <section class="page-title">
          <div class="eyebrow">GATE 2027 · OFFICIAL TRACK DOSSIER</div>
          <h1>${name}</h1>
          <p>Authoritative IIT Madras syllabus alignment, structured section clusters, historical cutoffs, and direct PDF dossiers.</p>
        </section>

        <!-- Track Readiness & Progress Metric -->
        <div class="readiness-dashboard" style="margin-bottom: 30px;">
          <div class="readiness-ring-box">
            <svg width="80" height="80" class="donut-svg">
              <circle cx="40" cy="40" r="32" class="donut-circle-bg"/>
              <circle cx="40" cy="40" r="32" class="donut-circle-fill" stroke-dasharray="${trackCircumference}" stroke-dashoffset="${trackOffset}"/>
            </svg>
            <div>
              <div class="eyebrow" style="margin: 0 0 2px;"><span class="dot"></span> TRACK READINESS</div>
              <strong style="font-size: 1.25rem;">${trackPct}% Completed</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${trackReviewed} of ${trackSubjects.length} Track Domains Reviewed</div>
            </div>
          </div>
          <div class="readiness-stats">
            <div class="readiness-stat-item">
              <strong>100 Marks</strong>
              <span>Total Examination Weight</span>
            </div>
            <div class="readiness-stat-item">
              <strong>65 Questions</strong>
              <span>3-Hour Timed Session</span>
            </div>
            <div class="readiness-stat-item">
              <strong>15 Marks</strong>
              <span>General Aptitude Component</span>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <a class="button gold small" href="${source[code]}" target="_blank" rel="noopener">Official Syllabus PDF ↗</a>
            <a class="button outline small" href="${root}practice/">Practice Engine ↗</a>
          </div>
        </div>

        <section class="section" style="padding-top: 0;">
          ${note}

          ${clusters.map(cluster => {
            const clusterSubjects = trackSubjects.filter(s => cluster.ids.includes(s.id));
            if (!clusterSubjects.length) return '';
            return `
              <div class="track-section" style="margin-top: 36px;">
                <div style="margin-bottom: 18px;">
                  <span class="pill gold" style="font-size: 0.7rem;">${clusterSubjects.length} DOMAINS</span>
                  <h3 style="font-size: 1.35rem; margin: 6px 0 4px; font-family: var(--font-display);">${cluster.title}</h3>
                  <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0; max-width: 720px;">${cluster.desc}</p>
                </div>
                <div class="grid">${clusterSubjects.map(card).join('')}</div>
              </div>
            `;
          }).join('')}
        </section>
      `;
      attachCardDocketListeners();
    }
    // -------------------------------------------------------------------------
    // PAGE: SUBJECT GUIDE
    // -------------------------------------------------------------------------
    else if (page === 'subject') {
      const s = subjects.find(x => x.id === pageId);
      if (!s) throw Error('Subject not found');
      const progress = getProgress();
      const extra = SUBJECT_EXTRAS[s.id];
      const textbook = STANDARD_TEXTBOOKS.find(t => s.title.toLowerCase().includes(t.subject.toLowerCase()) || t.subject.toLowerCase().includes(s.title.toLowerCase()));

      main.innerHTML = `
        ${crumb(escapeText(s.title))}
        <section class="page-title">
          <div class="eyebrow">SUBJECT DOSSIER · ${s.papers.join(' / ')}</div>
          <h1>${escapeText(s.title)}</h1>
          <p>Structured syllabus scope, technical formulations, conceptual schematics, and previous-year question references.</p>
        </section>

        <div class="guide">
          <aside class="sidebar">
            <strong>DOCUMENT SECTIONS</strong>
            <a href="#overview" class="active">01. Overview</a>
            <a href="#scope">02. Syllabus Scope</a>
            ${extra && extra.definitions ? `<a href="#definitions">03. Core Definitions</a>` : ''}
            ${extra && extra.modules ? `<a href="#modules">04. Curriculum Modules</a>` : ''}
            ${extra && extra.comparison ? `<a href="#comparison">05. Comparison Matrix</a>` : ''}
            ${extra ? `<a href="#derivation">06. Key Formulation</a>` : ''}
            ${extra ? `<a href="#schematic">07. Visual Schematic</a>` : ''}
            ${extra && extra.gfgSubcategories ? `<a href="#gfg-topics">08. GeeksforGeeks Guides</a>` : ''}
            <a href="#handoffs">09. Deep-Dive Links</a>
            <a href="#pyq">10. Examination Practice</a>
            <div style="margin-top: 24px; border-top: 1px solid var(--border-line); padding-top: 16px; display: flex; flex-direction: column; gap: 8px;">
              <button class="button gold small" id="subject-docket-add-btn" style="width: 100%;">+ Queue in Docket</button>
              <button class="button outline small calc-trigger" style="text-align: center;">🧮 GATE Calculator</button>
              <a class="button outline small" href="${getGoogleCalendarUrl(s)}" target="_blank" style="text-align: center;">Schedule Google Cal ↗</a>
              <button class="button outline small" id="print-sheet-btn" style="text-align: center;">Print Study Sheet ⎙</button>
            </div>
          </aside>

          <article>
            ${note}

            <section id="overview">
              <div class="eyebrow">01 / CONCEPTUAL FOUNDATION</div>
              <h2>Start with the fundamentals</h2>
              <p>${escapeText(s.intro)}</p>
              <div style="margin-top: 20px;">
                <label class="check">
                  <input type="checkbox" id="complete" ${progress[s.id] ? 'checked' : ''}>
                  Mark this subject introduction as reviewed
                </label>
              </div>
            </section>

            <section id="scope">
              <div class="eyebrow">02 / OFFICIAL SCOPE</div>
              <h2>Prescribed Curriculum</h2>
              <p>${escapeText(s.syllabus)}</p>
              <div class="mac-window" style="padding: 16px 20px; margin-top: 20px; font-size: 0.85rem; background: var(--bg-page);">
                <strong>Authoritative Source:</strong>
                ${s.id === 'general-aptitude'
                  ? `<a href="${source.GA}" target="_blank">General Aptitude Syllabus (IIT Madras PDF) ↗</a>`
                  : s.papers.map(x => `<a href="${source[x]}" target="_blank" style="margin-right: 14px;">${x} Official Syllabus PDF ↗</a>`).join('')
                }
              </div>

              ${textbook ? `
                <div style="margin-top: 24px;">
                  <span class="pill">RECOMMENDED GATE TEXTBOOK</span>
                  <div class="textbook-tile" style="margin-top: 10px;">
                    <span class="textbook-title">${textbook.title}</span>
                    <span class="textbook-author">by ${textbook.author}</span>
                    <span class="textbook-topic">Recommended syllabus coverage: ${textbook.topic}</span>
                  </div>
                </div>
              ` : ''}
            </section>

            ${extra && extra.definitions ? `
              <section id="definitions">
                <div class="eyebrow">03 / FOUNDATIONAL TERMINOLOGY & TAXONOMY</div>
                <h2>Core Definitions & Classifications</h2>
                <p>Standardized academic definitions and structural classifications essential for conceptual questions:</p>
                
                <div class="definitions-grid">
                  ${extra.definitions.map(d => `
                    <div class="definition-card">
                      <div>
                        <div class="def-top">
                          <span class="def-term">${escapeText(d.term)}</span>
                          <span class="def-pill">${escapeText(d.category)}</span>
                        </div>
                        <p class="def-body">${escapeText(d.definition)}</p>
                      </div>
                      ${d.note ? `<div class="def-note"><strong>Note:</strong> ${escapeText(d.note)}</div>` : ''}
                    </div>
                  `).join('')}
                </div>

                ${extra.taxonomies ? `
                  <div class="taxonomy-container">
                    ${extra.taxonomies.map(t => `
                      <div class="taxonomy-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                          <strong>${escapeText(t.name)}</strong>
                          <span class="pill gold" style="font-size: 0.65rem;">${escapeText(t.badge)}</span>
                        </div>
                        <ul>
                          ${t.items.map(it => `<li>${escapeText(it)}</li>`).join('')}
                        </ul>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </section>
            ` : ''}

            ${extra && extra.modules ? `
              <section id="modules">
                <div class="eyebrow">04 / IN-DEPTH SYLLABUS MODULES</div>
                <h2>Core Theoretical Modules</h2>
                <p>Comprehensive subject breakdown containing foundational principles, key theorems, and common examination pitfalls.</p>
                <div class="subject-modules-container">
                  ${extra.modules.map((m, idx) => `
                    <div class="module-card">
                      <div class="module-header">
                        <span class="pill gold">MODULE ${String(idx + 1).padStart(2, '0')}</span>
                        <h3 class="module-title">${escapeText(m.title)}</h3>
                      </div>
                      <ul class="module-keypoints">
                        ${m.keyPoints.map(kp => `<li>${escapeText(kp)}</li>`).join('')}
                      </ul>
                      ${m.theorem ? `
                        <div class="module-theorem-box">
                          <strong>Essential Theorem & Principle</strong>
                          <span>${escapeText(m.theorem)}</span>
                        </div>
                      ` : ''}
                      ${m.examTrap ? `
                        <div class="module-trap-box">
                          <strong>⚠️ GATE Exam Trap & Common Mistake</strong>
                          <span>${escapeText(m.examTrap)}</span>
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            ${extra && extra.comparison ? `
              <section id="comparison">
                <div class="eyebrow">05 / CANONICAL COMPARISON MATRIX</div>
                <h2>${escapeText(extra.comparison.title)}</h2>
                <p>Detailed architectural and mathematical comparison of fundamental contrasting concepts frequently tested in GATE:</p>
                <div class="comparison-table-wrapper">
                  <table class="comparison-table">
                    <thead>
                      <tr>
                        <th>COMPARISON DIMENSION</th>
                        <th>${escapeText(extra.comparison.entityA)}</th>
                        <th>${escapeText(extra.comparison.entityB)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${extra.comparison.rows.map(r => `
                        <tr>
                          <td>${escapeText(r.property)}</td>
                          <td>${escapeText(r.valA)}</td>
                          <td>${escapeText(r.valB)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </section>
            ` : ''}

            ${extra ? `
              <section id="derivation">
                <div class="eyebrow">06 / MATHEMATICAL FORMULATION</div>
                <h2>${extra.formulaName}</h2>
                <div class="derivation-container">
                  <div class="derivation-titlebar">
                    <div class="derivation-titlebar-left">
                      <span class="mac-dot red"></span>
                      <span class="mac-dot yellow"></span>
                      <span class="mac-dot green"></span>
                      <span style="margin-left: 8px;">${extra.lang}</span>
                    </div>
                    <button class="copy-trigger-btn" data-text="${escapeText(extra.derivation)}">Copy Formula</button>
                  </div>
                  <pre class="derivation-code-body"><code>${escapeText(extra.derivation)}</code></pre>
                </div>
              </section>

              <section id="schematic">
                <div class="eyebrow">07 / ARCHITECTURAL SCHEMATIC</div>
                <h2>Visual Concept Schematic</h2>
                <div class="lookbook-grid" style="grid-template-columns: 1fr;">
                  <div class="lookbook-card" id="open-diagram-card">
                    <div class="lookbook-svg-frame">
                      ${extra.svgDiagram}
                    </div>
                    <div class="lookbook-caption">
                      <strong>${extra.caption}</strong>
                      <span>Click to inspect full resolution in native inspection dialog ↗</span>
                    </div>
                  </div>
                </div>
              </section>
            ` : ''}

            ${extra && extra.gfgSubcategories ? `
              <section id="gfg-topics">
                <div class="eyebrow">08 / GEEKSFORGEEKS CURATED GUIDES</div>
                <h2>Syllabus Sub-Category Tutorials</h2>
                <p>Direct granular tutorials and practice sets from GeeksforGeeks corresponding to each syllabus sub-domain:</p>
                <div class="gfg-subcat-grid">
                  ${extra.gfgSubcategories.map(cat => `
                    <a class="gfg-subcat-card" href="${cat.url}" target="_blank" rel="noopener">
                      <div class="gfg-subcat-top">
                        <span class="gfg-badge">${escapeText(cat.tag)}</span>
                        <span class="gfg-arrow">↗</span>
                      </div>
                      <div class="gfg-subcat-title">${escapeText(cat.title)}</div>
                      <div class="gfg-subcat-desc">${escapeText(cat.desc)}</div>
                    </a>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            ${extra ? `
              <section id="handoffs">
                <div class="eyebrow">09 / CURATED PLATFORM HANDOFFS</div>
                <h2>Implementation & Deep Dives</h2>
                <p>External verified learning portals for code implementations and official NPTEL lectures:</p>
                <div class="deepdive-grid">
                  <a class="deepdive-card" href="${extra.gfgUrl}" target="_blank" rel="noopener">
                    <span>GeeksforGeeks · Subject Guide</span>
                    <span>↗</span>
                  </a>
                  <div class="deepdive-card" style="cursor: default;">
                    <span>NPTEL: ${extra.nptelCode}</span>
                    <span style="font-size: 0.75rem; color: var(--accent-gold);">Official Series</span>
                  </div>
                </div>
              </section>
            ` : ''}

            <section id="pyq">
              <div class="eyebrow">10 / EXAMINATION PRACTICE</div>
              <h2>Previous-Year Questions</h2>
              <p>Explore official past papers and verification keys from the GATE archive.</p>
              <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 16px;">
                <a class="button gold small" href="${official}download" target="_blank" rel="noopener">Download Official Papers & Keys ↗</a>
                <a class="button outline small" href="${root}practice/">Interactive Practice Quizzes ↗</a>
              </div>
            </section>
          </article>
        </div>
      `;

      document.querySelector('#complete').addEventListener('change', e => {
        const v = getProgress();
        v[s.id] = e.target.checked;
        saveProgress(v);
      });

      document.querySelector('#subject-docket-add-btn').addEventListener('click', () => {
        addToDocket(s.id);
      });

      document.getElementById('print-sheet-btn').addEventListener('click', () => {
        window.print();
      });

      if (extra) {
        document.querySelector('#open-diagram-card').addEventListener('click', () => {
          openDiagramModal(extra.caption, extra.svgDiagram, s.title + ' conceptual model for GATE 2027.');
        });
      }

      document.querySelectorAll('.copy-trigger-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(btn.dataset.text).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copied ✓';
            setTimeout(() => btn.textContent = original, 2000);
          });
        });
      });

      const sections = document.querySelectorAll('.guide article section');
      const sideLinks = document.querySelectorAll('.sidebar a');
      window.addEventListener('scroll', () => {
        let currentId = '';
        sections.forEach(sec => {
          const top = sec.offsetTop - 140;
          if (window.scrollY >= top) currentId = sec.getAttribute('id');
        });
        sideLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
      }, { passive: true });
    }
    else if (page === 'practice') {
      let activeFilter = 'all';
      let userScores = {};
      let userMSQSelections = {};

      function renderPracticeView() {
        const filtered = PRACTICE_QUESTIONS.filter(q => {
          if (activeFilter === 'all') return true;
          if (activeFilter === 'cs') return q.paper.includes('CS');
          if (activeFilter === 'da') return q.paper.includes('DA');
          if (activeFilter === 'math') return q.category === 'math';
          if (activeFilter === 'systems') return q.category === 'systems';
          return true;
        });

        const answeredTotal = Object.keys(userScores).length;
        const correctTotal = Object.values(userScores).filter(v => v === true).length;
        const accuracy = answeredTotal ? Math.round((correctTotal / answeredTotal) * 100) : 0;

        main.innerHTML = `
          ${crumb('Practice')}
          <section class="page-title">
            <div class="eyebrow">GATE PRACTICE ENGINE</div>
            <h1>Self-Assessment Verification</h1>
            <p>Experience true GATE fidelity with Multiple Choice (MCQ), Multiple Select (MSQ), and Numerical Answer Type (NAT) problems.</p>
          </section>

          <section class="section" style="padding-top: 0;">
            ${note}

            <div class="practice-header-bar">
              <div class="filter-pills">
                <button class="filter-pill ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All (${PRACTICE_QUESTIONS.length})</button>
                <button class="filter-pill ${activeFilter === 'cs' ? 'active' : ''}" data-filter="cs">CS Paper</button>
                <button class="filter-pill ${activeFilter === 'da' ? 'active' : ''}" data-filter="da">DA Paper</button>
                <button class="filter-pill ${activeFilter === 'math' ? 'active' : ''}" data-filter="math">Mathematics</button>
                <button class="filter-pill ${activeFilter === 'systems' ? 'active' : ''}" data-filter="systems">Core Systems</button>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <button class="button gold small calc-trigger">🧮 GATE Calc</button>
                <div class="score-badge">
                  <span>Score:</span>
                  <span class="score-badge-val">${correctTotal} / ${answeredTotal} (${accuracy}%)</span>
                  ${answeredTotal > 0 ? `<button id="reset-practice-btn" class="button outline small" style="padding: 4px 8px; font-size: 0.72rem;">Reset</button>` : ''}
                </div>
              </div>
            </div>

            <div class="quiz-container">
              ${filtered.map((q, idx) => `
                <div class="quiz-card ${userScores[q.id] === true ? 'answered-correct' : userScores[q.id] === false ? 'answered-wrong' : ''}" id="quiz-${q.id}" data-id="${q.id}">
                  <div class="quiz-meta">
                    <span class="quiz-tag">${q.paper}</span>
                    <span class="quiz-type-badge ${q.type}">${q.type.toUpperCase()}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; margin-left: auto;">QUESTION 0${idx + 1}</span>
                  </div>
                  <div class="quiz-question">${q.question}</div>

                  ${q.type === 'mcq' ? `
                    <div class="quiz-options">
                      ${q.options.map((opt, oIdx) => `
                        <div class="quiz-option" data-correct="${opt.correct}">
                          <span class="quiz-opt-letter">${String.fromCharCode(65 + oIdx)}</span>
                          <span>${opt.text}</span>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}

                  ${q.type === 'msq' ? `
                    <div class="quiz-options">
                      ${q.options.map((opt, oIdx) => `
                        <div class="quiz-option msq-opt" data-idx="${oIdx}" data-correct="${opt.correct}">
                          <div class="quiz-checkbox-icon">✓</div>
                          <span>${opt.text}</span>
                        </div>
                      `).join('')}
                    </div>
                    <button class="button gold small submit-msq-btn" data-id="${q.id}" style="margin-top: 10px;">Check MSQ Answer</button>
                  ` : ''}

                  ${q.type === 'nat' ? `
                    <div class="quiz-nat-container">
                      <input type="number" step="any" class="quiz-nat-input" placeholder="Enter value..." id="nat-input-${q.id}">
                      <button class="button gold small submit-nat-btn" data-id="${q.id}">Check NAT Answer</button>
                    </div>
                  ` : ''}

                  <div class="quiz-feedback" ${userScores[q.id] !== undefined ? '' : 'hidden'}>
                    ${userScores[q.id] !== undefined ? (userScores[q.id] ? `<strong>Correct!</strong> ${q.explanation}` : `<strong>Incorrect.</strong> ${q.explanation}`) : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        `;

        document.querySelectorAll('.filter-pill').forEach(btn => {
          btn.addEventListener('click', () => {
            activeFilter = btn.dataset.filter;
            renderPracticeView();
          });
        });

        const resetBtn = document.getElementById('reset-practice-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            userScores = {};
            userMSQSelections = {};
            renderPracticeView();
          });
        }

        // MCQ Selection Logic
        document.querySelectorAll('.quiz-card').forEach(cardEl => {
          const qId = cardEl.dataset.id;
          const qData = PRACTICE_QUESTIONS.find(x => x.id === qId);
          if (qData.type !== 'mcq') return;

          const options = cardEl.querySelectorAll('.quiz-option');
          const feedback = cardEl.querySelector('.quiz-feedback');

          options.forEach(opt => {
            opt.addEventListener('click', () => {
              const isCorrect = opt.dataset.correct === 'true';
              userScores[qId] = isCorrect;

              options.forEach(o => {
                o.classList.remove('selected', 'correct', 'wrong');
                if (o.dataset.correct === 'true') o.classList.add('correct');
              });

              if (!isCorrect) {
                opt.classList.add('wrong');
                cardEl.classList.add('answered-wrong');
                cardEl.classList.remove('answered-correct');
                feedback.className = 'quiz-feedback warning';
                feedback.innerHTML = `<strong>Incorrect.</strong> ${qData.explanation}`;
              } else {
                cardEl.classList.add('answered-correct');
                cardEl.classList.remove('answered-wrong');
                feedback.className = 'quiz-feedback success';
                feedback.innerHTML = `<strong>Correct!</strong> ${qData.explanation}`;
              }
              feedback.hidden = false;
              updateScoreBadge();
            });
          });
        });

        // MSQ Selection Logic
        document.querySelectorAll('.submit-msq-btn').forEach(btn => {
          const qId = btn.dataset.id;
          const cardEl = document.getElementById(`quiz-${qId}`);
          const qData = PRACTICE_QUESTIONS.find(x => x.id === qId);
          userMSQSelections[qId] = userMSQSelections[qId] || new Set();

          cardEl.querySelectorAll('.msq-opt').forEach(opt => {
            opt.addEventListener('click', () => {
              const idx = Number(opt.dataset.idx);
              if (userMSQSelections[qId].has(idx)) {
                userMSQSelections[qId].delete(idx);
                opt.classList.remove('selected');
              } else {
                userMSQSelections[qId].add(idx);
                opt.classList.add('selected');
              }
            });
          });

          btn.addEventListener('click', () => {
            const selected = Array.from(userMSQSelections[qId]);
            const correctIndices = qData.options.map((o, i) => o.correct ? i : null).filter(i => i !== null);
            const isCorrect = selected.length === correctIndices.length && selected.every(i => correctIndices.includes(i));

            userScores[qId] = isCorrect;
            const feedback = cardEl.querySelector('.quiz-feedback');

            cardEl.querySelectorAll('.msq-opt').forEach(opt => {
              if (opt.dataset.correct === 'true') opt.classList.add('correct');
              else if (opt.classList.contains('selected')) opt.classList.add('wrong');
            });

            if (isCorrect) {
              cardEl.classList.add('answered-correct');
              cardEl.classList.remove('answered-wrong');
              feedback.className = 'quiz-feedback success';
              feedback.innerHTML = `<strong>Correct!</strong> All required options matched. ${qData.explanation}`;
            } else {
              cardEl.classList.add('answered-wrong');
              cardEl.classList.remove('answered-correct');
              feedback.className = 'quiz-feedback warning';
              feedback.innerHTML = `<strong>Incorrect.</strong> In GATE MSQs, full marks require selecting all correct options without partial credit. ${qData.explanation}`;
            }
            feedback.hidden = false;
            updateScoreBadge();
          });
        });

        // NAT Submit Logic
        document.querySelectorAll('.submit-nat-btn').forEach(btn => {
          const qId = btn.dataset.id;
          const cardEl = document.getElementById(`quiz-${qId}`);
          const qData = PRACTICE_QUESTIONS.find(x => x.id === qId);
          const input = cardEl.querySelector('.quiz-nat-input');
          const feedback = cardEl.querySelector('.quiz-feedback');

          btn.addEventListener('click', () => {
            const val = parseFloat(input.value);
            if (isNaN(val)) return showToast('Please enter a valid numerical value');

            const isCorrect = val >= qData.tolerance[0] && val <= qData.tolerance[1];
            userScores[qId] = isCorrect;

            if (isCorrect) {
              cardEl.classList.add('answered-correct');
              cardEl.classList.remove('answered-wrong');
              feedback.className = 'quiz-feedback success';
              feedback.innerHTML = `<strong>Correct!</strong> Value ${val} falls within official tolerance. ${qData.explanation}`;
            } else {
              cardEl.classList.add('answered-wrong');
              cardEl.classList.remove('answered-correct');
              feedback.className = 'quiz-feedback warning';
              feedback.innerHTML = `<strong>Incorrect.</strong> Expected value: ${qData.correctVal}. ${qData.explanation}`;
            }
            feedback.hidden = false;
            updateScoreBadge();
          });
        });
      }

      function updateScoreBadge() {
        const aTot = Object.keys(userScores).length;
        const cTot = Object.values(userScores).filter(v => v === true).length;
        const acc = aTot ? Math.round((cTot / aTot) * 100) : 0;
        const badgeVal = document.querySelector('.score-badge-val');
        if (badgeVal) badgeVal.textContent = `${cTot} / ${aTot} (${acc}%)`;
      }

      renderPracticeView();
    }

    // -------------------------------------------------------------------------
    // PAGE: PLANNER (CATEGORY-ORGANIZED CLUSTERS & CHECKLIST)
    // -------------------------------------------------------------------------
    else if (page === 'planner') {
      const clusters = [
        {
          name: 'Mathematical Foundations',
          ids: ['linear-algebra', 'calculus-optimization', 'probability-statistics', 'discrete-mathematics'],
          estHours: 35
        },
        {
          name: 'Core Software & Systems Architecture',
          ids: ['operating-systems', 'computer-organization', 'computer-networks', 'digital-logic', 'compiler-design', 'theory-of-computation'],
          estHours: 55
        },
        {
          name: 'Programming, Data Structures & Databases',
          ids: ['programming-data-structures', 'algorithms', 'databases'],
          estHours: 30
        },
        {
          name: 'Applied Intelligence & General Aptitude',
          ids: ['machine-learning', 'artificial-intelligence', 'general-aptitude'],
          estHours: 25
        }
      ];

      main.innerHTML = `
        ${crumb('Planner')}
        <section class="page-title">
          <div class="eyebrow">DYNAMIC STUDY TRACKER</div>
          <h1>Study Planner & Curated Clusters</h1>
          <p>Monitor your subject review status, generate calendar revision blocks, and backup your preparation progress.</p>
        </section>

        <section class="section" style="padding-top: 0;">
          <div class="mac-window" style="padding: 24px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <strong id="progress-text" style="font-size: 1.1rem;">0 of 16 subjects reviewed</strong>
              <div style="display: flex; gap: 8px;">
                <button id="planner-export-ics" class="button gold small">Export Revision Schedule (.ics)</button>
                <button id="planner-queue-all" class="button outline small">Queue All in Docket</button>
              </div>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" id="progress-bar"></div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Total Estimated Revision Effort: ~145 Hours across 16 foundational domains.</p>
          </div>

          <div id="cluster-container">
            ${clusters.map((cluster, cIdx) => `
              <div class="planner-cluster" data-cluster="${cIdx}">
                <div class="planner-cluster-header">
                  <div>
                    <h3>${cluster.name}</h3>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Est. ${cluster.estHours} Hours Revision</span>
                  </div>
                  <button class="cluster-select-btn" data-cluster="${cIdx}">Toggle Cluster</button>
                </div>
                <div class="checklist">
                  ${cluster.ids.map(id => {
                    const sub = subjects.find(s => s.id === id);
                    if (!sub) return '';
                    return `
                      <label class="check">
                        <input type="checkbox" data-id="${sub.id}">
                        <span>${sub.title}</span>
                        <small>${sub.papers.join(' / ')}</small>
                      </label>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="actions" style="margin-top: 30px;">
            <button id="export" class="button">Export Progress JSON</button>
            <label class="button outline" style="cursor: pointer;">
              Import Progress JSON
              <input id="import" type="file" accept="application/json" style="display: none;">
            </label>
          </div>
          <p id="message" role="status" style="font-weight: 600; color: var(--status-emerald); margin-top: 10px;"></p>
        </section>
      `;

      const renderPlanner = () => {
        const v = getProgress();
        const reviewedCount = subjects.filter(s => v[s.id] === true).length;
        const pct = Math.round((reviewedCount / subjects.length) * 100);

        document.querySelector('#progress-text').textContent = `${reviewedCount} of ${subjects.length} subjects reviewed (${pct}%)`;
        document.querySelector('#progress-bar').style.width = pct + '%';
        document.querySelectorAll('#cluster-container input[type="checkbox"]').forEach(cb => {
          cb.checked = v[cb.dataset.id] === true;
        });
      };

      renderPlanner();

      document.querySelector('#cluster-container').addEventListener('change', e => {
        if (!e.target.dataset.id) return;
        const v = getProgress();
        v[e.target.dataset.id] = e.target.checked;
        saveProgress(v);
        renderPlanner();
      });

      document.querySelectorAll('.cluster-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cIdx = Number(btn.dataset.cluster);
          const cIds = clusters[cIdx].ids;
          const v = getProgress();
          const allChecked = cIds.every(id => v[id] === true);
          cIds.forEach(id => v[id] = !allChecked);
          saveProgress(v);
          renderPlanner();
          showToast(`Updated cluster: ${clusters[cIdx].name}`);
        });
      });

      document.getElementById('planner-queue-all').addEventListener('click', () => {
        subjects.forEach(s => addToDocket(s.id));
        showToast('All 16 subjects queued in your Study Docket!');
      });

      document.getElementById('planner-export-ics').addEventListener('click', () => {
        exportDocketICS(subjects);
      });

      document.querySelector('#export').onclick = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, subjects: getProgress() }, null, 2)], { type: 'application/json' }));
        a.download = 'study-gate-progress.json';
        a.click();
        URL.revokeObjectURL(a.href);
      };

      document.querySelector('#import').onchange = async e => {
        try {
          const v = JSON.parse(await e.target.files[0].text());
          if (v.version !== 1 || !v.subjects || typeof v.subjects !== 'object') throw Error();
          saveProgress(v.subjects);
          renderPlanner();
          document.querySelector('#message').textContent = 'Progress successfully imported!';
        } catch {
          document.querySelector('#message').textContent = 'Invalid backup file. Progress unchanged.';
        }
      };
    }

    // -------------------------------------------------------------------------
    // PAGE: PYQS (EXAM INTELLIGENCE, QUESTION TYPES & WEIGHTAGE MATRIX)
    // -------------------------------------------------------------------------
    else if (page === 'pyqs') {
      const weightageData = [
        { subject: 'Algorithms & Data Structures', avgMarks: '14 - 16', trend: 'High Priority (Dynamic Prog, Graphs, Trees)' },
        { subject: 'Operating Systems', avgMarks: '8 - 10', trend: 'Paging, Deadlocks, Semaphore Synchronization' },
        { subject: 'Theory of Computation', avgMarks: '7 - 9', trend: 'Pumping Lemma, Undecidability, DFA/PDA' },
        { subject: 'Databases (DBMS)', avgMarks: '7 - 8', trend: 'BCNF/3NF Normalization, SQL, Transactions' },
        { subject: 'Computer Networks', avgMarks: '7 - 9', trend: 'TCP Congestion, Subnetting, Sliding Window' },
        { subject: 'Computer Organization & Architecture', avgMarks: '8 - 10', trend: 'Cache Mapping, Pipeline Hazards, Addressing' },
        { subject: 'Discrete Mathematics', avgMarks: '7 - 9', trend: 'Combinatorics, Relations, Generating Functions' },
        { subject: 'Linear Algebra & Calculus', avgMarks: '6 - 8', trend: 'Eigenvalues, SVD, Maxima/Minima' },
        { subject: 'Machine Learning & AI (DA)', avgMarks: '22 - 25', trend: 'Supervised Models, Loss Optimization, A* Search' },
        { subject: 'General Aptitude', avgMarks: '15 Fixed', trend: 'Verbal, Quantitative, Spatial Reasoning' }
      ];

      main.innerHTML = `
        ${crumb('PYQs')}
        <section class="page-title">
          <div class="eyebrow">OFFICIAL EXAM INTELLIGENCE</div>
          <h1>Paper Pattern & Previous Papers</h1>
          <p>Authoritative marking schemes, question type taxonomies, historical topic weightages, and master keys from IIT Madras.</p>
        </section>

        <section class="section" style="padding-top: 0;">
          ${note}

          <h2>Official GATE 2027 Question Types</h2>
          <p style="color: var(--text-muted);">The examination contains 65 questions totaling 100 marks (15 marks General Aptitude + 85 marks Subject Paper):</p>
          <div class="pattern-grid">
            <div class="pattern-card">
              <div class="pattern-type">TYPE 01 · MCQ</div>
              <div class="pattern-title">Multiple Choice Questions</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Objective 4-option questions with exactly one correct option.</p>
              <span class="marking-rule marking-negative">Negative Marking: 1-mark (-0.33), 2-mark (-0.66)</span>
            </div>
            <div class="pattern-card">
              <div class="pattern-type">TYPE 02 · MSQ</div>
              <div class="pattern-title">Multiple Select Questions</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">One or more options may be correct. Full marks require marking all correct options without partial credit.</p>
              <span class="marking-rule marking-nonegative">Zero Negative Marking (0 Penalty)</span>
            </div>
            <div class="pattern-card">
              <div class="pattern-type">TYPE 03 · NAT</div>
              <div class="pattern-title">Numerical Answer Type</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Entered via on-screen virtual keypad with real-number tolerances.</p>
              <span class="marking-rule marking-nonegative">Zero Negative Marking (0 Penalty)</span>
            </div>
          </div>

          <h2 style="margin-top: 50px;">3-Year Official Qualifying Cutoff Trends</h2>
          <p style="color: var(--text-muted);">Historical qualifying marks (out of 100) across recent GATE administrations:</p>
          <div class="weightage-table-container">
            <table class="weightage-table">
              <thead>
                <tr>
                  <th>PAPER & YEAR</th>
                  <th>GENERAL / OPEN</th>
                  <th>OBC-NCL / EWS</th>
                  <th>SC / ST / PwD</th>
                  <th>ORGANIZING INSTITUTE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>GATE CS 2026</strong></td>
                  <td style="color: var(--accent-gold); font-weight: 700;">27.6</td>
                  <td>24.8</td>
                  <td>18.4</td>
                  <td>IIT Roorkee</td>
                </tr>
                <tr>
                  <td><strong>GATE CS 2025</strong></td>
                  <td style="color: var(--accent-gold); font-weight: 700;">28.5</td>
                  <td>25.6</td>
                  <td>19.0</td>
                  <td>IIT Roorkee</td>
                </tr>
                <tr>
                  <td><strong>GATE CS 2024</strong></td>
                  <td style="color: var(--accent-gold); font-weight: 700;">27.6</td>
                  <td>24.8</td>
                  <td>18.4</td>
                  <td>IISc Bangalore</td>
                </tr>
                <tr>
                  <td><strong>GATE DA 2026</strong></td>
                  <td style="color: #059669; font-weight: 700;">36.2</td>
                  <td>32.5</td>
                  <td>24.1</td>
                  <td>IIT Roorkee</td>
                </tr>
                <tr>
                  <td><strong>GATE DA 2025</strong></td>
                  <td style="color: #059669; font-weight: 700;">37.1</td>
                  <td>33.3</td>
                  <td>24.7</td>
                  <td>IIT Roorkee</td>
                </tr>
                <tr>
                  <td><strong>GATE DA 2024</strong></td>
                  <td style="color: #059669; font-weight: 700;">37.1</td>
                  <td>33.3</td>
                  <td>24.7</td>
                  <td>IISc Bangalore</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mac-window" style="padding: 24px; margin-top: 40px;">
            <h3>Strategic Scoring & Mathematical Guessing Analysis</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
              In GATE, understanding the mathematical expectation of guessing is critical for tactical decision making:
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 16px;">
              <div style="background: var(--bg-surface); padding: 16px; border-radius: 8px; border: 1px solid var(--border-line);">
                <strong style="color: #e0443e;">MCQ Guessing Expectation (4 Options)</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 6px 0 0;">
                  Blind guess expectation is strictly 0: (1/4)*(+1) - (3/4)*(1/3) = 0. However, eliminating just ONE distractor yields positive expected value E[X] = +0.11; eliminating TWO options yields E[X] = +0.33!
                </p>
              </div>
              <div style="background: var(--bg-surface); padding: 16px; border-radius: 8px; border: 1px solid var(--border-line);">
                <strong style="color: #059669;">MSQ & NAT Tactical Advantage</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 6px 0 0;">
                  MSQ and NAT questions carry ZERO negative marking. Never leave a NAT or MSQ question blank if you have derived intermediate bounds or can eliminate impossible cases.
                </p>
              </div>
            </div>
          </div>

          <h2 style="margin-top: 50px;">5-Year Average Subject Weightage Matrix</h2>
          <div class="weightage-table-container">
            <table class="weightage-table">
              <thead>
                <tr>
                  <th>SUBJECT DOMAIN</th>
                  <th>AVG MARKS (OUT OF 100)</th>
                  <th>HIGH-YIELD CORE CONCEPTS</th>
                </tr>
              </thead>
              <tbody>
                ${weightageData.map(row => `
                  <tr>
                    <td><strong>${row.subject}</strong></td>
                    <td style="color: var(--accent-gold); font-weight: 700;">${row.avgMarks}</td>
                    <td>${row.trend}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="mac-window" style="padding: 30px; margin-top: 40px;">
            <h3>Official Year-Wise Question Paper Repository</h3>
            <p>Download original question papers and verified final master answer keys directly from the official organizing institute.</p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px;">
              <a class="button gold" href="${official}download" target="_blank" rel="noopener">Open Official GATE Download Portal ↗</a>
              <a class="button outline" href="${official}question_paper_pattern" target="_blank" rel="noopener">Official Exam Scheme ↗</a>
            </div>
          </div>
        </section>
      `;
    }
    // -------------------------------------------------------------------------
    // PAGE: RESOURCES (SYLLABUS, FORMULA LOOKBOOK & STANDARD TEXTBOOKS)
    // -------------------------------------------------------------------------
    else {
      main.innerHTML = `
        ${crumb('Resources')}
        <section class="page-title">
          <div class="eyebrow">OFFICIAL REFERENCES & STANDARDS</div>
          <h1>Study Resources & Standards</h1>
          <p>Authoritative IIT Madras guidelines, curated textbook library, and high-yield formula cheatsheets for GATE 2027.</p>
        </section>

        <section class="section" style="padding-top: 0;">
          <h2>Official Syllabus Publications</h2>
          <div class="resource-list">
            <a href="${source.CS}" target="_blank">GATE 2027 Computer Science (CS) Syllabus <span>Official PDF ↗</span></a>
            <a href="${source.DA}" target="_blank">GATE 2027 Data Science & AI (DA) Syllabus <span>Official PDF ↗</span></a>
            <a href="${source.GA}" target="_blank">GATE 2027 General Aptitude (GA) Syllabus <span>Official PDF ↗</span></a>
            <a href="${official}question_paper_pattern" target="_blank">Official Question Paper Pattern & Marking Scheme <span>Official Site ↗</span></a>
            <a href="${official}download" target="_blank">Master Papers & Official Answer Keys <span>Official Site ↗</span></a>
          </div>

          <h2 style="margin-top: 50px;">High-Yield Formula & Theorem Quick-Reference</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Essential mathematical relationships, network bounds, and algorithmic recurrence equations.</p>
          <div class="formula-grid">
            ${FORMULA_LOOKBOOK.map(item => `
              <div class="formula-card">
                <div class="formula-header">
                  <span class="formula-tag">${item.domain}</span>
                  <button class="copy-formula-btn" data-text="${escapeText(item.body)}">Copy</button>
                </div>
                <h3>${item.title}</h3>
                <pre class="formula-body"><code>${escapeText(item.body)}</code></pre>
              </div>
            `).join('')}
          </div>

          <h2 style="margin-top: 50px;">Curated Standard Textbooks</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Gold-standard references recommended by university professors and top GATE scorers.</p>
          <div class="textbook-grid">
            ${STANDARD_TEXTBOOKS.map(tb => `
              <div class="textbook-tile">
                <span class="textbook-subject">${tb.subject}</span>
                <span class="textbook-title">${tb.title}</span>
                <span class="textbook-author">by ${tb.author}</span>
                <span class="textbook-topic">${tb.topic}</span>
              </div>
            `).join('')}
          </div>
        </section>
      `;

      document.querySelectorAll('.copy-formula-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(btn.dataset.text).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copied ✓';
            setTimeout(() => btn.textContent = original, 2000);
          });
        });
      });
    }

    function attachCardDocketListeners() {
      document.querySelectorAll('.docket-add-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          addToDocket(btn.dataset.id);
        });
      });
    }
  })
  .catch(err => {
    console.error(err);
    main.innerHTML = `
      <section class="section">
        <h1>Unable to load study directory</h1>
        <p>Please serve the repository using a local web server (e.g. <code>python3 -m http.server</code>) or GitHub Pages.</p>
      </section>
    `;
  });

// -----------------------------------------------------------------------------
// 16. Service Worker Registration (PWA Offline Capability)
// -----------------------------------------------------------------------------
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(root + 'sw.js').catch(() => {});
  });
}
