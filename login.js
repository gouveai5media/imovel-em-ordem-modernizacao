const loginForm = document.querySelector('#loginForm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const passwordToggle = document.querySelector('#passwordToggle');
const emailTooltip = document.querySelector('#emailTooltip');
const loginToast = document.querySelector('#loginToast');
let toastTimer;

function showToast(message) {
  loginToast.textContent = message;
  loginToast.classList.add('toast--visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => loginToast.classList.remove('toast--visible'), 3000);
}

function openModal(id) {
  const modal = document.querySelector(`#${id}`);
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  window.setTimeout(() => modal.querySelector('input, button:not([data-close])')?.focus(), 0);
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
}

document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.open));
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => closeModal(button.closest('.modal')));
});

document.querySelector('[data-help="email"]').addEventListener('click', () => {
  emailTooltip.hidden = !emailTooltip.hidden;
});

emailTooltip.querySelector('button').addEventListener('click', () => {
  emailTooltip.hidden = true;
});

passwordToggle.addEventListener('click', () => {
  const visible = passwordInput.type === 'text';
  passwordInput.type = visible ? 'password' : 'text';
  passwordToggle.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailValid = emailInput.validity.valid && emailInput.value.trim();
  const passwordValid = passwordInput.value.trim().length > 0;
  emailInput.closest('.field').classList.toggle('field--invalid', !emailValid);
  passwordInput.closest('.field').classList.toggle('field--invalid', !passwordValid);
  if (!emailValid || !passwordValid) return;
  openModal('propertyModal');
});

document.querySelector('#registerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const code = document.querySelector('#condoCode').value.trim();
  if (!code) return;
  closeModal(document.querySelector('#registerModal'));
  showToast(`Código ${code} verificado. Continue o pré-cadastro.`);
});

document.querySelector('#recoveryForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const recoveryEmail = document.querySelector('#recoveryEmail');
  if (!recoveryEmail.validity.valid || !recoveryEmail.value.trim()) return;
  closeModal(document.querySelector('#recoveryModal'));
  showToast('Orientações de recuperação enviadas para o e-mail informado.');
});

document.querySelectorAll('[data-property]').forEach((button) => {
  button.addEventListener('click', () => {
    closeModal(document.querySelector('#propertyModal'));
    showToast(`Acesso selecionado: ${button.dataset.property}`);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  emailTooltip.hidden = true;
  const openModalElement = [...document.querySelectorAll('.modal')].find((modal) => !modal.hidden);
  if (openModalElement) closeModal(openModalElement);
});
