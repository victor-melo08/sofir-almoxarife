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
