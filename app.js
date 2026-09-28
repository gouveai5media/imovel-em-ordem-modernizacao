const condominios = [
  { codigo: '2020001', nome: 'AA RSO ASSESSORIA CONDOMÍNIO', status: 'Ativo' },
  { codigo: '2023001', nome: 'ARUANÃ', status: 'Ativo' },
  { codigo: '2021105', nome: 'AUREA - RESIDENCIAL AGATA', status: 'Ativo' },
  { codigo: '2025029', nome: 'BENX_LED – LOJAS', status: 'Ativo' },
  { codigo: '2025028', nome: 'BENX_LED MADA', status: 'Ativo' },
  { codigo: '2025030', nome: 'BENX_LED VILA MADALENA', status: 'Ativo' },
  { codigo: '2023005', nome: 'BKL - VISTA VERDE', status: 'Ativo' },
  { codigo: '2025012', nome: 'BRATKE_GMS', status: 'Ativo' },
  { codigo: '2024011', nome: 'BRAVO_BE DEODORO', status: 'Ativo' },
  { codigo: '2024007', nome: 'CANVAS_HART SANTANA', status: 'Ativo' },
  { codigo: '2021109', nome: 'CBU - YES IDEAL LIVING', status: 'Ativo' },
  { codigo: '2024023', nome: 'CENTRO DE TREINAMENTO CBF', status: 'Ativo' },
  { codigo: '2023021', nome: 'CHAPCHAP RESIDÊNCIA FIUZA', status: 'Ativo' }
];

const manutencoes = [
  { sistema: 'Exaustão', itens: ['Mecânica'] },
  { sistema: 'Heliporto', itens: ['Geral'] },
  { sistema: 'Hidráulica', itens: ['Água potável', 'Água potável / água quente', 'Água potável / bombas', 'Água potável / redutora', 'Água servida', 'Água servida / bombas', 'Águas de reúso', 'Águas pluviais', 'Gerador de água quente'] },
  { sistema: 'Combate a incêndio', itens: ['Equipamentos', 'Sinalização e rotas'] }
];

const icons = {
  edit: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 20h4l11-11-4-4L4 16zM13.5 6.5l4 4"/></svg>',
  more: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
  eye: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  user: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',
  folder: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 6h7l2 2h9v11H3z"/></svg>',
  history: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6M4 4v4.6h4.6M12 8v5l3 2"/></svg>',
  tools: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.6 7 6.3 4.7a4 4 0 0 0 5 5L4 17.3 6.7 20l7.7-7.7a4 4 0 0 0 5-5L17 9.6 14.4 7z"/></svg>',
  people: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 16a5 5 0 0 1 7 4"/></svg>',
  building: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 21V7l8-4 8 4v14M8 21v-5h8v5M8 9h.01M12 9h.01M16 9h.01"/></svg>',
  trash: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>'
};

const condoRows = document.querySelector('#condoRows');
const resultCount = document.querySelector('#resultCount');
const rangeCount = document.querySelector('#rangeCount');
const totalCount = document.querySelector('#totalCount');
const condoSearch = document.querySelector('#condoSearch');
const maintenanceList = document.querySelector('#maintenanceList');
const maintenanceSearch = document.querySelector('#maintenanceSearch');
const toast = document.querySelector('#toast');
const toastText = document.querySelector('#toastText');
let toastTimer;

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function showToast(message) {
  toastText.textContent = message;
  toast.classList.add('toast--visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('toast--visible'), 2600);
}

function renderCondominios(items = condominios) {
  resultCount.textContent = items.length;
  rangeCount.textContent = items.length ? `1–${items.length}` : '0';
  totalCount.textContent = items.length;
  condoRows.innerHTML = items.map((item) => `
    <tr data-name="${item.nome}">
      <td data-label="Código"><span class="code-chip">${item.codigo}</span></td>
      <td data-label="Condomínio">
        <div class="condo-name">
          <span class="condo-name__avatar">${item.nome.slice(0, 2)}</span>
          <div><strong>${item.nome}</strong><small>Condomínio cadastrado</small></div>
        </div>
      </td>
      <td data-label="Status"><span class="status-pill"><span></span>${item.status}</span></td>
      <td data-label="Ações" class="data-table__actions">
        <div class="action-strip" aria-label="Acessos rápidos de ${item.nome}">
          <a class="row-action row-action--edit" href="condominio-form.html?modo=editar" aria-label="Editar ${item.nome}">${icons.edit}<span>Editar</span></a>
          <button class="action-icon action-icon--folder" type="button" data-tooltip="Arquivos" aria-label="Arquivos" data-action="Arquivos" data-condo="${item.nome}">${icons.folder}</button>
          <button class="action-icon action-icon--history" type="button" data-tooltip="Histórico" aria-label="Histórico" data-action="Histórico" data-condo="${item.nome}">${icons.history}</button>
          <button class="action-icon action-icon--tools" type="button" data-tooltip="Manutenções" aria-label="Manutenções" data-action="Manutenções" data-condo="${item.nome}">${icons.tools}</button>
          <button class="action-icon action-icon--view" type="button" data-tooltip="Visualizar" aria-label="Visualizar" data-action="Visualizar" data-condo="${item.nome}">${icons.eye}</button>
          <button class="action-icon action-icon--delete" type="button" data-tooltip="Excluir" aria-label="Excluir" data-action="Excluir" data-condo="${item.nome}">${icons.trash}</button>
          <button class="action-icon action-icon--people" type="button" data-tooltip="Moradores" aria-label="Moradores" data-action="Moradores" data-condo="${item.nome}">${icons.people}</button>
          <button class="action-icon action-icon--syndic" type="button" data-tooltip="Acessar como síndico" aria-label="Acessar como síndico" data-action="Acessar como síndico" data-condo="${item.nome}">${icons.user}</button>
          <button class="action-icon action-icon--developer" type="button" data-tooltip="Acessar como incorporadora" aria-label="Acessar como incorporadora" data-action="Acessar como incorporadora" data-condo="${item.nome}">${icons.building}</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderManutencoes(term = '') {
  const query = normalize(term.trim());
  const filtered = manutencoes
    .map((group) => ({
      ...group,
      itens: group.itens.filter((item) => !query || normalize(group.sistema).includes(query) || normalize(item).includes(query))
    }))
    .filter((group) => group.itens.length);

  maintenanceList.innerHTML = filtered.length ? filtered.map((group) => `
    <section class="maintenance-group">
      <header class="maintenance-group__header">
        <div>
          <span class="maintenance-group__icon">${icons.edit}</span>
          <div><h3>${group.sistema}</h3><p>${group.itens.length} ${group.itens.length === 1 ? 'subsistema' : 'subsistemas'}</p></div>
        </div>
        <a class="row-action row-action--edit" href="manutencao-form.html?modo=editar" aria-label="Editar sistema ${group.sistema}">${icons.edit}<span>Editar sistema</span></a>
      </header>
      <div class="maintenance-group__items">
        ${group.itens.map((item) => `
          <div class="maintenance-item">
            <span><i></i>${item}</span>
            <div>
              <button class="text-action" type="button" data-action="Editar manutenção" data-condo="${item}">Editar</button>
              <button class="icon-button icon-button--danger" type="button" data-action="Excluir manutenção" data-condo="${item}" aria-label="Excluir ${item}">${icons.trash}</button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `).join('') : '<div class="empty-state empty-state--compact"><h3>Nenhuma manutenção encontrada</h3><p>Tente buscar por outro sistema ou subsistema.</p></div>';
}

function closeActionMenus() {
  document.querySelectorAll('.action-menu--open').forEach((menu) => {
    menu.classList.remove('action-menu--open');
    menu.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
  });
}

document.querySelectorAll('[data-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('tab--active', active);
      item.setAttribute('aria-selected', String(active));
    });

    document.querySelectorAll('.tab-panel').forEach((panel) => {
      const active = panel.id === `panel-${tab.dataset.tab}`;
      panel.hidden = !active;
      panel.classList.toggle('tab-panel--active', active);
    });
  });
});

document.querySelectorAll('[data-nav-tab]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector(`[data-tab="${link.dataset.navTab}"]`)?.click();
    document.querySelectorAll('[data-nav-tab]').forEach((item) => item.classList.toggle('nav-item--active', item === link));
    document.querySelector('.content-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toggleSidebar(false);
  });
});

condoSearch.addEventListener('input', (event) => {
  const query = normalize(event.target.value.trim());
  renderCondominios(condominios.filter((item) => normalize(`${item.codigo} ${item.nome}`).includes(query)));
});

maintenanceSearch.addEventListener('input', (event) => renderManutencoes(event.target.value));

document.addEventListener('click', (event) => {
  const moreButton = event.target.closest('.row-action--more');
  if (moreButton) {
    const menu = moreButton.closest('.action-menu');
    const shouldOpen = !menu.classList.contains('action-menu--open');
    closeActionMenus();
    menu.classList.toggle('action-menu--open', shouldOpen);
    moreButton.setAttribute('aria-expanded', String(shouldOpen));
    return;
  }

  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    showToast(`${actionButton.dataset.action}: ${actionButton.dataset.condo}`);
  }

  if (!event.target.closest('.action-menu')) closeActionMenus();
});

const sidebar = document.querySelector('#sidebar');
const sidebarOverlay = document.querySelector('#sidebarOverlay');

function toggleSidebar(open) {
  sidebar.classList.toggle('sidebar--open', open);
  sidebarOverlay.classList.toggle('sidebar-overlay--visible', open);
  document.body.classList.toggle('no-scroll', open);
}

document.querySelector('#openSidebar').addEventListener('click', () => toggleSidebar(true));
document.querySelector('#closeSidebar').addEventListener('click', () => toggleSidebar(false));
sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    toggleSidebar(false);
    closeActionMenus();
  }
});

renderCondominios();
renderManutencoes();
