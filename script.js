// ============================================
// PrintCalc – Enhanced 3D Cost Calculator JS
// ============================================

let currentLang = 'en';
let currentCurrency = 'USD';
let currentMode = 'simple'; // simple | medium | advanced
let savedResults = [];

const currencySymbols = {
    USD: '$', EUR: '€', TRY: '₺', GBP: '£',
    JPY: '¥', CAD: 'CA$', AUD: 'A$', CHF: 'Fr',
    CNY: '¥', KRW: '₩', BRL: 'R$', INR: '₹',
    MXN: 'MX$', SEK: 'kr', NOK: 'kr', DKK: 'kr',
    PLN: 'zł', CZK: 'Kč', HUF: 'Ft', RUB: '₽'
};

// ── Translations ─────────────────────────────────────────────
const translations = {
    en: {
        // UI
        'calculator': '3D Print<br>Cost Calculator',
        'tagline': 'Real costs. Real margins. No guessing.',
        'mode_simple': 'Simple',
        'mode_medium': 'Standard',
        'mode_advanced': 'Advanced',
        'filament_type': 'Filament Type',
        'print_details': 'Print Details',
        'filament_price': 'Filament Price (per kg)',
        'filament_used': 'Filament Used (grams)',
        'print_time': 'Print Time (hours)',
        'printer_power': 'Printer Power (Watts)',
        'electricity_price': 'Electricity Price (per kWh)',
        'machine_wear': 'Machine Wear (per print)',
        'labor_rate': 'Labor Rate (per hour)',
        'labor_time': 'Setup / Post-Processing (min)',
        'fail_rate': 'Failure / Waste Rate (%)',
        'profit_margin': 'Profit Margin (%)',
        'overhead': 'Overhead / Platform Fee (%)',
        'packaging': 'Packaging & Shipping Cost',
        'quantity': 'Quantity (units)',
        'calculate': 'Calculate Cost',
        // Results
        'cost_breakdown': 'Cost Breakdown',
        'save': 'Save',
        'print': 'Print',
        'filament': 'Filament',
        'electricity': 'Electricity',
        'wear': 'Machine Wear',
        'labor': 'Labor',
        'failure': 'Failure Buffer',
        'overhead_label': 'Overhead',
        'packaging_label': 'Packaging',
        'cost_per_unit': 'Cost per unit',
        'suggested_price': 'Suggested price',
        'breakeven_at': 'Break-even at:',
        'profit_margin_label': 'Profit Margin',
        'cost_for': 'Cost for',
        'price_for': 'Price for',
        'units': 'units',
        // Saved
        'saved_estimates': 'Saved Estimates',
        'clear_all': 'Clear All',
        'saved_toast': 'Saved!',
        // Nav
        'filament_guide': 'Filament Cost Guide',
        'pricing_guide': 'Pricing Guide',
        // Tooltips
        'tip_power': 'Most FDM printers: 100–300W. Check your printer specs.',
        'tip_wear': 'Nozzles, beds, belts. Estimate $0.30–$1.00 per print.',
        'tip_fail': 'Add 5–15% to cover failed or rejected prints.',
        'tip_overhead': 'Platform/marketplace fees (Etsy, 3DHubs). Usually 5–15%.',
        'tip_packaging': 'Box, tape, padding, label. Add actual shipping separately.',
        'Custom': 'Custom'
    },
    tr: {
        'calculator': '3D Baskı<br>Maliyet Hesap.',
        'tagline': 'Gerçek maliyetler. Gerçek kar marjları.',
        'mode_simple': 'Basit',
        'mode_medium': 'Standart',
        'mode_advanced': 'Gelişmiş',
        'filament_type': 'Filament Türü',
        'print_details': 'Baskı Detayları',
        'filament_price': 'Filament Fiyatı (kg başına)',
        'filament_used': 'Kullanılan Filament (gram)',
        'print_time': 'Baskı Süresi (saat)',
        'printer_power': 'Yazıcı Gücü (Watt)',
        'electricity_price': 'Elektrik Fiyatı (kWh başına)',
        'machine_wear': 'Makine Aşınması (baskı başına)',
        'labor_rate': 'İşçilik Ücreti (saat başına)',
        'labor_time': 'Kurulum / Son İşlem (dak)',
        'fail_rate': 'Hata / Fire Oranı (%)',
        'profit_margin': 'Kâr Marjı (%)',
        'overhead': 'Genel Gider / Platform Ücreti (%)',
        'packaging': 'Paketleme & Kargo Maliyeti',
        'quantity': 'Adet (kaç adet baskı)',
        'calculate': 'Maliyeti Hesapla',
        'cost_breakdown': 'Maliyet Dökümü',
        'save': 'Kaydet',
        'print': 'Yazdır',
        'filament': 'Filament',
        'electricity': 'Elektrik',
        'wear': 'Makine Aşınması',
        'labor': 'İşçilik',
        'failure': 'Hata Payı',
        'overhead_label': 'Genel Gider',
        'packaging_label': 'Paketleme',
        'cost_per_unit': 'Birim maliyet',
        'suggested_price': 'Önerilen satış fiyatı',
        'breakeven_at': 'Başabaş noktası:',
        'profit_margin_label': 'Kâr Marjı',
        'cost_for': 'Toplam maliyet',
        'price_for': 'Toplam fiyat',
        'units': 'adet',
        'saved_estimates': 'Kaydedilmiş Hesaplamalar',
        'clear_all': 'Tümünü Sil',
        'saved_toast': 'Kaydedildi!',
        'filament_guide': 'Filament Maliyet Rehberi',
        'pricing_guide': 'Fiyatlandırma Rehberi',
        'tip_power': 'Çoğu FDM yazıcı: 100–300W. Yazıcı özelliklerinizi kontrol edin.',
        'tip_wear': 'Nozul, tabla, kayış. Baskı başına yaklaşık 10–30 ₺.',
        'tip_fail': 'Başarısız baskılar için %5–15 ekleyin.',
        'tip_overhead': 'Platform/pazar ücretleri (Trendyol, Etsy). Genellikle %5–15.',
        'tip_packaging': 'Kutu, bant, dolgu, etiket. Kargo ayrıca eklenmeli.',
        'Custom': 'Özel'
    },
    de: {
        'calculator': '3D-Druck<br>Kostenrechner',
        'tagline': 'Echte Kosten. Echte Margen.',
        'mode_simple': 'Einfach',
        'mode_medium': 'Standard',
        'mode_advanced': 'Erweitert',
        'filament_type': 'Filamenttyp',
        'print_details': 'Druckdetails',
        'filament_price': 'Filamentpreis (pro kg)',
        'filament_used': 'Verwendetes Filament (g)',
        'print_time': 'Druckzeit (Stunden)',
        'printer_power': 'Druckerleistung (Watt)',
        'electricity_price': 'Strompreis (pro kWh)',
        'machine_wear': 'Maschinenverschleiß (pro Druck)',
        'labor_rate': 'Arbeitslohn (pro Stunde)',
        'labor_time': 'Einrichtung / Nachbearbeitung (Min)',
        'fail_rate': 'Fehlerquote (%)',
        'profit_margin': 'Gewinnmarge (%)',
        'overhead': 'Gemeinkosten / Plattformgebühr (%)',
        'packaging': 'Verpackung & Versandkosten',
        'quantity': 'Menge (Einheiten)',
        'calculate': 'Kosten berechnen',
        'cost_breakdown': 'Kostenaufschlüsselung',
        'save': 'Speichern',
        'print': 'Drucken',
        'filament': 'Filament',
        'electricity': 'Strom',
        'wear': 'Verschleiß',
        'labor': 'Arbeit',
        'failure': 'Fehlerpuffer',
        'overhead_label': 'Gemeinkosten',
        'packaging_label': 'Verpackung',
        'cost_per_unit': 'Kosten pro Einheit',
        'suggested_price': 'Empfohlener Preis',
        'breakeven_at': 'Break-even bei:',
        'profit_margin_label': 'Gewinnmarge',
        'cost_for': 'Kosten für',
        'price_for': 'Preis für',
        'units': 'Einheiten',
        'saved_estimates': 'Gespeicherte Schätzungen',
        'clear_all': 'Alle löschen',
        'saved_toast': 'Gespeichert!',
        'filament_guide': 'Filament-Kostenrechner',
        'pricing_guide': 'Preisgestaltung',
        'tip_power': 'Die meisten FDM-Drucker: 100–300W.',
        'tip_wear': 'Düsen, Bett, Riemen. Ca. 0,30–1,00 € pro Druck.',
        'tip_fail': '5–15% für fehlgeschlagene Drucke hinzufügen.',
        'tip_overhead': 'Plattformgebühren (Etsy, 3DHubs): ca. 5–15%.',
        'tip_packaging': 'Karton, Klebeband, Polsterung, Etikett.',
        'Custom': 'Benutzerdefiniert'
    },
    fr: {
        'calculator': 'Calcul Coût<br>Impression 3D',
        'tagline': 'Vrais coûts. Vraies marges.',
        'mode_simple': 'Simple',
        'mode_medium': 'Standard',
        'mode_advanced': 'Avancé',
        'filament_type': 'Type de filament',
        'print_details': 'Détails d\'impression',
        'filament_price': 'Prix du filament (par kg)',
        'filament_used': 'Filament utilisé (grammes)',
        'print_time': 'Temps d\'impression (heures)',
        'printer_power': 'Puissance imprimante (Watts)',
        'electricity_price': 'Prix électricité (par kWh)',
        'machine_wear': 'Usure machine (par impression)',
        'labor_rate': 'Taux de main-d\'œuvre (par heure)',
        'labor_time': 'Configuration / Post-traitement (min)',
        'fail_rate': 'Taux d\'échec (%)',
        'profit_margin': 'Marge bénéficiaire (%)',
        'overhead': 'Frais généraux / Commission (%)',
        'packaging': 'Emballage & Expédition',
        'quantity': 'Quantité (unités)',
        'calculate': 'Calculer le coût',
        'cost_breakdown': 'Détail des coûts',
        'save': 'Sauvegarder',
        'print': 'Imprimer',
        'filament': 'Filament',
        'electricity': 'Électricité',
        'wear': 'Usure machine',
        'labor': 'Main-d\'œuvre',
        'failure': 'Marge d\'erreur',
        'overhead_label': 'Frais généraux',
        'packaging_label': 'Emballage',
        'cost_per_unit': 'Coût par unité',
        'suggested_price': 'Prix suggéré',
        'breakeven_at': 'Seuil de rentabilité :',
        'profit_margin_label': 'Marge bénéficiaire',
        'cost_for': 'Coût pour',
        'price_for': 'Prix pour',
        'units': 'unités',
        'saved_estimates': 'Estimations sauvegardées',
        'clear_all': 'Tout effacer',
        'saved_toast': 'Sauvegardé !',
        'filament_guide': 'Guide coût filament',
        'pricing_guide': 'Guide tarification',
        'tip_power': 'La plupart des imprimantes FDM : 100–300W.',
        'tip_wear': 'Buses, plateau, courroies. Env. 0,30–1,00 € par impression.',
        'tip_fail': 'Ajouter 5–15% pour les impressions échouées.',
        'tip_overhead': 'Frais de plateforme (Etsy, 3DHubs) : env. 5–15%.',
        'tip_packaging': 'Boîte, ruban, rembourrage, étiquette.',
        'Custom': 'Personnalisé'
    },
    es: {
        'calculator': 'Calculadora<br>Impresión 3D',
        'tagline': 'Costos reales. Márgenes reales.',
        'mode_simple': 'Simple',
        'mode_medium': 'Estándar',
        'mode_advanced': 'Avanzado',
        'filament_type': 'Tipo de filamento',
        'print_details': 'Detalles de impresión',
        'filament_price': 'Precio filamento (por kg)',
        'filament_used': 'Filamento usado (gramos)',
        'print_time': 'Tiempo de impresión (horas)',
        'printer_power': 'Potencia impresora (Vatios)',
        'electricity_price': 'Precio electricidad (por kWh)',
        'machine_wear': 'Desgaste máquina (por impresión)',
        'labor_rate': 'Tasa laboral (por hora)',
        'labor_time': 'Configuración / Post-proceso (min)',
        'fail_rate': 'Tasa de fallos (%)',
        'profit_margin': 'Margen de beneficio (%)',
        'overhead': 'Gastos generales / Comisión (%)',
        'packaging': 'Embalaje y envío',
        'quantity': 'Cantidad (unidades)',
        'calculate': 'Calcular costo',
        'cost_breakdown': 'Desglose de costos',
        'save': 'Guardar',
        'print': 'Imprimir',
        'filament': 'Filamento',
        'electricity': 'Electricidad',
        'wear': 'Desgaste',
        'labor': 'Mano de obra',
        'failure': 'Margen de error',
        'overhead_label': 'Gastos generales',
        'packaging_label': 'Embalaje',
        'cost_per_unit': 'Costo por unidad',
        'suggested_price': 'Precio sugerido',
        'breakeven_at': 'Punto de equilibrio:',
        'profit_margin_label': 'Margen de beneficio',
        'cost_for': 'Costo para',
        'price_for': 'Precio para',
        'units': 'unidades',
        'saved_estimates': 'Estimaciones guardadas',
        'clear_all': 'Borrar todo',
        'saved_toast': '¡Guardado!',
        'filament_guide': 'Guía de costo de filamento',
        'pricing_guide': 'Guía de precios',
        'tip_power': 'La mayoría de impresoras FDM: 100–300W.',
        'tip_wear': 'Boquillas, cama, correas. Aprox. $0.30–$1.00 por impresión.',
        'tip_fail': 'Añadir 5–15% para impresiones fallidas.',
        'tip_overhead': 'Comisiones de plataforma: aprox. 5–15%.',
        'tip_packaging': 'Caja, cinta, relleno, etiqueta.',
        'Custom': 'Personalizado'
    }
};

function t(key) {
    const lang = translations[currentLang] || translations['en'];
    return lang[key] || translations['en'][key] || key;
}

// ── Language ──────────────────────────────────────────────────
function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    applyLang();
    // Update active state
    document.querySelectorAll('.lang-option').forEach(el => {
        el.classList.toggle('active', el.dataset.lang === lang);
    });
}

function applyLang() {
    // Update all elements with data-key attribute
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        const text = t(key);
        if (el.tagName === 'INPUT') {
            el.placeholder = text;
        } else {
            el.innerHTML = text;
        }
    });

    // Update tooltips
    document.querySelectorAll('[data-tip-key]').forEach(el => {
        el.dataset.tip = t(el.dataset['tip-key'] || el.getAttribute('data-tip-key'));
    });

    // Update Custom button
    document.querySelectorAll('.custom-btn').forEach(btn => {
        btn.textContent = t('Custom');
    });

    document.title = currentLang === 'tr'
        ? '3D Baskı Maliyet Hesaplayıcı'
        : '3D Print Cost Calculator';
}

// ── Currency ──────────────────────────────────────────────────
function setCurrency(cur) {
    currentCurrency = cur;
    const sym = currencySymbols[cur] || cur;
    document.querySelectorAll('.cur-sym').forEach(el => el.textContent = sym);
}

function fmt(val) {
    const sym = currencySymbols[currentCurrency] || currentCurrency;
    // Format number based on currency
    const decimals = ['JPY','KRW','HUF'].includes(currentCurrency) ? 0 : 2;
    return sym + val.toFixed(decimals);
}

// setMode is defined in index.html

// ── Filament Presets ──────────────────────────────────────────
function setFilament(btn, type, defaultPrice) {
    document.querySelectorAll('.fil-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (defaultPrice > 0) {
        document.getElementById('price').value = defaultPrice;
    }
}

// ── Main Calculation ──────────────────────────────────────────
function calculate() {
    const get = id => {
        const el = document.getElementById(id);
        if (!el || el.closest('[style*="display: none"]') || el.closest('[style*="display:none"]')) {
            return 0;
        }
        return parseFloat(el.value) || 0;
    };

    const price       = parseFloat(document.getElementById('price').value) || 0;
    const gram        = parseFloat(document.getElementById('gram').value) || 0;
    const time        = parseFloat(document.getElementById('time').value) || 0;
    const power       = currentMode === 'simple' ? 150 : (parseFloat(document.getElementById('power').value) || 150);
    const electricity = currentMode === 'simple' ? 0.15 : (parseFloat(document.getElementById('electricity').value) || 0);
    const wear        = currentMode === 'simple' ? 0 : (parseFloat(document.getElementById('wear').value) || 0);
    const laborRate   = currentMode === 'simple' ? 0 : (parseFloat(document.getElementById('laborRate').value) || 0);
    const laborTime   = currentMode === 'simple' ? 0 : (parseFloat(document.getElementById('laborTime').value) || 0);
    const failRate    = currentMode === 'advanced' ? (parseFloat(document.getElementById('failRate').value) || 0) : 0;
    const overhead    = currentMode === 'advanced' ? (parseFloat(document.getElementById('overhead').value) || 0) : 0;
    const packaging   = currentMode === 'advanced' ? (parseFloat(document.getElementById('packaging').value) || 0) : 0;
    const profit      = parseFloat(document.getElementById('profit').value) || 0;
    const quantity    = currentMode === 'advanced' ? Math.max(1, Math.round(parseFloat(document.getElementById('quantity').value) || 1)) : 1;

    // Per-unit costs
    const filamentCost    = (gram / 1000) * price;
    const electricityCost = currentMode !== 'simple' ? (power / 1000) * time * electricity : 0;
    const laborCost       = laborRate * (laborTime / 60);
    const baseCost        = filamentCost + electricityCost + wear + laborCost;
    const failBuffer      = baseCost * (failRate / 100);
    const overheadCost    = (baseCost + failBuffer) * (overhead / 100);
    const totalCost       = baseCost + failBuffer + overheadCost + packaging;
    const sellingPrice    = totalCost * (1 + profit / 100);

    // Display
    document.getElementById('rFilament').textContent = fmt(filamentCost);
    document.getElementById('rElec').textContent     = fmt(electricityCost);
    document.getElementById('rWear').textContent     = fmt(wear);
    document.getElementById('rLabor').textContent    = fmt(laborCost);
    document.getElementById('rFail').textContent     = fmt(failBuffer);
    document.getElementById('rOverhead').textContent = fmt(overheadCost);
    document.getElementById('rPackaging').textContent= fmt(packaging);
    document.getElementById('rTotal').textContent    = fmt(totalCost);
    document.getElementById('rPrice').textContent    = fmt(sellingPrice);

    // Show/hide result cards based on mode
    toggleCard('cElec', currentMode !== 'simple');
    toggleCard('cWear', currentMode !== 'simple');
    toggleCard('cLabor', currentMode !== 'simple');
    toggleCard('cFail', currentMode === 'advanced');
    toggleCard('cOverhead', currentMode === 'advanced' && overhead > 0);
    toggleCard('cPackaging', currentMode === 'advanced' && packaging > 0);

    // Quantity rows
    const qtyRow      = document.getElementById('qtyRow');
    const qtyPriceRow = document.getElementById('qtyPriceRow');
    if (quantity > 1) {
        qtyRow.style.display      = 'flex';
        qtyPriceRow.style.display = 'flex';
        document.getElementById('qtyLabel').textContent      = `${t('cost_for')} ${quantity} ${t('units')}`;
        document.getElementById('qtyPriceLabel').textContent = `${t('price_for')} ${quantity} ${t('units')}`;
        document.getElementById('rQtyTotal').textContent     = fmt(totalCost * quantity);
        document.getElementById('rQtyPrice').textContent     = fmt(sellingPrice * quantity);
    } else {
        qtyRow.style.display      = 'none';
        qtyPriceRow.style.display = 'none';
    }

    document.getElementById('rBreakeven').textContent = fmt(totalCost);

    // Meter
    const meterPct = Math.min(profit, 200);
    document.getElementById('meterFill').style.width = (meterPct / 200 * 100) + '%';
    document.getElementById('meterPct').textContent  = profit.toFixed(0) + '%';

    // Donut chart
    const slices = [
        { label: t('filament'),  value: filamentCost,    color: '#00e5a0' },
        { label: t('electricity'),value: electricityCost, color: '#7c6cff' },
        { label: t('wear'),       value: wear,            color: '#ff6b35' },
        { label: t('labor'),      value: laborCost,       color: '#ffda00' },
        { label: t('failure'),    value: failBuffer,      color: '#f24464' },
        { label: t('overhead_label'), value: overheadCost,color: '#00b4d8' },
        { label: t('packaging_label'),value: packaging,   color: '#a8dadc' }
    ];
    drawDonut(slices, totalCost);

    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

    window._lastResult = { filamentCost, electricityCost, wear, laborCost, failBuffer, overheadCost, packaging, totalCost, sellingPrice, profit, gram, time, quantity };
}

function toggleCard(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'flex' : 'none';
}

// ── Donut Chart ───────────────────────────────────────────────
function drawDonut(slices, total) {
    const canvas = document.getElementById('donutChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) / 2 - 8;
    const inner = R * 0.58;

    ctx.clearRect(0, 0, W, H);

    const activeSlices = slices.filter(s => s.value > 0);
    let startAngle = -Math.PI / 2;

    activeSlices.forEach((s, i) => {
        const angle = total > 0 ? (s.value / total) * Math.PI * 2 : 0;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, startAngle, startAngle + angle);
        ctx.closePath();
        ctx.fillStyle = s.color;
        ctx.fill();
        // gap
        ctx.beginPath();
        ctx.arc(cx, cy, R, startAngle + angle - 0.01, startAngle + angle + 0.01);
        ctx.strokeStyle = '#0a0c10';
        ctx.lineWidth = 2;
        ctx.stroke();
        startAngle += angle;
    });

    // Inner hole — tema rengini kullan
    const themeColors = {
        forge:    { bg: '#141416', text: '#e8e6e0' },
        midnight: { bg: '#11141c', text: '#eceef5' },
        atelier:  { bg: '#faf7f2', text: '#1a1410' }
    };
    const theme = (window.currentTheme) || 'forge';
    const tc = themeColors[theme] || themeColors.forge;
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = tc.bg;
    ctx.fill();

    // Center label
    ctx.fillStyle = tc.text;
    ctx.font = 'bold 10px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fmt(total), cx, cy);

    // Legend
    const legend = document.getElementById('chartLegend');
    legend.innerHTML = activeSlices.map(s =>
        `<div class="legend-item">
            <div class="legend-dot" style="background:${s.color}"></div>
            ${s.label}: <strong style="color:${s.color}">${fmt(s.value)}</strong>
         </div>`
    ).join('');
}

// ── Save / Load ───────────────────────────────────────────────
function saveResult() {
    if (!window._lastResult) return;
    const r = window._lastResult;
    const now = new Date();
    const entry = {
        date: now.toLocaleString(),
        filamentType: document.querySelector('.fil-btn.active')?.dataset.type || '—',
        totalCost: r.totalCost,
        sellingPrice: r.sellingPrice,
        profit: r.profit,
        quantity: r.quantity,
        currency: currentCurrency,
        mode: currentMode
    };
    savedResults.unshift(entry);
    try { localStorage.setItem('printcalc_saved', JSON.stringify(savedResults)); } catch(e) {}
    renderSaved();
    showToast(t('saved_toast'));
}

function loadSaved() {
    try {
        const raw = localStorage.getItem('printcalc_saved');
        if (raw) savedResults = JSON.parse(raw);
    } catch(e) { savedResults = []; }
    renderSaved();
}

function renderSaved() {
    const el = document.getElementById('savedList');
    const sec = document.getElementById('savedSection');
    if (!el || !sec) return;
    if (!savedResults.length) { sec.style.display = 'none'; return; }
    sec.style.display = 'block';
    el.innerHTML = savedResults.map((r) => {
        const sym = currencySymbols[r.currency] || '$';
        return `<div class="saved-item">
            <div>
                <div style="font-weight:700;font-size:13px">${r.filamentType} · ${r.quantity} ${r.quantity > 1 ? t('units') : 'unit'}</div>
                <div class="saved-meta">${r.date} · ${r.currency} · ${r.mode || 'standard'}</div>
            </div>
            <div style="text-align:right">
                <div class="saved-price">${sym}${r.sellingPrice.toFixed(2)}</div>
                <div class="saved-meta">Cost: ${sym}${r.totalCost.toFixed(2)} · Margin: ${r.profit}%</div>
            </div>
         </div>`;
    }).join('');
}

function clearSaved() {
    savedResults = [];
    try { localStorage.removeItem('printcalc_saved'); } catch(e) {}
    renderSaved();
}

function printResult() { window.print(); }

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
}

// ── Keyboard & Live Update ────────────────────────────────────
document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') calculate();
});

let _debounce;
document.addEventListener('input', () => {
    clearTimeout(_debounce);
    _debounce = setTimeout(() => {
        if (document.getElementById('resultSection').style.display !== 'none') calculate();
    }, 400);
});