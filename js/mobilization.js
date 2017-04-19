'use strict';

localStorage.clear();

window.mobilization = (function() {
  var mobilizationData;
  var KODE_STRING = 'лекция добавлена';
  if(localStorage.length != 0) {
    mobilizationData = JSON.parse(localStorage.getItem('mobilization'));
  } else {
    window.load(DATA_URL, function(data) {
    mobilizationData = data;
    setLocalStorageMobilization();
    })
  }

  function testCapacity(lecture, newLecture) {
    if(mobilizationData.meetingRooms[lecture.room].capacity >= mobilizationData.meetingRooms[newLecture.streams].studentsCount) {
      return true;
    } else {
      return false;
    }
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
    mobilizationData = JSON.parse(localStorage.getItem('mobilization'));
  }

  function addLecture(obj) {
    var flag = '';
    var capacity = null;

    for(var i=0; i < mobilizationData.lectures.length; i++) {
      if(flag.length <= KODE_STRING.length) {
        flag = findRepeatLectures(mobilizationData.lectures[i], obj);
        capacity = testCapacity(mobilizationData.lectures[i], obj)
      }
    }
    if(flag === KODE_STRING) {
      if(!obj.id) {
        obj.id = mobilizationData.lectures.length;
      }
      mobilizationData.lectures.push(obj);
      setLocalStorageMobilization();
    } else {
      return flag;
    }
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
      var keys = Object.keys(obj);
      var flag = false;



      return mobilizationData.lectures.filter(function(filterItem) {
        return isLectureMatch(filterItem, keys[0], obj[keys[0]])
      });
      // if(Object.keys(obj).length === 3  && obj.streams) {
      //   streamsLectures = mobilizationData.lectures.filter(function(lectureItem) {
      //     return isLectureMatch(lectureItem, 'streams', obj.streams)
      //   });

      //   return findSchoolLection(obj.start, obj.end, streamsLectures);
      // } else  if (Object.keys(obj).length === 3  && obj.room){
      //   roomLectures = mobilizationData.lectures.filter(function(lectureItem) {
      //     return isLectureMatch(lectureItem, 'room', obj.room)
      //   });

      //   return findSchoolLection(obj.start, obj.end, roomLectures);
      // }
      // for(var key in obj) {
      //   return mobilizationData.lectures.filter(function(lectureItem) {
      //     return isLectureMatch(lectureItem, key, obj[key])
      //   });
      // }
    }
    else {
      return mobilizationData.lectures;
    }
  }

  function findRepeatLectures(lecture, newLecture) {
    if(lecture.start === newLecture.start || lecture.start > newLecture.end <= lecture.end) {
      if(lecture.teacher === newLecture.teacher) {
        return 'Ошибка: преподаватель ' +  mobilizationData.teachers[newLecture.teacher].name +' уже занят в это время на другой лекции!';
      } else
      if(lecture.room === newLecture.room) {
        return 'Ошибка: комната ' +  mobilizationData.meetingRooms[newLecture.room].title +' уже занята в это время!';
      } else {
        for(var i = 0; i < lecture.streams.length; i++) {
          if(lecture.streams[i] === newLecture.streams[0]) {
            return 'Ошибка: в это время у школы ' +  newLecture.streams[0] +' уже есть лекция!';
          }
          return KODE_STRING;
        }
      }
    } else {
      return KODE_STRING;
    }
  }

  function isLectureMatch(lecture, key, value) {
    var lectureDate = new Date(lecture[key]);
    var valueDate = new Date(value);
    debugger;
    if(lecture[key] === 'start') {
      return lectureDate.valueOf() >= valueDate;
    }

    if(Array.isArray(lecture[key])) {
      return lecture[key].indexOf(value) !== -1;
    } else {
      return lecture[key] === value;
    }
  }

  return {
    getLectures: getLectures, // получить все фильтры или сделать выборку
    addLecture: addLecture, // добавить лекцию
    editLecture: editLecture, // редактировать лекцию
    getSchools: getSchools, // получить все школы или выбрать одну
    addSchool: addSchool, // добавить или редактировать школу
    getRooms: getRooms,
    addRoom: addRoom,
    findRepeatLectures: findRepeatLectures,
    isLectureMatch: isLectureMatch
  };
})();
