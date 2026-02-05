import http.server
import socketserver
import webbrowser
import os

# Always use port 8000
PORT = 8000

# Change to project directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # No logging

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Server running on http://localhost:{PORT}")
        print("📱 Open: http://localhost:8000/splash.html")
        webbrowser.open('http://localhost:8000/splash.html')
        httpd.serve_forever()
except OSError:
    print("⚠️  Port 8000 busy. Using port 8001...")
    with socketserver.TCPServer(("", 8001), Handler) as httpd:
        print("✅ Server running on http://localhost:8001")
        webbrowser.open('http://localhost:8001/splash.html')
        httpd.serve_forever()