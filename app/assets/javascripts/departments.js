Yacs.on('click', 'department', function (event) {
  department_id = event.target.dataset.id;
  Yacs.models.courses.query({
    department_id: department_id,
    show_sections: true },
    function (courses, success) {
      
    });
});