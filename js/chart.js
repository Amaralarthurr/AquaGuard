let precipitationChart;

function initChart() {
    const ctx = document.getElementById('precipitationChart').getContext('2d');
    
    const hours = [];
    const precipitationData = [];
    
    for (let i = 23; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        hours.push(hour.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        
        precipitationData.push(Math.random() * 15);
    }
    
    precipitationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Precipitação (mm)',
                data: precipitationData,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `💧 ${context.parsed.y.toFixed(1)}mm`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        maxTicksLimit: 8
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + 'mm';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    updateChartStats(precipitationData);
}

function updateChartStats(data) {
    const max = Math.max(...data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const total = data.reduce((a, b) => a + b, 0);
    
    document.getElementById('chart-max').textContent = `${max.toFixed(1)}mm`;
    document.getElementById('chart-avg').textContent = `${avg.toFixed(1)}mm`;
    document.getElementById('chart-total').textContent = `${total.toFixed(1)}mm`;
}

function refreshChart() {
    const newData = [];
    for (let i = 0; i < 24; i++) {
        newData.push(Math.random() * 15);
    }
    
    precipitationChart.data.datasets[0].data = newData;
    precipitationChart.update('active');
    
    updateChartStats(newData);
    
    const button = document.getElementById('refresh-chart');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check mr-1"></i>Atualizado!';
    button.classList.add('bg-green-500');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('bg-green-500');
    }, 2000);
}

document.addEventListener('DOMContentLoaded', function() {
    initChart();
    
    document.getElementById('refresh-chart').addEventListener('click', refreshChart);
});