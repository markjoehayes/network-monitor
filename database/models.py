from sqlalchemy import create_engine, Column, Integer, String, DateTime, BigInteger, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class PacketLog(Base):
    __tablename__ = 'packet_logs'
    
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    src_ip = Column(String(45))
    dst_ip = Column(String(45))
    protocol = Column(String(10))
    size = Column(Integer)
    src_port = Column(Integer, nullable=True)
    dst_port = Column(Integer, nullable=True)
    
class TrafficSummary(Base):
    __tablename__ = 'traffic_summary'
    
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(45))
    bytes_sent = Column(BigInteger, default=0)
    bytes_received = Column(BigInteger, default=0)
    packet_count = Column(Integer, default=0)
