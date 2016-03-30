Handlebars.registerHelper('department_code', function (id) {
  return new Handlebars.SafeString(Yacs.models.departments.store.id[id]);
});

Handlebars.registerHelper('range', function (min, max) {
  return new Handlebars.SafeString(min == max ? max : min + '-' + max);
});

Handlebars.registerHelper('join', function (ar) {
  return new Handlebars.SafeString(arr.join(', '));
});

Handlebars.registerHelper('subtract', function (a, b) {
  return new Handlebars.SafeString(a - b);
});