import { Component } from '@angular/core';

@Component({
  selector: 'about',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class AboutComponent {
  public data = {
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
      },
      {
        'name': 'Darren Lin',
        'github': 'darrendlin',
        'years': 'Summer 2017'
      },
      {
        'name': 'Emmett Hitz',
        'github': 'emmetthitz',
        'years': 'Summer 2017'
      },
      {
        'name': 'Perri Adams',
        'github': 'perribus',
        'years': 'Summer 2017'
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
}
