const params = new URLSearchParams(window.location.search);

const img1 = params.get("img1");
const img2 = params.get("img2");

const imgDefault = document.getElementById("imgDefault");
const imgHover = document.getElementById("imgHover");
const container = document.getElementById("hoverImage");

if (!img1 || !img2) {
  console.warn("Missing img1 or img2 parameters");
}

imgDefault.src = img1 || "";
imgHover.src = img2 || "";

// Mobile tap toggle
let toggled = false;

container.addEventListener("click", () => {
  if (window.matchMedia("(hover: none)").matches) {
    toggled = !toggled;
    imgHover.style.opacity = toggled ? "1" : "0";
  }
});
