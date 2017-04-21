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
   * @param {Lecture} lecture - Передаваемая лекция
   *
   * @returns {Boolean} Вернёт true, если вмещаются, и false если нет
   */
  function testCapacity(lecture) {
    if(mobilizationData.meetingRooms[lecture.room].capacity >= mobilizationData.streams[lecture.streams].studentsCount) {
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

  /**
   * @function editLecture
   * Меняет лекцию по Id на переданный объект
   *
   * @param {Number} lectureId - Id лекции, которую надо изменить
   * @param {Lecture} lecture - Новая лекция
   *
   * @returns {Lecture} Запишет в localStorage объект с изменениями
   */
  function editLecture(lectureId, lecture) {
    mobilizationData.lectures.splice(lectureId, 1, lecture);
    setLocalStorageMobilization();
  }

  /**
   * @function setLocalStorageMobilization
   * Запись в localStorage и в mobilizationData данных
   *
   * @returns {Lecture} Обвновленный localStorage и mobilizationData
   */
  function setLocalStorageMobilization() {
    localStorage.setItem('mobilization', JSON.stringify(mobilizationData));
    mobilizationData = JSON.parse(localStorage.getItem('mobilization'));
  }

  /**
   * @function addLecture
   * Добавление новой лекции
   *
   * @param {Lecture} lecture - Новая лекция
   *
   * @returns {Lecture} При успехе: Обновленный localStorage и mobilizationData. Иначе: сообщение с описанием ошибки
   */
  function addLecture(lecture) {
    var flag = '';
    var capacity = testCapacity(lecture);
    if(!capacity) {
      return 'В аудитории недостаточно места для студентов';
    }

    for(var i=0; i < mobilizationData.lectures.length; i++) {
      if(flag.length <= KODE_STRING.length) {
        flag = findRepeatLectures(mobilizationData.lectures[i], lecture);
      }
    }
    if(flag === KODE_STRING) {
      if(!lecture.id) {
        lecture.id = mobilizationData.lectures.length;
      }
      mobilizationData.lectures.push(lecture);
      setLocalStorageMobilization();
    } else {
      return flag;
    }
  }

  /**
   * @function getStream
   * Получение данных по одному потоку
   *
   * @param {String} streams - Выбранный поток
   *
   * @returns {Object} Вернет данные выбранного потока
   */
  function getStream(stream) {
    return mobilizationData.streams[stream];
  }

  /**
   * @function getStreams
   * Получение данных по всем потокам
   *
   * @returns {Object} Вернет данные о всех потоках
   */
  function getStreams() {
    return mobilizationData.streams;
  }

  /**
   * @function getRoom
   * Получение данных по всем аудиториям
   *
   * @param {String} room - Выбранная аудитория
   *
   * @returns {Object} Вернет данные выбранной аудитории
   */
  function getRoom(room) {
    return mobilizationData.meetingRooms[room];
  }

  /**
   * @function getRooms
   * Получение данных по всем аудиториям
   *
   * @returns {Object} Вернет данные о всех аудиториях
   */
  function getRooms() {
    return mobilizationData.meetingRooms;
  }

  /**
   * @function addStream
   * Добавить поток
   *
   * @param {String} streamName - Название потока
   * @param {Object} stream - Объект с данными о потоке
   *
   * @returns {Leture} Сохранение потока в localStorage и mobilizationData
   */
  function addStream(streamName, stream) {
    mobilizationData.streams[streamName] = stream;
    setLocalStorageMobilization();
  }

  /**
   * @function addRoom
   * Добавить поток
   *
   * @param {String} roomName - Название аудитории
   * @param {Object} room - Объект с данными об аудитории
   *
   * @returns {Lecture} Сохранение аудитории в localStorage и mobilizationData
   */
  function addRoom(roomName, room) {
    mobilizationData.meetingRooms[roomName] = room;
    setLocalStorageMobilization();
  }

  /**
   * @function getLectures
   * Получить лекции
   *
   * @param {Object} params - Объект с данными по которым идет отбор
   *
   * @returns {Array.<Lecture>} Вернутся лекции, удовлетворяющие запрос
   */
  function getLectures(params) {
    var streamsLectures;
    var roomLectures;
    var filterLectures = mobilizationData.lectures;
    if(params) {
      var keys = Object.keys(params);
      for(var i=0; i < keys.length; i++) {
        filterLectures = filterLectures.filter(function(filterItem) {
          return isLectureMatch(filterItem, keys[i], params[keys[i]])
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
   * @param {Lecture} lecture - Существующая лекция
   * @param {Lecture} newLecture - Лекция, которая добавляется
   *
   * @returns {Boolean} Вернёт true, если лекции пересекаются, и false если нет
   */
  function isLecturesSimultaneously(lecture, newLecture) {
    if(lecture.start.valueOf() === newLecture.start.valueOf() || lecture.start.valueOf() > newLecture.end.valueOf() <= lecture.end.valueOf()) {
      return true;
    }
    if(lecture.end.valueOf() > newLecture.start.valueOf() && lecture.start.valueOf() < newLecture.end.valueOf()) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @function findRepeatLectures
   * Проверяет, занят ли преподаватель, аудитория или школа для лекции, которая добавляется
   *
   * @param {Lecture} lecture - Существующая лекция
   * @param {Lecture} newLecture - Лекция, которая добавляется
   *
   * @returns {String} Вернёт "Лекция добавлена", если лекции не пересекаются, и описание ошибки, если пересекаются
   */
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

  /**
   * @function isLectureMatch
   * Проверяет, имеются ли входящие данные в Lecture
   *
   * @param {Lecture} lecture - Объект с данными о лекции
   * @param {String} key - Ключ лекции
   * @param {String} value - Значение
   *
   * @returns {Boolean} Вернет true, если в lecture по key соответсвует value, иначе - false
   */
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
    getStreams: getStreams, // получить все школы
    getStream: getStream, // получить одну школу
    addStream: addStream, // добавить или редактировать школу
    getRooms: getRooms, // получить все аудитории
    getRoom: getRoom, // получить одну аудиторию
    addRoom: addRoom, // добавить аудиторию
    findRepeatLectures: findRepeatLectures, // найти совпадения
    isLectureMatch: isLectureMatch, // имеется ли значение в лекции
    isLecturesSimultaneously: isLecturesSimultaneously // проверить пересечение лекций
  };
})();
