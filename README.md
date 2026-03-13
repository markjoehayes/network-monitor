# Network Monitoring Dashboard

A real-time network traffic monitoring system that captures, analyzes, and visualizes LAN traffic. Built with Python, Scapy, PostgreSQL, and Flask.

![Network Monitor Dashboard](dashboard-screenshot.png) <!-- You can add a screenshot later -->

## Features

- **Real-time packet capture** - Monitor network traffic as it happens
- **Live dashboard** - Auto-refreshing web interface with charts and tables
- **Top talkers** - See which IP addresses are using the most bandwidth
- **Protocol distribution** - Visual breakdown of TCP/UDP/other traffic
- **Data persistence** - All traffic logged to PostgreSQL database
- **Docker support** - Easy database deployment with Docker Compose

## Tech Stack

- **Python** 3.14+** - Core language
- **Scapy** - Packet capture and analysis
- **PostgreSQL** - Data storage
- **SQLAlchemy** - Database ORM
- **Flask** - Web dashboard backend
- **Chart.js** - Frontend visualizations
- **Docker** - Containerized database

## Project Structure

network-monitor/
├── capture/
│ ├── init.py
│ └── packet_capture.py # Main packet capture script
├── database/
│ ├── init.py
│ ├── db_manager.py # Database operations
│ └── models.py # SQLAlchemy models
├── dashboard/
│ ├── init.py
│ ├── app.py # Flask web application
│ ├── static/
│ │ └── script.js # Frontend JavaScript
│ └── templates/
│ └── index.html # Dashboard HTML
├── docker-compose.yml # PostgreSQL container setup
├── requirements.txt # Python dependencies
├── run_capture.sh # Script to start packet capture
├── run_dashboard.sh # Script to start web dashboard
└── README.md 


## Prerequisites

- **Python 3.14
- **Docker** and **Docker Compose** (for PostgreSQL)
- **libpcap** (for packet capture)
- **PostgreSQL client libraries** (for psycopg2)

### Installation on Arch Linux

```bash
# Install system dependencies
sudo pacman -S postgresql-libs libpcap docker docker-compose

# Add user to docker group (log out after)
sudo usermod -aG docker $USER

# Start docker service
sudo systemctl enable --now docker
```

### Installation on Ubuntu/Debian

```bash
# Install system dependencies
sudo apt update
sudo apt install python3-pip libcap-dev postgresql-client docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

## Setup Instructions

### 1. Clone and Setup Virtual Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd network-monitor

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 2. Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Start PostgressSQL Database

```bash

# Start the database container
docker-compose up -d postgres

# Verify that it's running
docker-compose ps
```

### 4. Start Packet Capture

You'll need root priviliges for packet capture:

```bash

# Make sure the capture script is executable
chmod +x run_capture.sh

# Start capturing (you may need to spacify your next network interface)
./run_capture.sh
```

### 5. Start the Dashboard

```bash

# In a new terminal
cd network-monitor
source .venv/bin/activate
./run_dashboard.sh
```

### 6. View the Dashboard

Open your browser and navigate to http://localhost:5000

## Usage

- The dashboard auto-refreshed every 5 seconds
- **Top Talkers** table shows IPs with highest traffic
- **Protocol Distribution** pie chart shows traffic types
- **Traffic Volume** bar chart shows bandwidth usage by IP
- Packet capture runs continuously, storing data in PostgresSQL

# Troubleshooting

## Permission Issues with Docker
```bash

# if you get "permission denied" for docker.sock
sudo usermod -aG docker $USER
# Log out and back in
```

## Packet Capture Shows No Traffic

```bash

# List your network intefaces
ip link show

# Capture on specific interface
./run_capture.sh --interface wlan0 # for WiFi
./run_capture.sh --interface eth0  # for Ethernet
```

## Module Import Errors

If python can't find local modules

```bash
# Set PYTHONPATH
export PYTHONPATH=/path/to/network-monitor
# or run scripts from project root
```

## Database Connection Issues

```bash
# Check if PostgresSQL is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Test database connection
python -c "from database.db_manager import DatabaseManager; db=DatabaseManager(); print('DB OK')"
```

# ROADMAP

 - Historical data views with date picker

 - Email alerts for unusual traffic

 - DNS query tracking

 - Geolocation mapping of external IPs

 -  Bandwidth graphs over time

 -  Port/protocol filtering

 -  User authentication

 -  PCAP export functionality

 -  Anomaly detection

 -  Mobile-responsive design

# Contact

Mark Hayes markjoehayes@proton.me

Project Link: https://github.com/yourusername/network-monitor
