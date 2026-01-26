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


// slider range
$(function () {
  $("#price-slider").slider({
    range: true,
    min: 0,
    max: 1000000,
    values: [0, 1000000],
    slide: function (event, ui) {
      $("#price-min").val(ui.values[0]);
      $("#price-max").val(ui.values[1]);
    }
  });

  $("#price-min").val($("#price-slider").slider("values", 0));
  $("#price-max").val($("#price-slider").slider("values", 1));

  // ввод вручную
  $("#price-min, #price-max").on("change", function () {
    let min = +$("#price-min").val();
    let max = +$("#price-max").val();

    if (min > max) [min, max] = [max, min];

    $("#price-slider").slider("values", [min, max]);
  });
});
