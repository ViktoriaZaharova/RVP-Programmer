// mask phone
$('[name="phone"]').mask('+7 (999) 999-99-99');

Fancybox.bind("[data-fancybox]", {
  // Your custom options
});

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

$('.similar-slider').slick({
  slidesToShow: 6,
  infinite: false,
  arrows: false,
  prevArrow: '<button class="slick-prev slick-arrow" type="button"></button>',
  nextArrow: '<button class="slick-next slick-arrow" type="button"></button>',
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 5,
      }
    },
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 4,
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 5,

      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 4,
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 3,
        variableWidth: true,
      }
    }
  ]
});

$('.company-gallery-slider').slick({
  slidesToShow: 3,
  arrows: true,
  // infinite: false,
  prevArrow: '<button class="slick-prev slick-arrow" type="button"></button>',
  nextArrow: '<button class="slick-next slick-arrow" type="button"></button>',
});


// ==================================================
// SLICK: скрывать точки если 1 слайд
// ==================================================
function toggleSlickDots($slider, slick) {
  setTimeout(() => {
    const $dots = $slider.find('.slick-dots');
    if ($dots.length) {
      $dots.toggle(slick.slideCount > 1);
    }
  }, 0);
}

$('.product-card-slider')
  .on('init reInit setPosition', function (e, slick) {
    toggleSlickDots($(this), slick);
  })
  .slick({
    slidesToShow: 1,
    arrows: false,
    dots: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: false
  });

$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
  $('.product-card-slider.slick-initialized').slick('setPosition');
});



$(function () {

  // ===============================
  // КОЛОНКИ
  // ===============================
  $('.products.products-column').each(function () {
    const $container = $(this);
    const $btn = $container.find('.btn-toggle-column');

    function getColumnVisible() {
      const w = $(window).width();
      if (w >= 992) return 15;       // ПК
      if (w >= 768) return 16;       // Планшет
      return 10;                    // Мобильные (пример, можно менять)
    }

    function updateColumns() {
      const COLUMN_VISIBLE = getColumnVisible();

      $container.find('.product-column-item').each(function () {
        const $item = $(this);
        const $cards = $item.find('.product-card-column');

        $cards.hide();
        $cards.slice(0, COLUMN_VISIBLE).show();
      });

      if ($container.find('.product-card-column:hidden').length > 0) {
        $btn.show();
      } else {
        $btn.hide();
      }
    }

    // Изначальная инициализация
    updateColumns();

    // При ресайзе окна пересчитываем
    $(window).on('resize', function () {
      updateColumns();
    });

    $btn.off('click').on('click', function (e) {
      e.preventDefault();
      const COLUMN_VISIBLE = getColumnVisible();

      $container.find('.product-column-item').each(function () {
        const $item = $(this);
        const $cards = $item.find('.product-card-column');
        const $hidden = $cards.filter(':hidden');

        $hidden.slice(0, COLUMN_VISIBLE).show();

        // обновляем slick
        $hidden.slice(0, COLUMN_VISIBLE).find('.product-card-slider').each(function () {
          const $slider = $(this);
          if ($slider.hasClass('slick-initialized')) {
            $slider.slick('setPosition');
          }
        });
      });

      if ($container.find('.product-card-column:hidden').length === 0) {
        $btn.hide();
      }
    });

  });

  // ===============================
  // РЯДЫ
  // ===============================
  $('.products.products-list').each(function () {
    const $container = $(this);
    const $btn = $container.find('.btn-toggle-row');
    const ROW_VISIBLE = 11;

    $container.find('.products-list-item').each(function () {
      const $listItem = $(this);
      const $cards = $listItem.find('.product-card-row');

      $cards.hide();
      $cards.slice(0, ROW_VISIBLE).show();
    });

    if ($container.find('.product-card-row:hidden').length > 0) {
      $btn.show();
    } else {
      $btn.hide();
    }

    $btn.off('click').on('click', function (e) {
      e.preventDefault();

      $container.find('.products-list-item').each(function () {
        const $listItem = $(this);
        const $cards = $listItem.find('.product-card-row');
        const $hidden = $cards.filter(':hidden');
        $hidden.slice(0, ROW_VISIBLE).show();
      });

      if ($container.find('.product-card-row:hidden').length === 0) {
        $btn.hide();
      }
    });
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
  const dropdownBtn = document.querySelector('.sort-button');

  // если на странице нет фильтра — ничего не делаем
  if (!$radios.length || !dropdownBtn) return;

  const bsDropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownBtn);

  $radios.on('change', function () {
    const text = $(this).siblings('span').text();
    $('.sort-button__text').text(text);

    if (window.innerWidth < 992) {
      bsDropdown.hide();
    }
  });
});


// text hidden-show
$(function () {
  $('.js-text-wrap').each(function () {
    const $text = $(this);
    const $btn = $text.next('.js-show-text');

    // clone без ограничений — для вычисления реальной высоты
    const $clone = $text.clone()
      .removeClass('is-collapsed is-expanded')
      .css({
        position: 'absolute',
        visibility: 'hidden',
        maxHeight: 'none',
        height: 'auto'
      })
      .appendTo('body');

    const fullHeight = $clone.outerHeight();
    $clone.remove();

    const collapsedHeight = $text.outerHeight();

    if (fullHeight <= collapsedHeight) {
      $btn.hide();
    }
  });

  $('.js-show-text').on('click', function (e) {
    e.preventDefault();

    const $btn = $(this);
    const $text = $btn.prev('.js-text-wrap');

    $text.toggleClass('is-collapsed is-expanded');

    const isOpen = $text.hasClass('is-expanded');

    $btn.find('span').text(
      isOpen ? 'Скрыть описание' : 'Показать описание целиком'
    );

    $btn.find('img').css(
      'transform',
      isOpen ? 'rotate(180deg)' : 'rotate(0)'
    );
  });
});


// показать карточку товара по наведению в зависимости от значениея data-tab
$(function () {

  const MOBILE_BREAKPOINT = 768;

  const $dropdown = $('.category-dropdown');
  const $toggle = $dropdown.find('[data-bs-toggle="dropdown"]');
  const $menu = $dropdown.find('.category-menu');
  const $wrapper = $menu.find('.category-menu-wrapper');

  /* --------------------------------------------------
     Helpers
  -------------------------------------------------- */
  function isMobile() {
    return window.innerWidth < MOBILE_BREAKPOINT;
  }

  function resetMenu() {
    $wrapper.find('.category-menu-level').removeClass('active');
    $wrapper.find('.category-menu-level--1').addClass('active');
    $wrapper.find('.category-link').removeClass('active');
  }

  resetMenu();

  /* --------------------------------------------------
     Bootstrap fix:
     клики внутри меню НЕ закрывают dropdown
     (кроме mobile-close)
  -------------------------------------------------- */
  $menu.on('click', function (e) {
    if (!$(e.target).closest('.category-close').length) {
      e.stopPropagation();
    }
  });

  /* --------------------------------------------------
     Клик по пункту с подменю (MOBILE)
  -------------------------------------------------- */
  $menu.on('click', '.category-link.has-submenu', function (e) {
    if (!isMobile()) return;

    e.preventDefault();
    e.stopPropagation();

    const $link = $(this);
    const $currentLevel = $link.closest('.category-menu-level');
    const tabId = $link.data('tab');
    const $targetLevel = $wrapper.find('.js-tab-content[data-tab="' + tabId + '"]');

    if (!$targetLevel.length) return;

    /* ACTIVE логика */
    if ($currentLevel.hasClass('category-menu-level--1')) {
      $wrapper.find('.category-link').removeClass('active');
    }

    if ($currentLevel.hasClass('category-menu-level--2')) {
      $wrapper
        .find('.category-menu-level--2 .category-link, .category-menu-level--3 .category-link')
        .removeClass('active');
    }

    /* LEVELS */
    $wrapper.find('.category-menu-level').removeClass('active');

    $link.addClass('active');
    $targetLevel.addClass('active');
  });

  /* --------------------------------------------------
     Назад (MOBILE)
  -------------------------------------------------- */
  $menu.on('click', '.category-back', function (e) {
    if (!isMobile()) return;

    e.preventDefault();
    e.stopPropagation();

    const $currentLevel = $(this).closest('.category-menu-level');

    // level 3 → level 2
    if ($currentLevel.hasClass('category-menu-level--3')) {
      $wrapper.find('.category-menu-level').removeClass('active');
      $wrapper.find('.category-menu-level--2').addClass('active');

      $wrapper
        .find('.category-menu-level--3 .category-link')
        .removeClass('active');
    }

    // level 2 → level 1
    else if ($currentLevel.hasClass('category-menu-level--2')) {
      resetMenu();
    }
  });

  /* --------------------------------------------------
     ❌ КРЕСТИК — MOBILE
     закрывает ТОЛЬКО .category-menu
  -------------------------------------------------- */
  $menu.on('click', '.category-close', function (e) {
    if (!isMobile()) return;

    e.preventDefault();
    e.stopPropagation();

    resetMenu();

    // закрываем dropdown-menu вручную
    $menu.removeClass('show');
    $toggle
      .removeClass('show')
      .attr('aria-expanded', 'false');
  });

  /* --------------------------------------------------
     Resize
  -------------------------------------------------- */
  $(window).on('resize', function () {
    if (!isMobile()) {
      resetMenu();
    }
  });

});




