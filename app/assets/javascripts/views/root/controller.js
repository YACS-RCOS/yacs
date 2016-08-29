// TODO: Move index.html to hbs template

/**
 * Root view of YACS. Controls site navigation and search
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.root = function () {
  var homeButton = document.getElementById('page-title');
  var searchbar = document.getElementById('searchbar');
  var scheduleButton = document.getElementById('schedule-btn');
  var content = document.getElementById('content');

  Yacs.on('click', homeButton, function () { Yacs.views.departments(content); });
  Yacs.on('click', scheduleButton, function () { Yacs.views.schedule(content); });

  /**
   * Handle input destined for search bar. Assume all text input is intended
   * for for the search bar, and focus the search bar accordingly.
   * If the search bar is cleared, show the departments (home) view.
   * When a query is submitted by pressing enter, show the courses
   * matching the given search query.
   */
  Yacs.on('keydown', document, function (elem, event) {
    var key = event.keyCode;
    if (!(event.ctrlKey || event.metaKey)) {
      if ((key >= 48 && key <= 105) || key == 32) {
        if (key == 127 && searchbar.value.length <= 1)
          Yacs.views.departments(content);
        searchbar.focus();
      } else if (key == 13) {
        if (searchbar.value) {
          Yacs.models.courses.query({ search: searchbar.value,
                                      show_sections: true,
                                      show_periods: true },
            function (data, success) {
              if (success)
                Yacs.views.courses(content, data);
          });
        } else {
          Yacs.views.departments(content);
        }
      } else if ((key == 8 || key == 46) && searchbar.value.length <= 1) {
        Yacs.views.departments(content);
      }
    }
  });

  // Yacs.on('click', document.body, function () { searchbar.focus() });
  // TODO lol previous line was a bit of an oversight, must emulate caret

  searchbar.focus();

  Yacs.models.schools.preload(function () {
    Yacs.views.departments(content);
  });
};
