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

  //close popup
  $("#close").on("click", function (event) {
    event.preventDefault();
    $('.modal-content').empty();
    $(".modal").removeClass("is-visible");
  });
});
