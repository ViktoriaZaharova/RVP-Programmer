// mask phone
$('[name="phone"]').mask('+7 (999) 999-99-99');

// active link menu
$(function () {
  const currentPath = window.location.pathname.split('/').pop();

  $('.menu.my-ul .nav-link').each(function () {
    const linkPath = $(this).attr('href');

    if (linkPath === currentPath) {
      $('.menu.my-ul .nav-link').removeClass('active');
      $(this).addClass('active');
    }
  });
});



// parcing price
function formatPrice(num) {
  num = num.toString().replace(/\D/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function parsePrice(str) {
  return parseInt(str.replace(/\D/g, ''), 10) || 0;
}


$('#price-min, #price-max')
  .on('input', function () {
    this.value = this.value.replace(/\D/g, '');
  })
  .on('blur', function () {
    $(this).val(formatPrice($(this).val()));
  });


// slider range
$(function () {
  const $slider = $('#price-slider');
  const $min = $('#price-min');
  const $max = $('#price-max');

  $slider.slider({
    range: true,
    min: 1580,
    max: 87400,
    step: 1000,
    values: [0, 65000],
    slide: function (e, ui) {
      $min.val(formatPrice(ui.values[0]));
      $max.val(formatPrice(ui.values[1]));
    }
  });

  // старт
  $min.val(formatPrice($slider.slider('values', 0)));
  $max.val(formatPrice($slider.slider('values', 1)));

  // ручной ввод → слайдер
  $min.add($max).on('blur', function () {
    let min = parsePrice($min.val());
    let max = parsePrice($max.val());

    if (min > max) [min, max] = [max, min];

    $slider.slider('values', [min, max]);
    $min.val(formatPrice(min));
    $max.val(formatPrice(max));
  });
});



$(function () {
  $('.btn-filter-mobile').click(function (e) {
    e.preventDefault();
    $('.sidebar-column').fadeIn();
  });

  $('.sidebar-btn__close').click(function (e) {
    e.preventDefault();
    $('.sidebar-column').fadeOut();
  });
});

// slick slider
$('.watched-slider').slick({
  slidesToShow: 7,
  infinite: false,
  prevArrow: '<button class="slick-prev slick-arrow" type="button"></button>',
  nextArrow: '<button class="slick-next slick-arrow" type="button"></button>',
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 6,
      }
    },
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 5,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        variableWidth: true,
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        variableWidth: true,
        arrows: false
      }
    }
  ]
});

$('.product-card-slider').on('init reInit afterChange', function (event, slick) {
  const $slider = $(this);

  // реальные слайды (без slick-cloned)
  const realSlidesCount = slick.$slides.not('.slick-cloned').length;

  if (realSlidesCount <= 1) {
    $slider.find('.slick-dots').hide();
  } else {
    $slider.find('.slick-dots').show();
  }
});


$('.product-card-slider').slick({
  slidesToShow: 1,
  arrows: false,
  dots: true,
  fade: true,
  autoplay: true,
  autoplaySpeed: 3000,
  infinite: false
});

$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
  $('.product-card-slider').slick('refresh');
});

// toggle card product
$(function () {

  const LIMITS = {
    row: 11,
    column: 15
  };

  const MOBILE_WIDTH = 690;

  function isMobile() {
    return $(window).width() < MOBILE_WIDTH;
  }

  function getActiveTab() {
    return $('.tab-pane.active, .tab-pane.show.active');
  }

  function initProductsInTab($tab) {
    if (!$tab.length) return;

    const $rowCards = $tab.find('.product-card-row');
    const $columnCards = $tab.find('.product-card-column');

    let $cards = $rowCards.length ? $rowCards : $columnCards;
    let limit = $rowCards.length ? LIMITS.row : LIMITS.column;

    // desktop / tablet логика
    if (!isMobile()) {

      if ($cards.length <= limit) {
        $('.btn-toggle-product').hide();
        $cards.show();
        return;
      }

      $cards.hide().slice(0, limit).show();
      $('.btn-toggle-product').show();

    } else {
      // mobile < 690 — кнопку не скрываем
      $cards.show();
      $('.btn-toggle-product').show();
    }
  }

  // первичная инициализация
  initProductsInTab(getActiveTab());

  // клик по кнопке
  $('.btn-toggle-product').on('click', function (e) {
    e.preventDefault();

    const $tab = getActiveTab();
    if (!$tab.length) return;

    $tab.find('.product-card-row, .product-card-column').show();

    // обновляем slick внутри column
    $tab.find('.product-card-slider.slick-initialized').each(function () {
      $(this).slick('setPosition');
    });

    // кнопку скрываем ТОЛЬКО не на мобиле
    if (!isMobile()) {
      $(this).hide();
    }
  });

  // при переключении табов
  $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
    initProductsInTab(getActiveTab());
  });

  // при ресайзе (например, поворот телефона)
  $(window).on('resize', function () {
    initProductsInTab(getActiveTab());
  });

});


$(function () {

  const LIMITS = {
    row: 11,
    column: 15
  };

  function getActiveTab() {
    return $('.tab-pane.active, .tab-pane.show.active');
  }

  function initProductsInTab($tab) {
    if (!$tab.length) return;

    const $rowCards = $tab.find('.product-card-row');
    const $columnCards = $tab.find('.product-card-column');

    let $cards = $rowCards.length ? $rowCards : $columnCards;
    let limit = $rowCards.length ? LIMITS.row : LIMITS.column;

    // если карточек меньше лимита — просто скрываем кнопку
    if ($cards.length <= limit) {
      $('.btn-toggle-product').hide();
      return;
    }

    // скрываем лишние
    $cards.hide().slice(0, limit).show();

    $('.btn-toggle-product').show();
  }

  // первичная инициализация
  initProductsInTab(getActiveTab());

  // клик по кнопке "Показать ещё"
  $('.btn-toggle-product').on('click', function (e) {
    e.preventDefault();

    const $tab = getActiveTab();
    if (!$tab.length) return;

    const $rowCards = $tab.find('.product-card-row');
    const $columnCards = $tab.find('.product-card-column');

    let $cards = $rowCards.length ? $rowCards : $columnCards;

    $cards.show();

    // если есть slick — пересобираем
    $tab.find('.product-card-slider.slick-initialized').each(function () {
      $(this).slick('setPosition');
    });

    $(this).hide();
  });

  // при переключении табов
  $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
    initProductsInTab(getActiveTab());
  });

});


// subsection toggle
$(function () {
  const $container = $('.subsections');
  const $items = $container.find('.subsection-link').not('.subsection-link__toggle');
  const $toggle = $container.find('.subsection-link__toggle');

  function getVisibleCount() {
    const w = $(window).width();

    if (w >= 1300) return 11; // desktop
    if (w >= 992) return 6;  // <1300
    if (w >= 768) return 5;  // <992
    if (w >= 576) return 7;  // <768
    return 5;                 // <576
  }

  function updateView() {
    const visibleCount = getVisibleCount();

    if ($items.length > visibleCount) {
      if (!$container.hasClass('is-open')) {
        $items.hide().slice(0, visibleCount).show();
      }
      $toggle.show();
    } else {
      $items.show();
      $toggle.hide();
    }
  }

  // первичная инициализация
  updateView();

  // ресайз
  $(window).on('resize', function () {
    updateView();
  });

  // toggle
  $toggle.on('click', function (e) {
    e.preventDefault();

    const visibleCount = getVisibleCount();
    const isOpen = $container.hasClass('is-open');

    if (isOpen) {
      $items.hide().slice(0, visibleCount).show();
      $(this).find('span').text('Показать все');
      $container.removeClass('is-open');
    } else {
      $items.show();
      $(this).find('span').text('Скрыть');
      $container.addClass('is-open');
    }
  });
});


// filter mobile 
$(function () {
  const $buttonText = $('.sort-button__text');
  const $radios = $('.filter-vat__item-input');

  function updateButtonText() {
    const text = $radios.filter(':checked').siblings('span').text();
    $buttonText.text(text);
  }

  updateButtonText();

  $radios.on('change', function () {
    updateButtonText();
  });
});

$(function () {
  const $radios = $('.filter-vat__item-input');
  const dropdownEl = document.querySelector('.content-filters__sort.dropdown');
  const dropdownBtn = document.querySelector('.sort-button');

  // экземпляр Bootstrap dropdown
  const bsDropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownBtn);

  $radios.on('change', function () {
    // обновляем текст кнопки
    const text = $(this).siblings('span').text();
    $('.sort-button__text').text(text);

    // закрываем dropdown только на < 992
    if (window.innerWidth < 992) {
      bsDropdown.hide();
    }
  });
});

