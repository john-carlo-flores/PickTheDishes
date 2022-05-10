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
          <p class="price">Price: ${data.price}</p>
    `)
    return $('.modal-content').append($modal);
  };
    // function to create order lists into cart
    const createCartList = (data) => {
      const $foodInCart = `
        <div class="food-in-cart">
          <p>${data.quantity}</p>
          <p>${data.food}</p>
          <p>${data.price}</p>
          <button>X</button>
        </div>
      `
      return $foodInCart;
    };

    const renderCartLists = (itemArray) => {
      for (const item of itemArray) {
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
    let $input = $(this).parent().find('input');
    let quantity = $input.val();
    let $food = $('.add-modal').find('.food-name').text();
    let $price = $('.add-modal').find('.price').text();
    let unitPrice = $price.split(" ")[1];
    let sumPrice = unitPrice * quantity;

    // check if food is already exist in the array
    // change the quantity of the object
    // orderItems = [];
    const createItemObj = () => {
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

    // if (orderItems.length === 0) {
    //   createItemObj();
    // } else {
    //   for (const item of orderItems) {
    //     if ($food === item.food) {
    //       item.quantity = quantity;
    //       console.log('same: ', orderItems);
    //     } else {
    //       createItemObj();
    //     }
    //   }
    // }

    console.log('new: ', orderItems);

    $('.cart-list').empty();
    renderCartLists(orderItems);
    // empty object so new item can be made
    orderItem = {};

    const modal = $(this).closest('.modal-background');
    modal.addClass('hidden');
  });

  // change quantity in the cart
  $('.cart-list').on('click','.food-in-cart', function() {
    const order = $(this);
    const id = order.attr('id');
    $('.update-modal').removeClass('hidden');
  })


});
