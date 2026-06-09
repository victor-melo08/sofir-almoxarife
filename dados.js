// ═══════════════════════════════════════════
// DADOS.JS — Estado global + persistência localStorage
// ═══════════════════════════════════════════

// ── Famílias de minuterias (fixas, vindas da planilha) ──
const FAMILIAS = [
  'Parafuso Allen',
  'Parafuso Sextavado',
  'Parafuso Especial',
  'Porca Sextavada',
  'Porca Parlock',
  'Porca Fixação',
  'Arruela Lisa',
  'Arruela de Pressão',
  'Anel Elástico',
  'Pino',
  'Rebite',
  'Cabo de Aço',
  'Acessório para Cabo de Aço',
  'Chaveta',
  'Outros',
];

// ── Estado da aplicação ──
let produtos  = [];
let historico = [];
let retCodSeq = 1;
let entCodSeq = 1;
let cadCodSeq = 1;

// ── Chaves do localStorage ──
const LS_PRODUTOS  = 'estoque_produtos';
const LS_HISTORICO = 'estoque_historico';
const LS_SEQS      = 'estoque_sequencias';

// ─────────────────────────────────────────
// CARREGAR dados do localStorage
// ─────────────────────────────────────────
function carregarDados() {
  try {
    const p = localStorage.getItem(LS_PRODUTOS);
    if (p) produtos = JSON.parse(p);

    const h = localStorage.getItem(LS_HISTORICO);
    if (h) historico = JSON.parse(h);

    const s = localStorage.getItem(LS_SEQS);
    if (s) {
      const seqs = JSON.parse(s);
      retCodSeq = seqs.ret || 1;
      entCodSeq = seqs.ent || 1;
      cadCodSeq = seqs.cad || 1;
    }
  } catch (e) {
    console.warn('Erro ao carregar dados:', e);
  }
}

// ─────────────────────────────────────────
// SALVAR dados no localStorage
// ─────────────────────────────────────────
function salvarDados() {
  try {
    localStorage.setItem(LS_PRODUTOS,  JSON.stringify(produtos));
    localStorage.setItem(LS_HISTORICO, JSON.stringify(historico));
    localStorage.setItem(LS_SEQS, JSON.stringify({
      ret: retCodSeq,
      ent: entCodSeq,
      cad: cadCodSeq,
    }));
  } catch (e) {
    console.warn('Erro ao salvar dados:', e);
  }
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function totalProd(p) {
  return p.lotes.reduce((s, l) => s + l.qtd, 0);
}

function getProd(cod) {
  return produtos.find(p => p.cod.toUpperCase() === cod.trim().toUpperCase());
}

function gerarProxCod() {
  return 'S' + String(cadCodSeq).padStart(3, '0');
}

function badgeStatus(p) {
  const t = totalProd(p);
  if (t === 0)  return '<span class="badge badge-out">Zerado</span>';
  if (t <= 10)  return '<span class="badge badge-low">Baixo</span>';
  return '<span class="badge badge-ok">OK</span>';
}

function showAlert(id, msg, tipo) {
  const b = document.getElementById(id);
  if (!b) return;
  b.className = 'alert alert-' + (tipo === 'ok' ? 'ok' : 'err');
  b.textContent = msg;
  b.style.display = 'block';
  clearTimeout(b._timer);
  b._timer = setTimeout(() => { b.style.display = 'none'; }, 6000);
}

function fmtDate() {
  return new Date().toLocaleString('pt-BR');
}

// ─────────────────────────────────────────
// MODAL de confirmação
// ─────────────────────────────────────────
function abrirModal(mensagem, callback) {
  document.getElementById('modal-body').innerHTML = mensagem;
  document.getElementById('modal-confirm-btn').onclick = () => {
    fecharModal();
    if (callback) callback();
  };
  document.getElementById('modal-overlay').classList.add('open');
}

function fecharModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}
