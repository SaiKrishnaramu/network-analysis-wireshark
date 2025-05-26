from flask import Flask, render_template, jsonify
from threading import Thread, Lock, Event
import asyncio
import pyshark
import time

app = Flask(__name__, static_folder='static')
packets = []
capture_thread = None
capture_lock = Lock()
stop_event = Event()
interface = 'Wi-Fi'  # Replace with your interface name

def packet_capture():
    global packets
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        capture = pyshark.LiveCapture(interface=interface)
        for packet in capture.sniff_continuously():
            if stop_event.is_set():
                break
            new_packet = {
                'time': packet.sniff_time.strftime("%H:%M:%S"),
                'src': getattr(packet.ip, 'src', getattr(packet.eth, 'src', 'N/A')),
                'dst': getattr(packet.ip, 'dst', getattr(packet.eth, 'dst', 'N/A')),
                'protocol': packet.highest_layer
            }
            packets = [new_packet] + packets[:99]  # Keep last 100 packets
    except Exception as e:
        print(f"Capture error: {e}")
    finally:
        stop_event.clear()

@app.route('/')
def dashboard():
    return render_template('dashboard.html',packets=packets)

@app.route('/start')
def start_capture():
    global capture_thread
    with capture_lock:
        if not capture_thread or not capture_thread.is_alive():
            stop_event.clear()
            capture_thread = Thread(target=packet_capture, daemon=True)
            capture_thread.start()
    return jsonify({"status": "Capture started"})

@app.route('/stop')
def stop_capture():
    stop_event.set()
    return jsonify({"status": "Capture stopped"})

@app.route('/packets')
def get_packets():
    return jsonify(packets[:30])  # Return first 30 (most recent) packets

if __name__ == '__main__':
    app.run(debug=True, port=5000)