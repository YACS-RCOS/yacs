import { Component } from '@angular/core';

const FLAVORTEXTS: string[] = [
  'A grass-fed, free-ranged',
  'The best',
  'Yet another',
  'An experimental GMO',
  'A radioactive',
  'A zombie',
  'An',
  'A pizza-funded',
  'An ice tea powered',
  'A lone computer runs this',
  'Some guy\'s',
  'A (somewhat) tested',
  'Batteries not included in this',
  'A GMO-free',
  'A mutant',
  'The second biggest',
  'A longstanding',
  'A Red Hat-supported',
  'A 100% all natural',
  'A third-generation',
  'A heavily debugged',
  'A filmed on location',
  'A Y2K compliant',
  'A vortigaunt maintained',
  'Degree not included in this',
  '9/10 mindless drones recommend this',
  'Ask your doctor before using this',
  'Far more work than necessary went into this',
  'An officially cursed',
  'A caffeine-powered',
  'Better than your mother\'s',
  'A kid-tested, mother-approved',
  'A science-backed',
  'A somewhat broken',
  'A PHP-free',
  'A dog-friendly',
  'A cat-approved',
  'A dishwasher-safe',
  'An employee-owned',
  'Don\'t restart your computer while using this',
  'A painstakingly crafted',
  'A geothermal powered',
  'A mighty fine',
  'A hydrophobic'
];

@Component({
  selector: 'footer',
  templateUrl: './component.html',
  styleUrls: ['component.scss']
})

export class FooterComponent {
  flavortext: string;

  constructor() {
    let index = Math.floor(Math.random() * FLAVORTEXTS.length);
    this.flavortext = FLAVORTEXTS[index];
  }
}
