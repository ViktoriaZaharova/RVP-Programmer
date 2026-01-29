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
  const visibleCount = 11;

  if ($items.length > visibleCount) {
    $items.slice(visibleCount).hide();
  } else {
    $toggle.hide();
  }

  $toggle.on('click', function (e) {
    e.preventDefault();

    const isOpen = $container.hasClass('is-open');

    if (isOpen) {
      $items.slice(visibleCount).hide();
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
