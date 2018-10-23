# NYU Gallatin Adapter
This is the Yacs adapter for the Gallatin Course Search API. It queries the Gallatin Course Database at [`https://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json`][gallatin-api] in pieces and pipes the information to the amalgamator.

### Division of Labor
The python script will be divided into 4 tasks:

1. Server request-handling - the script needs act as a server, responding to `GET` requests from Yacs with course information. This task involves making a web server to respond to these `GET` requests
2. API comprehension - the script needs to understand the NYU API enough to write a correctly formatted `GET` request to send to Gallatin's API server
3. Sending requests - Once we have a formatted `GET` request, we need to establish a connection to the Gallatin Course Search API server and save the information it sends us
4. Translating to Yacs format - The JSON objects we get from the API aren't formatted correctly - Yacs can't understand it until we reformat the information to be more aligned with the Yacs schema

### File Structure
This adapter uses the following file structure:

```
.
├── README.md		- README file
├── gallatin api.md - Explanation/documentation of Gallation Course Search API
├── reqhandler.py	- Server request-handling module
├── apitrans.py		- API comprehension module
├── galreq.py		- Sending requests module
├── jsontrans.py	- Translating to Yacs format module
├── globals.py		- Holds global variables
└── main.py			- main entry-point to python script
```

### Functions
To make it easier to coordinate, we're going to use the following standard names for public functions and variables:

```python

API_URL = "URL_OF_THE_GALLATIN_API"

# Task 2
def get_query(term_shortname):
	# This function takes in the term_shortname as a string
	# and then returns a query string to send to the API
	return "CORRECT_QUERY_STRING"

# Task 3
def gallatin_data(query_string):
	# This function takes in a query string
	# and returns the JSON data that the API returns for that query string
	return "JSON_STRING_FROM_API"

# Task 4
def format_data(unformatted_json):
	# This function takes in a JSON string in the API's format
	# and returns a JSON string in Yacs format
	return "FORMATTED_JSON_STRING"

```

[gallatin-api]: https://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json
