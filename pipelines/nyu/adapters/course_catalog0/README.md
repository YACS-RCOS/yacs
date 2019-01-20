# Course Catalog Web Scraper
This is the Yacs adapter for the Course Catalog website. It opens the webpage at [`https://sis.nyu.edu/psc/csprod/EMPLOYEE/SA/c/NYU_SR.NYU_CLS_SRCH.GBL`][course-search] and navigates it to find course information. It then parses that information and returns it to the Yacs Adapter

### Division of Labor
The python script will be divided into 4 tasks:

Task| Name				| Package(s)		| Description
:---| :---				| :---				| :---
1	| Webpage Parsing	| `requests`		| Connecting to and querying the site
2 	| HTML Parsing		| `bs4`				| Converting the HTML into usable JSON using Beautiful Soup
3 	| JSON Conversion	| `json`			| Converting JSON into a Yacs-readable format
4 	| Sending JSON		| `http`			| Sending formatted JSON to Yacs

### File Structure
```
.
├── README.md		- This document
├── roadmap.md		- More detailed roadmap of project
├── site_format.md	- Documentation for the format of the site
└── src				- Source folder
	├── main.py		- Main entrypoint for program
    └── ...			- More files
```

### Functions
We'll use the following standard functions:

```python

# Task 1 and 2
def get_data(queue, *data):
	# Queue is a queue that implements queue.put(obj)
	# *data is an ordered list of attributes
	# necessary to determine the page to request from
	return None

# Task 3
def append_data(queue, data_dict):
	# queue is a queue that implements queue.get()
	# data_dict is a dictionary of term_shortname=key,dictionary=value pairs
	return None

# ----- Task ~5 (not on the task list) --------
# ----- Use these functions (from file_management) to do anything with files/data
def add_entry(entry_dict): # Add an entry dictionary to the entry dict queue
    return None

def get_entry(): # Get an entry dictionary to format
    return entry_object

def put_data(term_shortname,json):
    return None

def get_data(term_shortname):
    return term_shortname_data
```

[course-search]: https://sis.nyu.edu/psc/csprod/EMPLOYEE/SA/c/NYU_SR.NYU_CLS_SRCH.GBL
