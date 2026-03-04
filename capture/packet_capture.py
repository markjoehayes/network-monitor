#!/usr/bin/env python3

from scapy.all import sniff, IP, TCP, UDP
from datetime import datetime
import time
import threading
from database.db_manager import DatabaseManager

class PacketCapture:
    def __init__(self, interface=None):
        self.db_manager = DatabaseManager()
        self.interface = interface
        self.running = False
        
    def packet_handler(self, packet):
        if IP in packet:
            packet_data = {
                'timestamp': datetime.utcnow(),
                'src_ip': packet[IP].src,
                'dst_ip': packet[IP].dst,
                'protocol': 'other',
                'size': len(packet),
                'src_port': None,
                'dst_port': None
            }
            
            # Determine protocol
            if TCP in packet:
                packet_data['protocol'] = 'TCP'
                packet_data['src_port'] = packet[TCP].sport
                packet_data['dst_port'] = packet[TCP].dport
            elif UDP in packet:
                packet_data['protocol'] = 'UDP'
                packet_data['src_port'] = packet[UDP].sport
                packet_data['dst_port'] = packet[UDP].dport
            
            # Store in database
            self.db_manager.insert_packet(packet_data)
            print(f"Captured: {packet_data['src_ip']} -> {packet_data['dst_ip']} ({packet_data['protocol']})")
    
    def start_capture(self):
        self.running = True
        print(f"Starting packet capture on interface {self.interface or 'default'}")
        sniff(iface=self.interface, prn=self.packet_handler, store=0, stop_filter=lambda x: not self.running)
    
    def stop_capture(self):
        self.running = False

def main():
    capture = PacketCapture()
    try:
        capture.start_capture()
    except KeyboardInterrupt:
        capture.stop_capture()
        print("\nCapture stopped")

if __name__ == "__main__":
    main()
