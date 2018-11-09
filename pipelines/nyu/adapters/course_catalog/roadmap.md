# Roadmap for Webscraping Adapter
Building our web-scraper will involve the following tasks:

Task| Name				| Package(s)		| Description
:---| :---				| :---				| :---
1	| Webpage Parsing	| `requests`		| Connecting to and querying the site
2 	| HTML Parsing		| `bs4`				| Converting the HTML into usable JSON using Beautiful Soup
3 	| JSON Conversion	| `json`			| Converting JSON into a Yacs-readable format
4 	| Sending JSON		| `http`			| Sending formatted JSON to Yacs

For help on these packages, please look in the [`sites.md`](pipelines/nyu/sites.md) for useful docs/guides.

### Webpage Parsing
We're going to be first inspecting the architecture of the javascript that the site uses, then trying to emulate the GET requests that it generates in order to reduce the amount of requests necessary to get all the course information we want.

### HTML Parsing
HTML parsing will involve taking HTML from the course search website and formatting it into JSON. This will involve 2 packages: `bs4` (Beautiful Soup) and `json`.

### JSON Conversion
To convert the JSON into a format usable by Yacs, we'll use 2 separate packages - `json` makes it easier to work directly with JSON, but `pandas` makes it easier to filter and concatenate aggregate data. We'll use these packages in conjunction to quickly and efficiently format JSON.

### Serving JSON
To send correctly formatted JSON to Yacs, we'll use the `http.server` package. This code should be essentially reusable from the Gallatin adapter - there will be minimal differences between the two. Beyond that, this task will also involve the management of JSON objects in some form of file system - we probably can't expect to reliably hold all of the course information in RAM. Instead, we'll probably use some kind of file system as a 'cache' to store full records for a single `term_shortname`, so that when our adapter is polled for information, it has something to send.

### Additional concerns
Web scraping is a long and arduous process, both for the coder and the computer. We'll need to continuously reevaluate our code to make sure that it's not only efficient, but easy to understand. *Documentation is key*. Keep a habit of commenting your work, and make sure to use the Slack and create issues.
