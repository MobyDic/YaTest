Ссылка на gh-pages тестового задания: [Мобилизация 2017](https://alex-koshara.github.io/YaTest)

Как пользоваться библиотекой:
Все функции доступны через консоль разработчика:
Получение лекций по ключам:
id - ID лекции
streams - название потока
teacher - Данные учителя
start - начало лекций
end - завершение лекций
room - название аудитории

Примеры:
`mobilization.getLectures();`
Покажет абсолютно все лекции.

`mobilization.getLectures({streams: 'design', teacher: 'iKarev'});`
Отберет все лекции для дизайнеров, у которых учитель Иван Карев.

`mobilization.addRoom('apalon', {capacity: 10, description: 'Апалон вас сам найдет', title: 'Аполинариум'});`
Если аудитория есть - изменит данные. Если нет - добавит новую аудитория
По аналогии `addStream(streamName, Object)`

`mobilization.getLectures({start: '2017-08-09', end: '2017-08-11'
    });`
Покажет лекции в заданный период времени.

`mobilization.addLecture({start: '2017-08-09'
    });`
Покажет лекции, начиная с этой даты

`mobilization.getLectures({end: '2017-08-10'});`
Покажет лекции до этой даты

`mobilization.getRooms()`
Получить все аудитории

`mobilization.getStreams()`
Получить все потоки

```mobilization.addLecture({
      "streams": ["frontend"],
      "lection": "Лекция 1. Адаптивная вёрстка",
      "teacher": "iKarev",
      "start": "2017-08-09T20:30:00",
      "end": "2017-08-09T22:00:00",
      "room": "batut"
    });```
Добавить новую лекцию. Если учитель\аудитория\школа в это время заняты, библиотека об этом сообщит.

