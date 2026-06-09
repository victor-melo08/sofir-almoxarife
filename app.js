// ═══════════════════════════════════════════
// APP.JS — Inicialização e navegação
// ═══════════════════════════════════════════

const TAB_TITLES = {
  estoque:    ['Estoque',                'Visão geral dos materiais em almoxarife'],
  cadastro:   ['Cadastro de produtos',   'Registrar novos materiais com código único'],
  entrada:    ['Solicitação de entrada', 'Acrescentar saldo em produtos existentes'],
  retirada:   ['Registrar retirada',     'Retirar materiais com rastreamento por pedido'],
  historico:  ['Histórico',              'Registro completo de entradas e retiradas'],
  relatorios: ['Relatórios',             'Emitir e imprimir relatórios de estoque'],
};

// ── Popula todos os <select> de família com as famílias cadastradas ──
function popularFamiliaSelects() {
  const ids = ['est-familia', 'cad-familia', 'cad-familia-f', 'rel-familia-f'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const temPlaceholder = el.querySelector('option[value=""]');
    // Limpa opções de família (mantém placeholder)
    Array.from(el.options).forEach(o => { if (o.value !== '') o.remove(); });
    FAMILIAS.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = f;
      el.appendChild(opt);
    });
  });
}

function switchTab(name, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('sec-' + name).classList.add('active');
  const t = TAB_TITLES[name];
  document.getElementById('topbar-title').textContent = t[0];
  document.getElementById('topbar-sub').textContent   = t[1];

  if (name === 'estoque')    { renderMetrics(); renderEstoque(); }
  if (name === 'cadastro')   { atualizarPreviewCod(); renderCadastro(); }
  if (name === 'historico')  { renderHistorico(); }
  if (name === 'relatorios') { renderRelatorio(); }
}

document.addEventListener('DOMContentLoaded', () => {
  carregarDados();
  popularFamiliaSelects();
  renderMetrics();
  renderEstoque();
  atualizarPreviewCod();
});
