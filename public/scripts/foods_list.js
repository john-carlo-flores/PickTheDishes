$(() => {
  // create modal
  const createModal = (data) => {
    const $modal = $(`
          <h3>${data.name}</h3>
          <p>${data.description}</p>
          <p>Price: ${data.price}</p>
    `)
    return $('.modal-content').append($modal);
  };

  // open popup
  $(".food").on("click", function (event) {
    event.preventDefault();
    $(".modal").addClass("is-visible");

    // get food.id that has been clicked
    let elmId = $(this).attr("id");

    $.ajax({
      url: `/foods/${elmId}`,
      method: 'GET',
    }).then((foods) => {
      createModal(foods);
    })
  });

  // minus button for quantity
  $('.minus').on('click', function() {
    let $input = $(this).parent().find('input');
    let count = parseInt($input.val())
    count = count < 1 ? 1 : count - 1;
    $input.val(count);
    $input.change();
  })

  // plus button for quantity
  $('.plus').on('click', function() {
    let $input = $(this).parent().find('input');
    let count = parseInt($input.val())
    count = count < 1 ? 1 : count + 1;
    $input.val(count);
    $input.change();
  })

  //close popup
  $("#close").on("click", function (event) {
    event.preventDefault();
    $('.modal-content').empty();
    $(".modal").removeClass("is-visible");
  });
});
