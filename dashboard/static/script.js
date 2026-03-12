let protocolChart, trafficChart;

function formatBytes(bytes) {
    if (bytes === 0 || bytes === undefined || bytes === null) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateDashboard() {
    console.log('Fetching data...');
    fetch('/api/traffic')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            
            // Update timestamp
            document.getElementById('timestamp').textContent = 
                new Date(data.timestamp).toLocaleString();
            
            // Update top talkers table
            const tbody = document.getElementById('talkers-body');
            tbody.innerHTML = '';
            
            if (data.traffic && data.traffic.length > 0) {
                data.traffic.sort((a, b) => (b.bytes_sent || 0) - (a.bytes_sent || 0))
                    .slice(0, 10)
                    .forEach(talker => {
                        const row = tbody.insertRow();
                        row.insertCell().textContent = talker.ip || 'Unknown';
                        row.insertCell().textContent = formatBytes(talker.bytes_sent || 0);
                        row.insertCell().textContent = talker.packet_count || 0;
                    });
            } else {
                const row = tbody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 3;
                cell.textContent = 'No traffic data yet. Make sure packet capture is running!';
                cell.style.textAlign = 'center';
            }
            
            // Update protocol chart
            updateProtocolChart(data.protocols || []);
            
            // Update traffic chart
            updateTrafficChart(data.traffic || []);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('timestamp').textContent = 'Error loading data';
            document.getElementById('talkers-body').innerHTML = 
                '<tr><td colspan="3" class="error">Error connecting to server. Make sure the backend is running.</td></tr>';
        });
}

function updateProtocolChart(protocols) {
    const ctx = document.getElementById('protocolChart').getContext('2d');
    
    if (protocolChart) {
        protocolChart.destroy();
    }
    
    if (!protocols || protocols.length === 0) {
        protocols = [{protocol: 'No data', count: 1}];
    }
    
    protocolChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: protocols.map(p => p.protocol || 'Unknown'),
            datasets: [{
                data: protocols.map(p => p.count || 1),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateTrafficChart(traffic) {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    if (trafficChart) {
        trafficChart.destroy();
    }
    
    if (!traffic || traffic.length === 0) {
        // Show empty chart with message
        trafficChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['No data'],
                datasets: [{
                    label: 'Bytes Sent',
                    data: [0],
                    backgroundColor: '#36A2EB'
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'No traffic data available'
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return formatBytes(value);
                            }
                        }
                    }
                }
            }
        });
        return;
    }
    
    const topTraffic = traffic.sort((a, b) => (b.bytes_sent || 0) - (a.bytes_sent || 0)).slice(0, 5);
    
    trafficChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topTraffic.map(t => t.ip || 'Unknown'),
            datasets: [{
                label: 'Bytes Sent',
                data: topTraffic.map(t => t.bytes_sent || 0),
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return formatBytes(value);
                        }
                    }
                }
            }
        }
    });
}

// Update every 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
    setInterval(updateDashboard, 5000);
});
