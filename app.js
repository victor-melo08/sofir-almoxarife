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

// ═══════════════════════════════════════════
// ENTRADA.JS
// ═══════════════════════════════════════════
let entBlocos = [], entBlocoSeq = 0;

function addEntradaBloco() {
  const id = ++entBlocoSeq;
  entBlocos.push(id);
  const div = document.createElement('div');
  div.className = 'prod-block'; div.id = 'ent-bloco-' + id;
  div.innerHTML = `
    <div class="prod-block-header">
      <span class="prod-block-num">Produto ${entBlocos.length}</span>
      <input class="inp mono" type="text" placeholder="Código (ex: S001)" style="max-width:180px;flex-shrink:0;height:32px" oninput="onEntCodInput(${id},this.value)" id="ent-cod-${id}">
      <span class="prod-block-nome" id="ent-nome-${id}">— digite o código —</span>
      <button style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:20px;padding:0 4px" onclick="rmEntBloco(${id})">×</button>
    </div>
    <div class="prod-block-body">
      <div class="lote-header-labels"><span>Nº do pedido</span><span>Quantidade</span></div>
      <div id="ent-lotes-${id}"></div>
      <button class="btn-dashed" onclick="addEntLote(${id})" id="ent-addlote-${id}" style="display:none">+ Adicionar pedido</button>
    </div>`;
  document.getElementById('ent-blocos').appendChild(div);
}

function onEntCodInput(id, val) {
  const p = getProd(val.trim());
  const nomeEl = document.getElementById('ent-nome-' + id);
  const addBtn = document.getElementById('ent-addlote-' + id);
  const lotesDiv = document.getElementById('ent-lotes-' + id);
  if (p) {
    nomeEl.textContent = p.nome; nomeEl.style.color = 'var(--text)';
    addBtn.style.display = 'block';
    if (!lotesDiv.children.length) addEntLote(id);
  } else {
    nomeEl.textContent = val ? 'Código não encontrado' : '— digite o código —';
    nomeEl.style.color = val ? 'var(--danger)' : 'var(--text3)';
    addBtn.style.display = 'none';
  }
}

function addEntLote(blocoId) {
  const div = document.createElement('div');
  div.className = 'lote-row';
  div.innerHTML = `
    <input class="inp mono lote-ped" type="text" placeholder="Ex: 054003">
    <input class="inp lote-qtd" type="number" placeholder="Qtd" min="0">
    <button class="btn-danger-sm" onclick="this.closest('.lote-row').remove()">×</button>`;
  document.getElementById('ent-lotes-' + blocoId).appendChild(div);
}

function rmEntBloco(id) {
  entBlocos = entBlocos.filter(x => x !== id);
  document.getElementById('ent-bloco-' + id)?.remove();
}

function confirmarEntrada() {
  const blocos = document.querySelectorAll('[id^="ent-bloco-"]');
  if (!blocos.length) { showAlert('alert-ent', 'Adicione ao menos um produto.', 'err'); return; }
  let itens = [], erros = [];
  blocos.forEach(bloco => {
    const bid = bloco.id.replace('ent-bloco-', '');
    const cod = document.getElementById('ent-cod-' + bid)?.value.trim().toUpperCase();
    const p = getProd(cod);
    if (!p) { erros.push(`Código ${cod} inválido.`); return; }
    const lotes = Array.from(document.querySelectorAll(`#ent-lotes-${bid} .lote-row`))
      .map(r => { const ins = r.querySelectorAll('input'); return { pedido: ins[0].value.trim(), qtd: parseInt(ins[1].value) || 0 }; })
      .filter(l => l.pedido && l.qtd > 0);
    if (!lotes.length) { erros.push(`Produto ${cod}: adicione ao menos um pedido com quantidade.`); return; }
    itens.push({ p, lotes });
  });
  if (erros.length) { showAlert('alert-ent', erros[0], 'err'); return; }

  const codEnt = 'E' + String(entCodSeq++).padStart(3, '0');
  const histItens = [];
  itens.forEach(({ p, lotes }) => {
    lotes.forEach(({ pedido, qtd }) => {
      const ex = p.lotes.find(l => l.pedido === pedido);
      if (ex) ex.qtd += qtd; else p.lotes.push({ pedido, qtd });
      histItens.push({ cod: p.cod, nome: p.nome, familia: p.familia, pedido, qtd });
    });
  });
  historico.unshift({ codigo: codEnt, tipo: 'entrada', ts: fmtDate(), itens: histItens, resp: 'Sistema', obs: '' });
  salvarDados(); renderMetrics();
  showAlert('alert-ent', `Entrada ${codEnt} registrada! ${histItens.length} movimentação(ões).`, 'ok');
  resetEntrada();
}

function resetEntrada() { document.getElementById('ent-blocos').innerHTML = ''; entBlocos = []; entBlocoSeq = 0; }

// ═══════════════════════════════════════════
// ESTOQUE.JS
// ═══════════════════════════════════════════
let estExpandidos = new Set();

function renderMetrics() {
  const tot     = produtos.reduce((s, p) => s + totalProd(p), 0);
  const peds    = new Set(produtos.flatMap(p => p.lotes.map(l => l.pedido))).size;
  const zerados = produtos.filter(p => totalProd(p) === 0).length;
  document.getElementById('metrics').innerHTML = `
    <div class="metric"><div class="metric-label">Peças em estoque</div><div class="metric-value">${tot}</div></div>
    <div class="metric"><div class="metric-label">Produtos cadastrados</div><div class="metric-value">${produtos.length}</div></div>
    <div class="metric"><div class="metric-label">Pedidos rastreados</div><div class="metric-value">${peds}</div></div>
    <div class="metric"><div class="metric-label">Produtos zerados</div><div class="metric-value ${zerados > 0 ? 'danger' : ''}">${zerados}</div></div>`;
}

function renderEstoque() {
  const q       = document.getElementById('est-search').value.toLowerCase();
  const familia = document.getElementById('est-familia').value;
  const f = produtos.filter(p =>
    (!q       || p.cod.toLowerCase().includes(q) || p.nome.toLowerCase().includes(q)) &&
    (!familia || p.familia === familia)
  );
  const tb = document.getElementById('est-body');
  if (!f.length) { tb.innerHTML = `<tr><td colspan="8" class="empty">Nenhum produto encontrado</td></tr>`; return; }
  tb.innerHTML = f.map(p => {
    const exp        = estExpandidos.has(p.cod);
    const pedsSummary = p.lotes.map(l => `<span class="cod" style="font-size:10px">${l.pedido}</span>`).join(' ');
    return `
      <tr class="data-row">
        <td><button class="expand-btn" onclick="toggleExpEst('${p.cod}')">${exp ? '▲' : '▼'}</button></td>
        <td><span class="cod">${p.cod}</span></td>
        <td><span style="font-weight:500">${p.nome}</span><br><span style="font-size:11px;color:var(--text3)">${p.local}</span></td>
        <td style="font-size:12px;color:var(--text2)">${p.familia || '—'}</td>
        <td><div class="pedidos-cell">${pedsSummary || '<span style="color:var(--text3);font-size:12px">—</span>'}</div></td>
        <td style="font-family:var(--mono);font-weight:600">${totalProd(p)}</td>
        <td>${badgeStatus(p)}</td>
        <td><button class="btn-table-del" onclick="confirmarExcluirProduto('${p.cod}')">Excluir</button></td>
      </tr>
      ${exp ? p.lotes.map(l => `<tr class="sub-row"><td colspan="2">Pedido <strong>${l.pedido}</strong></td><td colspan="6" style="font-family:var(--mono)">${l.qtd} un.</td></tr>`).join('') : ''}`;
  }).join('');
}

function toggleExpEst(cod) { estExpandidos.has(cod) ? estExpandidos.delete(cod) : estExpandidos.add(cod); renderEstoque(); }

function confirmarExcluirProduto(cod) {
  const p = getProd(cod);
  if (!p) return;
  const aviso = totalProd(p) > 0 ? `<br><strong style="color:var(--danger)">Atenção: produto ainda possui ${totalProd(p)} un. em estoque.</strong>` : '';
  abrirModal(`Deseja excluir <strong>${p.cod} — ${p.nome}</strong>?${aviso}<br><br>Esta ação não poderá ser desfeita.`, () => excluirProduto(cod));
}

function excluirProduto(cod) {
  produtos = produtos.filter(p => p.cod !== cod);
  estExpandidos.delete(cod);
  salvarDados();
  renderMetrics();
  renderEstoque();
}

// ═══════════════════════════════════════════
// HISTORICO.JS
// ═══════════════════════════════════════════
let histExpandidos = new Set();

function renderHistorico() {
  const q    = document.getElementById('hist-search').value.toLowerCase();
  const tipo = document.getElementById('hist-tipo-f').value;
  const f = historico.filter(h => {
    const mt = !tipo || h.tipo === tipo;
    const mq = !q || h.codigo.toLowerCase().includes(q) || h.resp.toLowerCase().includes(q) ||
      h.itens.some(i => i.nome.toLowerCase().includes(q) || i.cod.toLowerCase().includes(q) || i.pedido.includes(q));
    return mt && mq;
  });
  const tb = document.getElementById('hist-body');
  if (!f.length) { tb.innerHTML = `<tr><td colspan="6" class="empty">Nenhuma movimentação registrada</td></tr>`; return; }
  let html = '';
  f.forEach(h => {
    const exp   = histExpandidos.has(h.codigo);
    const isEnt = h.tipo === 'entrada';
    const resumo = h.itens.slice(0,2).map(i => `<span class="cod" style="font-size:10px">${i.cod}</span>`).join(' ');
    const mais   = h.itens.length > 2 ? ` <span style="font-size:11px;color:var(--text3)">+${h.itens.length-2} mais</span>` : '';
    const tipoLabel = isEnt ? '<span class="badge badge-ok">Entrada</span>' : '<span class="badge badge-out">Retirada</span>';
    const codLabel  = isEnt ? `<span class="hist-code">${h.codigo}</span>` : `<span class="badge badge-out" style="font-family:var(--mono);font-size:12px">${h.codigo}</span>`;
    html += `<tr class="data-row">
      <td><button class="expand-btn" onclick="toggleHistExp('${h.codigo}')">${exp?'▲':'▼'}</button></td>
      <td>${codLabel}</td><td>${tipoLabel}</td>
      <td style="font-size:12px;color:var(--text2)">${h.ts}</td>
      <td style="font-size:12px">${resumo}${mais}</td>
      <td style="font-size:12px;color:var(--text2)">${h.resp}</td>
    </tr>`;
    if (exp) {
      html += `<tr><td colspan="6" style="padding:0">
        <table class="hist-sub-table"><thead><tr>
          <th>CÓDIGO</th><th>PRODUTO</th><th>FAMÍLIA</th><th>PEDIDO</th><th>QTD</th>
          ${!isEnt ? '<th>SALDO</th>' : ''}
        </tr></thead><tbody>
        ${h.itens.map(i => `<tr>
          <td><span class="cod">${i.cod}</span></td>
          <td>${i.nome}</td>
          <td style="color:var(--text3)">${i.familia || '—'}</td>
          <td style="font-family:var(--mono)">${i.pedido}</td>
          <td style="font-family:var(--mono);font-weight:600">${isEnt?'+':'−'}${i.qtd}</td>
          ${!isEnt ? `<td style="font-family:var(--mono);color:var(--text3)">${i.saldo} un.</td>` : ''}
        </tr>`).join('')}
        ${h.obs ? `<tr><td colspan="6" style="font-style:italic;color:var(--text2)">Obs: ${h.obs}</td></tr>` : ''}
        </tbody></table>
      </td></tr>`;
    }
  });
  tb.innerHTML = html;
}

function toggleHistExp(cod) { histExpandidos.has(cod) ? histExpandidos.delete(cod) : histExpandidos.add(cod); renderHistorico(); }

// ═══════════════════════════════════════════
// RELATORIOS.JS
// ═══════════════════════════════════════════

let relAtivo = 'estoque-geral';

function switchRel(nome, el) {
  document.querySelectorAll('.rel-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  relAtivo = nome;
  renderRelatorio();
}

function renderRelatorio() {
  const area = document.getElementById('rel-conteudo');
  const filtros = document.getElementById('rel-filtros');

  if (relAtivo === 'estoque-geral')  { filtros.innerHTML = ''; renderRelEstoqueGeral(area); }
  if (relAtivo === 'produtos')        { filtros.innerHTML = ''; renderRelProdutos(area); }
  if (relAtivo === 'entradas')        { filtros.innerHTML = filtroData(); renderRelEntradas(area); }
  if (relAtivo === 'retiradas')       { filtros.innerHTML = filtroData() + filtroResp(); renderRelRetiradas(area); }
  if (relAtivo === 'familias')        { filtros.innerHTML = filtroFamilia(); renderRelFamilias(area); }
}

// ── Filtros HTML ──
function filtroData() {
  return `
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <label style="text-transform:none;font-size:12px;color:var(--text2)">Período:</label>
      <input type="date" class="filter-sel" id="rf-de" onchange="renderRelatorio()" style="height:34px;padding:0 8px">
      <span style="font-size:12px;color:var(--text3)">até</span>
      <input type="date" class="filter-sel" id="rf-ate" onchange="renderRelatorio()" style="height:34px;padding:0 8px">
    </div>`;
}
function filtroResp() {
  const resps = [...new Set(historico.filter(h=>h.tipo==='retirada').map(h=>h.resp))].sort();
  return `<select class="filter-sel" id="rf-resp" onchange="renderRelatorio()">
    <option value="">Todos os responsáveis</option>
    ${resps.map(r=>`<option>${r}</option>`).join('')}
  </select>`;
}
function filtroFamilia() {
  return `<select class="filter-sel" id="rf-familia" onchange="renderRelatorio()" style="min-width:220px">
    <option value="">Todas as famílias</option>
    ${FAMILIAS.map(f=>`<option>${f}</option>`).join('')}
  </select>`;
}

// ── Helpers ──
function getDataFiltro() {
  const de  = document.getElementById('rf-de')?.value;
  const ate = document.getElementById('rf-ate')?.value;
  return { de, ate };
}
function dentroDoperiodo(ts, de, ate) {
  if (!de && !ate) return true;
  // ts formato pt-BR: DD/MM/YYYY, HH:MM:SS
  const partes = ts.split(', ')[0].split('/');
  const data = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  if (de  && data < new Date(de  + 'T00:00:00')) return false;
  if (ate && data > new Date(ate + 'T23:59:59')) return false;
  return true;
}
function tabelaHeader(...cols) {
  return `<thead><tr>${cols.map(([c,w])=>`<th style="width:${w||'auto'}">${c}</th>`).join('')}</tr></thead>`;
}
function emptyRel(msg='Nenhum registro encontrado.') {
  return `<tr><td colspan="20" class="empty">${msg}</td></tr>`;
}
function relWrap(titulo, subtitulo, tableHtml) {
  const hoje = new Date().toLocaleString('pt-BR');
  return `
    <div class="rel-print-header">
      <div class="rel-print-title">${titulo}</div>
      <div class="rel-print-sub">${subtitulo}</div>
      <div class="rel-print-date">Emitido em ${hoje}</div>
    </div>
    <div class="table-card" style="margin-top:0">${tableHtml}</div>`;
}

// ══════════════════════════════════════════
// 1. ESTOQUE GERAL
// ══════════════════════════════════════════
function renderRelEstoqueGeral(area) {
  const tot = produtos.reduce((s,p)=>s+totalProd(p),0);
  const zerados = produtos.filter(p=>totalProd(p)===0).length;

  const rows = produtos.length
    ? produtos.map(p => {
        const pedidos = p.lotes.map(l=>`${l.pedido} (${l.qtd})`).join(', ') || '—';
        return `<tr>
          <td><span class="cod">${p.cod}</span></td>
          <td style="font-weight:500">${p.nome}</td>
          <td style="font-size:12px;color:var(--text2)">${p.familia||'—'}</td>
          <td style="font-size:12px;color:var(--text2)">${p.local}</td>
          <td style="font-size:12px">${pedidos}</td>
          <td style="font-family:var(--mono);font-weight:600;text-align:right">${totalProd(p)}</td>
          <td>${badgeStatus(p)}</td>
        </tr>`;
      }).join('')
    : emptyRel('Nenhum produto em estoque.');

  area.innerHTML = `
    <div class="rel-summary">
      <div class="rel-sum-item"><span class="rel-sum-val">${produtos.length}</span><span class="rel-sum-lbl">Produtos</span></div>
      <div class="rel-sum-item"><span class="rel-sum-val">${tot}</span><span class="rel-sum-lbl">Peças totais</span></div>
      <div class="rel-sum-item ${zerados>0?'danger':''}"><span class="rel-sum-val">${zerados}</span><span class="rel-sum-lbl">Zerados</span></div>
    </div>
    ${relWrap('Relatório de Estoque Geral', `${produtos.length} produto(s) · ${tot} peça(s) em estoque`,
      `<table>${tabelaHeader(['Código','90px'],['Produto'],['Família','160px'],['Local','120px'],['Pedidos e qtds'],['Total','70px'],['Status','90px'])}
      <tbody>${rows}</tbody></table>`
    )}`;
}

// ══════════════════════════════════════════
// 2. PRODUTOS CADASTRADOS
// ══════════════════════════════════════════
function renderRelProdutos(area) {
  const rows = produtos.length
    ? produtos.map((p, i) => `<tr>
        <td style="font-size:12px;color:var(--text3);text-align:center">${i+1}</td>
        <td><span class="cod">${p.cod}</span></td>
        <td style="font-weight:500">${p.nome}</td>
        <td style="font-size:12px;color:var(--text2)">${p.familia||'—'}</td>
        <td style="font-size:12px;color:var(--text2)">${p.local}</td>
        <td style="font-family:var(--mono);font-weight:600;text-align:right">${totalProd(p)}</td>
      </tr>`).join('')
    : emptyRel('Nenhum produto cadastrado.');

  area.innerHTML = relWrap(
    'Relatório de Produtos Cadastrados',
    `${produtos.length} produto(s) registrado(s)`,
    `<table>${tabelaHeader(['#','36px'],['Código','90px'],['Nome / Descrição'],['Família','160px'],['Local','130px'],['Estoque','80px'])}
    <tbody>${rows}</tbody></table>`
  );
}

// ══════════════════════════════════════════
// 3. ENTRADAS
// ══════════════════════════════════════════
function renderRelEntradas(area) {
  const { de, ate } = getDataFiltro();
  const entradas = historico.filter(h => h.tipo === 'entrada' && dentroDoperiodo(h.ts, de, ate));
  const totItens = entradas.reduce((s,h)=>s+h.itens.reduce((ss,i)=>ss+i.qtd,0),0);

  const rows = entradas.length
    ? entradas.map(h => {
        const resumo = h.itens.map(i=>`${i.cod} — ${i.nome} (${i.pedido}: +${i.qtd})`).join('<br>');
        return `<tr>
          <td><span class="hist-code">${h.codigo}</span></td>
          <td style="font-size:12px;color:var(--text2)">${h.ts}</td>
          <td style="font-size:12px">${resumo}</td>
          <td style="font-family:var(--mono);font-weight:600;text-align:right">
            ${h.itens.reduce((s,i)=>s+i.qtd,0)}
          </td>
        </tr>`;
      }).join('')
    : emptyRel('Nenhuma entrada no período selecionado.');

  area.innerHTML = `
    <div class="rel-summary">
      <div class="rel-sum-item"><span class="rel-sum-val">${entradas.length}</span><span class="rel-sum-lbl">Solicitações</span></div>
      <div class="rel-sum-item"><span class="rel-sum-val">${totItens}</span><span class="rel-sum-lbl">Peças recebidas</span></div>
    </div>
    ${relWrap('Relatório de Entradas de Material',
      `${entradas.length} solicitação(ões) · ${totItens} peça(s) recebida(s)`,
      `<table>${tabelaHeader(['Cód. Entrada','100px'],['Data/Hora','140px'],['Itens movimentados'],['Qtd total','80px'])}
      <tbody>${rows}</tbody></table>`
    )}`;
}

// ══════════════════════════════════════════
// 4. RETIRADAS
// ══════════════════════════════════════════
function renderRelRetiradas(area) {
  const { de, ate } = getDataFiltro();
  const respF = document.getElementById('rf-resp')?.value || '';
  const retiradas = historico.filter(h =>
    h.tipo === 'retirada' &&
    dentroDoperiodo(h.ts, de, ate) &&
    (!respF || h.resp === respF)
  );
  const totItens = retiradas.reduce((s,h)=>s+h.itens.reduce((ss,i)=>ss+i.qtd,0),0);

  const rows = retiradas.length
    ? retiradas.map(h => {
        const resumo = h.itens.map(i=>`${i.cod} — ${i.nome} (${i.pedido}: −${i.qtd})`).join('<br>');
        return `<tr>
          <td><span class="badge badge-out" style="font-family:var(--mono);font-size:12px">${h.codigo}</span></td>
          <td style="font-size:12px;color:var(--text2)">${h.ts}</td>
          <td style="font-size:12px">${resumo}</td>
          <td style="font-family:var(--mono);font-weight:600;text-align:right">
            ${h.itens.reduce((s,i)=>s+i.qtd,0)}
          </td>
          <td style="font-weight:500">${h.resp}</td>
          <td style="font-size:12px;color:var(--text2)">${h.obs||'—'}</td>
        </tr>`;
      }).join('')
    : emptyRel('Nenhuma retirada no período selecionado.');

  area.innerHTML = `
    <div class="rel-summary">
      <div class="rel-sum-item"><span class="rel-sum-val">${retiradas.length}</span><span class="rel-sum-lbl">Retiradas</span></div>
      <div class="rel-sum-item"><span class="rel-sum-val">${totItens}</span><span class="rel-sum-lbl">Peças retiradas</span></div>
      <div class="rel-sum-item"><span class="rel-sum-val">${[...new Set(retiradas.map(h=>h.resp))].length}</span><span class="rel-sum-lbl">Responsáveis</span></div>
    </div>
    ${relWrap('Relatório de Retiradas de Material',
      `${retiradas.length} retirada(s) · ${totItens} peça(s) retirada(s)`,
      `<table>${tabelaHeader(['Cód. Retirada','110px'],['Data/Hora','140px'],['Itens retirados'],['Qtd','70px'],['Responsável','140px'],['Observação','130px'])}
      <tbody>${rows}</tbody></table>`
    )}`;
}

// ══════════════════════════════════════════
// 5. POR FAMÍLIA
// ══════════════════════════════════════════
function renderRelFamilias(area) {
  const familiaF = document.getElementById('rf-familia')?.value || '';
  const familias = familiaF ? [familiaF] : FAMILIAS;

  let html = '';
  let totalGeral = 0, totalProdutos = 0;

  familias.forEach(fam => {
    const prods = produtos.filter(p => p.familia === fam);
    totalProdutos += prods.length;
    const totFam = prods.reduce((s,p)=>s+totalProd(p),0);
    totalGeral += totFam;

    const rows = prods.length
      ? prods.map(p => `<tr>
          <td><span class="cod">${p.cod}</span></td>
          <td style="font-weight:500">${p.nome}</td>
          <td style="font-size:12px;color:var(--text2)">${p.local}</td>
          <td style="font-size:12px">${p.lotes.map(l=>`${l.pedido} (${l.qtd})`).join(', ')||'—'}</td>
          <td style="font-family:var(--mono);font-weight:600;text-align:right">${totalProd(p)}</td>
          <td>${badgeStatus(p)}</td>
        </tr>`).join('')
      : `<tr><td colspan="6" style="text-align:center;padding:14px;font-size:12px;color:var(--text3)">Nenhum produto cadastrado nesta família</td></tr>`;

    html += `
      <div class="rel-familia-bloco">
        <div class="rel-familia-header">
          <span class="rel-familia-nome">${fam}</span>
          <span class="rel-familia-stats">
            <span class="cod" style="font-size:11px">${prods.length} produto(s)</span>
            <span class="cod" style="font-size:11px;margin-left:6px">${totFam} un. em estoque</span>
          </span>
        </div>
        <table>
          ${tabelaHeader(['Código','90px'],['Nome / Descrição'],['Local','120px'],['Pedidos e qtds'],['Total','70px'],['Status','90px'])}
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  });

  area.innerHTML = `
    <div class="rel-summary">
      <div class="rel-sum-item"><span class="rel-sum-val">${familias.length}</span><span class="rel-sum-lbl">Famílias</span></div>
      <div class="rel-sum-item"><span class="rel-sum-val">${totalProdutos}</span><span class="rel-sum-lbl">Produtos</span></div>
      <div class="rel-sum-item"><span class="rel-sum-val">${totalGeral}</span><span class="rel-sum-lbl">Peças totais</span></div>
    </div>
    <div class="rel-print-header">
      <div class="rel-print-title">Relatório por Família</div>
      <div class="rel-print-sub">${familiaF || 'Todas as famílias'} · Emitido em ${new Date().toLocaleString('pt-BR')}</div>
    </div>
    ${html}`;
}

// ══════════════════════════════════════════
// IMPRESSÃO
// ══════════════════════════════════════════
function imprimirRelatorio() {
  window.print();
}

// ═══════════════════════════════════════════
// RETIRADA.JS
// ═══════════════════════════════════════════
let retBlocos = [], retBlocoSeq = 0;

function addRetBloco() {
  const id = ++retBlocoSeq; retBlocos.push(id);
  const div = document.createElement('div');
  div.className = 'ret-block'; div.id = 'ret-bloco-' + id;
  div.innerHTML = `
    <div class="ret-block-head" style="background:var(--bg2);padding:11px 14px;display:flex;align-items:center;gap:10px">
      <span class="prod-block-num">Produto ${retBlocos.length}</span>
      <input class="inp mono" type="text" placeholder="Código (ex: S001)" style="max-width:180px;flex-shrink:0;height:32px" oninput="onRetCodInput(${id},this.value)" id="ret-cod-${id}">
      <span id="ret-nome-${id}" style="flex:1;font-size:13px;color:var(--text3)">— digite o código —</span>
      <button style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:20px;padding:0 4px" onclick="rmRetBloco(${id})">×</button>
    </div>
    <div class="prod-block-body" id="ret-body-${id}">
      <p style="font-size:12px;color:var(--text3);font-family:var(--mono)">Digite o código para ver os pedidos disponíveis.</p>
    </div>`;
  document.getElementById('ret-blocos').appendChild(div);
}

function onRetCodInput(id, val) {
  const p = getProd(val.trim());
  const nomeEl = document.getElementById('ret-nome-' + id);
  const body   = document.getElementById('ret-body-' + id);
  if (!p) {
    nomeEl.textContent = val ? 'Código não encontrado' : '— digite o código —';
    nomeEl.style.color = val ? 'var(--danger)' : 'var(--text3)';
    body.innerHTML = `<p style="font-size:12px;color:var(--text3);font-family:var(--mono)">Digite o código para ver os pedidos disponíveis.</p>`;
    return;
  }
  nomeEl.textContent = p.nome; nomeEl.style.color = 'var(--text)';
  const lotesDisp = p.lotes.filter(l => l.qtd > 0);
  if (!lotesDisp.length) { body.innerHTML = `<p style="font-size:12px;color:var(--danger);font-family:var(--mono)">Produto sem saldo em estoque.</p>`; return; }
  body.innerHTML = `
    <p style="font-size:12px;color:var(--text2);margin-bottom:12px;font-family:var(--mono)">
      Família: <strong>${p.familia || '—'}</strong> · Total disponível: <strong>${totalProd(p)}</strong> un.
    </p>
    ${lotesDisp.map(l => {
      const sk = l.pedido.replace(/[^a-zA-Z0-9]/g, '_');
      return `<div class="pedido-ret-row">
        <span class="ped-label">Pedido <strong>${l.pedido}</strong></span>
        <span class="ped-disp">Disponível: ${l.qtd} un.</span>
        <input class="inp ped-qtd-inp" type="number" id="ret-inp-${id}-${sk}" min="0" max="${l.qtd}" value="0" oninput="this.style.borderColor=parseInt(this.value)>${l.qtd}?'var(--danger)':''">
      </div>`;
    }).join('')}`;
}

function rmRetBloco(id) { retBlocos = retBlocos.filter(x => x !== id); document.getElementById('ret-bloco-' + id)?.remove(); }

function confirmarRetirada() {
  const resp = document.getElementById('ret-resp').value.trim();
  const obs  = document.getElementById('ret-obs').value.trim();
  if (!resp) { showAlert('alert-ret', 'Informe o responsável pela retirada.', 'err'); return; }
  const blocos = document.querySelectorAll('[id^="ret-bloco-"]');
  if (!blocos.length) { showAlert('alert-ret', 'Adicione ao menos um produto.', 'err'); return; }
  let itens = [], erros = [];
  blocos.forEach(bloco => {
    const bid = bloco.id.replace('ret-bloco-', '');
    const cod = document.getElementById('ret-cod-' + bid)?.value.trim().toUpperCase();
    const p = getProd(cod);
    if (!p) { erros.push(`Código ${cod} inválido.`); return; }
    p.lotes.filter(l => l.qtd > 0).forEach(l => {
      const sk  = l.pedido.replace(/[^a-zA-Z0-9]/g, '_');
      const inp = document.getElementById(`ret-inp-${bid}-${sk}`);
      if (!inp) return;
      const qtd = parseInt(inp.value) || 0;
      if (qtd <= 0) return;
      if (qtd > l.qtd) { erros.push(`${cod} / pedido ${l.pedido}: excede disponível (${l.qtd}).`); return; }
      itens.push({ p, cod, pedido: l.pedido, qtd, lote: l });
    });
  });
  if (erros.length)  { showAlert('alert-ret', erros[0], 'err'); return; }
  if (!itens.length) { showAlert('alert-ret', 'Nenhuma quantidade informada.', 'err'); return; }

  const codRet = 'R' + String(retCodSeq++).padStart(3, '0');
  const histItens = [];
  itens.forEach(({ lote, qtd, cod, p, pedido }) => {
    lote.qtd -= qtd;
    histItens.push({ cod, nome: p.nome, familia: p.familia, pedido, qtd, saldo: lote.qtd });
  });
  historico.unshift({ codigo: codRet, tipo: 'retirada', ts: fmtDate(), itens: histItens, resp, obs });
  salvarDados(); renderMetrics();
  showAlert('alert-ret', `Retirada ${codRet} registrada! ${itens.length} item(ns) movimentado(s).`, 'ok');
  resetRetirada();
}

function resetRetirada() {
  document.getElementById('ret-blocos').innerHTML = '';
  document.getElementById('ret-resp').value = '';
  document.getElementById('ret-obs').value  = '';
  retBlocos = []; retBlocoSeq = 0;
}

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

// ═══════════════════════════════════════════
// CADASTRO.JS
// ═══════════════════════════════════════════

function atualizarPreviewCod() {
  const cod = gerarProxCod();
  const inp = document.getElementById('cad-cod');
  if (inp) inp.value = cod;
  const prev = document.getElementById('cad-preview');
  if (prev) prev.textContent = cadCodSeq > 1 ? `Anterior: S${String(cadCodSeq-1).padStart(3,'0')}` : '';
}

function cadastrarProduto() {
  const nome    = document.getElementById('cad-nome').value.trim();
  const familia = document.getElementById('cad-familia').value;
  const local   = document.getElementById('cad-local').value.trim();
  if (!nome)    { showAlert('alert-cad', 'Informe o nome / descrição do material.', 'err'); return; }
  if (!familia) { showAlert('alert-cad', 'Selecione a família do produto.', 'err'); return; }

  // Avança até código livre (proteção contra duplicata)
  while (getProd(gerarProxCod())) cadCodSeq++;
  const cod = gerarProxCod();

  produtos.push({ cod, nome, familia, local: local || '—', lotes: [] });
  cadCodSeq++;

  salvarDados();
  renderCadastro();
  renderMetrics();
  showAlert('alert-cad', `Produto ${cod} — ${nome} cadastrado com sucesso!`, 'ok');
  limparCad();
  atualizarPreviewCod();
}

function limparCad() {
  document.getElementById('cad-nome').value  = '';
  document.getElementById('cad-local').value = '';
  document.getElementById('cad-familia').selectedIndex = 0;
  atualizarPreviewCod();
}

function renderCadastro() {
  const q       = (document.getElementById('cad-search')?.value || '').toLowerCase();
  const familia = document.getElementById('cad-familia-f')?.value || '';
  const f = produtos.filter(p =>
    (!q       || p.cod.toLowerCase().includes(q) || p.nome.toLowerCase().includes(q)) &&
    (!familia || p.familia === familia)
  );
  const tb = document.getElementById('cad-body');
  if (!f.length) { tb.innerHTML = `<tr><td colspan="6" class="empty">Nenhum produto cadastrado</td></tr>`; return; }
  tb.innerHTML = f.map(p => `
    <tr class="data-row">
      <td><span class="cod">${p.cod}</span></td>
      <td style="font-weight:500">${p.nome}</td>
      <td style="font-size:12px;color:var(--text2)">${p.familia || '—'}</td>
      <td style="font-size:12px;color:var(--text2)">${p.local}</td>
      <td style="font-family:var(--mono);font-weight:600">${totalProd(p)}</td>
      <td><button class="btn-table-del" onclick="confirmarExcluirProduto('${p.cod}')">Excluir</button></td>
    </tr>`).join('');
}
