
## How the Gallatin API Works
The Gallatin API uses the [elasticsearch system][elastic-search-api] and returns data in JSON format.

### A Basic Example
The Gallatin API works by using terms in the URL as conditions, similar to the parts of a `WHERE` clause in SQL. For example, if the URL is:

```
https://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json?limit=10
```

then the api will return 10 course objects - here's an example with just one:

``` JSON
{
    "totalMatches":"4587",
	"1":{
		"course":"IDSEM-UG1752",
		"title":"This Mediated Life: An Introduction to the Study of Mass Media",
		"credit":"4",
		"foundation-libarts":"HUM",
		"level":"U",
		"term":"WI",
		"type":"Interdisciplinary Seminars (IDSEM-UG)",
		"year":"2019",
		"section":"001",
		"description":"The actual description is really long so this is a placeholder for it",
		"days":"Mon Tue Wed Thu ",
		"times":"10:00 AM - 1:30 PM",
		"days2":"",
		"instructors":[{"Julian Cornell":"/content/gallatin/en/people/faculty/jc266"}],
		"notes":""
	}
}
```

 Notice that the URL is the same except for the ending, where the query terms begin after a question mark `?` after the URL, and are defined as `key=value` pairs. To reduce redundancy, from now on we'll use the shorthand `?QUERY` to denote the entire URL, where `QUERY` is a placeholder for the entire query string. so for example,

```
https://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json?limit=10
```
becomes
```SQL
?limit=10 -- SQL syntax highlighting for visual clarity
```

### Query by Attribute
A blank query - that is, going to the URL without specifying a query at all - returns an unfiltered list of courses from the database, limited to the first 50 or so by default. If you wanted to filter this list by some attribute, you'd specify it like this:

```
?attribute=value
```

Where `attribute` is the name of an attribute that courses can have, and value is a string (that isn't enclosed in quotes). Currently, we don't know of any other ways to query by attribute - as we continue to experiment with the database more, or find actual documentation on how to use it, this section will become more comprehensive.

##### Database Attributes
The following is a list of the attributes that courses have:

Attribute Name		| Values	| Description
:---				| :---		| :---
Course  			| String	|  Course ID
Title  				| String	|  Course name
Credit  			| Integer	|  Number of credits
foundation-libarts  | String	|  ?
level  				| String	|  Code for whether it's undergrad or grad
term  				| String	|  The term the course is offered in
type  				| String	|  Type of course (i.e. department)
year  				| Integer	|  Year offered
section  			| Integer	|  Section #
description  		| String	|  Course description
days  				| String	|  Days section is offered
times  				| String	|  Times section is offered
days2  				| String	|  ?
instructors  		| String Array|List of instructors for the course
notes  				| String	|  ?

### Special Characters
Seems that it's possible to use certain special characters to query on more than one attribute at once. For example, the `&ampersand&` is used as a logical `AND`:

```
?year=2018&type=U
```

This returns all the undergraduate courses in 2018.

### Query Keywords
Certain words are reserved as special keywords - for example, the value of `limit` sets the explicit maximum number of results to return - without the keyword the results are limited by an implicit limit of 50.

[gallatin-api]: https://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json
[elastic-search-api]: https://www.elastic.co/guide/en/elasticsearch/reference/current/_the_search_api.html
