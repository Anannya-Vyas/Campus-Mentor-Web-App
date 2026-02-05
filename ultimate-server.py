import http.server
import socketserver
import webbrowser
import os

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # No logging

def find_available_port(start_port=8000, max_attempts=50):
    """Find an available port starting from start_port"""
    for port in range(start_port, start_port + max_attempts):
        try:
            # Test if port is available
            with socketserver.TCPServer(("", port), Handler) as test_server:
                test_server.server_close()
                return port
        except OSError:
            continue
    return None

def run_server():
    # Kill any existing Python processes
    os.system('taskkill /f /im python.exe 2>nul')
    
    # Find available port
    port = find_available_port(8000)
    
    if port is None:
        print("❌ No available ports found. Please restart your computer.")
        input("Press Enter to exit...")
        return
    
    # Set working directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Start server
    with socketserver.TCPServer(("", port), Handler) as httpd:
        print("🎉 CAMPUS MENTOR SERVER STARTED!")
        print("=" * 50)
        print(f"📍 URL: http://localhost:{port}/splash.html")
        print(f"📁 Folder: {os.getcwd()}")
        print("⏹️  Press Ctrl+C to stop the server")
        print("=" * 50)
        
        # Open browser
        webbrowser.open(f'http://localhost:{port}/splash.html')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")

if __name__ == "__main__":
    run_server()