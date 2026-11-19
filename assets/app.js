/**
 * Study GATE Exam with Arshad - Core Application Engine
 * Aesthetics: Apple-Inspired Editorial Minimalism · Velvet Burgundy & Champagne Gold
 * Features: Zero-Flash Dual Theme, Cmd+K Spotlight, 3D Kinetic Canvas, 
 *           Career Matchmaker Wizard, Study Docket Drawer, Self-Assessment Quizzes,
 *           Mac-Style Derivation Blocks, SVG Lookbook with Native <dialog>,
 *           Reading Progress & Scroll-Spy, Direct Calendar (.ics) Generator.
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
// 3. Calendar Revision Integration (.ics Generator)
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
    // Schedule one subject revision block every consecutive evening at 18:00
    const start = new Date(now);
    start.setDate(now.getDate() + idx + 1);
    start.setHours(18, 0, 0, 0);
    const end = new Date(start);
    end.setHours(20, 0, 0, 0); // 2 hour session

    const pad = n => String(n).padStart(2, '0');
    const toICSDate = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:gate2027-${sub.id}-${start.getTime()}@studygate.org`);
    icsContent.push(`DTSTAMP:${toICSDate(now)}Z`);
    icsContent.push(`DTSTART:${toICSDate(start)}`);
    icsContent.push(`DTEND:${toICSDate(end)}`);
    icsContent.push(`SUMMARY:GATE 2027 Revision: ${sub.title} (${sub.papers.join('/')})`);
    icsContent.push(`DESCRIPTION:Topics to cover:\\n${sub.syllabus.replace(/,/g, '\\,')}\\n\\nIndependent GATE preparation portal with Arshad.`);
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

// -----------------------------------------------------------------------------
// 4. Curated Technical Lookbook & Derivations Dictionary
// -----------------------------------------------------------------------------
const SUBJECT_EXTRAS = {
  'discrete-mathematics': {
    formulaName: 'Generating Function & Recurrence Relation',
    lang: 'Mathematical Derivation',
    derivation: `Linear Homogeneous Recurrence: a_n = c_1 a_{n-1} + c_2 a_{n-2}
Characteristic Equation: r^2 - c_1 r - c_2 = 0
Roots r_1, r_2:
  Case 1 (Distinct Real): a_n = A(r_1)^n + B(r_2)^n
  Case 2 (Repeated Real): a_n = (A + Bn)(r_1)^n
Generating Function Transformation:
  G(x) = sum_{n=0}^{infinity} a_n x^n
  x * G(x) = sum_{n=1}^{infinity} a_{n-1} x^n
  => G(x)(1 - c_1 x - c_2 x^2) = a_0 + (a_1 - c_1 a_0)x`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><rect width="320" height="180" fill="transparent"/><circle cx="80" cy="50" r="18" stroke="#c5a059" stroke-width="2" fill="rgba(197,160,89,0.15)"/><text x="80" y="55" fill="#c5a059" text-anchor="middle" font-size="12" font-family="monospace">V1</text><circle cx="240" cy="50" r="18" stroke="#c5a059" stroke-width="2" fill="rgba(197,160,89,0.15)"/><text x="240" y="55" fill="#c5a059" text-anchor="middle" font-size="12" font-family="monospace">V2</text><circle cx="160" cy="130" r="18" stroke="#059669" stroke-width="2" fill="rgba(5,150,105,0.15)"/><text x="160" y="135" fill="#059669" text-anchor="middle" font-size="12" font-family="monospace">V3</text><line x1="98" y1="50" x2="222" y2="50" stroke="#c5a059" stroke-width="2"/><line x1="93" y1="63" x2="147" y2="117" stroke="#059669" stroke-width="2"/><line x1="227" y1="63" x2="173" y2="117" stroke="#059669" stroke-width="2"/><text x="160" y="35" fill="#999" font-size="10" text-anchor="middle">Chrom. Number chi(G) = 3 (K_3 Graph)</text></svg>`,
    caption: 'Graph Coloring & Chromatic Number Topology'
  },
  'linear-algebra': {
    formulaName: 'Eigenvalues & Singular Value Decomposition (SVD)',
    lang: 'Linear Algebra',
    derivation: `Characteristic Equation: det(A - lambda * I) = 0
Properties of Eigenvalues lambda_i:
  1. sum(lambda_i) = Trace(A)
  2. prod(lambda_i) = det(A)
  3. A is invertible <=> lambda_i != 0 for all i
Singular Value Decomposition (SVD):
  A = U * Sigma * V^T
  U: m x m orthogonal matrix (eigenvectors of A * A^T)
  Sigma: m x n diagonal singular values sigma_i = sqrt(lambda_i(A^T A))
  V: n x n orthogonal matrix (eigenvectors of A^T * A)`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><rect width="320" height="180" fill="transparent"/><line x1="40" y1="140" x2="280" y2="140" stroke="#666" stroke-width="1.5"/><line x1="160" y1="20" x2="160" y2="160" stroke="#666" stroke-width="1.5"/><ellipse cx="160" cy="90" rx="90" ry="45" stroke="#c5a059" stroke-width="2" fill="rgba(197,160,89,0.1)" transform="rotate(-20 160 90)"/><line x1="160" y1="90" x2="240" y2="60" stroke="#e0443e" stroke-width="2.5"/><text x="250" y="60" fill="#e0443e" font-size="11" font-weight="700">sigma_1 u_1</text><line x1="160" y1="90" x2="145" y2="48" stroke="#059669" stroke-width="2.5"/><text x="140" y="40" fill="#059669" font-size="11" font-weight="700">sigma_2 u_2</text></svg>`,
    caption: 'Geometric Transformation & Principal Hyperellipsoid in SVD'
  },
  'calculus-optimization': {
    formulaName: 'Taylor Series & Gradient Optimization',
    lang: 'Multivariable Calculus',
    derivation: `Multivariate Taylor Expansion around x_0:
  f(x) approx f(x_0) + grad f(x_0)^T (x - x_0) + 1/2 (x - x_0)^T H(x_0) (x - x_0)
where H is the Hessian Matrix: H_{ij} = d^2 f / (d x_i d x_j)
Stationary Point Conditions:
  grad f(x*) = 0
  H(x*) Positive Definite (all lambda > 0) => Local Strict Minimum
  H(x*) Negative Definite (all lambda < 0) => Local Strict Maximum
  H(x*) Indefinite (mixed signs)         => Saddle Point`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><path d="M40 140 Q 160 20 280 140" fill="none" stroke="#c5a059" stroke-width="2.5"/><circle cx="160" cy="80" r="5" fill="#059669"/><line x1="100" y1="80" x2="220" y2="80" stroke="#059669" stroke-dasharray="4" stroke-width="2"/><text x="160" y="65" fill="#059669" font-size="11" text-anchor="middle" font-weight="700">f'(x*) = 0 (Global Minimum)</text></svg>`,
    caption: 'Stationary Extremum and Curvature'
  },
  'probability-statistics': {
    formulaName: "Bayes' Law & Central Limit Theorem",
    lang: 'Probability Theory',
    derivation: `Bayes' Rule:
  P(A_i | B) = [ P(B | A_i) * P(A_i) ] / sum_{j=1}^k [ P(B | A_j) * P(A_j) ]

Central Limit Theorem (CLT):
  Given i.i.d random variables X_1, X_2, ..., X_n with mean mu and variance sigma^2:
  Sample Mean X_bar = (1/n) * sum(X_i)
  As n -> infinity:
  Z = (X_bar - mu) / (sigma / sqrt(n))  ---> N(0, 1)`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><path d="M 40 150 C 110 150, 130 30, 160 30 C 190 30, 210 150, 280 150" fill="rgba(197,160,89,0.15)" stroke="#c5a059" stroke-width="2.5"/><line x1="160" y1="30" x2="160" y2="150" stroke="#e0443e" stroke-dasharray="3" stroke-width="1.5"/><text x="160" y="165" fill="#666" font-size="10" text-anchor="middle">mu (Mean)</text><text x="210" y="110" fill="#c5a059" font-size="10">+1 sigma</text></svg>`,
    caption: 'Gaussian Bell Curve Distribution (CLT Convergence)'
  },
  'computer-organization': {
    formulaName: 'Cache Memory EAT & Pipeline Speedup',
    lang: 'Computer Architecture',
    derivation: `Effective Access Time (EAT) with Hierarchical Cache:
  EAT = H_1 * T_1 + (1 - H_1) * [ H_2 * (T_1 + T_2) + (1 - H_2) * (T_1 + T_2 + T_mem) ]
  where H_i = Hit Ratio at Level i, T_i = Access Latency.

Pipeline Speedup:
  Speedup S = Non-pipelined Time / Pipelined Time
            = (n * k * tau) / [ (k + n - 1) * tau + Stalls ]
  Ideal Limit (as n -> infinity, Stalls = 0): Speedup = k (number of stages)`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><rect x="30" y="30" width="60" height="25" fill="#4a0e17" rx="4"/><text x="60" y="46" fill="#fff" font-size="9" text-anchor="middle">CPU Core</text><rect x="110" y="30" width="55" height="25" fill="#c5a059" rx="4"/><text x="137" y="46" fill="#111" font-size="9" text-anchor="middle">L1 Cache</text><rect x="185" y="30" width="55" height="25" fill="#a8853b" rx="4"/><text x="212" y="46" fill="#111" font-size="9" text-anchor="middle">L2 Cache</text><rect x="255" y="20" width="50" height="45" fill="#333" rx="4"/><text x="280" y="47" fill="#fff" font-size="9" text-anchor="middle">RAM</text><line x1="90" y1="42" x2="110" y2="42" stroke="#666" stroke-width="2"/><line x1="165" y1="42" x2="185" y2="42" stroke="#666" stroke-width="2"/><line x1="240" y1="42" x2="255" y2="42" stroke="#666" stroke-width="2"/><text x="160" y="120" fill="#999" font-size="10" text-anchor="middle">Hierarchy: Trade-off between capacity and latency</text></svg>`,
    caption: 'Memory Hierarchy Latency vs Capacity Pyramid'
  },
  'algorithms': {
    formulaName: "Master Theorem for Divide & Conquer",
    lang: 'Algorithm Analysis',
    derivation: `Recurrence: T(n) = a * T(n/b) + f(n), where a >= 1, b > 1
Critical Value: c_crit = log_b(a)
Case 1: f(n) = O(n^{c_crit - epsilon}) for epsilon > 0
        => T(n) = Theta(n^{log_b(a)})
Case 2: f(n) = Theta(n^{c_crit} * log^k(n)) for k >= 0
        => T(n) = Theta(n^{log_b(a)} * log^{k+1}(n))
Case 3: f(n) = Omega(n^{c_crit + epsilon}) and regularity holds
        => T(n) = Theta(f(n))`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><circle cx="160" cy="30" r="14" fill="#c5a059"/><text x="160" y="34" fill="#111" font-size="9" text-anchor="middle">T(n)</text><circle cx="90" cy="85" r="12" fill="#c5a059"/><text x="90" y="89" fill="#111" font-size="8" text-anchor="middle">T(n/2)</text><circle cx="230" cy="85" r="12" fill="#c5a059"/><text x="230" y="89" fill="#111" font-size="8" text-anchor="middle">T(n/2)</text><line x1="150" y1="42" x2="100" y2="75" stroke="#666" stroke-width="2"/><line x1="170" y1="42" x2="220" y2="75" stroke="#666" stroke-width="2"/><text x="160" y="150" fill="#999" font-size="10" text-anchor="middle">Recursion Tree: Total Work per Level = sum c*n</text></svg>`,
    caption: 'Recursion Tree Level-Wise Cost Partitioning'
  },
  'operating-systems': {
    formulaName: "Banker's Algorithm & Effective Paging Time",
    lang: 'Systems & OS',
    derivation: `Banker's Safety Algorithm Check:
  Need[i][j] = Max[i][j] - Allocation[i][j]
  If Need_i <= Work:
     Work = Work + Allocation_i
     Finish[i] = true
  Safe Sequence exists <=> all Finish[i] == true

Two-Level Paging with TLB:
  EAT = Hit_TLB * (t_TLB + t_mem) + (1 - Hit_TLB) * (t_TLB + 2 * t_mem + t_mem)
      = t_TLB + t_mem + (1 - Hit_TLB) * 2 * t_mem`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><rect x="30" y="40" width="80" height="40" fill="#4a0e17" rx="6"/><text x="70" y="65" fill="#fff" font-size="10" text-anchor="middle">CPU (VA)</text><rect x="140" y="30" width="60" height="60" fill="#c5a059" rx="6"/><text x="170" y="65" fill="#111" font-size="10" text-anchor="middle">TLB</text><rect x="230" y="30" width="70" height="80" fill="#2d0a0f" rx="6"/><text x="265" y="75" fill="#fff" font-size="10" text-anchor="middle">Page Table</text><line x1="110" y1="60" x2="140" y2="60" stroke="#c5a059" stroke-width="2"/><line x1="200" y1="60" x2="230" y2="60" stroke="#059669" stroke-width="2"/><text x="160" y="150" fill="#999" font-size="10" text-anchor="middle">Virtual Address -> TLB Hit -> Physical Frame</text></svg>`,
    caption: 'TLB Translation Lookaside Buffer Acceleration'
  },
  'databases': {
    formulaName: "Relational Normal Forms & Lossless Decomposition",
    lang: 'Database Normalization',
    derivation: `Decomposition R into (R1, R2) is Lossless-Join if and only if:
  (R1 cap R2) -> R1 in F+  OR  (R1 cap R2) -> R2 in F+
(i.e., common attribute must be a Super Key of at least one relation)

Normal Form Hierarchy:
  1NF: Atomic attribute domain values.
  2NF: 1NF + No partial dependency (Non-prime attribute -> part of candidate key).
  3NF: 2NF + For every X -> A, either X is a Super Key OR A is a prime attribute.
  BCNF: For every X -> A, X MUST be a Super Key.`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><ellipse cx="160" cy="90" rx="140" ry="75" fill="none" stroke="#666" stroke-width="1.5"/><text x="160" y="35" fill="#777" font-size="9" text-anchor="middle">1NF</text><ellipse cx="160" cy="95" rx="110" ry="60" fill="none" stroke="#c5a059" stroke-width="1.5"/><text x="160" y="55" fill="#c5a059" font-size="9" text-anchor="middle">2NF</text><ellipse cx="160" cy="100" rx="80" ry="45" fill="none" stroke="#059669" stroke-width="1.5"/><text x="160" y="75" fill="#059669" font-size="9" text-anchor="middle">3NF</text><ellipse cx="160" cy="105" rx="50" ry="30" fill="rgba(74,14,23,0.3)" stroke="#e0443e" stroke-width="2"/><text x="160" y="110" fill="#e0443e" font-size="10" text-anchor="middle" font-weight="700">BCNF</text></svg>`,
    caption: 'Strict Inclusion Hierarchy of Relational Normal Forms'
  },
  'theory-of-computation': {
    formulaName: "Pumping Lemma for Regular Languages",
    lang: 'Formal Languages',
    derivation: `Let L be a regular language with pumping length p.
Any string w in L with |w| >= p can be split into w = x y z such that:
  1. |y| >= 1  (non-empty pumpable segment)
  2. |x y| <= p (pump occurs in the prefix)
  3. For all i >= 0, x (y^i) z in L
Contrapositive Method:
  Choose string w in L of length >= p.
  Show that for EVERY partition w = xyz meeting (1) & (2),
  there exists some i such that x (y^i) z NOT in L => L is NOT regular.`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><ellipse cx="160" cy="90" rx="145" ry="75" fill="none" stroke="#666" stroke-width="1.5"/><text x="160" y="32" fill="#777" font-size="9" text-anchor="middle">Type 0: Recursively Enumerable (Turing Machine)</text><ellipse cx="160" cy="98" rx="115" ry="58" fill="none" stroke="#c5a059" stroke-width="1.5"/><text x="160" y="58" fill="#c5a059" font-size="9" text-anchor="middle">Type 1: Context-Sensitive</text><ellipse cx="160" cy="105" rx="85" ry="42" fill="none" stroke="#059669" stroke-width="1.5"/><text x="160" y="80" fill="#059669" font-size="9" text-anchor="middle">Type 2: Context-Free (PDA)</text><ellipse cx="160" cy="112" rx="55" ry="26" fill="rgba(197,160,89,0.2)" stroke="#e0443e" stroke-width="2"/><text x="160" y="117" fill="#e0443e" font-size="10" text-anchor="middle" font-weight="700">Type 3: Regular (DFA)</text></svg>`,
    caption: 'Chomsky Hierarchy of Formal Languages & Automata'
  },
  'compiler-design': {
    formulaName: "FIRST and FOLLOW Sets for LL(1) Parsing",
    lang: 'Syntax Analysis',
    derivation: `Rules for FIRST(X):
  1. If X is terminal, FIRST(X) = { X }.
  2. If X -> epsilon, add epsilon to FIRST(X).
  3. If X -> Y_1 Y_2 ... Y_k:
     Add FIRST(Y_1) - {epsilon}. If epsilon in FIRST(Y_1), add FIRST(Y_2)...
Rules for FOLLOW(A):
  1. Add $ to FOLLOW(S) where S is start symbol.
  2. If A -> alpha B beta, add FIRST(beta) - {epsilon} to FOLLOW(B).
  3. If A -> alpha B or A -> alpha B beta where epsilon in FIRST(beta):
     Add FOLLOW(A) to FOLLOW(B).`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><rect x="20" y="50" width="55" height="30" fill="#4a0e17" rx="4"/><text x="47" y="69" fill="#fff" font-size="9" text-anchor="middle">Lexer</text><rect x="95" y="50" width="55" height="30" fill="#c5a059" rx="4"/><text x="122" y="69" fill="#111" font-size="9" text-anchor="middle">Parser</text><rect x="170" y="50" width="55" height="30" fill="#059669" rx="4"/><text x="197" y="69" fill="#fff" font-size="9" text-anchor="middle">Semantics</text><rect x="245" y="50" width="55" height="30" fill="#2d0a0f" rx="4"/><text x="272" y="69" fill="#fff" font-size="9" text-anchor="middle">CodeGen</text><line x1="75" y1="65" x2="95" y2="65" stroke="#999" stroke-width="2"/><line x1="150" y1="65" x2="170" y2="65" stroke="#999" stroke-width="2"/><line x1="225" y1="65" x2="245" y2="65" stroke="#999" stroke-width="2"/><text x="160" y="130" fill="#999" font-size="10" text-anchor="middle">Compiler Frontend Pipeline: Tokens -> AST -> IR</text></svg>`,
    caption: 'Compiler Analysis and Synthesis Pipeline Stages'
  },
  'machine-learning': {
    formulaName: "Bias-Variance Decomposition & L2 Regularization",
    lang: 'Statistical Machine Learning',
    derivation: `Mean Squared Error Decomposition for test point x:
  E[(y - f_hat(x))^2] = Bias[f_hat(x)]^2 + Var[f_hat(x)] + sigma_epsilon^2
where:
  Bias[f_hat(x)] = E[f_hat(x)] - f(x)
  Var[f_hat(x)]  = E[(f_hat(x) - E[f_hat(x)])^2]
  sigma_epsilon^2 = Irreducible environmental noise

Ridge Regression (L2 Penalty):
  w* = argmin_w ||X w - y||^2 + lambda * ||w||_2^2
  Closed-Form Solution: w* = (X^T X + lambda * I)^{-1} X^T y
  Adding lambda * I guarantees invertibility even when X^T X is singular!`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><path d="M 40 40 Q 120 130 280 140" fill="none" stroke="#e0443e" stroke-width="2"/><text x="80" y="130" fill="#e0443e" font-size="10">Bias^2</text><path d="M 40 140 Q 200 130 280 40" fill="none" stroke="#059669" stroke-width="2"/><text x="240" y="130" fill="#059669" font-size="10">Variance</text><path d="M 40 120 Q 160 50 280 120" fill="none" stroke="#c5a059" stroke-width="2.5"/><text x="160" y="45" fill="#c5a059" font-size="10" text-anchor="middle" font-weight="700">Total Error (Sweet Spot)</text></svg>`,
    caption: 'Bias-Variance Tradeoff Curve vs Model Complexity'
  },
  'artificial-intelligence': {
    formulaName: "A* Search Admissibility & Alpha-Beta Pruning",
    lang: 'Heuristic Search & AI',
    derivation: `A* Evaluation Function:
  f(n) = g(n) + h(n)
  g(n): Exact cost from start node to current node n.
  h(n): Estimated cost from node n to goal.
Admissibility Condition:
  h(n) <= h*(n) for all n (h never overestimates actual cost).
  => Guarantees finding optimal path on tree search!
Consistency (Monotonicity):
  h(n) <= c(n, a, n') + h(n')
  => Ensures f(n) is monotonically non-decreasing along any path.`,
    svgDiagram: `<svg viewBox="0 0 320 180" width="100%" height="100%"><circle cx="160" cy="30" r="14" fill="#4a0e17"/><text x="160" y="34" fill="#fff" font-size="9" text-anchor="middle">MAX</text><circle cx="90" cy="85" r="12" fill="#c5a059"/><text x="90" y="89" fill="#111" font-size="8" text-anchor="middle">MIN</text><circle cx="230" cy="85" r="12" fill="#c5a059"/><text x="230" y="89" fill="#111" font-size="8" text-anchor="middle">MIN</text><line x1="150" y1="42" x2="100" y2="75" stroke="#666" stroke-width="2"/><line x1="170" y1="42" x2="220" y2="75" stroke="#666" stroke-width="2"/><line x1="220" y1="95" x2="200" y2="130" stroke="#e0443e" stroke-dasharray="3" stroke-width="2"/><text x="240" y="130" fill="#e0443e" font-size="9">Pruned (beta <= alpha)</text></svg>`,
    caption: 'Adversarial Minimax Search Tree with Alpha-Beta Pruning'
  }
};

// -----------------------------------------------------------------------------
// 5. Self-Assessment Practice Question Bank
// -----------------------------------------------------------------------------
const PRACTICE_QUESTIONS = [
  {
    id: 'la-1',
    subject: 'linear-algebra',
    paper: 'CS & DA',
    question: 'Let A be a 2x2 matrix with Trace(A) = 7 and Det(A) = 12. What are the eigenvalues of matrix A?',
    options: [
      { text: '3 and 4', correct: true },
      { text: '2 and 6', correct: false },
      { text: '1 and 12', correct: false },
      { text: '-3 and -4', correct: false }
    ],
    explanation: 'For any matrix, sum of eigenvalues equals Trace(A) = 7, and product of eigenvalues equals Det(A) = 12. Solving lambda^2 - 7*lambda + 12 = 0 gives (lambda - 3)(lambda - 4) = 0, so eigenvalues are 3 and 4.'
  },
  {
    id: 'algo-1',
    subject: 'algorithms',
    paper: 'CS & DA',
    question: 'What is the asymptotic time complexity of the recurrence relation T(n) = 2T(n/2) + n*log(n)?',
    options: [
      { text: 'Theta(n * log^2(n))', correct: true },
      { text: 'Theta(n * log(n))', correct: false },
      { text: 'Theta(n^2)', correct: false },
      { text: 'Theta(n^log_2(3))', correct: false }
    ],
    explanation: 'By the extended Master Theorem: a = 2, b = 2, so n^{log_b(a)} = n^1. Since f(n) = n*log(n) = Theta(n^{log_b(a)} * log^k(n)) with k = 1, Case 2 applies, yielding T(n) = Theta(n * log^{k+1}(n)) = Theta(n * log^2(n)).'
  },
  {
    id: 'os-1',
    subject: 'operating-systems',
    paper: 'CS',
    question: 'A system uses 1-level paging. Memory access time is 100 ns and TLB access time is 20 ns. What is the effective memory access time (EAT) if TLB hit ratio is 90%?',
    options: [
      { text: '130 ns', correct: true },
      { text: '120 ns', correct: false },
      { text: '210 ns', correct: false },
      { text: '110 ns', correct: false }
    ],
    explanation: 'EAT = Hit_TLB * (t_TLB + t_mem) + (1 - Hit_TLB) * (t_TLB + 2 * t_mem). EAT = 0.90 * (20 + 100) + 0.10 * (20 + 200) = 0.90 * 120 + 0.10 * 220 = 108 + 22 = 130 ns.'
  },
  {
    id: 'dbms-1',
    subject: 'databases',
    paper: 'CS & DA',
    question: 'Relation R(A, B, C, D) has functional dependencies F = { A -> B, B -> C, C -> D, D -> A }. In which highest normal form is relation R?',
    options: [
      { text: 'BCNF (Boyce-Codd Normal Form)', correct: true },
      { text: '3NF, but not BCNF', correct: false },
      { text: '2NF, but not 3NF', correct: false },
      { text: '1NF only', correct: false }
    ],
    explanation: 'Since A -> B -> C -> D -> A forms a full cycle, each of {A}, {B}, {C}, and {D} is a candidate key. Because the LHS of every functional dependency in F is a super key, R is in BCNF.'
  },
  {
    id: 'ml-1',
    subject: 'machine-learning',
    paper: 'DA',
    question: 'In Ridge Regression, as the regularization hyperparameter lambda increases from 0 toward infinity, what happens to model bias and variance?',
    options: [
      { text: 'Bias increases, Variance decreases', correct: true },
      { text: 'Bias decreases, Variance increases', correct: false },
      { text: 'Both Bias and Variance increase', correct: false },
      { text: 'Both Bias and Variance decrease', correct: false }
    ],
    explanation: 'Increasing the L2 penalty lambda shrinks weight magnitudes toward zero, restricting model flexibility. This reduces sensitivity to data fluctuations (decreases variance) while increasing systematic simplification error (increases bias).'
  },
  {
    id: 'toc-1',
    subject: 'theory-of-computation',
    paper: 'CS',
    question: 'Is the language L = { a^n b^m | n != m and n, m >= 0 } regular or context-free?',
    options: [
      { text: 'Context-free but not regular', correct: true },
      { text: 'Regular language', correct: false },
      { text: 'Deterministic context-sensitive only', correct: false },
      { text: 'Unrestricted / Non-computable', correct: false }
    ],
    explanation: 'Comparing counts of a and b requires unbounded memory, so L is not regular (verifiable by Pumping Lemma or closure under complement with a*b*). A non-deterministic pushdown automaton can guess whether n > m or n < m, so L is context-free.'
  }
];

// -----------------------------------------------------------------------------
// 6. Interactive 3D Kinetic Canvas (Algorithmic Particles in Hero)
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

  const nodeCount = 38;
  const nodes = [];
  const mouse = { x: -1000, y: -1000, radius: 100 };

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      radius: Math.random() * 2.5 + 2,
      baseRadius: Math.random() * 2.5 + 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const primaryColor = isDark ? 'rgba(229, 193, 88, ' : 'rgba(197, 160, 89, ';
    const dotColor = isDark ? '#e5c158' : '#4a0e17';

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

      // Mouse repulsion / damping
      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        n.x -= (dx / dist) * force * 3;
        n.y -= (dy / dist) * force * 3;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      // Connect constellation edges
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dxx = n.x - n2.x;
        const dyy = n.y - n2.y;
        const d = Math.sqrt(dxx * dxx + dyy * dyy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = primaryColor + (1 - d / 110) * 0.45 + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    animationFrameId = requestAnimationFrame(draw);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw();
  }
}

// -----------------------------------------------------------------------------
// 7. Interactive Career Matchmaker Wizard (CS vs DA Pathway)
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
          ${step.options.map((opt, i) => `
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
      // Calculate outcome
      const csCount = answers.filter(a => a === 'CS').length;
      const daCount = answers.filter(a => a === 'DA').length;
      let recTitle = "Dual Paper Target (GATE CS + GATE DA)";
      let recDesc = "You possess balanced interests across software systems and data-driven intelligence! Because CS and DA share 7 foundational subjects (Linear Algebra, Calculus, Probability, DBMS, Programming & Data Structures, Algorithms, and General Aptitude), you can prepare both concurrently with high synergy.";
      let recAction = "Queue 7 Shared Foundation Subjects";

      if (csCount > daCount) {
        recTitle = "Primary Target: GATE Computer Science (CS)";
        recDesc = "Your preference highlights Core Systems, Architecture, and Formal Computation. GATE CS aligns directly with M.Tech Computer Science admissions and top software research.";
        recAction = "Queue Core CS Subjects";
      } else if (daCount > csCount) {
        recTitle = "Primary Target: GATE Data Science & AI (DA)";
        recDesc = "Your affinity focuses on Machine Learning, Applied Statistics, and AI Foundations. GATE DA opens premier doors to modern AI/DS programs and industry roles.";
        recAction = "Queue Core DA Subjects";
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
// 8. Universal Command Palette (Spotlight / Cmd+K)
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
          <input type="search" id="cmd-input" placeholder="Type a subject, concept, or formula..." autocomplete="off">
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

    // Core static navigation items
    const staticRoutes = [
      { title: 'Computer Science Directory (CS)', url: `${root}cs/`, badge: 'CS', type: 'page' },
      { title: 'Data Science & AI Directory (DA)', url: `${root}da/`, badge: 'DA', type: 'page' },
      { title: 'Interactive Self-Assessment Practice', url: `${root}practice/`, badge: 'QUIZ', type: 'tool' },
      { title: 'Study Progress Planner', url: `${root}planner/`, badge: 'PLAN', type: 'tool' },
      { title: 'Official PYQ Papers & Keys', url: `${root}pyqs/`, badge: 'GATE', type: 'page' },
      { title: 'Official Syllabus Resources', url: `${root}resources/`, badge: 'DOC', type: 'page' }
    ];

    staticRoutes.forEach(r => {
      if (!query || r.title.toLowerCase().includes(query)) {
        items.push(r);
      }
    });

    // Subject items
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
      results.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">No matching subjects or tools found.</div>`;
      return;
    }

    results.innerHTML = items.map((item, idx) => `
      <div class="cmd-item ${idx === selectedIndex ? 'active' : ''}" data-idx="${idx}">
        <div class="cmd-item-left">
          <span style="font-size: 0.95rem;">${item.type === 'subject' ? '📖' : '⚡'}</span>
          <span>${item.title}</span>
        </div>
        <span class="cmd-badge ${item.badge.includes('CS') ? 'cs' : 'da'}">${item.badge}</span>
      </div>
    `).join('');

    results.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = Number(el.dataset.idx);
        if (items[idx]) window.location.href = items[idx].url;
      });
      el.addEventListener('mouseenter', () => {
        selectedIndex = Number(el.dataset.idx);
        updateActiveItem();
      });
    });
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
      if (items[selectedIndex]) window.location.href = items[selectedIndex].url;
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
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closePalette();
    }
  });

  document.querySelectorAll('.spotlight-trigger').forEach(btn => {
    btn.addEventListener('click', openPalette);
  });
}

// -----------------------------------------------------------------------------
// 9. Persistent Study Docket Slide-Out Drawer
// -----------------------------------------------------------------------------
let allLoadedSubjects = [];

function initDocketDrawer(subjects) {
  allLoadedSubjects = subjects;
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
      <div class="docket-body" id="docket-items-container"></div>
      <div class="docket-footer">
        <button id="export-ics-btn" class="button gold small">Export Revision Schedule (.ics)</button>
        <div style="display: flex; gap: 10px;">
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
        <p style="font-size: 0.82rem; margin-top: 6px;">Add subjects to queue your revision and download a synchronized calendar block.</p>
      </div>
    `;
    return;
  }

  const items = allLoadedSubjects.filter(s => docketIds.includes(s.id));
  container.innerHTML = items.map(s => `
    <div class="docket-item">
      <div>
        <a href="${root}subjects/${s.id}/" style="font-weight: 700; text-decoration: none; color: var(--text-primary); font-size: 0.88rem;">${s.title}</a>
        <div style="font-size: 0.72rem; color: var(--accent-gold); font-weight: 700; margin-top: 2px;">${s.papers.join(' / ')}</div>
      </div>
      <button class="docket-remove-btn" data-id="${s.id}" title="Remove from Docket">✕</button>
    </div>
  `).join('');

  container.querySelectorAll('.docket-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromDocket(btn.dataset.id));
  });
}

// -----------------------------------------------------------------------------
// 10. Header Enrichment (Theme Toggle, Spotlight, Docket Counter)
// -----------------------------------------------------------------------------
function enrichSiteHeader() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // Highlight active link
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

// -----------------------------------------------------------------------------
// 11. Reading Progress Bar & Native Dialog Setup
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// 12. Mobile Menu Toggle
// -----------------------------------------------------------------------------
const menu = document.querySelector('#menu');
if (menu) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    document.querySelector('#nav').classList.toggle('open', !open);
  });
}

// -----------------------------------------------------------------------------
// 13. Data Fetching & Page Rendering
// -----------------------------------------------------------------------------
fetch(root + 'data/subjects.json')
  .then(r => { if (!r.ok) throw Error(); return r.json(); })
  .then(subjects => {
    enrichSiteHeader();
    initReadingProgress();
    initCommandPalette(subjects);
    initDocketDrawer(subjects);
    initDialogInspector();

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
              <div class="eyebrow">SUBJECT REPOSITORY</div>
              <h2>Master the syllabus.</h2>
            </div>
            <p>Shared subjects display common foundations alongside paper-specific syllabi.</p>
          </div>
          <div id="results" class="grid">${subjects.map(card).join('')}</div>
          <p id="empty" hidden style="text-align: center; padding: 40px; color: var(--text-muted);">No matching subjects found.</p>
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
        const filtered = subjects.filter(s =>
          (s.title + ' ' + s.papers.join(' ') + ' ' + s.syllabus + ' ' + s.intro).toLowerCase().includes(term)
        );
        document.querySelector('#results').innerHTML = filtered.map(card).join('');
        document.querySelector('#empty').hidden = !!filtered.length;
        attachCardDocketListeners();
      });

      attachCardDocketListeners();
    }

    // -------------------------------------------------------------------------
    // PAGE: CS or DA DEPARTMENT DIRECTORY
    // -------------------------------------------------------------------------
    else if (page === 'cs' || page === 'da') {
      const code = page.toUpperCase();
      const name = code === 'CS' ? 'Computer Science & Information Technology' : 'Data Science & Artificial Intelligence';
      main.innerHTML = `
        ${crumb(code)}
        <section class="page-title">
          <div class="eyebrow">GATE 2027 · PAPER ${code}</div>
          <h1>${name}</h1>
          <p>Official syllabus guide, topic matrix, and direct syllabus downloads verified against IIT Madras.</p>
        </section>

        <section class="section" style="padding-top: 0;">
          ${note}
          <div class="mac-window" style="margin-bottom: 30px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: gap; gap: 16px;">
            <div>
              <strong>Official IIT Madras ${code} Syllabus Document</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Official PDF publication with authoritative section codes</div>
            </div>
            <a class="button gold small" href="${source[code]}" target="_blank" rel="noopener">Download Official ${code} Syllabus PDF ↗</a>
          </div>

          <div class="grid">${subjects.filter(s => s.papers.includes(code)).map(card).join('')}</div>
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
            ${extra ? `<a href="#derivation">03. Key Formulation</a>` : ''}
            ${extra ? `<a href="#schematic">04. Visual Schematic</a>` : ''}
            <a href="#pyq">05. Previous Questions</a>
            <div style="margin-top: 24px; border-top: 1px solid var(--border-line); padding-top: 16px;">
              <button class="button gold small" id="subject-docket-add-btn" style="width: 100%;">+ Queue in Docket</button>
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
                <strong>Reference Link:</strong>
                ${s.id === 'general-aptitude'
                  ? `<a href="${source.GA}" target="_blank">General Aptitude Syllabus (IIT Madras PDF) ↗</a>`
                  : s.papers.map(x => `<a href="${source[x]}" target="_blank" style="margin-right: 14px;">${x} Official Syllabus PDF ↗</a>`).join('')
                }
              </div>
            </section>

            ${extra ? `
              <section id="derivation">
                <div class="eyebrow">03 / MATHEMATICAL FORMULATION</div>
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
                <div class="eyebrow">04 / ARCHITECTURAL SCHEMATIC</div>
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

            <section id="pyq">
              <div class="eyebrow">05 / EXAMINATION PRACTICE</div>
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

      // Complete checkbox
      document.querySelector('#complete').addEventListener('change', e => {
        const v = getProgress();
        v[s.id] = e.target.checked;
        saveProgress(v);
      });

      // Subject Docket button
      document.querySelector('#subject-docket-add-btn').addEventListener('click', () => {
        addToDocket(s.id);
      });

      // Diagram click inspection
      if (extra) {
        document.querySelector('#open-diagram-card').addEventListener('click', () => {
          openDiagramModal(extra.caption, extra.svgDiagram, s.title + ' conceptual model for GATE 2027.');
        });
      }

      // Copy buttons
      document.querySelectorAll('.copy-trigger-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(btn.dataset.text).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copied ✓';
            setTimeout(() => btn.textContent = original, 2000);
          });
        });
      });

      // Scroll-Spy Intersection Observer
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

    // -------------------------------------------------------------------------
    // PAGE: PRACTICE (SELF-ASSESSMENT QUIZZES)
    // -------------------------------------------------------------------------
    else if (page === 'practice') {
      main.innerHTML = `
        ${crumb('Practice')}
        <section class="page-title">
          <div class="eyebrow">GATE PRACTICE ENGINE</div>
          <h1>Self-Assessment Verification</h1>
          <p>Test your conceptual depth on high-yield GATE CS & DA questions with immediate validation and derivations.</p>
        </section>

        <section class="section" style="padding-top: 0;">
          ${note}
          <div class="quiz-container">
            ${PRACTICE_QUESTIONS.map((q, idx) => `
              <div class="quiz-card" id="quiz-${q.id}" data-id="${q.id}">
                <div class="quiz-meta">
                  <span class="quiz-tag">${q.paper}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">QUESTION 0${idx + 1}</span>
                </div>
                <div class="quiz-question">${q.question}</div>
                <div class="quiz-options">
                  ${q.options.map((opt, oIdx) => `
                    <div class="quiz-option" data-correct="${opt.correct}">
                      <span class="quiz-opt-letter">${String.fromCharCode(65 + oIdx)}</span>
                      <span>${opt.text}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="quiz-feedback" hidden></div>
              </div>
            `).join('')}
          </div>
        </section>
      `;

      // Quiz interaction logic
      document.querySelectorAll('.quiz-card').forEach(cardEl => {
        const options = cardEl.querySelectorAll('.quiz-option');
        const feedback = cardEl.querySelector('.quiz-feedback');
        const qId = cardEl.dataset.id;
        const qData = PRACTICE_QUESTIONS.find(x => x.id === qId);

        options.forEach(opt => {
          opt.addEventListener('click', () => {
            const isCorrect = opt.dataset.correct === 'true';
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
          });
        });
      });
    }

    // -------------------------------------------------------------------------
    // PAGE: PLANNER
    // -------------------------------------------------------------------------
    else if (page === 'planner') {
      main.innerHTML = `
        ${crumb('Planner')}
        <section class="page-title">
          <div class="eyebrow">DYNAMIC STUDY TRACKER</div>
          <h1>Study Planner & Checklist</h1>
          <p>Monitor your subject review status, generate calendar revision blocks, and backup your preparation progress.</p>
        </section>

        <section class="section" style="padding-top: 0;">
          <div class="mac-window" style="padding: 24px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <strong id="progress-text" style="font-size: 1.1rem;">0 of 16 subjects reviewed</strong>
              <button id="planner-export-ics" class="button gold small">Export Revision Schedule (.ics)</button>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" id="progress-bar"></div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Data is persisted locally in your browser session.</p>
          </div>

          <div id="checklist" class="checklist"></div>

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
        document.querySelector('#checklist').innerHTML = subjects.map(s => `
          <label class="check">
            <input type="checkbox" data-id="${s.id}" ${v[s.id] === true ? 'checked' : ''}>
            <span>${s.title}</span>
            <small>${s.papers.join(' / ')}</small>
          </label>
        `).join('');
      };

      renderPlanner();

      document.querySelector('#checklist').addEventListener('change', e => {
        if (!e.target.dataset.id) return;
        const v = getProgress();
        v[e.target.dataset.id] = e.target.checked;
        saveProgress(v);
        renderPlanner();
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
    // PAGE: PYQS
    // -------------------------------------------------------------------------
    else if (page === 'pyqs') {
      main.innerHTML = `
        ${crumb('PYQs')}
        <section class="page-title">
          <div class="eyebrow">OFFICIAL EXAM REPOSITORY</div>
          <h1>Previous-Year Question Papers</h1>
          <p>Authoritative question papers and official answer keys from GATE organizing institutes.</p>
        </section>

        <section class="section" style="padding-top: 0;">
          ${note}
          <div class="mac-window" style="padding: 30px; margin-bottom: 30px;">
            <h3>Official IIT Madras Download Portal</h3>
            <p>Access year-wise question papers and verified master answer keys directly from the official portal.</p>
            <div style="margin-top: 20px;">
              <a class="button gold" href="${official}download" target="_blank" rel="noopener">Open Official GATE Download Archive ↗</a>
            </div>
          </div>

          <div class="departments">
            <div class="department">
              <span class="pill">CS HISTORICAL TRENDS</span>
              <h3>Computer Science Papers</h3>
              <p>Practice standard question papers with full coverage of Theory of Computation, Compilers, Architecture, and Algorithms.</p>
            </div>
            <div class="department">
              <span class="pill">DA HISTORICAL TRENDS</span>
              <h3>Data Science & AI Papers</h3>
              <p>Review the foundational 2024–2026 GATE DA papers covering Machine Learning, Probability, and Advanced DBMS.</p>
            </div>
          </div>
        </section>
      `;
    }

    // -------------------------------------------------------------------------
    // PAGE: RESOURCES
    // -------------------------------------------------------------------------
    else {
      main.innerHTML = `
        ${crumb('Resources')}
        <section class="page-title">
          <div class="eyebrow">OFFICIAL REFERENCES</div>
          <h1>Study Resources & Standards</h1>
          <p>Authoritative IIT Madras guidelines, paper patterns, and curriculum specifications for GATE 2027.</p>
        </section>

        <section class="section resource-list" style="padding-top: 0;">
          <a href="${source.CS}" target="_blank">GATE 2027 Computer Science (CS) Syllabus <span>Official PDF ↗</span></a>
          <a href="${source.DA}" target="_blank">GATE 2027 Data Science & AI (DA) Syllabus <span>Official PDF ↗</span></a>
          <a href="${source.GA}" target="_blank">GATE 2027 General Aptitude (GA) Syllabus <span>Official PDF ↗</span></a>
          <a href="${official}question_paper_pattern" target="_blank">Official Question Paper Pattern & Marking Scheme <span>Official Site ↗</span></a>
          <a href="${official}download" target="_blank">Master Papers & Official Answer Keys <span>Official Site ↗</span></a>
        </section>
      `;
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
// 14. Service Worker Registration (PWA Offline Capability)
// -----------------------------------------------------------------------------
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(root + 'sw.js').catch(() => {});
  });
}
