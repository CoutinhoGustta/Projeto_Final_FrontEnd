/* =========================================
   CONFIGURAÇÕES E DADOS INICIAIS
========================================= */

const CHAVE_TECNICOS = "tecnicosFalcontec";
const CHAVE_ORDENS = "ordensFalcontec";
const CHAVE_SESSAO = "sessaoFalcontec";

const administradorPadrao = {
  id: 1,
  nome: "Administrador Falcontec",
  usuario: "admin",
  senha: "admin123",
  tipo: "admin",
  ativo: true,
};

const tecnicoPadrao = {
  id: 2,
  nome: "Davi Henrique",
  usuario: "davi",
  senha: "davi123",
  tipo: "tecnico",
  ativo: true,
};

const STATUS_ORDENS = ["Pendente", "Em andamento", "Concluído", "Cancelado"];

/* =========================================
   CARREGAMENTO DOS TÉCNICOS
========================================= */

function carregarUsuariosTecnicos() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_TECNICOS));

    if (Array.isArray(dados)) {
      const outrosTecnicos = dados.filter(
        (usuario) =>
          usuario.tipo === "tecnico" &&
          usuario.usuario.toLowerCase() !== "davi",
      );

      return [administradorPadrao, tecnicoPadrao, ...outrosTecnicos];
    }
  } catch (erro) {
    console.error("Erro ao carregar técnicos:", erro);
  }

  return [administradorPadrao, tecnicoPadrao];
}

let usuariosTecnicos = carregarUsuariosTecnicos();

function salvarUsuariosTecnicos() {
  const tecnicos = usuariosTecnicos.filter(
    (usuario) => usuario.tipo === "tecnico",
  );

  localStorage.setItem(CHAVE_TECNICOS, JSON.stringify(tecnicos));
}

/* =========================================
   CARREGAMENTO DAS ORDENS DE SERVIÇO
========================================= */

function carregarOrdensServico() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_ORDENS));

    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    console.error("Erro ao carregar ordens:", erro);
    return [];
  }
}

let ordensServico = carregarOrdensServico();

function salvarOrdensServico() {
  localStorage.setItem(CHAVE_ORDENS, JSON.stringify(ordensServico));
}

/* =========================================
   SESSÃO E NAVEGAÇÃO
========================================= */

function obterSessao() {
  try {
    const dados =
      localStorage.getItem(CHAVE_SESSAO) ||
      sessionStorage.getItem(CHAVE_SESSAO);

    return dados ? JSON.parse(dados) : null;
  } catch (erro) {
    localStorage.removeItem(CHAVE_SESSAO);
    sessionStorage.removeItem(CHAVE_SESSAO);
    return null;
  }
}

function redirecionarUsuario(sessao) {
  if (sessao.tipo === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "painel.html";
  }
}

function encerrarSessao() {
  localStorage.removeItem(CHAVE_SESSAO);
  sessionStorage.removeItem(CHAVE_SESSAO);

  window.location.href = "tecnico.html";
}

/* =========================================
   LOGIN
========================================= */

const formLogin = document.getElementById("form-login-tecnico");

if (formLogin) {
  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const usuarioDigitado = document
      .getElementById("usuario")
      .value.trim()
      .toLowerCase();

    const senhaDigitada = document.getElementById("senha").value;

    const lembrarLogin = document.getElementById("lembrar-login");
    const mensagem = document.getElementById("mensagem-login");

    const usuarioEncontrado = usuariosTecnicos.find(
      (usuario) =>
        usuario.usuario.toLowerCase() === usuarioDigitado &&
        usuario.senha === senhaDigitada &&
        usuario.ativo,
    );

    if (!usuarioEncontrado) {
      mensagem.textContent = "Usuário ou senha inválidos.";
      mensagem.style.color = "#d32f2f";
      return;
    }

    const sessao = {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      usuario: usuarioEncontrado.usuario,
      tipo: usuarioEncontrado.tipo,
    };

    if (lembrarLogin && lembrarLogin.checked) {
      localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
      sessionStorage.removeItem(CHAVE_SESSAO);
    } else {
      sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
      localStorage.removeItem(CHAVE_SESSAO);
    }

    mensagem.textContent = "Login realizado com sucesso!";
    mensagem.style.color = "#2e7d32";

    setTimeout(() => {
      redirecionarUsuario(sessao);
    }, 700);
  });
}

/* =========================================
   PAINEL ADMINISTRATIVO
========================================= */

const nomeAdministrador = document.getElementById("nome-administrador");

if (nomeAdministrador) {
  const sessaoAtual = obterSessao();

  if (!sessaoAtual || sessaoAtual.tipo !== "admin") {
    window.location.href = "tecnico.html";
  } else {
    nomeAdministrador.textContent = sessaoAtual.nome;

    const botaoSair = document.getElementById("btn-sair");

    if (botaoSair) {
      botaoSair.addEventListener("click", encerrarSessao);
    }
  }
}

/* =========================================
   CADASTRO DE TÉCNICOS
========================================= */

const formCadastroTecnico = document.getElementById("form-cadastrar-tecnico");

function atualizarListaTecnicos() {
  const lista = document.getElementById("lista-tecnicos");
  const quantidade = document.getElementById("quantidade-tecnicos");
  const total = document.getElementById("total-tecnicos");

  if (!lista) return;

  const tecnicos = usuariosTecnicos.filter(
    (usuario) => usuario.tipo === "tecnico",
  );

  lista.innerHTML = "";

  if (quantidade) quantidade.textContent = tecnicos.length;
  if (total) total.textContent = tecnicos.length;

  if (tecnicos.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.className = "admin-lista-vazia";
    mensagem.textContent = "Nenhum técnico cadastrado.";

    lista.appendChild(mensagem);
    return;
  }

  tecnicos.forEach((tecnico) => {
    const item = document.createElement("div");
    item.className = "item-tecnico";

    const informacoes = document.createElement("div");
    informacoes.className = "item-tecnico-informacoes";

    const nome = document.createElement("strong");
    nome.className = "item-tecnico-nome";
    nome.textContent = tecnico.nome;

    const usuario = document.createElement("p");
    usuario.className = "item-tecnico-usuario";
    usuario.textContent = `Usuário: ${tecnico.usuario}`;

    const status = document.createElement("span");
    status.className = tecnico.ativo
      ? "status-tecnico status-tecnico-ativo"
      : "status-tecnico status-tecnico-inativo";

    status.textContent = tecnico.ativo ? "Ativo" : "Inativo";

    informacoes.append(nome, usuario);
    item.append(informacoes, status);

    lista.appendChild(item);
  });
}

if (formCadastroTecnico) {
  formCadastroTecnico.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome-tecnico").value.trim();

    const usuario = document
      .getElementById("usuario-tecnico")
      .value.trim()
      .toLowerCase();

    const senha = document.getElementById("senha-tecnico").value;

    const mensagem = document.getElementById("mensagem-cadastro-tecnico");

    const usuarioExiste = usuariosTecnicos.some(
      (tecnico) => tecnico.usuario.toLowerCase() === usuario,
    );

    if (usuarioExiste) {
      mensagem.textContent = "Este nome de usuário já está cadastrado.";
      mensagem.style.color = "#d32f2f";
      return;
    }

    const novoId =
      Math.max(...usuariosTecnicos.map((tecnico) => tecnico.id)) + 1;

    const novoTecnico = {
      id: novoId,
      nome,
      usuario,
      senha,
      tipo: "tecnico",
      ativo: true,
    };

    usuariosTecnicos.push(novoTecnico);

    salvarUsuariosTecnicos();

    atualizarListaTecnicos();
    preencherSelecaoTecnicos();
    atualizarListaOrdensAdmin();
    atualizarResumoOrdensAdmin();

    formCadastroTecnico.reset();

    mensagem.textContent = "Técnico cadastrado com sucesso!";
    mensagem.style.color = "#2e7d32";
  });
}

/* =========================================
   SELEÇÃO DE TÉCNICOS NAS ORDENS
========================================= */

function preencherSelecaoTecnicos() {
  const selecao = document.getElementById("tecnico-responsavel");

  if (!selecao) return;

  selecao.innerHTML = "";

  const opcaoInicial = document.createElement("option");
  opcaoInicial.value = "";
  opcaoInicial.textContent = "Selecione um técnico";

  selecao.appendChild(opcaoInicial);

  const tecnicosAtivos = usuariosTecnicos.filter(
    (usuario) => usuario.tipo === "tecnico" && usuario.ativo,
  );

  tecnicosAtivos.forEach((tecnico) => {
    const opcao = document.createElement("option");

    opcao.value = tecnico.id;
    opcao.textContent = tecnico.nome;

    selecao.appendChild(opcao);
  });
}

/* =========================================
   CRIAÇÃO DE ORDENS DE SERVIÇO
========================================= */

const formCriarOrdem = document.getElementById("form-criar-ordem");

if (formCriarOrdem) {
  formCriarOrdem.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const cliente = document.getElementById("cliente-ordem").value.trim();
    const telefone = document.getElementById("telefone-ordem").value.trim();

    const equipamento = document
      .getElementById("equipamento-ordem")
      .value.trim();

    const problema = document.getElementById("problema-ordem").value.trim();

    const tecnicoId = Number(
      document.getElementById("tecnico-responsavel").value,
    );

    const data = document.getElementById("data-ordem").value;

    const mensagem = document.getElementById("mensagem-ordem");

    const tecnicoResponsavel = usuariosTecnicos.find(
      (usuario) =>
        usuario.id === tecnicoId && usuario.tipo === "tecnico" && usuario.ativo,
    );

    if (!tecnicoResponsavel) {
      mensagem.textContent = "Selecione um técnico válido.";
      mensagem.style.color = "#d32f2f";
      return;
    }

    const novoId = Math.max(0, ...ordensServico.map((ordem) => ordem.id)) + 1;

    const novaOrdem = {
      id: novoId,
      cliente,
      telefone,
      equipamento,
      problema,
      tecnicoId,
      tecnicoNome: tecnicoResponsavel.nome,
      data,
      status: "Pendente",
    };

    ordensServico.push(novaOrdem);

    salvarOrdensServico();
    atualizarListaOrdensAdmin();
    atualizarResumoOrdensAdmin();

    formCriarOrdem.reset();

    mensagem.textContent = "Ordem de serviço criada com sucesso!";
    mensagem.style.color = "#2e7d32";
  });
}

/* =========================================
   FORMATAÇÃO DE DATAS
========================================= */

function formatarData(data) {
  if (!data) return "Não informada";

  const dataFormatada = new Date(`${data}T00:00:00`);

  if (Number.isNaN(dataFormatada.getTime())) {
    return "Data inválida";
  }

  return dataFormatada.toLocaleDateString("pt-BR");
}

/* =========================================
   ALTERAÇÃO DO STATUS DAS ORDENS
========================================= */

function alterarStatusOrdem(id, novoStatus, sessao) {
  if (!STATUS_ORDENS.includes(novoStatus)) return;

  const ordem = ordensServico.find((item) => item.id === id);

  if (!ordem) return;

  // O técnico só pode alterar as próprias ordens.
  if (sessao.tipo === "tecnico" && ordem.tecnicoId !== sessao.id) {
    return;
  }

  ordem.status = novoStatus;

  salvarOrdensServico();

  atualizarListaOrdensAdmin();
  atualizarResumoOrdensAdmin();

  const sessaoAtual = obterSessao();

  if (sessaoAtual && sessaoAtual.tipo === "tecnico") {
    atualizarPainelTecnico(sessaoAtual);
  }
}

/* =========================================
   CRIAÇÃO DO SELETOR DE STATUS
========================================= */

function criarSeletorStatus(ordem, sessao) {
  const grupo = document.createElement("div");
  grupo.className = "campo-status-ordem";

  const label = document.createElement("label");
  label.textContent = "Alterar status:";

  const selecao = document.createElement("select");

  STATUS_ORDENS.forEach((status) => {
    const opcao = document.createElement("option");

    opcao.value = status;
    opcao.textContent = status;

    if (status === ordem.status) {
      opcao.selected = true;
    }

    selecao.appendChild(opcao);
  });

  selecao.addEventListener("change", function () {
    alterarStatusOrdem(ordem.id, selecao.value, sessao);
  });

  grupo.append(label, selecao);

  return grupo;
}

/* =========================================
   LISTAGEM DE ORDENS DO ADMINISTRADOR
========================================= */

function atualizarListaOrdensAdmin() {
  const lista = document.getElementById("lista-ordens-admin");
  const quantidade = document.getElementById("quantidade-ordens");

  if (!lista) return;

  const campoBusca = document.getElementById("buscar-ordem-admin");
  const filtroStatus = document.getElementById("filtro-status-admin");

  const busca = campoBusca ? campoBusca.value.trim().toLowerCase() : "";

  const statusSelecionado = filtroStatus ? filtroStatus.value : "Todas";

  const ordensFiltradas = ordensServico.filter((ordem) => {
    const correspondeBusca = [
      String(ordem.id),
      ordem.cliente,
      ordem.equipamento,
      ordem.tecnicoNome,
    ].some((valor) =>
      String(valor || "")
        .toLowerCase()
        .includes(busca),
    );

    const correspondeStatus =
      statusSelecionado === "Todas" || ordem.status === statusSelecionado;

    return correspondeBusca && correspondeStatus;
  });

  lista.innerHTML = "";

  if (quantidade) {
    quantidade.textContent = `${ordensFiltradas.length} de ${ordensServico.length} ordens`;
  }

  if (ordensFiltradas.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.className = "admin-lista-vazia";

    mensagem.textContent =
      ordensServico.length === 0
        ? "Nenhuma ordem de serviço cadastrada."
        : "Nenhuma ordem encontrada com esses filtros.";

    lista.appendChild(mensagem);
    return;
  }

  ordensFiltradas.forEach((ordem) => {
    const item = document.createElement("div");
    item.className = "item-ordem";

    // Cabeçalho do cartão
    const cabecalho = document.createElement("div");
    cabecalho.className = "item-ordem-cabecalho";

    const titulo = document.createElement("h3");
    titulo.className = "item-ordem-titulo";
    titulo.textContent = `Ordem de Serviço #${ordem.id}`;

    const status = document.createElement("span");
    status.className = "status-ordem";
    status.textContent = ordem.status;

    if (ordem.status === "Pendente") {
      status.classList.add("status-pendente");
    } else if (ordem.status === "Em andamento") {
      status.classList.add("status-andamento");
    } else if (ordem.status === "Concluído") {
      status.classList.add("status-concluido");
    } else if (ordem.status === "Cancelado") {
      status.classList.add("status-cancelado");
    }

    cabecalho.append(titulo, status);

    // Informações da ordem
    const informacoes = document.createElement("div");
    informacoes.className = "item-ordem-informacoes";

    const cliente = document.createElement("p");
    cliente.textContent = `Cliente: ${ordem.cliente}`;

    const clienteLabel = document.createElement("strong");
    clienteLabel.textContent = "Cliente: ";
    cliente.prepend(clienteLabel);
    cliente.append(document.createTextNode(ordem.cliente));

    const equipamento = document.createElement("p");
    const equipamentoLabel = document.createElement("strong");
    equipamentoLabel.textContent = "Equipamento: ";
    equipamento.append(
      equipamentoLabel,
      document.createTextNode(ordem.equipamento),
    );

    const tecnico = document.createElement("p");
    const tecnicoLabel = document.createElement("strong");
    tecnicoLabel.textContent = "Técnico responsável: ";
    tecnico.append(tecnicoLabel, document.createTextNode(ordem.tecnicoNome));

    const data = document.createElement("p");
    const dataLabel = document.createElement("strong");
    dataLabel.textContent = "Data: ";
    data.append(dataLabel, document.createTextNode(formatarData(ordem.data)));

    informacoes.append(cliente, equipamento, tecnico, data);

    item.append(cabecalho, informacoes);

    lista.appendChild(item);
  });
}

/* =========================================
   RESUMO DE ORDENS DO ADMINISTRADOR
========================================= */

function atualizarResumoOrdensAdmin() {
  const total = document.getElementById("total-ordens-admin");
  const pendentes = document.getElementById("total-pendentes-admin");
  const andamento = document.getElementById("total-andamento-admin");
  const concluidos = document.getElementById("total-concluidos-admin");
  const cancelados = document.getElementById("total-cancelados-admin");

  if (total) {
    total.textContent = ordensServico.length;
  }

  if (pendentes) {
    pendentes.textContent = ordensServico.filter(
      (ordem) => ordem.status === "Pendente",
    ).length;
  }

  if (andamento) {
    andamento.textContent = ordensServico.filter(
      (ordem) => ordem.status === "Em andamento",
    ).length;
  }

  if (concluidos) {
    concluidos.textContent = ordensServico.filter(
      (ordem) => ordem.status === "Concluído",
    ).length;
  }

  if (cancelados) {
    cancelados.textContent = ordensServico.filter(
      (ordem) => ordem.status === "Cancelado",
    ).length;
  }
}

/* =========================================
   PAINEL DO TÉCNICO
========================================= */

const nomeTecnicoLogado = document.getElementById("nome-tecnico-logado");

if (nomeTecnicoLogado) {
  const sessaoAtual = obterSessao();

  if (!sessaoAtual || sessaoAtual.tipo !== "tecnico") {
    window.location.href = "tecnico.html";
  } else {
    nomeTecnicoLogado.textContent = sessaoAtual.nome;

    const tituloBoasVindas = document.getElementById("titulo-boas-vindas");

    if (tituloBoasVindas) {
      tituloBoasVindas.textContent = `Bem-vindo, ${sessaoAtual.nome}!`;
    }

    const botaoSair = document.getElementById("btn-sair");

    if (botaoSair) {
      botaoSair.addEventListener("click", encerrarSessao);
    }

    atualizarPainelTecnico(sessaoAtual);
  }
}

/* =========================================
   ORDENS ATRIBUÍDAS AO TÉCNICO
========================================= */

function atualizarPainelTecnico(sessao) {
  const lista = document.getElementById("lista-ordens-tecnico");

  if (!lista) return;

  const minhasOrdens = ordensServico.filter(
    (ordem) => ordem.tecnicoId === sessao.id,
  );

  const total = document.getElementById("total-ordens");
  const pendentes = document.getElementById("total-pendentes");
  const andamento = document.getElementById("total-andamento");
  const concluidos = document.getElementById("total-concluidos");
  const cancelados = document.getElementById("total-cancelados");

  if (total) {
    total.textContent = minhasOrdens.length;
  }

  if (pendentes) {
    pendentes.textContent = minhasOrdens.filter(
      (ordem) => ordem.status === "Pendente",
    ).length;
  }

  if (andamento) {
    andamento.textContent = minhasOrdens.filter(
      (ordem) => ordem.status === "Em andamento",
    ).length;
  }

  if (concluidos) {
    concluidos.textContent = minhasOrdens.filter(
      (ordem) => ordem.status === "Concluído",
    ).length;
  }

  if (cancelados) {
    cancelados.textContent = minhasOrdens.filter(
      (ordem) => ordem.status === "Cancelado",
    ).length;
  }

  lista.innerHTML = "";

  if (minhasOrdens.length === 0) {
    const mensagem = document.createElement("p");

    mensagem.textContent =
      "Você ainda não possui ordens de serviço atribuídas.";

    lista.appendChild(mensagem);
    return;
  }

  minhasOrdens.forEach((ordem) => {
    const item = document.createElement("div");
    item.className = "item-ordem";

    const titulo = document.createElement("h3");
    titulo.textContent = `Ordem de Serviço #${ordem.id}`;

    const cliente = document.createElement("p");
    cliente.textContent = `Cliente: ${ordem.cliente}`;

    const telefone = document.createElement("p");
    telefone.textContent = `Telefone: ${ordem.telefone}`;

    const equipamento = document.createElement("p");
    equipamento.textContent = `Equipamento: ${ordem.equipamento}`;

    const problema = document.createElement("p");
    problema.textContent = `Problema relatado: ${ordem.problema}`;

    const data = document.createElement("p");
    data.textContent = `Data: ${formatarData(ordem.data)}`;

    const status = document.createElement("p");
    status.textContent = `Status atual: ${ordem.status}`;

    const seletorStatus = criarSeletorStatus(ordem, sessao);

    item.append(
      titulo,
      cliente,
      telefone,
      equipamento,
      problema,
      data,
      status,
      seletorStatus,
    );

    lista.appendChild(item);
  });
}

/* =========================================
   INICIALIZAÇÃO DOS PAINÉIS
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  atualizarListaTecnicos();
  preencherSelecaoTecnicos();
  atualizarListaOrdensAdmin();
  atualizarResumoOrdensAdmin();

  const campoBusca = document.getElementById("buscar-ordem-admin");
  const filtroStatus = document.getElementById("filtro-status-admin");

  if (campoBusca) {
    campoBusca.addEventListener("input", atualizarListaOrdensAdmin);
  }

  if (filtroStatus) {
    filtroStatus.addEventListener("change", atualizarListaOrdensAdmin);
  }
});
