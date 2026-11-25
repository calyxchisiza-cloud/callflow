const form = document.querySelector('#signup-form');
const emailField = document.querySelector('#email');
const passwordField = document.querySelector('#password');
const revealButton = document.querySelector('.visibility-toggle');
const message = document.querySelector('#form-message');

revealButton.addEventListener('click', () => {
  const shouldReveal = passwordField.type === 'password';
  passwordField.type = shouldReveal ? 'text' : 'password';
  revealButton.setAttribute('aria-pressed', String(shouldReveal));
  revealButton.setAttribute('aria-label', shouldReveal ? 'Hide password' : 'Show password');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.textContent = '';

  if (!emailField.validity.valid) {
    emailField.focus();
    message.textContent = emailField.value ? 'Please enter a valid email address.' : 'Add an email address to continue.';
    return;
  }
  if (passwordField.value.length < 8) {
    passwordField.focus();
    message.textContent = 'Use at least 8 characters for this demo.';
    return;
  }

  message.textContent = 'Demo only — your details were not sent or saved.';
  form.reset();
  passwordField.type = 'password';
  revealButton.setAttribute('aria-pressed', 'false');
  revealButton.setAttribute('aria-label', 'Show password');
});

document.querySelectorAll('.social-button').forEach((button) => {
  button.addEventListener('click', () => {
    message.textContent = `${button.dataset.provider} sign-up is a visual demo and is not connected.`;
  });
});

document.querySelector('#login-link').addEventListener('click', (event) => {
  event.preventDefault();
  message.textContent = 'Log in is a visual demo and is not connected.';
});

document.querySelectorAll('.terms-copy a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    message.textContent = `${link.textContent} will be available when the site has its policy pages.`;
  });
});

const scene = document.querySelector('.scene');
const sceneArt = document.querySelector('.scene-art');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (scene && sceneArt && finePointer && !reduceMotion) {
  scene.addEventListener('pointermove', (event) => {
    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    scene.style.setProperty('--scene-x', `${(-x * 7).toFixed(1)}px`);
    scene.style.setProperty('--scene-y', `${(-y * 5).toFixed(1)}px`);
  });
  scene.addEventListener('pointerleave', () => {
    scene.style.setProperty('--scene-x', '0px');
    scene.style.setProperty('--scene-y', '0px');
  });
}
