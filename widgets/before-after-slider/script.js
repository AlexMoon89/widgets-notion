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

function update(x) {
  const rect = container.getBoundingClientRect();
  let pos = x - rect.left;
  pos = Math.max(0, Math.min(pos, rect.width));

  overlay.style.width = `${pos}px`;
  handle.style.left = `${pos}px`;
}

// Mouse
container.addEventListener("mousedown", e => {
  dragging = true;
  update(e.clientX);
});

window.addEventListener("mousemove", e => {
  if (dragging) update(e.clientX);
});

window.addEventListener("mouseup", () => dragging = false);

// Touch
container.addEventListener("touchstart", e => {
  dragging = true;
  update(e.touches[0].clientX);
});

window.addEventListener("touchmove", e => {
  if (dragging) update(e.touches[0].clientX);
});

window.addEventListener("touchend", () => dragging = false);
