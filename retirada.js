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
