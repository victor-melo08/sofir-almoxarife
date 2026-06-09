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
