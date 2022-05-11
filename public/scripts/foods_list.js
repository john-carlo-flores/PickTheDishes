$(() => {
  // array of Objects
  // e.g. [{id: 2, number:3}, {id: 3, number:1}]
  // renderOrder functino like renderTweets
  // update, add, delete call renderOrder()
  const orderItems = [];
  let orderItem = {};

  // create modal
  const createModal = (data) => {
    const $modal = $(`
          <p hidden class="food-id">${data.id}</p>
          <h3 class="food-name">${data.name}</h3>
          <p>${data.description}</p>
          <p class="price">$ ${data.price}</p>
    `)
    return $('.modal-content').append($modal);
  };
    // function to create order lists into cart
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
    $('#total-price').text(`${total}`);
  }

  // open popup
  $('.food').on('click', function (event) {
    event.preventDefault();
    $('.add-modal').removeClass('hidden');

    // get food.id that has been clicked
    let elmId = $(this).attr('id');
    showItem(elmId);
  });

  // minus button for quantity
  $('.minus').on('click', function() {
    let $input = $(this).parent().find('input');
    let count = parseInt($input.val())
    count = count < 1 ? 1 : count - 1;
    $input.val(count);
    $input.change();
  });

  // plus button for quantity
  $('.plus').on('click', function() {
    let $input = $(this).parent().find('input');
    let count = parseInt($input.val())
    count = count < 1 ? 1 : count + 1;
    $input.val(count);
    $input.change();
  });


  //close popup
  $('.close').on('click', function (event) {
    event.preventDefault();
    $('.modal-content').empty();
    const modal = $(this).closest('.modal-background');
    modal.addClass('hidden');
  });



  // add item to the cart
  $('.add').on('click', function() {
    // added food data to make food-in-cart
    const $input = $(this).parent().find('input');
    const quantity = $input.val();
    const $food = $('.add-modal').find('.food-name').text();
    const $price = $('.add-modal').find('.price').text();
    const unitPrice = $price.split(" ")[1];
    const sumPrice = unitPrice * quantity;
    const $id = $('.add-modal').find('.food-id').text();

    // check if food is already exist in the array
    // change the quantity of the object
    // orderItems = [];
    const createItemObj = () => {
      orderItem.id = $id;
      orderItem.food = $food;
      orderItem.quantity = quantity;
      orderItem.price = sumPrice;
      orderItems.push(orderItem);
    };
    let isAdded = false;
    let addedFood;
    for (const item of orderItems) {
      if ($food === item.food) {
        isAdded = true;
        addedFood = item;
      }
    }

    if (isAdded === true) {
      addedFood.quantity = quantity;
      addedFood.price = sumPrice;
    } else {
      createItemObj();
    }

    $('.cart-list').empty();
    renderCartLists(orderItems);
    getTotal(orderItems);
    // empty object so new item can be made
    orderItem = {};

    const modal = $(this).closest('.modal-background');
    modal.addClass('hidden');
  });

  // change quantity in the cart
  $('.cart-list').on('click','.food-in-cart', function() {
    const $id = $(this).find('.food-id').text();
    showItem($id);
    $('.update-modal').removeClass('hidden');
  })

  // update button will update quantity
  $('.update').on('click', function() {
    const modal = $(this).closest('.modal-background');

    const $input = $(this).parent().find('input');
    const quantity = $input.val();
    const $id = modal.find('.food-id').text();
    const $price = modal.find('.price').text();
    const unitPrice = $price.split(" ")[1];

    for (const item of orderItems) {
      if (item.id === $id) {
        item.quantity = quantity;
        item.price = unitPrice * quantity;
      }
    }

    $('.cart-list').empty();
    renderCartLists(orderItems);
    getTotal(orderItems);

    modal.addClass('hidden');
  })

  // delete from the cart
  $('.cart-list').on('click', '.delete', function(event) {
    event.stopPropagation();
    const food = $(this).closest('.food-in-cart')
    const $id = food.find('.food-id').text();

    for (const item of orderItems) {
      if (item.id === $id) {
        const index = orderItems.indexOf(item);
        orderItems.splice(index, 1);
      }
    }
    $('.cart-list').empty();
    renderCartLists(orderItems);
    getTotal(orderItems);
  })

  $('.checkout-button').on('click', function() {
    $('.order-confirm').removeClass('hidden');
    const data = JSON.stringify(orderItems); // don't need in js
    // console.log(data);

    // stringfy
    console.log(orderItems);
    $.ajax({
      url: '/orders',
      method: 'POST',
      data: data,
      contentType: 'application/json'
    })
    // $.post('/foods/order', data )
    // .then(() => console.log('Sent successfully!'));
  });

})
