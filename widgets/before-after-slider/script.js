const params = new URLSearchParams(window.location.search);

const img1 = params.get("img1");
const img2 = params.get("img2");

const before = document.getElementById("imgBefore");
const after = document.getElementById("imgAfter");
const overlay = document.getElementById("overlay");
const handle = document.getElementById("handle");
const container = document.getElementById("baContainer");

before.src = img1 || "";
after.src = img2 || "";

let dragging = false;

function updateSlider(x) {
  const rect = container.getBoundingClientRect();
  let pos = x - rect.left;
  pos = Math.max(0, Math.min(pos, rect.width));

  const percent = (pos / rect.width) * 100;

  overlay.style.width = percent + "%";
  handle.style.left = percent + "%";
}

container.addEventListener("mousedown", e => {
  dragging = true;
  updateSlider(e.clientX);
});

window.addEventListener("mousemove", e => {
  if (dragging) updateSlider(e.clientX);
});

window.addEventListener("mouseup", () => {
  dragging = false;
});

// Touch support
container.addEventListener("touchstart", e => {
  dragging = true;
  updateSlider(e.touches[0].clientX);
});

window.addEventListener("touchmove", e => {
  if (dragging) updateSlider(e.touches[0].clientX);
});

window.addEventListener("touchend", () => {
  dragging = false;
});
