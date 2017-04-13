'use strict';

// localStorage.clear();

(function() {
  var mobilizationData;
  if(localStorage.length != 0) {
    mobilizationData = JSON.parse(localStorage.getItem('mobilization'));
  } else {
    window.load(DATA_URL, function(data) {
    mobilizationData = data;
    setLocalStorage(mobilizationData);
    })
  }

  window.mobilization = {
    filteredData: [],
    getLectures: getFilteredLectures,
    addLecture: addNewLecture
  };

  function setLocalStorage(obj) {
    localStorage.setItem('mobilization', JSON.stringify(obj));
  }

  function addNewLecture(obj) {
    mobilizationData.lectures.push(obj);
    setLocalStorage(mobilizationData);
  }

  function getFilteredLectures(obj) {
    if(obj) {
      for(var key in obj) {
        return mobilizationData.lectures.filter(function(filterItem) {
          if(Array.isArray(filterItem[key])) {
            return filterItem[key].indexOf(obj[key]) !== -1;
          } else {
            return filterItem[key] === obj[key];
          }
        });
      }
    }
    else {
      return mobilizationData.lectures;
    }
  }
})();
