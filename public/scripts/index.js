$(() => {
  $('.order-now-button').on('click', redirectFoodPage);
})

const redirectFoodPage = function() {
  window.location='/foods';
}
