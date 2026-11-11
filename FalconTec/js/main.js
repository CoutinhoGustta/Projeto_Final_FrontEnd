/* ==========================================
   ARQUIVO: main.js
   FUNCIONALIDADE: FORMULÁRIO DE AGENDAMENTO
========================================== */

const formularioAgendamento = document.getElementById("form-agendamento");

// Verifica se o formulário existe na página atual
if (formularioAgendamento) {
  formularioAgendamento.addEventListener("submit", function (event) {
    // Impede o envio tradicional do formulário
    event.preventDefault();

    // Captura os dados preenchidos pelo cliente
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const equipamento = document.getElementById("equipamento").value;
    const marca = document.getElementById("marca").value.trim();
    const problema = document.getElementById("problema").value.trim();
    const servico = document.getElementById("servico").value;
    const data = document.getElementById("data").value;

    // Formata a data para o padrão brasileiro
    const dataFormatada = data.split("-").reverse().join("/");

    // Organiza as informações em uma mensagem
    const mensagem = `
Olá! Gostaria de solicitar um atendimento com a Falcontec Refrigeração.

*DADOS DO CLIENTE*
Nome: ${nome}
Telefone: ${telefone}
E-mail: ${email || "Não informado"}

*DADOS DO EQUIPAMENTO*
Equipamento: ${equipamento}
Marca: ${marca}
Problema: ${problema}

*PREFERÊNCIA DE ATENDIMENTO*
Serviço desejado: ${servico}
Data preferencial: ${dataFormatada}

Aguardo o retorno da equipe. Obrigado!
    `;

    // Codifica a mensagem para utilização na URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Número oficial de WhatsApp da Falcontec
    const numeroFalcontec = "558332387600";

    // Abre o WhatsApp com a mensagem preenchida
    const linkWhatsApp = `https://wa.me/${numeroFalcontec}?text=${mensagemCodificada}`;

    window.open(linkWhatsApp, "_blank");
  });
}
