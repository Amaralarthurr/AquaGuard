// Mapa Interativo de Riscos
let riskMap;
let markersVisible = true;
let riskMarkers = [];

function initMap() {
    // Inicializar mapa centrado em São Paulo
    riskMap = L.map('riskMap').setView([-23.5505, -46.6333], 11);
    
    // Adicionar camada do mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(riskMap);
    
    // Dados simulados de áreas de risco
    const riskAreas = [
        { lat: -23.5505, lng: -46.6333, risk: 'alto', name: 'Centro - SP', reports: 15 },
        { lat: -23.5629, lng: -46.6544, risk: 'medio', name: 'Vila Madalena', reports: 8 },
        { lat: -23.5475, lng: -46.6361, risk: 'baixo', name: 'Jardins', reports: 3 },
        { lat: -23.5329, lng: -46.6395, risk: 'alto', name: 'Bela Vista', reports: 12 },
        { lat: -23.5505, lng: -46.6166, risk: 'medio', name: 'Mooca', reports: 6 },
        { lat: -23.5733, lng: -46.6417, risk: 'alto', name: 'Pinheiros', reports: 18 },
        { lat: -23.5505, lng: -46.6833, risk: 'medio', name: 'Lapa', reports: 9 },
        { lat: -23.5205, lng: -46.6333, risk: 'baixo', name: 'Ipiranga', reports: 4 },
        { lat: -23.5805, lng: -46.6333, risk: 'alto', name: 'Vila Olímpia', reports: 14 },
        { lat: -23.5405, lng: -46.6133, risk: 'medio', name: 'Tatuapé', reports: 7 }
    ];
    
    // Adicionar marcadores
    riskAreas.forEach(area => {
        const color = getRiskColor(area.risk);
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        const marker = L.marker([area.lat, area.lng], { icon: icon })
            .bindPopup(`
                <div class="p-3">
                    <h4 class="font-bold text-lg">${area.name}</h4>
                    <p class="text-sm mb-2">Nível de Risco: <span class="font-semibold" style="color: ${color}">${area.risk.toUpperCase()}</span></p>
                    <p class="text-sm mb-2">📝 ${area.reports} relatos hoje</p>
                    <div class="flex space-x-2 mt-2">
                        <button class="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">Ver Detalhes</button>
                        <button class="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">Reportar</button>
                    </div>
                </div>
            `)
            .addTo(riskMap);
        
        riskMarkers.push(marker);
    });
    
    // Adicionar círculos de área de influência
    riskAreas.forEach(area => {
        const color = getRiskColor(area.risk);
        L.circle([area.lat, area.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.1,
            radius: 1000
        }).addTo(riskMap);
    });
}

function getRiskColor(risk) {
    switch(risk) {
        case 'alto': return '#dc2626';
        case 'medio': return '#f59e0b';
        case 'baixo': return '#10b981';
        default: return '#6b7280';
    }
}

function toggleMarkers() {
    markersVisible = !markersVisible;
    
    riskMarkers.forEach(marker => {
        if (markersVisible) {
            marker.addTo(riskMap);
        } else {
            riskMap.removeLayer(marker);
        }
    });
    
    const button = document.getElementById('toggle-markers');
    button.innerHTML = markersVisible ? 
        '<i class="fas fa-map-marker-alt mr-1"></i>Ocultar' : 
        '<i class="fas fa-map-marker-alt mr-1"></i>Mostrar';
}

function centerMap() {
    riskMap.setView([-23.5505, -46.6333], 11);
    
    // Feedback visual
    const button = document.getElementById('center-map');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check mr-1"></i>Centralizado!';
    
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 1500);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que o DOM esteja pronto
    setTimeout(() => {
        initMap();
    }, 500);
    
    document.getElementById('toggle-markers').addEventListener('click', toggleMarkers);
    document.getElementById('center-map').addEventListener('click', centerMap);
});