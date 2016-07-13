Handlebars.registerHelper('department_code', function (id) {
  return new Handlebars.SafeString(Yacs.models.departments.store.id[id].code);
});

Handlebars.registerHelper('course_credits', function (c) {
  var outString = '';
  // render "credit(s)" properly
  if (c.min_credits != c.max_credits) {
    outString = c.min_credits + '-' + c.max_credits + ' credits';
  }
  else {
    outString = c.max_credits + ' credit' + (c.max_credits == 1 ? '' : 's');
  }
  return new Handlebars.SafeString(outString);
});

Handlebars.registerHelper('join', function (arr) {
  return new Handlebars.SafeString(arr.join(', '));
});

Handlebars.registerHelper('course_seats', function (c) {
  var remaining = c.seats - c.seats_taken;
  return new Handlebars.SafeString(remaining);
});

Handlebars.registerHelper('selected_status', function (s) {
  return new Handlebars.SafeString(Yacs.user.hasSelection(s.id) ? 'selected' : '');
});

Handlebars.registerHelper('day_name', function (n) {
  return new Handlebars.SafeString(['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][n]);
});

Handlebars.registerHelper('time_range', function (start, end) {
  return new Handlebars.SafeString([start, end].map(function (time) {
    var hour = Math.floor(time / 100);
    var ampm = hour > 12 ? 'p' : 'a';
    hour = hour > 12 ? hour - 12 : hour == 0 ? 12 : hour;
    var minutes = time % 100;
    minutes = minutes > 9 ? minutes : minutes == 0 ? '' : '0' + minutes;
    return hour + (minutes ? ':' + minutes : '') + ampm;
  }).join('-'));
});

/**
 * Courses view. Displays courses and their sections
 * @param {Object} data - Object containing Courses model collection
 * @param {Model[]} data.courses - Courses model collection
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.courses = function (data) {
  var html = HandlebarsTemplates.courses(data);
  Yacs.setContents(html);

  var isCourseSelected = function (course) {
    var isSelected = true;
    course.querySelectorAll('section').forEach(function (s) {
      if (!Yacs.user.hasSelection(s.dataset.id)) isSelected = false;
    });
    return isSelected;
  };

  var requireTruncation = function (desc, showButton) {
    var overflowed = desc.classList.contains("truncated");
    var overflowing = desc.scrollHeight > 38;
    if (overflowed != overflowing) {
      console.log(overflowed, overflowing, desc.innerHTML);
      desc.classList[overflowing ? 'add' : 'remove']("truncated");
      showButton.innerHTML = overflowing ? 'show' : 'hide';
      showButton.style.display = overflowing ? 'block' : 'none';
    }
  };

  // Add event listeners to sections
  document.getElementsByTagName('section').forEach(function (s) {
    Yacs.on('click', s, function (section) {
      /* If there happens to be a mismatch between the data and the display,
         we care about the data - e.g. if the id is in the array, we will
         always deselect it regardless of whether it was being rendered as
         selected or not.
      */
      var sid = section.dataset.id;
      if (Yacs.user.removeSelection(sid)) {
        section.classList.remove('selected');
      }
      else {
        Yacs.user.addSelection(sid);
        section.classList.add('selected');
      }
      var course = section.closest('course');
      course.classList[isCourseSelected(course) ? 'add' : 'remove']('selected');
    });
    if (Yacs.user.hasSelection(s.dataset.id)) s.classList.add('selected');
  });

  /* This does not actually add or remove sections from the selected list.
     TODO: implement this
  */
  document.getElementsByTagName('course').forEach(function (c) {
    Yacs.on('click', c.getElementsByTagName('course-info')[0], function (ci) {
      var isSelected = isCourseSelected(c);
      c.getElementsByTagName('section').forEach(function (s) {
        if (isSelected) {
          s.classList.remove('selected');
          Yacs.user.removeSelection(s.dataset.id);
        } else {
          s.classList.add('selected');
          Yacs.user.addSelection(s.dataset.id);
        }
      });
      c.classList[isSelected ? 'remove' : 'add']('selected');
    });
    if (isCourseSelected(c)) c.classList.add('selected');

    var desc = c.querySelector('course-description');
    var showButton = c.querySelector('show-hide-button');
    Yacs.on('click', showButton, function (showButton,event) {
      var descTruncated = desc.classList.contains("truncated");
      desc.classList[descTruncated ? 'remove' : 'add']("truncated");
      showButton.innerHTML = descTruncated ? 'hide' : 'show';
      event.stopPropagation();
    });
    requireTruncation(desc, showButton);
  });

  var resizingFxn;
  window.addEventListener("resize", function () {
    console.log("resizing");
    clearTimeout(resizingFxn);
    resizingFxn = setTimeout(function () {
      console.log("ended resizing");
      document.querySelectorAll("course").forEach(function (c) {
        var desc = c.querySelector('course-description');
        var showButton = c.querySelector('show-hide-button');
        requireTruncation(desc, showButton);
      });
    }, 100);
  });
};
