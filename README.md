# YACS - Yet Another Course Scheduler

Simple, Sane Course Scheduling.
YACS is a web-based course scheduler with an emphasis on usability.
YACS is 100% RPI home-grown and hosted. To use it, visit https://yacs.cs.rpi.edu

Visit [our blog](https://yacsblog.wordpress.com/) for more updates and information.

iOS and Android apps are in development. They can be found at Our iOS app repository can be found at https://github.com/YACS-RCOS/YACSiOS and https://github.com/YACS-RCOS/YACSAndroid respectively.

## API

YACS includes a JSON API that is public by default. This can very useful for providing a standardized way of programatically accessing the data in your school's course catalog and/or student information system if no such resource exists or is publicly accessible. The API includes course searching and filtering, as well as the scheduling feature. Documentation can be found in [the wiki](https://github.com/YACS-RCOS/yacs/wiki/API-Docs).

## Setup

YACS uses Docker and docker-compose to make setting up a breeze! See the wiki for instructions to run the app and its dependencies [in development](https://github.com/YACS-RCOS/yacs/wiki/Setting-Up-Your-Dev-Environment) and [deploy YACS at your own school](https://github.com/YACS-RCOS/yacs/wiki/Deploying-YACS-at-Your-School).

## Contributing

We encourage you to [create issues](https://github.com/YACS-RCOS/yacs/issues/new) and contribute to YACS! To contribute [fork the repo](https://github.com/YACS-RCOS/yacs/fork), comment on an issue, and submit a pull request to the [staging](https://github.com/YACS-RCOS/yacs/tree/staging) branch. Build checks and code reviews are required before merging. Once chanbged are verified in the staging branch, they will be merged into master and a new release will be created.

## Code of Conduct

YACS is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant code of conduct](http://contributor-covenant.org/).

## License
YACS is an open source project released under the terms of the [MIT License](https://opensource.org/licenses/MIT)

## Status

[![Build Status](https://img.shields.io/travis/YACS-RCOS/yacs/master.svg)](https://travis-ci.org/YACS-RCOS/yacs)
[![Coverage Status](https://img.shields.io/coveralls/YACS-RCOS/yacs.svg)](https://coveralls.io/github/YACS-RCOS/yacs?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/YACS-RCOS/yacs.svg)](https://codeclimate.com/github/YACS-RCOS/yacs)
