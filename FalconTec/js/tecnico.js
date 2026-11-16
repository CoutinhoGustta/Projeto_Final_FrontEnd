/* ==========================================
   ARQUIVO: tecnico.js
   SISTEMA DE ACESSO DA ÁREA TÉCNICA
========================================== */

// Usuários fictícios para demonstração
const usuariosTecnicos = [
  {
    id: 1,
    nome: "Administrador Falcontec",
    usuario: "admin",
    senha: "admin123",
    tipo: "admin",
    ativo: true,
  },
];

// Elementos da página de login
const formularioLogin = document.getElementById("form-login-tecnico");
const mensagemLogin = document.getElementById("mensagem-login");

// Recupera a sessão ativa
function obterSessao() {
  const sessaoSalva =
    localStorage.getItem("sessaoFalcontec") ||
    sessionStorage.getItem("sessaoFalcontec");

  if (!sessaoSalva) {
    return null;
  }

  try {
    return JSON.parse(sessaoSalva);
  } catch (erro) {
    localStorage.removeItem("sessaoFalcontec");
    sessionStorage.removeItem("sessaoFalcontec");
    return null;
  }
}

// Encerra a sessão
function encerrarSessao() {
  localStorage.removeItem("sessaoFalcontec");
  sessionStorage.removeItem("sessaoFalcontec");

  window.location.href = "tecnico.html";
}

// ==========================================
// LOGIN
// ==========================================

if (formularioLogin) {
  // Se já estiver autenticado, evita voltar ao login
  const sessaoAtual = obterSessao();

  if (sessaoAtual) {
    window.location.href =
      sessaoAtual.tipo === "admin" ? "admin.html" : "tecnico.html";
  }

  formularioLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const usuarioDigitado = document.getElementById("usuario").value.trim();

    const senhaDigitada = document.getElementById("senha").value;

    const lembrarLogin = document.getElementById("lembrar-login").checked;

    const usuarioEncontrado = usuariosTecnicos.find(function (usuario) {
      return (
        usuario.usuario === usuarioDigitado &&
        usuario.senha === senhaDigitada &&
        usuario.ativo
      );
    });

    if (!usuarioEncontrado) {
      mensagemLogin.textContent = "Usuário ou senha inválidos.";
      mensagemLogin.style.color = "#c62828";
      return;
    }

    const sessao = {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      usuario: usuarioEncontrado.usuario,
      tipo: usuarioEncontrado.tipo,
    };

    // Salva a sessão conforme a escolha do usuário
    if (lembrarLogin) {
      localStorage.setItem("sessaoFalcontec", JSON.stringify(sessao));
      sessionStorage.removeItem("sessaoFalcontec");
    } else {
      sessionStorage.setItem("sessaoFalcontec", JSON.stringify(sessao));
      localStorage.removeItem("sessaoFalcontec");
    }

    mensagemLogin.textContent = "Login realizado com sucesso!";
    mensagemLogin.style.color = "#218838";

    setTimeout(function () {
      window.location.href =
        usuarioEncontrado.tipo === "admin" ? "admin.html" : "painel.html";
    }, 700);
  });
}

// ==========================================
// PROTEÇÃO DO PAINEL ADMINISTRATIVO
// ==========================================

const nomeAdministrador = document.getElementById("nome-administrador");

if (nomeAdministrador) {
  const sessaoAtual = obterSessao();

  // Impede o acesso sem uma sessão administrativa
  if (!sessaoAtual || sessaoAtual.tipo !== "admin") {
    window.location.replace("tecnico.html");
  } else {
    // Exibe o nome do administrador
    nomeAdministrador.textContent = sessaoAtual.nome;

    // Configura o botão de saída
    const botaoSair = document.getElementById("btn-sair");

    if (botaoSair) {
      botaoSair.addEventListener("click", encerrarSessao);
    }
  }
}
