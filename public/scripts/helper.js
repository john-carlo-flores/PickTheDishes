
  const createModal = (data) => {
    const $modal = $(`
          <p hidden class="food-id">${data.id}</p>
          <h3 class="food-name">${data.name}</h3>
          <p>${data.description}</p>
          <p class="price">Price: $ ${data.price}</p>
    `)
    return $('.modal-content').append($modal);
  };


  const createCartList = (data) => {
    const $foodInCart = `
      <div class="food-in-cart">
        <div>
          <p hidden class="food-id">${data.id}</p>
          <p>${data.quantity}</p>
          <p>${data.food}</p>
        </div>
        <div>
          <p>$${data.price}</p>
          <button class="delete">X</button>
        </div>
      </div>
    `
    return $foodInCart;
  };

  const renderCartLists = (items) => {
    for (const item of items) {
      const $cartList = createCartList(item);
      $('.cart-list').append($cartList);
    }
  };


// when clicked, show food modal
const showItem = (elmId) => {
  $.ajax({
    url: `/foods/${elmId}`,
    method: 'GET',
  }).then((foods) => {
    $('.modal-content').empty();
    createModal(foods);
  })
}

const getTotal = (items) => {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  $('#total-price').text(`$${total}`);
}
