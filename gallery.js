const gallery = document.querySelector(".photo-gallery");

if (gallery) {
  const galleryImages = Array.from(gallery.querySelectorAll(".photo-grid img"));
  const featuredImage = gallery.querySelector("#featured-photo");
  const featuredCaption = gallery.querySelector("#featured-caption");
  const shuffleButton = gallery.querySelector("#shuffle-photos");
  const photoStatus = gallery.querySelector("#photo-status");
  const photos = galleryImages.map((image) => ({
    src: image.getAttribute("src"),
    alt: image.alt,
    caption: image.closest("figure").querySelector("figcaption").textContent.trim()
  }));
  let currentPhotoIndex = 0;

  const updateImageState = (image) => {
    const photoSlot = image.closest(".photo-slot");
    if (photoSlot) {
      photoSlot.classList.toggle("photo-slot--empty", !image.naturalWidth);
    }
  };

  gallery.querySelectorAll(".photo-slot img").forEach((image) => {
    image.addEventListener("load", () => updateImageState(image));
    image.addEventListener("error", () => updateImageState(image));
    if (image.complete) {
      updateImageState(image);
    }
  });

  shuffleButton.addEventListener("click", () => {
    if (photos.length < 2) {
      return;
    }

    const nextIndex = Math.floor(Math.random() * (photos.length - 1));
    currentPhotoIndex = nextIndex >= currentPhotoIndex ? nextIndex + 1 : nextIndex;
    const photo = photos[currentPhotoIndex];

    featuredImage.src = photo.src;
    featuredImage.alt = photo.alt;
    featuredCaption.textContent = photo.caption;
    featuredImage.closest(".photo-slot").dataset.placeholder =
      `Add ${photo.src.split("/").pop()} to kwena-pictures/`;
    photoStatus.textContent = `Showing ${photo.caption.toLowerCase()}.`;
  });

  if (photos.length < 2) {
    shuffleButton.disabled = true;
  }
}
