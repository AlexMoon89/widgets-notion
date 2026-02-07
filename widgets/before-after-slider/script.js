const params = new URLSearchParams(window.location.search);

const img1 = params.get("img1");
const img2 = params.get("img2");

const before = document.getElementById("imgBefore");
const after = document.getElementById("imgAfter");
const overlay = document.getElementById("overlay");
const handle = document.getElementById("handle");
const container = document.getElementById("baContainer");

before.src = img1;
after.src = img2;

let dragging = false;

function updateSlider(clientX) {
  const rect = container.getBoundingClientRect();
  let x = clientX - rect.left;
  x = Math.max(0, Math.min(x, rect.width));

  const percent = (x / rect.width) * 100;

  // ancho visible del after
  overlay.style.width = `${percent}%`;
  handle.style.left = `${percent}%`;

  // 🔑 compensación visual:
  // movemos la imagen after en sentido contrario
  after.style.transform = `translateX(${(100 - percent)}%)`;
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
