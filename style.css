/* ═══════════════════════════════════════════
   VARIÁVEIS E RESET
═══════════════════════════════════════════ */
:root {
  --bg:           #F5F4F0;
  --bg2:          #ECEAE3;
  --bg3:          #E2DFD6;
  --surface:      #FFFFFF;
  --border:       #D6D2C8;
  --border2:      #C8C4B8;
  --text:         #1C1B18;
  --text2:        #5C5A54;
  --text3:        #9C9A94;
  --accent:       #1C4B2D;
  --accent-light: #EAF3E4;
  --accent-mid:   #2D6B42;
  --warn:         #7A3200;
  --warn-light:   #FFF0E6;
  --danger:       #8B1A1A;
  --danger-light: #FCEAEA;
  --mono:         'IBM Plex Mono', monospace;
  --sans:         'IBM Plex Sans', sans-serif;
  --r:            6px;
  --r-lg:         10px;
  --shadow:       0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--sans);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  font-size: 14px;
}

/* ═══════════════════════════════════════════
   LAYOUT PRINCIPAL
═══════════════════════════════════════════ */
.shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: 220px;
  background: var(--text);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo {
  padding: 24px 20px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.logo-title {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.05em;
}

.logo-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  margin-top: 3px;
  font-family: var(--mono);
}

nav {
  padding: 12px 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  transition: all 0.15s;
  border-left: 3px solid transparent;
  user-select: none;
}

.nav-item:hover {
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.05);
}

.nav-item.active {
  color: #fff;
  border-left-color: #6DBF8A;
  background: rgba(255,255,255,0.08);
}

.nav-item .ico {
  width: 18px;
  text-align: center;
  font-size: 15px;
}

.nav-label {
  font-size: 12px;
}

/* ── Main area ── */
.main {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.topbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 28px;
  height: 56px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.topbar-sub {
  font-size: 12px;
  color: var(--text3);
  font-family: var(--mono);
}

.content {
  padding: 24px 28px;
  flex: 1;
}

.section {
  display: none;
}

.section.active {
  display: block;
}

/* ═══════════════════════════════════════════
   MÉTRICAS
═══════════════════════════════════════════ */
.metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.metric {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 16px 18px;
  box-shadow: var(--shadow);
}

.metric-label {
  font-size: 11px;
  color: var(--text3);
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  font-family: var(--mono);
  color: var(--text);
}

.metric-value.danger { color: var(--danger); }

/* ═══════════════════════════════════════════
   TABELA
═══════════════════════════════════════════ */
.table-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.table-toolbar {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  height: 34px;
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 0 12px;
  font-family: var(--sans);
  font-size: 13px;
  background: var(--bg);
  color: var(--text);
  min-width: 220px;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
}

.filter-sel {
  height: 34px;
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 0 10px;
  font-family: var(--sans);
  font-size: 13px;
  background: var(--bg);
  color: var(--text);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  font-size: 11px;
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text3);
  padding: 10px 16px;
  text-align: left;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
}

td {
  padding: 11px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  vertical-align: middle;
}

tr:last-child td {
  border-bottom: none;
}

tr.data-row:hover td {
  background: var(--bg);
}

.sub-row td {
  background: var(--bg2);
  font-size: 12px;
  padding: 7px 16px 7px 44px;
  color: var(--text2);
  border-bottom: 1px solid var(--border);
}

.expand-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  font-size: 10px;
  color: var(--text2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-btn:hover {
  background: var(--bg2);
}

/* ── Badges e códigos ── */
.cod {
  font-family: var(--mono);
  font-size: 12px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 7px;
  display: inline-block;
}

.badge {
  display: inline-block;
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 100px;
  font-weight: 500;
  font-family: var(--mono);
}

.badge-ok  { background: var(--accent-light); color: var(--accent); }
.badge-low { background: var(--warn-light);   color: var(--warn);   }
.badge-out { background: var(--danger-light); color: var(--danger); }

.pedidos-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* ── Botão de ação inline na tabela ── */
.btn-table-del {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 3px 10px;
  font-size: 12px;
  color: var(--danger);
  cursor: pointer;
  font-family: var(--sans);
  transition: all 0.15s;
}

.btn-table-del:hover {
  background: var(--danger-light);
  border-color: #F09595;
}

/* ═══════════════════════════════════════════
   FORMULÁRIOS
═══════════════════════════════════════════ */
.form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 22px 24px;
  margin-bottom: 16px;
  box-shadow: var(--shadow);
}

.form-card h3 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 18px;
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-num {
  background: var(--accent);
  color: #fff;
  border-radius: 100px;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.form-hint {
  font-size: 12px;
  color: var(--text2);
  margin-bottom: 16px;
  font-family: var(--mono);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.fg {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.fg.full {
  grid-column: 1 / -1;
}

label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text2);
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.inp {
  height: 38px;
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 0 12px;
  font-family: var(--sans);
  font-size: 13px;
  background: var(--surface);
  color: var(--text);
  width: 100%;
  transition: border-color 0.15s;
}

.inp:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(28,75,45,0.08);
}

.inp.mono { font-family: var(--mono); }

.inp[readonly] {
  background: var(--bg2);
  color: var(--text2);
  cursor: default;
}

select.inp { cursor: pointer; }

/* ── Botões ── */
.btn {
  height: 38px;
  border-radius: var(--r);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0 20px;
  border: none;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: var(--accent-mid); }

.btn-ghost { background: none; border: 1px solid var(--border); color: var(--text); }
.btn-ghost:hover { background: var(--bg2); }

.btn-danger { background: var(--danger); color: #fff; }
.btn-danger:hover { background: #6B1010; }

.btn-danger-sm {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--r);
  width: 34px;
  height: 38px;
  cursor: pointer;
  color: var(--text3);
  font-size: 16px;
  flex-shrink: 0;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-danger-sm:hover {
  background: var(--danger-light);
  color: var(--danger);
  border-color: #F09595;
}

.btn-dashed {
  background: none;
  border: 1px dashed var(--border2);
  border-radius: var(--r);
  padding: 8px 14px;
  font-size: 12px;
  color: var(--text2);
  cursor: pointer;
  font-family: var(--sans);
  text-align: left;
  width: 100%;
  margin-top: 4px;
  transition: all 0.15s;
}

.btn-dashed:hover {
  background: var(--bg2);
  color: var(--text);
  border-color: var(--accent);
}

/* ── Alertas ── */
.alert {
  padding: 10px 16px;
  border-radius: var(--r);
  font-size: 13px;
  margin-bottom: 14px;
  display: none;
  font-family: var(--sans);
}

.alert-ok  { background: var(--accent-light); color: var(--accent); border: 1px solid #B8D9C8; }
.alert-err { background: var(--danger-light); color: var(--danger); border: 1px solid #F09595; }

/* ── Divisor ── */
.divider {
  height: 1px;
  background: var(--border);
  margin: 18px 0;
}

/* ── Bloco de produto (entrada/retirada) ── */
.prod-block {
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  margin-bottom: 12px;
}

.prod-block-header {
  background: var(--bg2);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.prod-block-num {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text3);
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 7px;
  flex-shrink: 0;
}

.prod-block-nome {
  font-size: 13px;
  color: var(--text3);
  flex: 1;
}

.prod-block-body {
  padding: 14px;
}

/* ── Linhas de lote ── */
.lote-header-labels {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.lote-header-labels span {
  font-size: 11px;
  font-family: var(--mono);
  text-transform: uppercase;
  color: var(--text3);
  letter-spacing: 0.04em;
}

.lote-header-labels span:first-child { flex: 1.2; padding-left: 12px; }
.lote-header-labels span:nth-child(2) { flex: 0.8; padding-left: 12px; }

.lote-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.lote-row .lote-ped { flex: 1.2; }
.lote-row .lote-qtd { flex: 0.8; }

/* ── Linhas de pedido na retirada ── */
.pedido-ret-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r);
}

.ped-label { font-family: var(--mono); font-size: 12px; color: var(--text2); flex: 1; }
.ped-disp  { font-family: var(--mono); font-size: 11px; color: var(--text3); white-space: nowrap; }
.ped-qtd-inp { width: 110px; flex-shrink: 0; }

/* ═══════════════════════════════════════════
   HISTÓRICO
═══════════════════════════════════════════ */
.hist-code {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 4px;
  padding: 2px 8px;
  display: inline-block;
}

.hist-sub-table { width: 100%; }
.hist-sub-table th {
  padding: 6px 16px 6px 44px;
  font-size: 10px;
  background: var(--bg3);
}
.hist-sub-table td {
  padding: 7px 16px 7px 44px;
  font-size: 12px;
  background: var(--bg2);
  color: var(--text2);
  border-bottom: 1px solid var(--border);
}

/* ═══════════════════════════════════════════
   MODAL DE EXCLUSÃO
═══════════════════════════════════════════ */
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 100;
  align-items: center;
  justify-content: center;
}

.modal-overlay.open {
  display: flex;
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 24px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}

.modal-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text);
}

.modal-body {
  font-size: 13px;
  color: var(--text2);
  margin-bottom: 20px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* ═══════════════════════════════════════════
   ESTADO VAZIO
═══════════════════════════════════════════ */
.empty {
  text-align: center;
  padding: 40px;
  color: var(--text3);
  font-size: 13px;
}

/* ═══════════════════════════════════════════
   SCROLLBAR
═══════════════════════════════════════════ */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 10px; }

/* ═══════════════════════════════════════════
   RESPONSIVO
═══════════════════════════════════════════ */
@media (max-width: 900px) {
  .metrics { grid-template-columns: repeat(2, 1fr); }
  .shell { flex-direction: column; height: auto; }
  .sidebar { width: 100%; }
  nav { display: flex; flex-wrap: wrap; padding: 8px; }
  .nav-item { border-left: none; border-bottom: 2px solid transparent; padding: 8px 12px; }
  .nav-item.active { border-bottom-color: #6DBF8A; }
  .form-grid { grid-template-columns: 1fr; }
  .fg.full { grid-column: 1; }
}

/* ═══════════════════════════════════════════
   RELATÓRIOS
═══════════════════════════════════════════ */
.rel-selector {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.rel-tab {
  height: 36px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: var(--r);
  background: var(--surface);
  color: var(--text2);
  font-size: 12px;
  font-family: var(--sans);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.rel-tab:hover { background: var(--bg2); color: var(--text); }
.rel-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); }

.rel-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

/* Resumo numérico */
.rel-summary {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.rel-sum-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
  box-shadow: var(--shadow);
}

.rel-sum-item.danger .rel-sum-val { color: var(--danger); }

.rel-sum-val {
  font-size: 26px;
  font-weight: 600;
  font-family: var(--mono);
  color: var(--text);
  line-height: 1;
}

.rel-sum-lbl {
  font-size: 11px;
  color: var(--text3);
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

/* Cabeçalho do relatório */
.rel-print-header {
  background: var(--surface);
  border: 1px solid var(--border);
  border-bottom: none;
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  padding: 16px 20px 14px;
}

.rel-print-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  font-family: var(--mono);
}

.rel-print-sub {
  font-size: 12px;
  color: var(--text2);
  margin-top: 3px;
  font-family: var(--mono);
}

.rel-print-date {
  font-size: 11px;
  color: var(--text3);
  margin-top: 2px;
  font-family: var(--mono);
}

/* Bloco por família */
.rel-familia-bloco {
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  margin-bottom: 14px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.rel-familia-header {
  background: var(--bg2);
  padding: 11px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 8px;
}

.rel-familia-nome {
  font-weight: 600;
  font-size: 13px;
  color: var(--text);
  font-family: var(--mono);
}

.rel-familia-stats {
  display: flex;
  gap: 6px;
  align-items: center;
}

/* ═══════════════════════════════════════════
   IMPRESSÃO
═══════════════════════════════════════════ */
@media print {
  .sidebar, .topbar, .rel-selector, .rel-toolbar, .table-toolbar,
  .btn, .btn-table-del, .btn-dashed, .modal-overlay { display: none !important; }
  .shell { display: block; }
  .main  { overflow: visible; }
  .content { padding: 0; }
  .section { display: none !important; }
  #sec-relatorios { display: block !important; }
  body { background: #fff; font-size: 12px; }
  .rel-summary { margin-bottom: 12px; }
  .rel-familia-bloco { break-inside: avoid; }
  table { font-size: 11px; }
  th, td { padding: 6px 10px; }
  .badge { border: 1px solid currentColor; }
  .table-card { box-shadow: none; border: 1px solid #ccc; }
}
