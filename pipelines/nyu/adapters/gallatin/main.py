from http.server import HTTPServer
from apitrans import get_query
from reqhandler import ReqHandler


def run():
  print('starting server...')

  # Server settings
  # Choose port 8080, for port 80, which is normally used for a http server, you need root access
  server_address = ('127.0.0.1', 8081)
  httpd = HTTPServer(server_address, ReqHandler)
  print('running server...')
  httpd.serve_forever()


run()
