(function () {
  'use strict';

  // Флаг, что Метрика уже загрузилась.
  var isLoaded = false,
    // Ваш идентификатор сайта в Яндекс.Метрика.
    metricaId = 123456789,
    // Переменная для хранения таймера.
    timerId;

  // Для бота Яндекса грузим Метрику сразу без "отложки",
  // чтобы в панели Метрики были зелёные кружочки
  // при проверке корректности установки счётчика.
  if (navigator.userAgent.indexOf('YandexMetrika') > -1) {
    loadMetrica();
  } else {
    // Подключаем Метрику, если юзер начал скроллить.
    window.addEventListener('scroll', loadMetrica, { passive: true });

    // Подключаем Метрику, если юзер коснулся экрана.
    window.addEventListener('touchstart', loadMetrica);

    // Подключаем Метрику, если юзер дернул мышкой.
    document.addEventListener('mouseenter', loadMetrica);

    // Подключаем Метрику, если юзер кликнул мышкой.
    document.addEventListener('click', loadMetrica);

    // Подключаем Метрику при полной загрузке DOM дерева,
    // с "отложкой" в 1 секунду через setTimeout,
    // если пользователь ничего вообще не делал (фоллбэк).
    document.addEventListener('DOMContentLoaded', loadFallback);
  }

  function loadFallback () {
    timerId = setTimeout(loadMetrica, 3000);
  }

  function loadMetrica (e) {

    // Пишем отладку в консоль браузера.
    if (e && e.type) {
      console.log(e.type);
    } else {
      console.log('DOMContentLoaded');
    }

    // Если флаг загрузки Метрики отмечен,
    // то ничего более не делаем.
    if (isLoaded) {
      return;
    }

    dataLayer.push({'event': 'afterLoad'});
    // Отмечаем флаг, что загрузилась,
    // чтобы не загружать повторно при других
    // событиях пользователя и старте фоллбэка.
    isLoaded = true;

    // Очищаем таймер, чтобы избежать лишних утечек памяти.
    clearTimeout(timerId);

    // Отключаем всех наших слушателей от всех событий,
    // чтобы избежать утечек памяти.
    window.removeEventListener('scroll', loadMetrica);
    window.removeEventListener('touchstart', loadMetrica);
    document.removeEventListener('mouseenter', loadMetrica);
    document.removeEventListener('click', loadMetrica);
    document.removeEventListener('DOMContentLoaded', loadFallback);
  }
})();
