const mode = (new URLSearchParams(window.location.search).get('modo') === 'editar' || window.location.href.includes('modo=editar')) ? 'editar' : 'novo';
const formType = document.body.dataset.form;
const icons = {
  trash: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>',
  settings: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/></svg>',
  edit: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 20h4l11-11-4-4L4 16z"/></svg>'
};

const toast = document.querySelector('#formToast');
const toastText = document.querySelector('#formToastText');
let toastTimer;
function showToast(message) { toastText.textContent = message; toast.classList.add('toast--visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 2800); }

function setupShell() {
  const sidebar = document.querySelector('#sidebar');
  const overlay = document.querySelector('#sidebarOverlay');
  const toggle = (open) => { sidebar.classList.toggle('sidebar--open', open); overlay.classList.toggle('sidebar-overlay--visible', open); };
  document.querySelector('#openSidebar')?.addEventListener('click', () => toggle(true));
  document.querySelector('#closeSidebar')?.addEventListener('click', () => toggle(false));
  overlay?.addEventListener('click', () => toggle(false));
}

function removeButton() { return `<button class="remove-button" type="button" data-remove aria-label="Remover">${icons.trash}</button>`; }
function addDate(value = '') { const list = document.querySelector('#dateList'); const phase = list.children.length + 1; list.insertAdjacentHTML('beforeend', `<div class="dynamic-row dynamic-row--date"><input value="Fase ${phase}" aria-label="Fase" readonly><input type="date" value="${value}" aria-label="Data do Habite-se">${removeButton()}</div>`); }
function addBlock(value = '') { document.querySelector('#blockList').insertAdjacentHTML('beforeend', `<div class="dynamic-row"><input value="${value}" placeholder="Nome do bloco" aria-label="Nome do bloco">${removeButton()}</div>`); }
function addManual(value = '') { document.querySelector('#manualList').insertAdjacentHTML('beforeend', `<div class="dynamic-row dynamic-row--manual"><input value="${value}" placeholder="Nome do manual" aria-label="Nome do manual">${removeButton()}<button class="settings-button" type="button" aria-label="Configurar manual">${icons.settings}</button></div>`); }

function fillCondoEdit() {
  const values = {sindico_nome:'RONALDO SA (GMAIL)',sindico_email:'ronaldosaoliveira@gmail.com',sindico_senha:'123456',sindico_cpf:'113.855.848-66',inc_nome:'Denise Brito',inc_email:'denise.magicoolhar@gmail.com',assistencia_tipo:'Sistema IMO',condominio_nome:'AA RSO ASSESSORIA CONDOMÍNIO',referencia:'2020001',cnpj:'11.111.111/1111-11',contrato_data:'2027-12-15',upload:'300',endereco:'RUA SOPHIA',bairro:'MORUMBI',cidade:'SÃO PAULO',numero:'56',complemento:'cj 62',telefone:'(55) 11995-7825',estado:'SP'};
  Object.entries(values).forEach(([name,value]) => { const field = document.querySelector(`[name="${name}"]`); if (field) field.value = value; });
  document.querySelector('[name="liberar_morador"]').checked = true;
}

function initCondo() {
  const isEdit = mode === 'editar';
  document.querySelector('#pageTitle').textContent = isEdit ? 'Editar dados do condomínio' : 'Cadastrar novo condomínio';
  document.querySelector('#breadcrumbMode').textContent = isEdit ? 'Editar condomínio' : 'Novo cadastro';
  document.querySelector('#submitCondo').textContent = isEdit ? 'Salvar alterações' : 'Cadastrar condomínio';
  const modules = ['Plantas de Furação','Plantas de Furação (DWG)','Databook','Databook (usuários)','Vídeos','Assistência Técnica','Planos de Reforma','Planos de Manutenção','Manutenção de Unidades','Gestão das Garantias','Agendamento de Espaços','Livro de Ocorrências','Quadro de Avisos'];
  document.querySelector('#modulesGrid').innerHTML = modules.map((item) => `<label class="check-card"><input type="checkbox" checked>${item}</label>`).join('');
  document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => ({date:addDate,block:addBlock,manual:addManual}[button.dataset.add])()));
  document.addEventListener('click', (event) => { if (event.target.closest('[data-remove]')) event.target.closest('.dynamic-row').remove(); });
  document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-scroll]').forEach((item) => item.classList.toggle('active', item === button)); document.querySelector(`#${button.dataset.scroll}`).scrollIntoView({behavior:'smooth',block:'start'}); }));
  if (isEdit) { fillCondoEdit(); addDate('2025-03-15'); ['BLOCO 1','BLOCO 2'].forEach(addBlock); ['Manual duplex','Manual Loja'].forEach(addManual); }
  else { addDate(); addBlock(); addManual(); }
  const units = isEdit ? ['Padrão','Cobertura','Garden','Casa','Manual duplex','Manual Loja'] : ['Padrão'];
  document.querySelector('#unitTypes').innerHTML = units.map((item) => `<a class="unit-type" href="manutencao-form.html?modo=editar">${icons.edit}<span>${item}</span><svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></a>`).join('');
  document.querySelector('#condoForm').addEventListener('submit', (event) => { event.preventDefault(); showToast(isEdit ? 'Alterações do condomínio salvas.' : 'Condomínio cadastrado com sucesso.'); });
}

let recordCount = 0;
function addRecord(data = {}) {
  recordCount += 1;
  const list = document.querySelector('#recordList');
  document.querySelector('#emptyRecords').hidden = true;
  list.insertAdjacentHTML('beforeend', `<article class="record-card"><header class="record-card__header"><div><span class="record-number">${recordCount}</span><div><strong>${data.title || 'Nova rotina de manutenção'}</strong><small>Configure a descrição e periodicidade.</small></div></div><button class="remove-button" type="button" data-remove-record aria-label="Excluir registro">${icons.trash}</button></header><div class="record-card__body"><div class="record-grid"><label><span>Descrição da manutenção</span><input value="${data.description || ''}" placeholder="Descreva a atividade"></label><label><span>Periodicidade</span><input type="number" value="${data.period || ''}" placeholder="Ex.: 6"></label><label><span>Período</span><select><option>Meses</option><option>Dias</option><option>Anos</option></select></label><label class="wide"><span>Orientações e observações</span><textarea placeholder="Informe procedimentos, responsáveis ou cuidados necessários">${data.notes || ''}</textarea></label></div></div></article>`);
}
function initMaintenance() {
  const isEdit = mode === 'editar';
  document.querySelector('#pageTitle').textContent = isEdit ? 'Editar manutenção' : 'Cadastrar nova manutenção';
  document.querySelector('#breadcrumbMode').textContent = isEdit ? 'Editar manutenção' : 'Novo cadastro';
  document.querySelector('#maintenanceHeading').textContent = isEdit ? 'Hidráulica · Água potável' : 'Novo sistema e subsistema';
  document.querySelector('#submitMaintenance').textContent = isEdit ? 'Salvar alterações' : 'Cadastrar manutenção';
  document.querySelector('.status-pill--draft').innerHTML = `<span></span>${isEdit ? 'Em edição' : 'Novo cadastro'}`;
  if (!isEdit) {
    document.querySelector('[name="sistema"]').selectedIndex = 0;
    document.querySelector('[name="subsistema"]').selectedIndex = 0;
  }
  if (isEdit) addRecord({title:'Verificação do sistema',description:'Verificar reservatórios, tubulações e pontos de abastecimento.',period:'6',notes:'Registrar a inspeção e eventuais não conformidades.'});
  document.querySelector('#addRecord').addEventListener('click', () => addRecord());
  document.querySelector('[data-empty-add]').addEventListener('click', () => addRecord());
  document.addEventListener('click', (event) => { const remove = event.target.closest('[data-remove-record]'); if (!remove) return; remove.closest('.record-card').remove(); if (!document.querySelector('#recordList').children.length) document.querySelector('#emptyRecords').hidden = false; });
  document.querySelector('#maintenanceForm').addEventListener('submit', (event) => { event.preventDefault(); showToast(isEdit ? 'Manutenção atualizada com sucesso.' : 'Manutenção cadastrada com sucesso.'); });
}

setupShell();
if (formType === 'condominio') initCondo();
if (formType === 'manutencao') initMaintenance();
