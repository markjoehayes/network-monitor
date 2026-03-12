import requests
try:
    r = requests.get('http://localhost:5000/')
    print(f"Main page: {r.status_code}")
    print(f"Content length: {len(r.text)}")
    
    r = requests.get('http://localhost:5000/api/traffic')
    print(f"API: {r.status_code}")
    print(f"Response: {r.text[:200]}")
except Exception as e:
    print(f"Error: {e}")
