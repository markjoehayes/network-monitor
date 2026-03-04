from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from .models import Base, PacketLog, TrafficSummary
import os

class DatabaseManager:
    def __init__(self, db_url=None):
        if db_url is None:
            db_url = os.getenv('DATABASE_URL', 'postgresql://admin:admin123@localhost:5432/network_monitor')
        
        self.engine = create_engine(db_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
    
    def insert_packet(self, packet_data):
        session = self.Session()
        try:
            packet = PacketLog(**packet_data)
            session.add(packet)
            session.commit()
            return packet.id
        except Exception as e:
            session.rollback()
            print(f"Error inserting packet: {e}")
        finally:
            session.close()
    
    def get_traffic_summary(self, minutes=5):
        session = self.Session()
        try:
            since = datetime.utcnow() - timedelta(minutes=minutes)
            
            # Group by source IP
            results = session.query(
                PacketLog.src_ip,
                func.sum(PacketLog.size).label('bytes_sent'),
                func.count(PacketLog.id).label('packet_count')
            ).filter(PacketLog.timestamp >= since)\
             .group_by(PacketLog.src_ip)\
             .all()
            
            return [{
                'ip': r[0],
                'bytes_sent': r[1],
                'packet_count': r[2]
            } for r in results]
        finally:
            session.close()
    
    def get_protocol_distribution(self, minutes=5):
        session = self.Session()
        try:
            since = datetime.utcnow() - timedelta(minutes=minutes)
            
            results = session.query(
                PacketLog.protocol,
                func.count(PacketLog.id).label('count'),
                func.sum(PacketLog.size).label('total_bytes')
            ).filter(PacketLog.timestamp >= since)\
             .group_by(PacketLog.protocol)\
             .all()
            
            return [{
                'protocol': r[0],
                'count': r[1],
                'bytes': r[2]
            } for r in results]
        finally:
            session.close()
