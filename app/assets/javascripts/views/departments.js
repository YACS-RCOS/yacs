/**
 * Home page view. Displays departments by school.
 * If no arguments are given, the view will use the preloaded Schools
 * @param {Object} [data] - Object containing Schools model collection
 * @param {Model[]} data.schools - Schools model collection
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.departments = function (target, data) {
  data = data || { schools: Yacs.models.schools.store.all };
  target.innerHTML = HandlebarsTemplates.departments(data);

  // add event listener to departments
  target.getElementsByTagName('department').forEach(function (department) {
    Yacs.on('click', department, function(d) {
      Yacs.models.courses.query(
        { department_id: d.dataset.id,
          show_sections: true,
          show_periods: true },
        function (data, success) {
          if (success) {
            Yacs.views.courses(target, data);
          }
      });
    });
  });
};
