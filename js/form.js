// Form submission
document
  .getElementById("community-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const consent = document.getElementById("lgpd-consent").checked;

    if (!consent) {
      alert(
        "🚨 Por favor, aceite os termos de uso e proteção de dados para continuar!"
      );
      return;
    }

    // Simulate success with confetti effect
    alert(
      "🎉 Relato enviado com sucesso! Você ganhou 50 pontos e subiu no ranking! 🏆"
    );
    this.reset();

    // Add some visual feedback
    const button = this.querySelector('button[type="submit"]');
    button.innerHTML =
      '<i class="fas fa-check mr-3"></i>Enviado com Sucesso! ✅';
    button.classList.add(
      "bg-gradient-to-r",
      "from-lime-green",
      "to-safe-green"
    );

    setTimeout(() => {
      button.innerHTML =
        '<i class="fas fa-paper-plane mr-3"></i>Enviar Relato (+50 pontos) 🎉';
      button.classList.remove("from-lime-green", "to-safe-green");
    }, 3000);
  });
