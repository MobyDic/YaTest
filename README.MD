Ссылка на gh-pages тестового задания: [Мобилизация 2017](https://alex-koshara.github.io/YaTest)

Как пользоваться библиотекой:<br>
Все функции доступны через консоль разработчика:<br>
Получение лекций по ключам:<br>
id - ID лекции<br>
streams - название потока<br>
teacher - Данные учителя<br>
start - начало лекций<br>
end - завершение лекций<br>
room - название аудитории<br>

Примеры:
`mobilization.getLectures();`<br>
Покажет абсолютно все лекции.

`mobilization.getLectures({streams: 'design', teacher: 'iKarev'});`<br>
Отберет все лекции для дизайнеров, у которых учитель Иван Карев.

`mobilization.addRoom('apalon', {capacity: 10, description: 'Апалон вас сам найдет', title: 'Аполинариум'});`<br>
Если аудитория есть - изменит данные. Если нет - добавит новую аудитория.<br>
По аналогии `addStream(streamName, Object)`

`mobilization.getLectures({start: '2017-08-09', end: '2017-08-11'
    });`<br>
Покажет лекции в заданный период времени.

`mobilization.addLecture({start: '2017-08-09'
    });`<br>
Покажет лекции, начиная с этой даты

`mobilization.getLectures({end: '2017-08-10'});`<br>
Покажет лекции до этой даты

`mobilization.getRooms()`<br>
Получить все аудитории

`mobilization.getStreams()`<br>
Получить все потоки

```mobilization.addLecture({
      "streams": ["frontend"],
      "lection": "Лекция 1. Адаптивная вёрстка",
      "teacher": "iKarev",
      "start": "2017-08-09T20:30:00",
      "end": "2017-08-09T22:00:00",
      "room": "batut"
    });```<br>
Добавить новую лекцию. Если учитель\аудитория\школа в это время заняты, библиотека об этом сообщит.

