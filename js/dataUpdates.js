// Simulate real-time data updates
setInterval(() => {
  const stats = document.querySelectorAll(".text-4xl.font-bold");
  stats.forEach((stat) => {
    if (stat.textContent.includes("mm")) {
      const currentValue = parseInt(stat.textContent);
      const newValue = currentValue + Math.floor(Math.random() * 3);
      stat.textContent = newValue + "mm";
    }
  });
}, 10000);
