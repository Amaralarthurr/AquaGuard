// Add parallax effect to hero video
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const video = document.querySelector("video");
  if (video) {
    const speed = scrolled * 0.5;
    video.style.transform = `translateY(${speed}px)`;
  }
});

// Add interactive hover effects
document.querySelectorAll(".card-hover").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Add loading animation for video
const video = document.querySelector("video");
if (video) {
  video.addEventListener("loadstart", function () {
    console.log("🎬 Carregando vídeo de fundo...");
  });

  video.addEventListener("canplay", function () {
    console.log("✅ Vídeo carregado com sucesso!");
  });
}
