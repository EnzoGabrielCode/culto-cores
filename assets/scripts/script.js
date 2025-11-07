document.addEventListener("DOMContentLoaded", function () {
  const imgElement = document.getElementById("versiculo-img");

  if (imgElement) {
    const randomNumber = Math.floor(Math.random() * 7) + 1;
    const imagePath = `./assets/img/versiculos/${randomNumber}.png`;

    imgElement.src = imagePath;
  }
});
