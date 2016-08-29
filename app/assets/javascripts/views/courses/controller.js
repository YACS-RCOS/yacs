Yacs.views.courses = function (target, params) {
  params.show_sections = params.show_periods = true;
  Yacs.models.courses.query(params, function (data, success) {
    if (success)
      Yacs.views.partials.courses(target, data);
  });
};
