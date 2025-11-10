document.addEventListener("DOMContentLoaded", function () {
  const imgElement = document.getElementById("versiculo-img");
  const sorteioForm = document.getElementById("sorteio-form");
  const emailInput = document.getElementById("email-input");
  const sortearBtn = document.getElementById("sortear-btn");
  const formMensagem = document.getElementById("form-mensagem");

  const chaveStorage = "versiculoSorteado";

  function exibirSorteio(imagePath) {
    imgElement.src = imagePath;

    document.body.classList.remove("antes-sorteio");
    document.body.classList.add("depois-sorteio");
  }

  async function handleSorteioSubmit(evento) {
    evento.preventDefault();

    const email = emailInput.value;

    if (!email || !email.includes("@")) {
      formMensagem.textContent = "Por favor, insira um e-mail válido.";
      formMensagem.className = "erro";
      return;
    }

    sortearBtn.disabled = true;
    sortearBtn.textContent = "SORTEANDO...";
    formMensagem.textContent = "";
    formMensagem.className = "";

    try {
      const randomNumber = Math.floor(Math.random() * 7) + 1;
      const imagePath = `./assets/img/versiculos/${randomNumber}.png`;
      const urlCompletaImagem = new URL(imagePath, window.location.href).href;

      localStorage.setItem(chaveStorage, imagePath);
      console.log("Sorteio salvo no localStorage:", imagePath);

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
        console.error(
          "Falha ao enviar o e-mail, mas o sorteio continua:",
          emailError
        );
      }

      exibirSorteio(imagePath);
    } catch (error) {
      console.error("Erro no processo de sorteio:", error);
      formMensagem.textContent = "Ops! Algo deu errado. Tente novamente.";
      formMensagem.className = "erro";
      sortearBtn.disabled = false;
      sortearBtn.textContent = "SORTEAR MINHA COR";
    }
  }

  const imagemSalva = localStorage.getItem(chaveStorage);

  if (imagemSalva) {
    console.log("Usuário já sorteou. Exibindo imagem salva:", imagemSalva);
    exibirSorteio(imagemSalva);
  } else {
    console.log("Usuário ainda não sorteou. Formulário pronto.");
    if (sorteioForm) {
      sorteioForm.addEventListener("submit", handleSorteioSubmit);
    }
  }
});
