import { asset } from '../utils/asset.js';

// Tela de senha de entrada.
// ATENÇÃO: é uma barreira para a apresentação, não segurança real — o site é estático e
// qualquer pessoa com o link direto de um arquivo (PDF, vídeo) consegue abri-lo sem a senha.
const CHAVE = 'bluetruck-acesso';
// SHA-256 da senha (em minúsculas), para ela não ficar escrita no código
const HASH = 'cbb90a1c03d919be8af9836a202b0ea05c2025aabbefa95a106c0b9b8e8b222f';

async function sha256(texto) {
  if (!globalThis.crypto?.subtle) return null; // sem HTTPS o navegador não oferece o recurso
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function senhaCorreta(digitada) {
  const texto = digitada.trim().toLowerCase();
  const hash = await sha256(texto);
  return hash ? hash === HASH : texto === 'carreta';
}

function jaLiberado() {
  try {
    return sessionStorage.getItem(CHAVE) === '1';
  } catch {
    return false;
  }
}

export function exigirSenha(aoLiberar) {
  if (jaLiberado()) {
    aoLiberar();
    return;
  }

  document.body.classList.add('gate-aberto');
  const tela = document.createElement('div');
  tela.className = 'gate';
  tela.innerHTML = `
    <form class="gate-card" autocomplete="off">
      <img class="gate-logo" src="${asset('images/logo-bluehealth.png')}" alt="Blue Health" width="162" height="60">
      <h1 class="gate-titulo">Acesso restrito</h1>
      <p class="gate-texto">Digite a senha para entrar no BlueTruck.</p>
      <input class="gate-input" type="password" name="senha" placeholder="Senha" aria-label="Senha" autofocus>
      <p class="gate-erro" role="alert" hidden>Senha incorreta. Tente novamente.</p>
      <button class="gate-botao" type="submit">Entrar</button>
    </form>
  `;
  document.body.appendChild(tela);

  const form = tela.querySelector('form');
  const input = tela.querySelector('.gate-input');
  const erro = tela.querySelector('.gate-erro');
  input.focus();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (await senhaCorreta(input.value)) {
      try {
        sessionStorage.setItem(CHAVE, '1');
      } catch {
        /* sem armazenamento: pede a senha de novo ao recarregar */
      }
      tela.remove();
      document.body.classList.remove('gate-aberto');
      aoLiberar();
    } else {
      erro.hidden = false;
      input.value = '';
      form.classList.remove('gate-tremer');
      void form.offsetWidth; // reinicia a animação
      form.classList.add('gate-tremer');
      input.focus();
    }
  });
}
