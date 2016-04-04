Handlebars.registerHelper('department_code', function (id) {
  return new Handlebars.SafeString(Yacs.models.departments.store.id[id].code);
});

Handlebars.registerHelper('render_credits', function (min, max) {
  var outString = '';
  // render "credit(s)" properly
  if(min < max) {
    outString = min + '-' + max + ' credits';
  }
  else {
    outString = max + ' credit' + (max === 1 ? 's' : '');
  }
  return new Handlebars.SafeString(outString);
});

Handlebars.registerHelper('join', function (arr) {
  return new Handlebars.SafeString(arr.join(', '));
});

Handlebars.registerHelper('render_seats', function (a, b) {
  return new Handlebars.SafeString((a-b) + ' seat' + ((a-b) === 1 ? '' : 's'));
});

Yacs.views.courses = function (data) {
  var html = HandlebarsTemplates.courses(data);
  document.querySelector('#content').innerHTML = html;
};
