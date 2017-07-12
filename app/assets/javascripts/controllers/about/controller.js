/**
 * About view. A completely static page describing the motivations, goals, and history of YACS.
 * This shouldn't really need much of a controller but it's here for completeness.
 * @return {undefined}
 * @memberOf Yacs.views
 */
'use strict';

Yacs.views.about = function (target) {
  var data = {
    'current_devs': [
      {
        'name': 'Cameron Root',
        'github': 'copperwater',
        'years': 'Fall 2015 - Spring 2017'
      },
      {
        'name': 'Richi Young',
        'github': 'Bad-Science',
        'years': 'Fall 2015 - Spring 2017'
      },
      {
        'name': 'Mark Robinson',
        'github': 'robinm8',
        'years': 'Fall 2016 - Spring 2017'
      },
      {
        'name': 'Ryan Stillings',
        'github': 'rystills',
        'years': 'Fall 2016 - Spring 2017'
      },
      {
        'name': 'Ayushi Mishra',
        'github': 'YushYush',
        'years': 'Fall 2016 - Spring 2017'
      },
      {
        'name': 'Kathleen Burkhardt',
        'github': 'kburk1997',
        'years': 'Spring 2017'
      },
      {
        'name': 'Rutvik Manohar',
        'github': 'rvm2113',
        'years': 'Spring 2017'
      }
    ],
    'past_devs': [
      {
        'name': 'Jeff Hui',
        'github': 'jeffh',
        'years': 'Fall 2010 - Fall 2011'
      },
      {
        'name': 'Jinzhen Gong',
        'github': 'jinz',
        'years': 'Spring 2011 - Fall 2011'
      },
      {
        'name': 'Arijit Deb',
        'github': 'digitalninja',
        'years': 'Fall 2015'
      },
      {
        'name': 'Aesa Kamar',
        'github': 'AesaKamar',
        'years': 'Spring 2016'
      },
      {
        'name': 'Haoxin Luo',
        'github': 'HaoxinLuo',
        'years': 'Summer 2016'
      },
      {
        'name': 'James Grippo',
        'github': 'JGrippo',
        'years': 'Fall 2015 - Fall 2016'
      },
      {
        'name': 'Wyatt Kroemer',
        'github': 'wyattkroemer',
        'years': 'Spring 2016'
      }
    ]
  };
  Yacs.render(target, 'about', data);
};
