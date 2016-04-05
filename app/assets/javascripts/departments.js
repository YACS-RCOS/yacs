Yacs.views.departments = function (data) {
  //
  data = data || { courses: Yacs.models.departments.store.all };

  // render data out through departments template
  Yacs.setContents(HandlebarsTemplates.departments(data));
  
  // add event listener to departments
  var nodes = document.getElementsByTagName('department');
  for(var i=0; i<nodes.length; ++i) {
    Yacs.addEventListener('click', nodes[i], function(dept) {
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
