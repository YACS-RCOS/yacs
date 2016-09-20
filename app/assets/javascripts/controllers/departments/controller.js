/**
 * Home page view. Displays departments by school.
 * If no arguments are given, the view will use the preloaded Schools
 * @param {HTMLElement} target- The element in which this view should be rendered
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.departments = function (target) {
  var data = { schools: Yacs.models.schools.store.all };
  target.innerHTML = HandlebarsTemplates.departments(data);
};
