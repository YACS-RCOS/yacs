Yacs.views.departments = function (data) {
  data = data || { courses: Yacs.models.departments.store.all };
  var html = HandlebarsTemplates.departments(data);
  document.querySelector('#content').innerHTML = html;
};

Yacs.on('click', 'department', function (dept) {
  document.querySelector('#content').innerHTML = "";
  department_id = dept.dataset.id;
  Yacs.models.courses.query({
    department_id: department_id,
    show_sections: true },
    function (data, success) {
      if (success)
        Yacs.views.courses(data);
    });
});
