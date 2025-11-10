// assets/scripts/script.js (COMPLETAMENTE NOVO)

document.addEventListener("DOMContentLoaded", function () {
  // --- Elementos do DOM ---
  const imgElement = document.getElementById("versiculo-img");
  const sorteioForm = document.getElementById("sorteio-form");
  const emailInput = document.getElementById("email-input");
  const sortearBtn = document.getElementById("sortear-btn");
  const formMensagem = document.getElementById("form-mensagem");

  // --- Chave do Storage ---
  const chaveStorage = "versiculoSorteado";

  // --- Função Reutilizável para mostrar o sorteio ---
  function exibirSorteio(imagePath) {
    // 1. Mostra a imagem na tela
    imgElement.src = imagePath;

    // 2. Muda a aparência da página (CSS)
    // Isso vai esconder o formulário e mostrar a imagem
    document.body.classList.remove("antes-sorteio");
    document.body.classList.add("depois-sorteio");
  }

  // --- Função Principal do Sorteio (agora faz tudo) ---
  async function handleSorteioSubmit(evento) {
    evento.preventDefault(); // Impede o formulário de recarregar a página

    const email = emailInput.value;

    // 1. Validação simples
    if (!email || !email.includes("@")) {
      formMensagem.textContent = "Por favor, insira um e-mail válido.";
      formMensagem.className = "erro";
      return;
    }

    // 2. Feedback visual
    sortearBtn.disabled = true;
    sortearBtn.textContent = "SORTEANDO...";
    formMensagem.textContent = "";
    formMensagem.className = "";

    try {
      // 3. FAZ O SORTEIO
      const randomNumber = Math.floor(Math.random() * 7) + 1;
      const imagePath = `./assets/img/versiculos/${randomNumber}.png`;
      const urlCompletaImagem = new URL(imagePath, window.location.href).href;

      // 4. SALVA NO LOCALSTORAGE (para o usuário não sortear de novo)
      localStorage.setItem(chaveStorage, imagePath);
      console.log("Sorteio salvo no localStorage:", imagePath);

      // 5. TENTA ENVIAR O E-MAIL (chama a API)
      try {
        await fetch("/api/enviar-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailUsuario: email,
            imagemSorteada: urlCompletaImagem,
          }),
        });
        console.log("E-mail enviado para a API com sucesso.");
      } catch (emailError) {
        // Se o e-mail falhar, não paramos o processo!
        // O usuário ainda deve ver a cor sorteada.
        console.error(
          "Falha ao enviar o e-mail, mas o sorteio continua:",
          emailError
        );
      }

      // 6. MOSTRA O RESULTADO
      // Isso só acontece DEPOIS de salvar e tentar enviar o e-mail
      exibirSorteio(imagePath);
    } catch (error) {
      // Erro geral
      console.error("Erro no processo de sorteio:", error);
      formMensagem.textContent = "Ops! Algo deu errado. Tente novamente.";
      formMensagem.className = "erro";
      sortearBtn.disabled = false;
      sortearBtn.textContent = "SORTEAR MINHA COR";
    }
  }

  // ===============================================
  // LÓGICA PRINCIPAL (AO CARREGAR A PÁGINA)
  // ===============================================

  const imagemSalva = localStorage.getItem(chaveStorage);

  if (imagemSalva) {
    // --- 1. USUÁRIO JÁ SORTEOU ---
    // Se achou, apenas exibe a imagem salva e não faz mais nada.
    // O formulário nem vai aparecer.
    console.log("Usuário já sorteou. Exibindo imagem salva:", imagemSalva);
    exibirSorteio(imagemSalva);
  } else {
    // --- 2. NOVO SORTEIO ---
    // Se não achou imagem, a página fica em "antes-sorteio"
    // e nós ativamos o formulário para esperar o "submit".
    console.log("Usuário ainda não sorteou. Formulário pronto.");
    if (sorteioForm) {
      sorteioForm.addEventListener("submit", handleSorteioSubmit);
    }
  }
});
