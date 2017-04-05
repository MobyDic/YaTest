'use strict';

var DATA_URL = './../data.json';
var schoolContainer = document.querySelector('.school');

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
    var schoolTitle = schoolHeader.querySelector('school__title')
    var schoolLection = newSchoolElement.querySelector('.school__lection');
    var schoolTeacher = newSchoolElement.querySelector('.school__teacher');
    var schoolDate = newSchoolElement.querySelector('.school__date');
    var schoolLocation = newSchoolElement.querySelector('.school__location');

    setSchoolMod(data.title)

    function setSchoolMod(data) {
      for(var i=0; i < data.length; i++) {
        console.log(data[i])
        // schoolTitle.innerText = data[i];
        // schoolHeader.appendChild(schoolTitle);
        switch (data[i]) {
          case 'фронтенд':
            newSchoolElement.classList.add('school__item--frontend');
            break;
          case 'мобильные':
            newSchoolElement.classList.add('school__item--mobile');
            break;
          case 'дизайн':
            newSchoolElement.classList.add('school__item--design');
            break;
        }
      }
    }

    schoolLection.textContent = data.lection;
    schoolTeacher.textContent = data.teacher;
    schoolDate.textContent = data.date;
    schoolLocation.textContent = data.location;

    return newSchoolElement;
  };
})();
