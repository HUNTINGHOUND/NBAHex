from nba_api.stats.endpoints import commonplayerinfo
import socket
from http.server import BaseHTTPRequestHandler
from io import BytesIO


class HTTPRequest(BaseHTTPRequestHandler):
    """
    Class made for parsing HTTP requests
    """

    def __init__(self, text):
        """
        Constructor for the class
        :param str text: The raw request string
        """
        self.rfile = BytesIO(text.encode("utf-8"))
        self.raw_requestline = self.rfile.readline()
        self.error_code = self.error_message = None
        self.parse_request()

    def send_error(self, code, message):
        self.error_code = code
        self.error_message = message


SERVER_HOST = '0.0.0.0'
SERVER_PORT = 8080

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_socket.bind((SERVER_HOST, SERVER_PORT))
server_socket.listen(1)
print("Listening on port %s ..." % SERVER_PORT)

while True:
    # Wait for client connections
    client_connection, cilent_address = server_socket.accept()

    # Get the client request
    request_text = client_connection.recv(1024).decode()
    request = HTTPRequest(request_text)

    print(request_text)

    print(request.error_code)
    print(request.command)
    print(request.headers.keys())
    print(request.headers["Host"])

    data = ""
    if request.headers["Command"] == "CommonPlayerInfo":
        playerid = int(request.headers["PlayerID"])
        data = commonplayerinfo.CommonPlayerInfo(player_id=playerid).get_response()

    # Send HTTP response
    response = 'HTTP/1.0 200 OK\n\n' + data
    client_connection.sendall(response.encode())
    client_connection.close()

server_socket.close()
