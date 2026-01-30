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
  if (slick.slideCount <= 1) {
    $(this).find('.slick-dots').hide();
  } else {
    $(this).find('.slick-dots').show();
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



// subsection toggle
$(function () {
  const $container = $('.subsections');
  const $items = $container.find('.subsection-link').not('.subsection-link__toggle');
  const $toggle = $container.find('.subsection-link__toggle');

  function getVisibleCount() {
    const w = $(window).width();

    if (w >= 1300) return 11; // desktop
    if (w >= 992)  return 6;  // <1300
    if (w >= 768)  return 5;  // <992
    if (w >= 576)  return 7;  // <768
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



// toggler btn product card
$(function () {
  const VISIBLE_COUNT = 11;

  $('.products-list-item').each(function () {
    const $block = $(this);
    const $cards = $block.find('.product-card.product-card-row');
    const $btn = $block.next('.btn-toggle-product');

    // если карточек меньше или равно 11
    if ($cards.length <= VISIBLE_COUNT) {
      $btn.hide();
      return;
    }

    // скрываем лишние
    $cards.slice(VISIBLE_COUNT).hide();
    $btn.show();

    // обработчик кнопки
    $btn.on('click', function (e) {
      e.preventDefault();

      $cards.show();
      $btn.hide();
    });
  });
});

$(function () {

  function getVisibleCount() {
    const w = window.innerWidth;

    if (w < 576) return 4;
    if (w < 992) return 8;
    return 15;
  }

  $('.btn-toggle-product-column').each(function () {
    const $btn = $(this);
    const $wrapper = $btn.prev('.product-column-item');
    const $cards = $wrapper.find('.product-card-column');

    function init() {
      const VISIBLE_COUNT = getVisibleCount();

      // сначала показываем всё (важно при ресайзе / табах)
      $cards.removeClass('is-hidden');

      if ($cards.length <= VISIBLE_COUNT) {
        $btn.hide();
        return;
      }

      // скрываем лишние
      $cards.slice(VISIBLE_COUNT).addClass('is-hidden');
      $btn.show();
    }

    init();

    // показать все и скрыть кнопку
    $btn.on('click', function (e) {
      e.preventDefault();

      $cards.removeClass('is-hidden');
      $btn.hide();
    });

    // пересчёт при ресайзе
    let resizeTimer;
    $(window).on('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 200);
    });
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
