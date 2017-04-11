'use strict';

(function() {
  if(localStorage.length != 0) {
    var data = JSON.parse(localStorage.getItem('program'));
    onLoadDo(data);

  } else {
    window.load(DATA_URL, function(data) {
      onLoadDo(data);
      localStorage.setItem('program', JSON.stringify(data))
    })
  };

  function onLoadDo(data) {
    renderContainer(data.program);

    window.filtersControl(data.program);
    window.toggleOverlay();
  }
})();

(function() {
  var schoolBlock = document.querySelector('.school');
  var editPopup = document.querySelector('.popup-edit');
  var inputPopup = editPopup.querySelector('.popup-edit__input');

  schoolBlock.addEventListener('click', onLectionClick)

  function onLectionClick(e) {
    e.preventDefault();

    if(e.target.classList.contains('school__lection')) {
      var targetText = e.target.innerText
      editPopup.classList.remove('invisible');
      inputPopup.value = targetText;
    }
  }
})();

