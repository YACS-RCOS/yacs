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
      "A Filmed on Location",
      "A Y2K Compliant",
      "A Vortigaunt Maintained",
      "Degree Not Included in this",
      "Clippy's Favorite",
      "9/10 Mindless Drones Recommend this",
      "Ask Your Doctor Before Using this",
      "Far More Work Than Necessary Went Into this",
      "Report Any Issues to the Data Mouse for this",
      "An Officially Cursed",
      "A caffeine-powered",
      "Better than your mother's",
      "A kid-tested, mother-approved",
      "Clarkson HATES this",
      "A science-backed",
      "A somewhat broken",
      "An official Dad Approved",
      "A PHP-free",
      "A dog-safe"
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