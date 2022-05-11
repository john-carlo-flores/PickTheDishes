
  const createModal = (data) => {
    const $modal = $(`
          <p hidden class="food-id">${data.id}</p>
          <h3 class="food-name">${data.name}</h3>
          <p>${data.description}</p>
          <p class="price">Price: ${data.price}</p>
    `)
    console.log('CreateModal');
    return $('.modal-content').append($modal);
  };
