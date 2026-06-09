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
