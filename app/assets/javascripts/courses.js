Handlebars.registerHelper('department_code', function (id) {
  return new Handlebars.SafeString(Yacs.models.departments.store.id[id].code);
});

Handlebars.registerHelper('range', function (min, max) {
  var credits = max;
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

Handlebars.registerHelper('subtract', function (a, b) {
  return new Handlebars.SafeString(a - b);
});

Yacs.views.courses = function (data) {
  var html = HandlebarsTemplates.courses(data);
  document.querySelector('#content').innerHTML = html;
};
