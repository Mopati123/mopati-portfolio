#!/usr/bin/env python3
"""Zero-dependency validation and local server for the portfolio."""
from __future__ import annotations
import argparse
import http.server
import socketserver
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def validate() -> int:
    command = [sys.executable, "-m", "unittest", "discover", "-s", "tests", "-v"]
    return subprocess.call(command, cwd=ROOT)

def serve(port: int) -> int:
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("127.0.0.1", port), handler) as server:
        print(f"Portfolio available at http://127.0.0.1:{port}")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            return 0
    return 0

def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("validate")
    serve_parser = sub.add_parser("serve")
    serve_parser.add_argument("--port", type=int, default=8080)
    args = parser.parse_args()
    return validate() if args.command == "validate" else serve(args.port)

if __name__ == "__main__":
    raise SystemExit(main())
