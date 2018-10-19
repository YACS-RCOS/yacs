# Yacs NYU Adapter
This repository holds python scripts for the Yacs NYU Adapters while it is still in development. Once a working product is done it'll probably be merged into the main Yacs repository, but this is easier for smaller group development.

### Folder Structure

```
.
├── README.md 	- This document; make sure to read the whole thing!
├── gallatin	- Folder that holds all the scripts for the Gallatin Course Search API adapter
│   └── main.py	- Placeholder script
└── sites.md	- This has some useful sites, like tutorials and cheatsheets

TODO: Figure out how we're going to organize the eventual python executable. Depending on what we run the file on, we might want to concatenate all our source files into a single document, or make a python package and import it into a main script.
```

### Contributing
We're going to use Slack and issues to coordinate division of labor, and pull requests to add code to the codebase. Try to keep other people updated when you start working on an issue or new file - we want to try to minimize repetition of work as much as possible.

#### Slack
Please use the *#dataAdapter* Slack channel to keep everyone updated when you start working on a feature or fixing a bug. If you're working on an issue, be sure to comment on it saying that you're working on it. Communication is key!

#### Issues
All of the issues related to NYU adapters will have both the **service:adapter** and **university:nyu** tags. Other useful tags are **class:bug** and **class:testing**. If you find a bug or a problem, please make an issue before starting to work on it - that way if problems arise in other parts of the adapter, we'll know where to look first.
