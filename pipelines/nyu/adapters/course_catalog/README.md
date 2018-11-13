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
# These will eventually have to change; not all of these really imply thread safety, and all of them assume
# that we're using the non-mobile version of the course catalog website
# Task 1
def get_page(term, year, subject):
	# term is a string, year is an integer, and subject
	# is a string
	# Returns HTML from formatted GET request
	# Using these parameters
	return "RAW_HTML"

# Task 2
def get_records(raw_html):
	#input is raw HTML (string)
	# Yields a dictionary with all the data for a record
	yield "ENTRY_DICT"

# Task 3
def append_data(subject_dict, entry_dict):
	# subject_dict and entry_dict are both dictionaries
	# Uses information stored in the entry_dict to
	# update the subject_dict
	# i.e. adding entries
	return None

# ----- Task ~5 (not on the task list) --------
# ----- Use these functions (from file_management) to do anything with files/data
def add_entry(entry_dict): # Add an entry dictionary to the entry dict queue
    return None

def get_entry(): # Get an entry dictionary to format
    return entry_object

def add_filedata(path, data): # add a fully formed result for a specific /:term_shortname to the file write queue
    return None

def get_filedata(): # Get data to write to a file
    return file_path, file_data_to_write

def opens(path,mode = 'r'): # Open a file at a path safely
    return FILE_OBJECT

```

[course-search]: https://sis.nyu.edu/psc/csprod/EMPLOYEE/SA/c/NYU_SR.NYU_CLS_SRCH.GBL
