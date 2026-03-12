// Simple version to test if JavaScript is working
console.log("JavaScript loaded!");

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
                data.traffic.forEach(talker => {
                    const row = tbody.insertRow();
                    row.insertCell().textContent = talker.ip || 'Unknown';
                    row.insertCell().textContent = talker.bytes_sent || 0;
                    row.insertCell().textContent = talker.packet_count || 0;
                });
            } else {
                const row = tbody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 3;
                cell.textContent = 'No traffic data yet. Make sure packet capture is running!';
                cell.style.textAlign = 'center';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('timestamp').textContent = 'Error loading data';
        });
}

// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, starting updates...");
    updateDashboard();
    setInterval(updateDashboard, 5000);
});
