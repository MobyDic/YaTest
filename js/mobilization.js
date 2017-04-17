'use strict';

// localStorage.clear();

(function() {
  var mobilizationData;
  if(localStorage.length != 0) {
    mobilizationData = JSON.parse(localStorage.getItem('mobilization'));
  } else {
    window.load(DATA_URL, function(data) {
    mobilizationData = data;
    setLocalStorageMobilization();
    })
  }



  function findSchoolLection(start, end, array) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var objStartDate = null;
    var objEndDate = null;
    var flagDate = true;
    var thisDay = 60000*60*24;
    return array.filter(function(filterItem) {
      objStartDate = new Date(filterItem.start);
      objEndDate = new Date(filterItem.start);


      if(flagDate && +startDate <= +objStartDate) {
        flagDate = false;
        return true;
      }
      if(!flagDate && +endDate + thisDay >= +objStartDate) {
        return true;
      }
    });
  }

  function editLecture(lectureId, obj) {
    mobilizationData.lectures.splice(lectureId, 1, obj);
    setLocalStorageMobilization();
  }

  function setLocalStorageMobilization() {
    localStorage.setItem('mobilization', JSON.stringify(mobilizationData));
  }

  function addLecture(obj) {
    if (!obj.id) {
      obj.id = mobilizationData.lectures.length;
    }
    mobilizationData.lectures.push(obj);
    setLocalStorageMobilization();
  }

  function getSchools(school) {
    if(school) {
      return mobilizationData.schools[school];
    }
    else {
      return mobilizationData.schools;
    }
  }

  function getRooms(room) {
    if(room) {
      return mobilizationData.rooms[room];
    }
    else {
      return mobilizationData.schools;
    }
  }

  function addSchool(schoolName, obj) {
    mobilizationData.schools[schoolName] = obj;
    setLocalStorageMobilization();
  }

  function addRoom(roomName, obj) {
    mobilizationData.meetingRooms[roomName] = obj;
    setLocalStorageMobilization();
  }

  function getLectures(obj) {
    var streamsLectures;
    var roomLectures;
    if(obj) {
      if(Object.keys(obj).length == 3  && obj.streams) {
        for(var key in obj) {
          streamsLectures = mobilizationData.lectures.filter(function(filterItem) {
            if(Array.isArray(filterItem.streams)) {
              return filterItem.streams.indexOf(obj.streams) !== -1;
            } else {
              return filterItem.streams === obj.streams;
            }
          });
        }
        return findSchoolLection(obj.start, obj.end, streamsLectures);
      } else  if (Object.keys(obj).length == 3  && obj.room){
        for(var key in obj) {
          roomLectures = mobilizationData.lectures.filter(function(filterItem) {
            if(Array.isArray(filterItem.room)) {
              return filterItem.room.indexOf(obj.room) !== -1;
            } else {
              return filterItem.room === obj.room;
            }
          });
        }
        return findSchoolLection(obj.start, obj.end, roomLectures);
      }
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

  return window.mobilization = {
    getLectures: getLectures, // получить все фильтры или сделать выборку
    addLecture: addLecture, // добавить лекцию
    editLecture: editLecture, // редактировать лекцию
    getSchools: getSchools, // получить все школы или выбрать одну
    addSchool: addSchool, // добавить или редактировать школу
    getRooms: getRooms,
    addRoom: addRoom
  };
})();
