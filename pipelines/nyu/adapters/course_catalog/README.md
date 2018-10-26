# Course Catalog Web Scraper
This is the Yacs adapter for the Course Catalog website. It opens the webpage at [`https://sis.nyu.edu/psc/csprod/EMPLOYEE/SA/c/NYU_SR.NYU_CLS_SRCH.GBL`][course-search] and navigates it to find course information. It then parses that information and returns it to the Yacs Adapter

### Division of Labor
The python script will be divided into 4 tasks:

Task| Name				| Package(s)		| Description
:---| :---				| :---				| :---
1	| Webpage Parsing	| `selenium`		| Connecting to and navigating the site using a selenium webdriver
2 	| HTML Parsing		| `bs4`,`json`		| Converting the HTML into usable JSON using Beautiful Soup
3 	| JSON Conversion	| `json`,`pandas`	| Converting JSON into a Yacs-readable format
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
#TODO Decide these
```

[course-search]: https://sis.nyu.edu/psc/csprod/EMPLOYEE/SA/c/NYU_SR.NYU_CLS_SRCH.GBL
