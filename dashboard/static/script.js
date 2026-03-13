// Global chart variables
let protocolChart = null;
let trafficChart = null;

console.log("JavaScript loaded!");

function formatBytes(bytes) {
    if (bytes === 0 || bytes === undefined || bytes === null) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateDashboard() {
    console.log("Fetching data...");
    
    fetch('/api/traffic')
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);
            
            // Update timestamp
            document.getElementById('timestamp').textContent = 
                new Date().toLocaleString();
            
            // Update talkers table
            const tbody = document.querySelector('#talkers-table tbody');
            if (!tbody) {
                console.error("Could not find table body!");
                return;
            }
            
            tbody.innerHTML = '';
            
            if (data.traffic && data.traffic.length > 0) {
                // Sort by bytes sent (descending)
                data.traffic.sort((a, b) => (b.bytes_sent || 0) - (a.bytes_sent || 0))
                    .slice(0, 10)  // Top 10
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
            console.error('Error:', error);
            document.getElementById('timestamp').textContent = 'Error loading data';
        });
}

function updateProtocolChart(protocols) {
    console.log("Updating protocol chart with:", protocols);
    
    const ctx = document.getElementById('protocolChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (protocolChart) {
        protocolChart.destroy();
    }
    
    // Prepare data
    let chartData = {
        labels: [],
        values: []
    };
    
    if (protocols && protocols.length > 0) {
        chartData.labels = protocols.map(p => p.protocol || 'Unknown');
        chartData.values = protocols.map(p => p.count || 0);
    } else {
        chartData.labels = ['No Data'];
        chartData.values = [1];
    }
    
    // Create new chart
    protocolChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartData.labels,
            datasets: [{
                data: chartData.values,
                backgroundColor: [
                    '#FF6384',  // Red
                    '#36A2EB',  // Blue
                    '#FFCE56',  // Yellow
                    '#4BC0C0',  // Teal
                    '#9966FF',  // Purple
                    '#FF9F40'   // Orange
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                },
                title: {
                    display: protocols.length === 0,
                    text: 'No protocol data available'
                }
            }
        }
    });
}

function updateTrafficChart(traffic) {
    console.log("Updating traffic chart with:", traffic);
    
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (trafficChart) {
        trafficChart.destroy();
    }
    
    // Prepare data - top 5 talkers by bytes sent
    let chartData = {
        labels: [],
        values: []
    };
    
    if (traffic && traffic.length > 0) {
        // Sort and take top 5
        const topTraffic = traffic
            .sort((a, b) => (b.bytes_sent || 0) - (a.bytes_sent || 0))
            .slice(0, 5);
        
        chartData.labels = topTraffic.map(t => {
            // Truncate long IPs
            const ip = t.ip || 'Unknown';
            return ip.length > 15 ? ip.substring(0, 12) + '...' : ip;
        });
        chartData.values = topTraffic.map(t => t.bytes_sent || 0);
    } else {
        chartData.labels = ['No Data'];
        chartData.values = [0];
    }
    
    // Create new chart
    trafficChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Bytes Sent',
                data: chartData.values,
                backgroundColor: '#36A2EB',
                borderColor: '#2980b9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatBytes(value);
                        }
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: traffic.length === 0,
                    text: 'No traffic data available'
                }
            }
        }
    });
}

// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, starting updates...");
    updateDashboard();
    setInterval(updateDashboard, 5000);
});
