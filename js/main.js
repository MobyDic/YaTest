'use strict';

var DATA_URL = './../data.json';
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

// if(JSON.parse(localStorage.get(program)))

function renderContainer(array) {
  schoolContainer.innerText = '';

  array.forEach(function (school) {
    schoolContainer.appendChild(window.schoolRender(school));
  });
}


// RENDER
window.schoolRender = (function () {
  var schoolTemplate = document.querySelector('#school-template');
  var schoolElement = schoolTemplate.content.querySelector('.school__item');
  var options = {
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
  };


  return function (data) {
    var newSchoolElement = schoolElement.cloneNode(true);
    var schoolHeader = newSchoolElement.querySelector('.school__header');
    var schoolLection = newSchoolElement.querySelector('.school__lection');
    var schoolTeacher = newSchoolElement.querySelector('.school__teacher');
    var schoolDate = newSchoolElement.querySelector('.school__date');
    var schoolLocation = newSchoolElement.querySelector('.school__location');
    var dateLection = new Date(data.date);

    setSchoolMod(data.streams)
    setClassCompleted(data)

    function setClassCompleted(data) {
      if(data.completed) {
        newSchoolElement.classList.add('school__item--completed');
      }
    }

    function setSchoolMod(data) {
      for(var i=0; i < data.length; i++) {
        var newSchoolTitle = document.createElement('h2');

        newSchoolTitle.classList.add('school__streams', 'school__streams--' + data[i]);
        newSchoolTitle.innerText = data[i];
        newSchoolElement.classList.add('school__item--' + data[i]);
        schoolHeader.appendChild(newSchoolTitle);
        }
      }


    schoolLection.textContent = data.lection;
    schoolTeacher.textContent = data.teacher;
    schoolDate.textContent = dateLection.toLocaleString('ru', options);
    schoolLocation.textContent = data.location;

    return newSchoolElement;
  };
})();
// =============================END RENDER==================================


// FILTER
window.filtersControl = (function() {
  var filterControlStreams = document.querySelector('#filter-control-streams');
  var filterControlTeachers = document.querySelector('#filter-control-teachers');
  var currentFilters = [];
  var filterList = {
    streams: {
      frontend: 'frontend',
      mobdev: 'mobdev',
      design: 'design'
    },
    teachers: {
      mVasilev: 'Максим Васильев',
      dDushkin: 'Дмитрий Душкин',
      iKarev: 'Иван Карев'
    }
  }

  return function(data) {
    var filters = data;
    filterControlStreams.addEventListener('change', onFiltersClick);
    filterControlTeachers.addEventListener('change', onFiltersClick);

    function onFiltersClick(e) {
      renderSchoolByFilter(e.target.value)
    }

    function renderSchoolByFilter(filterValue) {
      switch (filterValue) {
        case 'all':
          currentFilters = filters;
          break;
        case 'frontend':
          currentFilters = getSchoolFilter(filterList.streams.frontend, 'streams');
          break;

        case 'mobdev':
          currentFilters = getSchoolFilter(filterList.streams.mobdev, 'streams');
          break;

        case 'design':
          currentFilters = getSchoolFilter(filterList.streams.design, 'streams');
          break;
        case 'mVasilev':
          currentFilters = getSchoolFilter(filterList.teachers.mVasilev, 'teacher');
          break;
        case 'dDushkin':
          currentFilters = getSchoolFilter(filterList.teachers.dDushkin, 'teacher');
          break;
        case 'iKarev':
          currentFilters = getSchoolFilter(filterList.teachers.iKarev, 'teacher');
          break;
      };
      renderContainer(currentFilters);
    }

    function getSchoolFilter(value, filterItem) {
      currentFilters = [];
      filters.forEach(function(item) {
        for (var i=0; i < item[filterItem].length; i++) {
          if (item[filterItem][i] === value) {
            currentFilters.push(item);
          }
        }
      });
      return currentFilters;
    }
  };
})();
// =============================END FILTER==================================

//OVERLAY
window.toggleOverlay = (function() {
  return function() {
    var schoolBlock = document.querySelector('.school');
    var closeOverlayBtn = document.querySelector('.overlay__button');
    var overlay = document.querySelector('.overlay');
    schoolBlock.addEventListener('click', onOverylayClick);
    closeOverlayBtn.addEventListener('click', onOverylayClick);

    function onOverylayClick(e) {
      e.preventDefault();

      if(e.target.classList.contains('school__teacher') || e.target.classList.contains('overlay__button')) {
        overlay.classList.toggle('invisible');
      }
    }
  }

})();
// =============================END OVERLAY==================================
