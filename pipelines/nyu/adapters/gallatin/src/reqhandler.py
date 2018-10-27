from http.server import BaseHTTPRequestHandler

# So we need to override the do_GET() method in BaseHTTPRequestHandler
# We need to then fetch the appropriate data
# Then finally we need to send it back

# Here's some resources I've found so far
# https://daanlenaerts.com/blog/2015/06/03/create-a-simple-http-server-with-python-3/
# https://gist.github.com/bradmontgomery/2219997

class ReqHandler(BaseHTTPRequestHandler):

	def write_message(self, message, encoding = "utf8"):
		'''
		This method writes a message to the output stream
		Parameters:
		-----------
		message, string -
		Message to send
		encoding, string, default: "utf8" -
		optional parameter to specify encoding of message
		'''
		self.wfile.write(bytes(message, encoding))

	def send_all_headers(self):
		'''
		This method sends all the necessary headers
		'''
		# TODO Figure out what the heck this is

		self.send_response(200)
		self.send_header('Content-type','text/html')
		self.end_headers()

	# Override GET request
	def do_GET(self):
		'''
		This method performs the server logic associated
		with receiving a GET request
		'''
		self.send_all_headers()

		# Get the term name
		# self.path should hold the '/:term_shortname' part of the GET request
		self.path = self.path[1:]

		# Send the edited self.path containing the correct format of term name
		query = get_query(self.path)

		# Send query to get JSON data from the API
		data = gallatin_data(query)

		# Format the data recieved into Yacs format
		formatted_data = format_data(data)

		# Send message back to client
		message = formatted_data

		# Write content as utf-8 data
		self.write_message(message)
