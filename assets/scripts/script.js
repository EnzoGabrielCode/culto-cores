document.addEventListener("DOMContentLoaded", function () {
  const sortearBtn = document.getElementById("sortear-btn");
  const imgElement = document.getElementById("versiculo-img");

  if (sortearBtn) {
    sortearBtn.addEventListener("click", function () {
      const randomNumber = Math.floor(Math.random() * 7) + 1;
      const imagePath = `./assets/img/versiculos/${randomNumber}.png`;
      imgElement.src = imagePath;

      document.body.classList.remove("antes-sorteio");
      document.body.classList.add("depois-sorteio");
    });
  }
});
