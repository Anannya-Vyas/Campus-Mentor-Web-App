import http.server
import socketserver
import sys

PORT = 8000

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # No logging to avoid issues
        pass

def run_server(port):
    try:
        with socketserver.TCPServer(("", port), QuietHandler) as httpd:
            print(f"✅ Server started successfully on port {port}")
            print(f"🌐 Open: http://localhost:{port}/splash.html")
            print("Press Ctrl+C to stop")
            httpd.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"Port {port} busy, trying {port + 1}")
            run_server(port + 1)
        else:
            print(f"Error: {e}")

if __name__ == "__main__":
    run_server(PORT)