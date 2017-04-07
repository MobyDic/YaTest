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

window.load(DATA_URL, function(data) {
  renderContainer(data.program);
});

function renderContainer(array) {
  schoolContainer.innerText = '';

  array.forEach(function (picture) {
    schoolContainer.appendChild(window.schoolRender(picture));
  });
}


// RENDER
window.schoolRender = (function () {
  var schoolTemplate = document.querySelector('#school-template');
  var schoolElement = schoolTemplate.content.querySelector('.school__item');


  return function (data) {
    var newSchoolElement = schoolElement.cloneNode(true);
    var schoolHeader = newSchoolElement.querySelector('.school__header');
    var schoolLection = newSchoolElement.querySelector('.school__lection');
    var schoolTeacher = newSchoolElement.querySelector('.school__teacher');
    var schoolDate = newSchoolElement.querySelector('.school__date');
    var schoolLocation = newSchoolElement.querySelector('.school__location');

    setSchoolMod(data.title)

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
    schoolDate.textContent = data.date;
    schoolLocation.textContent = data.location;

    return newSchoolElement;
  };
})();
// =============================END RENDER==================================


// FILTER
(function() {
var filter = document.querySelector('.filtres__control');

filter.addEventListener('click', onFiltersClick);

function onFiltersClick(e) {
  renderSchoolByFilter(e.target.id)
}

function renderSchoolByFilter(filterId) {

}

})();
