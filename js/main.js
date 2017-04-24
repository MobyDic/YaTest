'use strict';
var objData = {
  getNumber: function() {
    return 5;
  },
  getString: function() {
    return 'string';
  },
  getFull: function() {
    return this.getString() + this.getNumber();
  }
};

var log = console.log;

var DATA_URL = 'https://alex-koshara.github.io/YaTest/js/data.json';
var schoolContainer = document.querySelector('.school');

// AJAX
window.load = (function () {
  return function (url, onLoad) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function (evt) {
      if (evt.target.status >= 200 && evt.target.status <= 400) {
        onLoad(evt.target.response);
      }
    });

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.send();
  };
})();
// =========================END AJAX======================================

window.load(DATA_URL, function(data) {
  window.uploadData = data;

  renderContainer(data);
  window.filtersControl(data);
  window.toggleOverlay();
})

function renderContainer(data) {
  schoolContainer.innerText = '';
  var lectures = data;
  if(!Array.isArray(data)) {
    lectures = data.lectures;
  }
  lectures.forEach(function (lecture) {
    schoolContainer.appendChild(window.lectureRender(lecture, data));
  });
}

// RENDER
window.lectureRender = (function () {
  var lectureTemplate = document.querySelector('#lecture-template');
  var lectureElement = lectureTemplate.content.querySelector('.lecture');
  var options = {
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
  };

  return function (lecture, data) {
    var newLectureElement = lectureElement.cloneNode(true);
    var lectureHeader = newLectureElement.querySelector('.lecture__header');
    var lectureLection = newLectureElement.querySelector('.lecture__lection');
    var lectureTeacher = newLectureElement.querySelector('.lecture__teacher');
    var lectureDate = newLectureElement.querySelector('.lecture__date');
    var lectureLocation = newLectureElement.querySelector('.lecture__location');
    var dateLection = new Date(lecture.start);

    setLectureMod(lecture.streams)
    setClassCompleted(lecture)

    function setClassCompleted(lecture) {
      if(lecture.completed) {
        newLectureElement.classList.add('lecture--completed');
      }
    }

    function setLectureMod(lecture) {
      for(var i=0; i < lecture.length; i++) {
        var newLectureTitle = document.createElement('h2');

        newLectureTitle.classList.add('lecture__streams', 'lecture__streams--' + lecture[i]);
        newLectureTitle.innerText = lecture[i];
        newLectureElement.classList.add('lecture--' + lecture[i]);
        lectureHeader.appendChild(newLectureTitle);
        }
      }

    lectureLection.textContent = lecture.lection;
    lectureTeacher.textContent = uploadData.teachers[lecture.teacher].name;
    lectureDate.textContent = dateLection.toLocaleString('ru', options);
    lectureLocation.textContent = uploadData.meetingRooms[lecture.room].title;

    return newLectureElement;
  };
})();
// =============================END RENDER==================================

// FILTER
window.filtersControl = (function() {
  var filterControlStreams = document.querySelector('#filter-control-streams');
  var filterControlTeachers = document.querySelector('#filter-control-teachers');
  var filteredLectures = [];
  var FILTER_LIST = {
    streams: {
      frontend: 'frontend',
      mobdev: 'mobdev',
      design: 'design'
    },
    teachers: {
      mVasilev: 'mVasilev',
      dDushkin: 'dDushkin',
      iKarev: 'iKarev'
    }
  }

  return function(data) {

    filterControlStreams.addEventListener('change', onFiltersClick);
    filterControlTeachers.addEventListener('change', onFiltersClick);

    function onFiltersClick(e) {
      renderLectureByFilter(e.target.name, e.target.value)
    }

    function renderLectureByFilter(key, value) {
      if(value) {
        filteredLectures = getFilteredLectures(key, value);
      } else {
        filteredLectures = uploadData;
      }
      renderContainer(filteredLectures);
    }

    function getFilteredLectures(key, value) {
      return data.lectures.filter(function(lecture) {
        if (Array.isArray(lecture[key])) {
          return lecture[key].indexOf(value) !== -1;
        } else {
          return lecture[key] === value;
        }
      });
    }
  };
})();
// =============================END FILTER==================================

//OVERLAY
window.toggleOverlay = (function() {
  return function() {
    var closeOverlayBtn = document.querySelector('.overlay__button');
    var overlay = document.querySelector('.overlay');

    schoolContainer.addEventListener('click', onOverylayClick);
    closeOverlayBtn.addEventListener('click', onOverylayClick);

    function onOverylayClick(e) {
      e.preventDefault();

      if(e.target.classList.contains('lecture__teacher') || e.target.classList.contains('overlay__button')) {
        overlay.classList.toggle('invisible');
      }
    }
  }

})();
// =============================END OVERLAY==================================
