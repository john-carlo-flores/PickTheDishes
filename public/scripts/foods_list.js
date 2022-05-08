$(() => {
  // open popup
  $(".food").on("click", function (event) {
    event.preventDefault();
    $(".modal").addClass("is-visible");
  });

  //close popup
  $(".close").on("click", function (event) {
    event.preventDefault();
    $(".modal").removeClass("is-visible");
  });
});
