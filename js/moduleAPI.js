'use strict';

(function() {
  if(localStorage.length) {
    var data = JSON.parse(localStorage.getItem('program'));
    doOnLoad(data);

  } else {
    window.load(DATA_URL, function(data) {
      doOnLoad(data);
      localStorage.setItem('program', JSON.stringify(data))
    })
  };

  function doOnLoad(data) {
    renderContainer(data.program);

    window.filtersControl(data.program);
    window.toggleOverlay();
  }
})();

(function() {
  var schoolBlock = document.querySelector('.school');

  schoolBlock.addEventListener('click', onLectionClick)

  function onLectionClick(e) {
    e.preventDefault();

    if(e.target.classList.contains('school__lection')) {
      console.log(e.target.innerText);
    }
  }
})();

