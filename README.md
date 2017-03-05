# YACS - Yet Another Course Scheduler
[![Build Status](https://img.shields.io/travis/YACS-RCOS/yacs/master.svg)](https://travis-ci.org/YACS-RCOS/yacs)
[![Coverage Status](https://img.shields.io/coveralls/YACS-RCOS/yacs.svg)](https://coveralls.io/github/YACS-RCOS/yacs?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/YACS-RCOS/yacs.svg)](https://codeclimate.com/github/YACS-RCOS/yacs)

Simple, Sane Course Scheduling. To use YACS @ RPI, visit https://yacs.cs.rpi.edu.

# What is YACS?

YACS was created with the goal of making students' lives a little easier. It allows users to avoid the often clunky UIs of proprietary Catalog Management and Student Information Systems by enabling easy browsing and searching of courses, and adds the additional functionality of easy schedule generation.

YACS is capable of aggregating academic data stored across multiple proprietary systems, including course offerings, section meeting times, and seat availability. This data then is presented to users in a searchable, browesable form.

Most importantly, YACS leverages meeting time data to provide students with an easy way to plan their semesters. Students need only select the courses and sections they would like to take, and are given a list of all valid schedule variants based on their selections. Schedules are presented in a weekly-calendar view, and are easily downloadable and shareable.

All of this functionality is exposed through a public REST API, making it easy to create exciting new applications and extensions that leverage the data YACS provides.

YACS is currently only in use at its alma mater, the Rensselaer Polytechnic Institute, but it is decoupled from the university by design. If you would like to get YACS set up at your school, please [contact us](mailto:yacsrpi@gmail.com). We are very eager to expand!

YACS is primarily developed within [RCOS, the Rensselaer Center for Open Source](https://rcos.io), an amazing organization at RPI that aims to facilitate open source education and solve societal problems. However, other developers and universities are strongly encouraged to contribute to and influence the direction of this project.

Visit [our blog](https://yacsblog.wordpress.com/), [pull requests](https://github.com/YACS-RCOS/yacs/pulls), and [issues page](https://github.com/YACS-RCOS/yacs/issues) for development updates and information.

# YACS Status, Architecture and Extensions
We are currently working towards a microservice architecture to enhance extensibility and decrease coupling between the core YACS project and any universities that implmenent the application. The new architecture will consist of the following core service types.

## Core Services
### yacs-api
(This repository) yacs-api is the core YACS API. It is written using Ruby on Rails. It provides a centralized, hierarchal interface for your university's course-related data. It holds and provides data on a university's schools, departments (subjects), courses, sections, and meeting times. In addition, it provides an interface for the scheduling algorithm, and can generate valid schedule combinations given a list of selections. All rivers flow through yacs-api. See [API Docs](#api-docs) for more information.
[Repository](https://github.com/YACS-RCOS/yacs)
### yacs-web
(Currently this repository, but moving to its own eventually). yacs-web is the YACS web frontend. It is written in VanillaJS with a side of Handlebars. It provides an easy-to-use web interface for browsing, searching, selecting, and scheduling courses. It currently uses the Rails asset pipeline for compilation and minification, however all dependencies on the backend have been removed, and it will eventually be moved to its own repository with a modern Javascript tool chain.
[Repository](https://github.com/YACS-RCOS/yacs)
### yacs-catalog
In development; near complete. yacs-catalog pulls and aggregates course and section data from a university's data sources, of which there are often many. This service exposes a simple HTTP API and is easily replaceable. If you wish to deploy YACS to your university, you will likely have to modify or replace this service. The example included here to be used at RPI aggregates data from Acalog ACMS and Ellucien Banner. If your university also uses these services, then you may not have to write any code to get YACS working!
[Repository](https://github.com/YACS-RCOS/yacs-catalog-service-rpi)
### yacs-updater
In development; near complete. yacs-updater is a simple service that pulls data from the yacs-catalog service and pushes it to the yacs-api on a regular interval. This service is easily interchangeable if it does not meed the needs of your university's existing software ecosystem, but should be sufficient for most. This service, combined with the yacs-catalog service, is designed to replace the existing background job in yacs-api that pulls data from several sources and updated the database accordingly. See the [admin-api](https://github.com/YACS-RCOS/yacs/tree/admin-api) branch of this repository for the secure POST/PUT/DELETE extensions to the YACS API in progress.
[Repository](https://github.com/YACS-RCOS/yacs-updater-service)
### yacs-admin
In early development. yacs-admin is a secure admin panel that will allow administrators (student maintainers, registrar staff, sysadmins, etc.) to manually edit and add courses and sections and prevent changes from being overwritten by automatic updates. This service will use the same extended YACS API as yacs-updater.
[Repository](https://github.com/kburk1997/yacs-admin)

## Other Dependencies
YACS depends on PostgreSQL, Redis, nginx and Solr. The included docker-compose file specifies images and configurations to containerize and link these dependencies, so you don't need to install or configure anything. A secure and omptimized nginx config is also provided.

## Projects that integrate with YACS
These are examples of projects that have been developed by other independant teams and either integrate with YACS or use its API. These are great examples of what can be accomplished with open, accessible academic data.

### suggestr
Suggestr is a machine learning based application that suggests courses to students based on the courses they have taken and the course paths of other students. 
[Repository](https://github.com/luciencd/suggestr)
### yacs-notifier
In early development. yacs-notifier will allow students to register to receive notifications when specific courses and sections become available (i.e., when there are available seats). Once it is at a reasonable stage of completion, it will be integrated into the yacs-web core frontend
### alexa integration
An Amazon Alexa app that uses the YACS api to query available seats and check for conflicts between courses. We plan to extend this to support additional queries in the near future.
[Repository](https://github.com/luciencd/alexatutorial)

There are several other projects out there that use the YACS API. If you'd like yours listed here, submit a pull request to this README!

# API Docs
YACS includes a JSON API that is public by default. This can very useful for providing a standardized way of programatically accessing the data in your school's course catalog and/or student information system if no such resource exists or is publicly accessible. The API includes course searching and filtering, as well as the scheduling feature. Documentation can be found in [the wiki](https://github.com/YACS-RCOS/yacs/wiki/API-Docs). There is also a [Swagger Specification](https://app.swaggerhub.com/api/YACS/YACS/5.0.0) that is in development.

# Setup
YACS uses Docker and docker-compose to make setting up a breeze! See the wiki for instructions to run the app and its dependencies [in development](https://github.com/YACS-RCOS/yacs/wiki/Setting-Up-Your-Dev-Environment) and [deploy YACS at your own school](https://github.com/YACS-RCOS/yacs/wiki/Deploying-YACS-at-Your-School). This may look like a lot of services to manage, but docker-compose and the provided scripts make it trivial to deploy YACS on a single host and update the application!

# Mobile
The YACS web frontend is mobile compatible but not mobile friendly. We aim to make the existing frontend mobile friendly as well as provide native experiences.

iOS and Android apps are in development. They can be found at Our iOS app repository can be found at https://github.com/YACS-RCOS/YACSiOS and https://github.com/YACS-RCOS/YACSAndroid respectively.

# Contributing
We encourage you to [create issues](https://github.com/YACS-RCOS/yacs/issues/new) and contribute to YACS! To contribute [fork the repo](https://github.com/YACS-RCOS/yacs/fork), comment on an issue, and submit a pull request to the [staging](https://github.com/YACS-RCOS/yacs/tree/staging) branch. Build checks and code reviews are required before merging. Once changes are verified in the staging branch, they will be merged into master and a new release will be created.

# Code of Conduct
YACS is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant code of conduct](http://contributor-covenant.org/).

# License
YACS is an open source project released under the terms of the [MIT License](https://opensource.org/licenses/MIT)
