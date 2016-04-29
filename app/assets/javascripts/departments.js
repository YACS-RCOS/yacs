/**
 * Home page view. Displays departments by school.
 * If no arguments are given, the view will use the preloaded Schools
 * @param {Object} [data] - Object containing Schools model collection
 * @param {Model[]} data.schools - Schools model collection
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.departments = function (data) {
  data = data || { schools: Yacs.models.schools.store.all };
  // render data out through departments template
  Yacs.setContents(HandlebarsTemplates.departments(data));
  // add event listener to departments
  var nodes = document.getElementsByTagName('department');
  for(var i=0; i<nodes.length; ++i) {
    Yacs.on('click', nodes[i], function(dept) {
      // wipe contents and make query for that department id
      Yacs.clearContents();
      Yacs.models.courses.query(
        { department_id: dept.dataset.id,
          show_sections: true },
        function (data, success) {
          if (success) {
            Yacs.views.courses(data);
          }
        });
    });
  }
};
