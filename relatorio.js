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
