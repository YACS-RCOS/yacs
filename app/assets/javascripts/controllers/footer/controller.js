Yacs.views.footer = function (target) {

  var selectFlavorText=function(){
    var choices = [
      'A grass-fed, free-ranged',
      'The best',
      'Yet another',
      "An experimental, GMO'd",
      'A radioactive',
      'A zombie',
      'An',
      'A pizza-funded',
      'An ice tea powered',
      'A lone computer runs this',
      "Some guy's",
      'A (somewhat) tested',
      'Batteries not included in this',
      'A GMO-free',
      'A mutant',
      'The second biggest',
      'A longstanding',
      "A Red Hat-supported",
      "A 100% all natural",
      "A third-generation",
      "A heavily debugged",
      "A filmed on location",
      "A Y2K compliant",
      "A vortigaunt maintained",
      "Degree not included in this",
      "Clippy's favorite",
      "9/10 mindless drones recommend this",
      "Ask your doctor before using this",
      "Far more work than necessary went into this",
      "Report Any Issues to the Data Mouse for this",
      "An officially cursed",
      "A caffeine-powered",
      "Better than your mother's",
      "A kid-tested, mother-approved",
      "A science-backed",
      "A somewhat broken",
      "An official dad approved",
      "A PHP-free",
      "A dog-friendly",
      "A cat-approved",
      "A dishwasher-safe"
    ];

    var index = Math.floor(Math.random()*choices.length);
    return choices[index];

  };
  var data = {
    flavortext: selectFlavorText(),
    yacsversion: '0.9'
  };

  Yacs.render(target, 'footer', data);

};