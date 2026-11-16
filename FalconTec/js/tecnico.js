/* ==========================================
   ARQUIVO: tecnico.js
   SISTEMA DE ACESSO E GERENCIAMENTO TÉCNICO
========================================== */

// Chave utilizada para salvar os técnicos no navegador
const CHAVE_TECNICOS = "tecnicosFalcontec";

// Administrador padrão do sistema
const administradorPadrao = {
  id: 1,
  nome: "Administrador Falcontec",
  usuario: "admin",
  senha: "admin123",
  tipo: "admin",
  ativo: true,
};

// Técnico fixo do sistema
const tecnicoPadrao = {
  id: 2,
  nome: "Davi Henrique",
  usuario: "davi",
  senha: "davi123",
  tipo: "tecnico",
  ativo: true,
};

// Carrega os técnicos cadastrados no navegador
function carregarUsuariosTecnicos() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_TECNICOS);

    if (dadosSalvos) {
      const tecnicosSalvos = JSON.parse(dadosSalvos);

      if (Array.isArray(tecnicosSalvos)) {
        // Mantém somente os usuários do tipo técnico
        const tecnicos = tecnicosSalvos.filter(function (usuario) {
          return usuario.tipo === "tecnico";
        });

        // Evita duplicar o Davi e mantém suas credenciais padrão
        const outrosTecnicos = tecnicos.filter(function (usuario) {
          return usuario.usuario.toLowerCase() !== tecnicoPadrao.usuario;
        });

        return [administradorPadrao, tecnicoPadrao, ...outrosTecnicos];
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar os técnicos:", erro);
  }

  return [administradorPadrao, tecnicoPadrao];
}

// Lista de usuários disponíveis no sistema
const usuariosTecnicos = carregarUsuariosTecnicos();

// Salva os técnicos no navegador
function salvarUsuariosTecnicos() {
  const tecnicos = usuariosTecnicos.filter(function (usuario) {
    return usuario.tipo === "tecnico";
  });

  localStorage.setItem(CHAVE_TECNICOS, JSON.stringify(tecnicos));
}

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

// Define o destino conforme o tipo de usuário
function redirecionarUsuario(sessao) {
  window.location.href = sessao.tipo === "admin" ? "admin.html" : "painel.html";
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
    redirecionarUsuario(sessaoAtual);
  }

  formularioLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const usuarioDigitado = document
      .getElementById("usuario")
      .value.trim()
      .toLowerCase();

    const senhaDigitada = document.getElementById("senha").value;

    const lembrarLogin = document.getElementById("lembrar-login").checked;

    const usuarioEncontrado = usuariosTecnicos.find(function (usuario) {
      return (
        usuario.usuario.toLowerCase() === usuarioDigitado &&
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
      redirecionarUsuario(sessao);
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

    // ==========================================
    // GERENCIAMENTO DE TÉCNICOS
    // ==========================================

    const formularioCadastro = document.getElementById(
      "form-cadastrar-tecnico",
    );

    const listaTecnicos = document.getElementById("lista-tecnicos");

    const totalTecnicos = document.getElementById("total-tecnicos");

    const quantidadeTecnicos = document.getElementById("quantidade-tecnicos");

    const mensagemCadastro = document.getElementById(
      "mensagem-cadastro-tecnico",
    );

    // Atualiza a lista exibida no painel
    function atualizarListaTecnicos() {
      if (!listaTecnicos) {
        return;
      }

      const tecnicos = usuariosTecnicos.filter(function (usuario) {
        return usuario.tipo === "tecnico";
      });

      // Atualiza os números do painel
      if (totalTecnicos) {
        totalTecnicos.textContent = tecnicos.length;
      }

      if (quantidadeTecnicos) {
        quantidadeTecnicos.textContent =
          tecnicos.length + (tecnicos.length === 1 ? " técnico" : " técnicos");
      }

      listaTecnicos.replaceChildren();

      // Exibe mensagem quando não existem técnicos
      if (tecnicos.length === 0) {
        const mensagemVazia = document.createElement("p");

        mensagemVazia.className = "admin-lista-vazia";
        mensagemVazia.textContent = "Nenhum técnico cadastrado até o momento.";

        listaTecnicos.appendChild(mensagemVazia);
        return;
      }

      // Cria um item para cada técnico cadastrado
      tecnicos.forEach(function (tecnico) {
        const item = document.createElement("article");
        item.className = "admin-tecnico-item";

        const informacoes = document.createElement("div");
        informacoes.className = "admin-tecnico-info";

        const nome = document.createElement("strong");
        nome.textContent = tecnico.nome;

        const usuario = document.createElement("span");
        usuario.textContent = "Usuário: " + tecnico.usuario;

        const situacao = document.createElement("span");
        situacao.className = "admin-tecnico-status";
        situacao.textContent = tecnico.ativo ? "Ativo" : "Inativo";

        informacoes.append(nome, usuario, situacao);
        item.appendChild(informacoes);

        listaTecnicos.appendChild(item);
      });
    }

    // Realiza o cadastro de um novo técnico
    if (formularioCadastro) {
      formularioCadastro.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome-tecnico").value.trim();

        const usuario = document
          .getElementById("usuario-tecnico")
          .value.trim()
          .toLowerCase();

        const senha = document.getElementById("senha-tecnico").value;

        // Verifica se o usuário já existe
        const usuarioExistente = usuariosTecnicos.some(function (tecnico) {
          return tecnico.usuario.toLowerCase() === usuario;
        });

        if (usuarioExistente) {
          mensagemCadastro.textContent =
            "Este nome de usuário já está cadastrado.";

          mensagemCadastro.style.color = "#c62828";
          return;
        }

        // Gera um novo identificador
        const novoId =
          Math.max(
            ...usuariosTecnicos.map(function (tecnico) {
              return tecnico.id;
            }),
          ) + 1;

        // Cria o novo técnico
        const novoTecnico = {
          id: novoId,
          nome: nome,
          usuario: usuario,
          senha: senha,
          tipo: "tecnico",
          ativo: true,
        };

        usuariosTecnicos.push(novoTecnico);

        // Salva e atualiza a lista
        salvarUsuariosTecnicos();
        atualizarListaTecnicos();

        // Limpa o formulário
        formularioCadastro.reset();

        mensagemCadastro.textContent = "Técnico cadastrado com sucesso!";

        mensagemCadastro.style.color = "#218838";
      });
    }

    // Exibe os técnicos ao abrir o painel
    atualizarListaTecnicos();
  }
}
