# NYU Gallatin Adapter
This is the Yacs adapter for the Gallatin Course Search API. It queries the Gallatin Course Database at [`https://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json`][gallatin-api] in pieces and pipes the information to the amalgamator.

## How the Gallatin API Works

### A Basic Example
The Gallatin API works by using terms in the URL as conditions, similar to the parts of a `WHERE` clause in SQL. For example, if the URL is:

```
https://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json?limit=10
```

then the api will return 10 course objects. Notice that the URL is the same except for the ending, where the query terms begin after a question mark `?` after the URL, and are defined as `key=value` pairs. To reduce redundancy, from now on we'll use the shorthand `?QUERY` to denote the entire URL, where `QUERY` is a placeholder for the entire query string. so for example,

```
https://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json?limit=10
```
becomes
```SQL
?limit=10 -- SQL syntax highlighting for visual clarity
```

### Query by Attribute

	TODO Explain this

##### Database Attributes

	TODO: List these out

### Special Characters

	TODO: Figure out all of them. One of them is '&'

### Query Keywords

	TODO: Both figure this out and explain this

[gallatin-api]: https://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json
