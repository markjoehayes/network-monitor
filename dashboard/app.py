from flask import Flask, render_template, jsonify
from database.db_manager import DatabaseManager
from datetime import datetime

app = Flask(__name__)
db_manager = DatabaseManager()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/traffic')
def get_traffic():
    traffic = db_manager.get_traffic_summary(minutes=5)
    protocols = db_manager.get_protocol_distribution(minutes=5)
    return jsonify({
        'traffic': traffic,
        'protocols': protocols,
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
