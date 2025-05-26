document.addEventListener('DOMContentLoaded', () => {
    let chart;
    let updateInterval;
    const protocolChartCanvas = document.getElementById('protocolChart');
    
    async function fetchPackets() {
        try {
            const response = await fetch('/packets');
            const packets = await response.json();
            updateStats(packets);
            updateChart(packets);
            updateTable(packets);
        } catch (error) {
            console.error('Error fetching packets:', error);
        }
    }

    function updateStats(packets) {
        document.getElementById('totalPackets').textContent = packets.length;
        const protocols = new Set(packets.map(p => p.protocol));
        document.getElementById('activeProtocols').textContent = protocols.size;
    }

    function updateChart(packets) {
        const protocolCounts = packets.reduce((acc, p) => {
            const proto = (p.protocol || 'other').toLowerCase();
            acc[proto] = (acc[proto] || 0) + 1;
            return acc;
        }, {});

        if (chart) chart.destroy();
        
        chart = new Chart(protocolChartCanvas, {
            type: 'doughnut',
            data: {
                labels: Object.keys(protocolCounts),
                datasets: [{
                    data: Object.values(protocolCounts),
                    backgroundColor: [
                        '#10b981', '#facc15', '#3b82f6', '#8b5cf6', 
                        '#ef4444', '#f97316', '#ec4899', '#14b8a6'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    }

    function updateTable(packets) {
        const tbody = document.getElementById('packetTableBody');
        tbody.innerHTML = packets.map(p => `
            <tr>
                <td>${p.time}</td>
                <td>${p.src}</td>
                <td>${p.dst}</td>
                <td>
                    <span class="protocol ${(p.protocol || '').toLowerCase()}">
                        ${p.protocol || 'N/A'}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // Button handlers
    window.startCapture = () => {
        fetch('/start')
            .then(() => {
                document.querySelector('.start').disabled = true;
                document.querySelector('.stop').disabled = false;
                updateInterval = setInterval(fetchPackets, 1000);
                fetchPackets();
            })
            .catch(console.error);
    }

    window.stopCapture = () => {
        fetch('/stop')
            .then(() => {
                document.querySelector('.start').disabled = false;
                document.querySelector('.stop').disabled = true;
                clearInterval(updateInterval);
            })
            .catch(console.error);
    }

    // Initial setup
    document.querySelector('.stop').disabled = true;
    fetchPackets();
});