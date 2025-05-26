# Network Traffic Analysis Dashboard 🌐

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0%2B-lightgrey)](https://flask.palletsprojects.com/)
[![Wireshark](https://img.shields.io/badge/Wireshark-3.6%2B-yellowgreen)](https://www.wireshark.org/)

Real-time network traffic monitoring system using Python, Flask, and Wireshark/tshark. Visualizes network packets in a modern web dashboard.

![Dashboard Screenshot](screenshot.png)

## Features ✨

- Real-time packet capture visualization
- Protocol distribution charts (TCP/UDP/DNS/HTTP)
- Source/Destination IP tracking
- Automatic interface detection
- Start/Stop capture controls
- Last 30 packets display
- Traffic statistics
- Dark mode UI

## Installation 🛠️

### Prerequisites
- Python 3.8+
- Wireshark/tshark
- Administrative privileges

```bash
# Clone repository
git clone https://github.com/SaiKrishnaramu/network-analysis-wireshark.git
cd network-analysis-wireshark

# Install dependencies
pip install -r requirements.txt

# Run as administrator
python app.py
