'use strict';

Handlebars.registerHelper('department_code', function (id) {
  return new Handlebars.SafeString(Yacs.models.departments.store.id[id].code);
});

Handlebars.registerHelper('course_credits', function (c) {
  var outString = '';

  // render "credit(s)" properly
  if (c.min_credits === c.max_credits) {
    outString = c.max_credits + ' credit' + (c.max_credits === 1 ? '' : 's');
  }
  else {
    outString = c.min_credits + '-' + c.max_credits + ' credits';
  }
  return new Handlebars.SafeString(outString);
});

Handlebars.registerHelper('formatted_description', function (description) {
  if (description === '') {
    return new Handlebars.SafeString('Description not available...');
  }
  return new Handlebars.SafeString(description);
});

Handlebars.registerHelper('join', function (arr) {
  return new Handlebars.SafeString(arr.join(', '));
});

Handlebars.registerHelper('seats_available', function (s) {
  var remaining = s.seats - s.seats_taken;
  return new Handlebars.SafeString(remaining);
});

Handlebars.registerHelper('closed_status', function (s) {
  return new Handlebars.SafeString(s.seats > 0 && s.seats_taken >= s.seats ? 'closed' : '');
});

Handlebars.registerHelper('day_name', function (n) {
  return new Handlebars.SafeString(['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][n]);
});

Handlebars.registerHelper('time_range', function (start, end) {
  return new Handlebars.SafeString([start, end].map(function (time) {
    var hour = Math.floor(time / 100);
    var ampm = hour >= 12 ? 'p' : 'a';

    if (hour > 12) {
      hour -= 12;
    }
    else if (hour === 0) {
      hour = 12;
    }

    var minutes = time % 100;
    if (minutes === 0) {
      // don't show minutes at all
      return hour + ampm;
    }
    else if (minutes <= 9) {
      minutes = '0' + minutes;
    }

    return hour + ':' + minutes + ampm;
  }).join('-'));
});
