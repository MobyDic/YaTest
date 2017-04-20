'use strict';
/**
 * @typedef {Object} Lecture
 * Лекция проекта «мобилизация»
 * @property {Number} id Уникальный идентификатор лекции
 * @property {Array.<String>} streams Потоки, у которых будет лекция
 * @property {String} lection Название лекции
 * @property {String} start Время начала лекции в ISO
 * @property {String} end Время окончания лекции в ISO
 * @property {String} teacher Идентификатор лектора
 * @property {String} room Идентификатор переговорки
 */
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

  /**
   * @function testCapacity
   * Проверяет, вмещаются ли студенты в аудиторию
   *
   * @param {Lecture} lecture
   *
   * @returns {Boolean} Вернёт true, если вмещаются, и false если нет
   */
  function testCapacity(lecture) {
    if(mobilizationData.meetingRooms[lecture.room].capacity >= mobilizationData.schools[lecture.streams].studentsCount) {
      return true;
    } else {
      return false;
    }
  }

  function getOneDay() {
    var minutes = 60;
    var hours = 24;
    var milliseconds = 60000;
    return milliseconds * minutes * hours;
  }

  function findSchoolLection(start, end, array) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var objStartDate = null;
    var objEndDate = null;
    var flagDate = true;
    var thisDay = getOneDay();
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
  /**
   * @function editLecture
   * Меняет лекцию на переданный объект
   *
   * @param {Lecture} lectureId
   * @param {Lecture} obj
   *
   * @returns {Boolean} Вернёт true, если вмещаются, и false если нет
   */
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
    var capacity = testCapacity(obj);
    if(!capacity) {
      return 'В аудитории недостаточно места для студентов';
    }

    for(var i=0; i < mobilizationData.lectures.length; i++) {
      if(flag.length <= KODE_STRING.length) {
        flag = findRepeatLectures(mobilizationData.lectures[i], obj);
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

  function getSchool(school) {
    return mobilizationData.schools[school];
  }

  function getSchools() {
    return mobilizationData.schools;
  }

  function getRoom(room) {
    return mobilizationData.meetingRooms[room];
  }

  function getRooms(room) {
    return mobilizationData.meetingRooms;
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
    var filterLectures = mobilizationData.lectures;
    if(obj) {
      var keys = Object.keys(obj);
      for(var i=0; i < keys.length; i++) {
        filterLectures = filterLectures.filter(function(filterItem) {
          return isLectureMatch(filterItem, keys[i], obj[keys[i]])
        });
      }

      return filterLectures;
    }
    else {
      return mobilizationData.lectures;
    }
  }

  /**
   * @function isLecturesSimultaneously
   * Проверяет, пересекаются ли две лекции по времени
   *
   * @param {Lecture} lecture
   * @param {Lecture} newLecture
   *
   * @returns {Boolean} Вернёт true, если лекции пересекаются, и false если нет
   */
  function isLecturesSimultaneously(lecture, newLecture) {
    if(lecture.start === newLecture.start || lecture.start > newLecture.end <= lecture.end) {
      return true;
    }
    if(lecture.end > newLecture.start && lecture.start < newLecture.end) {
      return true;
    } else {
      return false;
    }
  }

  function findRepeatLectures(lecture, newLecture) {
    if(isLecturesSimultaneously(lecture, newLecture)) {
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

    if(key === 'start') {
      return lectureDate.valueOf() >= valueDate.valueOf();
    }
    if(key === 'end') {
      return lectureDate.valueOf() <= valueDate.valueOf() + getOneDay();
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
    getSchools: getSchools, // получить все школы
    getSchool: getSchool, // получить одну школу
    addSchool: addSchool, // добавить или редактировать школу
    getRooms: getRooms, // получить все аудитории
    getRoom: getRoom, // получить одну аудиторию
    addRoom: addRoom,
    findRepeatLectures: findRepeatLectures,
    isLectureMatch: isLectureMatch,
    isLecturesSimultaneously: isLecturesSimultaneously
  };
})();
