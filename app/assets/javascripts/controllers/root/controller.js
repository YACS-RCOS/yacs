// TODO: Move index.html to hbs template

/**
 * Root view of YACS. Controls site navigation and search
 * @param {HTMLElement} target- The element in which this view should be rendered
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.root = function (target) {
  var searchbar = document.getElementById('searchbar');

  Yacs.router.define('/', function (params) {
    Yacs.views.departments(target, params);
  });
  Yacs.router.define('/courses', function (params) {
    Yacs.views.courses(target, params);
  });
  Yacs.router.define('/schedules', function (params) {
    Yacs.views.schedules(target, params);
  });

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
          Yacs.views.departments(target);
        searchbar.focus();
      } else if (key == 13) {
        if (searchbar.value) {
          Yacs.router.visit('/courses?search=' + searchbar.value);
        } else {
          Yacs.router.visit('/');
        }
      } else if ((key == 8 || key == 46) && searchbar.value.length <= 1) {
        Yacs.router.visit('/');
      }
    }
  });

  // Yacs.on('click', document.body, function () { searchbar.focus() });
  // TODO lol previous line was a bit of an oversight, must emulate caret

  searchbar.focus();

  Yacs.models.schools.preload(function () {
    Yacs.router.init();
  });
};
