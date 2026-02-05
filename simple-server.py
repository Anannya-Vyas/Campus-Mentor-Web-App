import http.server
import socketserver
import webbrowser
import os

PORT = 3000
web_dir = os.path.join(os.path.dirname(__file__))
os.chdir(web_dir)

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🚀 Campus Mentor Server Running!")
    print(f"📍 Open: http://localhost:{PORT}/splash.html")
    print(f"📁 Serving from: {web_dir}")
    webbrowser.open(f'http://localhost:{PORT}/splash.html')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")