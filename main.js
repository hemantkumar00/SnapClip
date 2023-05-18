let pageCount = 4;

let prevButton = document.getElementById("prev-button");
let nextButton = document.getElementById("next-button");
let container = document.getElementById("container");
let image;
let downloadButton;

async function loadImage() {
  let photos = await fetch(
    `https://picsum.photos/v2/list?page=${pageCount}&limit=99`,
  ).then((response) => response.json().then((response) => response));
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  photos.forEach((photo) => {
    // console.log(photo);
    container.append(creatCard(photo.download_url, photo.author));
  });
}

(async function () {
  await loadImage();
  if (pageCount == 1) {
    prevButton.disabled = true;
  }
  downloadPhoto();
})();

function creatCard(imgUrl, author) {
  const card = document.createElement("div");
  card.classList.add("card");
  const img = document.createElement("img");
  img.classList.add("card-image");
  img.setAttribute("id", "image");
  const section = document.createElement("section");
  section.classList.add("card-section");
  const span = document.createElement("span");
  span.classList.add("card-section-author");
  const button = document.createElement("button");
  button.setAttribute("id", "download-button");
  button.classList.add("card-section-button");
  button.textContent = "Download";
  span.textContent = author;
  img.src = imgUrl;
  section.appendChild(span);
  section.appendChild(button);
  card.append(img);
  card.append(section);

  return card;
}

nextButton.addEventListener("click", async function () {
  pageCount += 1;
  if (pageCount > 1) {
    prevButton.disabled = false;
  }
  await loadImage();
  downloadPhoto();
});
prevButton.addEventListener("click", async function () {
  pageCount -= 1;
  if (pageCount == 1) {
    prevButton.disabled = true;
  }
  await loadImage();
  downloadPhoto();
});

function downloadPhoto() {
  let containers = document.querySelectorAll(".card");

  for (i of containers) {
    let button = i.childNodes[1].childNodes[1];
    let image = i.childNodes[0];
    let imageUrl = i.childNodes[0].src;
    button.addEventListener("click", async function () {
      const image = await fetch(imageUrl);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "image file name here";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    image.addEventListener("click", async function () {
      await navigator.clipboard.writeText(imageUrl);
      alert("Copied: " + imageUrl);
    });
  }
}
