const params = new URLSearchParams(window.location.search);

const img1 = params.get("img1");
const img2 = params.get("img2");

const base = document.getElementById("imgBefore");
const overlay = document.getElementById("overlay");
const handle = document.getElementById("handle");
const container = document.getElementById("baContainer");

base.src = img1;
overlay.style.backgroundImage = `url(${img2})`;

let dragging = false;

function updateSlider(clientX) {
  const rect = container.getBoundingClientRect();
  let x = clientX - rect.left;
  x = Math.max(0, Math.min(x, rect.width));

  overlay.style.width = `${x}px`;
  handle.style.left = `${x}px`;
}

container.addEventListener("mousedown", e => {
  dragging = true;
  updateSlider(e.clientX);
});

window.addEventListener("mousemove", e => {
  if (dragging) updateSlider(e.clientX);
});

window.addEventListener("mouseup", () => dragging = false);

// Touch
container.addEventListener("touchstart", e => {
  dragging = true;
  updateSlider(e.touches[0].clientX);
});

window.addEventListener("touchmove", e => {
  if (dragging) updateSlider(e.touches[0].clientX);
});

window.addEventListener("touchend", () => dragging = false);
