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


```

[course-search]: https://sis.nyu.edu/psc/csprod/EMPLOYEE/SA/c/NYU_SR.NYU_CLS_SRCH.GBL
