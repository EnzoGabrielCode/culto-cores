document.addEventListener("DOMContentLoaded", function () {
  const sortearBtn = document.getElementById("sortear-btn");
  const imgElement = document.getElementById("versiculo-img");

  const chaveStorage = "versiculoSorteado";

  const imagemSalva = localStorage.getItem(chaveStorage);

  if (imagemSalva) {
    console.log("Usuário já sorteou. Exibindo imagem salva:", imagemSalva);

    imgElement.src = imagemSalva;

    document.body.classList.remove("antes-sorteio");
    document.body.classList.add("depois-sorteio");
  } else {
    console.log("Usuário ainda não sorteou. Botão pronto.");

    if (sortearBtn) {
      sortearBtn.addEventListener("click", function () {
        const randomNumber = Math.floor(Math.random() * 7) + 1;
        const imagePath = `./assets/img/versiculos/${randomNumber}.png`;

        imgElement.src = imagePath;

        document.body.classList.remove("antes-sorteio");
        document.body.classList.add("depois-sorteio");

        localStorage.setItem(chaveStorage, imagePath);
        console.log("Sorteio realizado e salvo:", imagePath);
      });
    }
  }
});
