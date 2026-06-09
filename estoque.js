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
