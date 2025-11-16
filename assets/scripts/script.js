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
      const response = await fetch("/api/sortear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailUsuario: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro desconhecido");
      }

      const imagePath = data.imagePath;

      localStorage.setItem(chaveStorage, imagePath);
      console.log("Sorteio salvo no localStorage:", imagePath);
      exibirSorteio(imagePath);
    } catch (error) {
      console.error("Erro no processo de sorteio:", error);
      formMensagem.textContent = error.message;
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
