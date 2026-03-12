# Test database connection
python -c "
from database.db_manager import DatabaseManager
db = DatabaseManager()
print('Database connection successful!')
"

# Test packet capture (may need sudo)
sudo python capture/packet_capture.py
# Press Ctrl+C to stop

# Test dashboard
python dashboard/app.py
# Then open http://localhost:5000 in your browser
