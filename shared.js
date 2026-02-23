// ============================================
// PrintCalc – Shared Header & Theme/Lang System
// Used by ALL pages (non-calculator pages)
// ============================================

(function() {

// ── Theme & Lang state ────────────────────────────────────────
window.currentTheme = 'forge';
window.currentLang  = 'en';

const THEMES = {
    forge:    { label: 'FORGE',    dot: '#ff7300' },
    midnight: { label: 'MIDNIGHT', dot: '#00e5a0' },
    atelier:  { label: 'ATELIER',  dot: '#c8202a' }
};

const LANGUAGES = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'es', flag: '🇪🇸', name: 'Español' }
];

// ── Page nav translations ─────────────────────────────────────
const NAV_LABELS = {
    en: { calc: 'Calculator', filament: 'Filament Guide', pricing: 'Pricing Guide', electricity: 'Electricity Cost', etsy: 'Etsy Pricing', compare: 'Material Compare' },
    tr: { calc: 'Hesaplayıcı', filament: 'Filament Rehberi', pricing: 'Fiyat Rehberi', electricity: 'Elektrik Maliyeti', etsy: 'Etsy Fiyatlama', compare: 'Malzeme Karşılaştır' },
    de: { calc: 'Rechner', filament: 'Filament-Rechner', pricing: 'Preisgestaltung', electricity: 'Stromkosten', etsy: 'Etsy-Preise', compare: 'Material Vergleich' },
    fr: { calc: 'Calculateur', filament: 'Guide Filament', pricing: 'Guide Tarifs', electricity: 'Coût Électricité', etsy: 'Prix Etsy', compare: 'Comparaison Matériaux' },
    es: { calc: 'Calculadora', filament: 'Guía Filamento', pricing: 'Guía de Precios', electricity: 'Costo Electricidad', etsy: 'Precios Etsy', compare: 'Comparar Materiales' }
};

// ── Inject Header HTML ────────────────────────────────────────
function buildHeader(activePage) {
    return `
<header class="site-header">
    <div class="logo">
        <a href="index.html" style="text-decoration:none;display:flex;align-items:center;gap:8px;">
            <span class="logo-icon">⬡</span>
            <span class="logo-text">Print<span>Calc</span></span>
        </a>
    </div>

    <nav class="shared-nav" id="sharedNav">
        <a href="index.html"                 class="snav-link ${activePage==='calc'?'snav-active':''}"       data-nav="calc"></a>
        <a href="filament-cost.html"         class="snav-link ${activePage==='filament'?'snav-active':''}"   data-nav="filament"></a>
        <a href="print-pricing-guide.html"   class="snav-link ${activePage==='pricing'?'snav-active':''}"    data-nav="pricing"></a>
        <a href="electricity-cost.html"      class="snav-link ${activePage==='electricity'?'snav-active':''}" data-nav="electricity"></a>
        <a href="etsy-pricing.html"          class="snav-link ${activePage==='etsy'?'snav-active':''}"        data-nav="etsy"></a>
        <a href="material-compare.html"      class="snav-link ${activePage==='compare'?'snav-active':''}"     data-nav="compare"></a>
    </nav>

    <div class="header-controls" style="gap:8px;display:flex;align-items:center;flex-wrap:wrap;">
        <!-- Tema Seçici -->
        <div class="theme-picker" id="themePicker">
            <button class="theme-btn" onclick="sharedTogglePicker('theme',event)">
                <span class="theme-dot" id="themeIndicator" style="background:#ff7300"></span>
                <span id="themeLabel">FORGE</span>
                <span class="arrow">▾</span>
            </button>
            <div class="picker-dropdown" id="themeDropdown">
                <div class="theme-option active" id="opt-forge"    onclick="sharedSelectTheme('forge')">
                    <div class="theme-option-swatch" style="background:#141416;border-color:rgba(255,115,0,0.4)">🔥</div>
                    <div class="theme-option-info"><div class="theme-option-name">Forge</div><div class="theme-option-desc">3D Printer · Turuncu</div></div>
                </div>
                <div class="theme-option" id="opt-midnight" onclick="sharedSelectTheme('midnight')">
                    <div class="theme-option-swatch" style="background:#11141c;border-color:rgba(0,229,160,0.4)">🌙</div>
                    <div class="theme-option-info"><div class="theme-option-name">Midnight</div><div class="theme-option-desc">Industrial Dark · Yeşil</div></div>
                </div>
                <div class="theme-option" id="opt-atelier" onclick="sharedSelectTheme('atelier')">
                    <div class="theme-option-swatch" style="background:#f5f0e8;border-color:rgba(200,32,42,0.4)">📰</div>
                    <div class="theme-option-info"><div class="theme-option-name">Atelier</div><div class="theme-option-desc">Editorial · Kırmızı</div></div>
                </div>
            </div>
        </div>

        <!-- Dil Seçici -->
        <div class="lang-picker">
            <button class="picker-btn" id="langBtn" onclick="sharedTogglePicker('lang',event)">
                <span id="langFlag">🇬🇧</span>
                <span id="langLabel">EN</span>
                <span class="arrow">▾</span>
            </button>
            <div class="picker-dropdown" id="langDropdown">
                <div class="picker-list" id="langList"></div>
            </div>
        </div>
    </div>
</header>`;
}

// ── Inject header into page ───────────────────────────────────
window.initSharedHeader = function(activePage) {
    // Replace existing header or prepend to body
    const existing = document.querySelector('header.site-header');
    const html = buildHeader(activePage);
    if (existing) {
        existing.outerHTML = html;
    } else {
        document.body.insertAdjacentHTML('afterbegin', html);
    }

    buildLangList();
    applyNavLabels();

    // Restore saved theme & lang
    try {
        const savedTheme = localStorage.getItem('printcalc_theme');
        if (savedTheme && THEMES[savedTheme]) sharedSelectTheme(savedTheme, true);
        const savedLang = localStorage.getItem('printcalc_lang');
        if (savedLang && NAV_LABELS[savedLang]) sharedSelectLang(savedLang, null, true);
    } catch(e) {}

    // Close on outside click
    document.addEventListener('click', e => {
        if (!e.target.closest('.lang-picker') && !e.target.closest('.theme-picker')) {
            sharedClosePickers();
        }
    });
};

function buildLangList() {
    const list = document.getElementById('langList');
    if (!list) return;
    list.innerHTML = LANGUAGES.map(l =>
        `<div class="picker-option ${l.code === window.currentLang ? 'active' : ''}" onclick="sharedSelectLang('${l.code}','${l.flag}')">
            <span class="opt-code">${l.flag} ${l.code.toUpperCase()}</span>
            <span class="opt-name">${l.name}</span>
        </div>`
    ).join('');
}

function applyNavLabels() {
    const labels = NAV_LABELS[window.currentLang] || NAV_LABELS.en;
    document.querySelectorAll('[data-nav]').forEach(el => {
        const key = el.dataset.nav;
        if (labels[key]) el.textContent = labels[key];
    });
}

// ── Theme ─────────────────────────────────────────────────────
window.sharedSelectTheme = function(theme, silent) {
    window.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const cfg = THEMES[theme];
    const lbl = document.getElementById('themeLabel');
    const dot = document.getElementById('themeIndicator');
    if (lbl) lbl.textContent = cfg.label;
    if (dot) dot.style.background = cfg.dot;
    document.querySelectorAll('.theme-option').forEach(el => el.classList.remove('active'));
    const opt = document.getElementById('opt-' + theme);
    if (opt) opt.classList.add('active');
    if (!silent) {
        sharedClosePickers();
        try { localStorage.setItem('printcalc_theme', theme); } catch(e) {}
    }
};

// ── Lang ──────────────────────────────────────────────────────
window.sharedSelectLang = function(code, flag, silent) {
    window.currentLang = code;
    document.documentElement.lang = code;
    const lang = LANGUAGES.find(l => l.code === code);
    const f = flag || (lang ? lang.flag : '🇬🇧');
    const flagEl = document.getElementById('langFlag');
    const lblEl  = document.getElementById('langLabel');
    if (flagEl) flagEl.textContent = f;
    if (lblEl)  lblEl.textContent  = code.toUpperCase();
    buildLangList();
    applyNavLabels();
    // Let page-specific code handle its own content
    if (window.onSharedLangChange) window.onSharedLangChange(code);
    if (!silent) {
        sharedClosePickers();
        try { localStorage.setItem('printcalc_lang', code); } catch(e) {}
    }
};

// ── Picker toggle ─────────────────────────────────────────────
window.sharedTogglePicker = function(type, event) {
    if (event) event.stopPropagation();
    const ids = { lang: 'langDropdown', theme: 'themeDropdown' };
    const target = document.getElementById(ids[type]);
    const isOpen = target.classList.contains('open');
    sharedClosePickers();
    if (!isOpen) target.classList.add('open');
};

window.sharedClosePickers = function() {
    document.querySelectorAll('.picker-dropdown').forEach(d => d.classList.remove('open'));
};

// ── Extra CSS for shared nav ──────────────────────────────────
const style = document.createElement('style');
style.textContent = `
.shared-nav {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    align-items: center;
}
.snav-link {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-dim);
    text-decoration: none;
    padding: 5px 10px;
    border-radius: var(--radius);
    border: 1px solid transparent;
    transition: all 0.15s;
    white-space: nowrap;
}
.snav-link:hover {
    color: var(--text);
    border-color: var(--border);
    background: var(--bg2);
}
.snav-active {
    color: var(--accent) !important;
    border-color: var(--border3) !important;
    background: var(--accent-pale) !important;
}
@media (max-width: 900px) {
    .shared-nav { display: none; }
}
`;
document.head.appendChild(style);

})();
