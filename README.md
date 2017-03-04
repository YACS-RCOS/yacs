# YACS - Yet Another Course Scheduler
[![Build Status](https://img.shields.io/travis/YACS-RCOS/yacs/master.svg)](https://travis-ci.org/YACS-RCOS/yacs)
[![Coverage Status](https://img.shields.io/coveralls/YACS-RCOS/yacs.svg)](https://coveralls.io/github/YACS-RCOS/yacs?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/YACS-RCOS/yacs.svg)](https://codeclimate.com/github/YACS-RCOS/yacs)

Simple, Sane Course Scheduling.
YACS is a web-based course scheduler with an emphasis on usability.
YACS is 100% RPI home-grown and hosted. To use it, visit https://yacs.cs.rpi.edu

Visit [our blog](https://yacsblog.wordpress.com/) for more updates and information.

iOS and Android apps are in development. They can be found at Our iOS app repository can be found at https://github.com/YACS-RCOS/YACSiOS and https://github.com/YACS-RCOS/YACSAndroid respectively.

## YACS Architecture and Extensions

We are currently working towards a microservice architecture to enhance extensibility and decrease coupling between the core YACS project and any universities that implmenent the application. The new architecture will consist of the following core service types.

### Core Services
#### [yacs-api](https://github.com/YACS-RCOS/yacs)
(This repository) The core YACS API. 
#### [yacs-web](https://github.com/YACS-RCOS/yacs)
(Currently this repository, but moving to its own eventually).
#### [yacs-catalog](https://github.com/YACS-RCOS/yacs-catalog-service-rpi)
In development; near complete. yacs-catalog pulls and aggregates course and section data from a university's data sources, of which there are often many. This service exposes a simple HTTP API and is easily replaceable. If you wish to deploy YACS to your university, you will likely have to modify or replace this service. The example included here to be used at RPI aggregates data from Acalog ACMS and Ellucien Banner. If your university also uses these services, then you may not have to write any code to get YACS working!
#### [yacs-updater](https://github.com/YACS-RCOS/yacs-updater-service)
In development; near complete. yacs-updater is a simple service that pulls data from the yacs-catalog service and pushes it to the yacs-api on a regular interval. This service is easily interchangeable if it does not meed the needs of your university's existing software ecosystem, but should be sufficient for most. This service, combined with the yacs-catalog service, is designed to replace the existing background job in yacs-api that pulls data from several sources and updated the database accordingly. See the [admin-api](https://github.com/YACS-RCOS/yacs/tree/admin-api) branch of this repository for the secure POST/PUT/DELETE extensions to the YACS API in progress.
#### [yacs-admin](https://github.com/kburk1997/yacs-admin)
In early development. yacs-admin is a secure admin panel that will allow administrators (student maintainers, registrar staff, sysadmins, etc.) to manually edit and add courses and sections and prevent changes from being overwritten by automatic updates. This service will use the same extended YACS API as yacs-updater.

### Projects that integrate with YACS
These are examples of projects that have been developed by other independant teams and either integrate with YACS or use its API. These are great examples of what else YACS makes possible.

#### [suggestr](https://github.com/luciencd/suggestr)
Suggestr is a machine learning based application that suggests courses to students based on the courses they have taken and the course paths of other students. 

#### yacs-notifier
In early development. yacs-notifier will allow students to register to receive notifications when specific courses and sections become available (i.e., when there are available seats). Once it is at a reasonable stage of completion, it will be integrated into the yacs-web core frontend.

#### [alexa integration](https://github.com/luciencd/alexatutorial)
An Amazon Alexa app that uses the YACS api to query available seats and check for conflicts between courses. We plan to extend this to support additional queries in the near future.

There are several other projects in development that integrate with YACS. If you'd like yours listed here, let us know!

## API

YACS includes a JSON API that is public by default. This can very useful for providing a standardized way of programatically accessing the data in your school's course catalog and/or student information system if no such resource exists or is publicly accessible. The API includes course searching and filtering, as well as the scheduling feature. Documentation can be found in [the wiki](https://github.com/YACS-RCOS/yacs/wiki/API-Docs).

## Setup

YACS uses Docker and docker-compose to make setting up a breeze! See the wiki for instructions to run the app and its dependencies [in development](https://github.com/YACS-RCOS/yacs/wiki/Setting-Up-Your-Dev-Environment) and [deploy YACS at your own school](https://github.com/YACS-RCOS/yacs/wiki/Deploying-YACS-at-Your-School).

## Contributing

We encourage you to [create issues](https://github.com/YACS-RCOS/yacs/issues/new) and contribute to YACS! To contribute [fork the repo](https://github.com/YACS-RCOS/yacs/fork), comment on an issue, and submit a pull request to the [staging](https://github.com/YACS-RCOS/yacs/tree/staging) branch. Build checks and code reviews are required before merging. Once changes are verified in the staging branch, they will be merged into master and a new release will be created.

## Code of Conduct

YACS is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant code of conduct](http://contributor-covenant.org/).

## License
YACS is an open source project released under the terms of the [MIT License](https://opensource.org/licenses/MIT)

## Status
