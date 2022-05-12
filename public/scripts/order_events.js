$(() => {

  $('.order').draggable({
    opacity: '0.7',
    revert: 'invalid',
    cursor: 'move',
    helper: 'clone',
    appendTo: '.content',
    containment: '.content'
  });

  $('.orders').droppable({
    accept: '.order',
    drop: handleDropEvent
  });

  $('#modal-dialog').dialog({
    autoOpen  : false,
    modal     : true,
    draggable : false
  });

  $('#modal-dialog').on('dialogclose', undoDropEvent);

  $('.order').on('click', viewOrder);
  $('.complete-order').on('click', completeOrder);
  $(document.body).on('click', '.close-button', closeFoodModal);
  $(document.body).on('click', (event) => {
    if (event.target === document.querySelector('#modal-order')) {
      $('#modal-order').toggleClass("show-modal");
      $('#modal-order').empty();
    }
  });
});

/// DROP EVENTS

const handleDropEvent = function(event , ui) {
  const orderID = ui.draggable.find('.order-id').text();
  const startTime = ui.draggable.find('.created-date').text();
  const state = ['Pending', 'Preparing', 'Ready for Pickup'];

  console.log('handleDropEvent:', startTime);

  // Reference selected order and original parent
  $('.content').data('$selectedOrder', $(ui.draggable));
  $('.content').data('$previousParent', $('.content').data('$selectedOrder').parent());

  const previousState = $('.content').data('$previousParent').siblings('h4').text();
  const currentState = $(this).siblings('h4').text();

  // Prevent skipping states and going backwards
  if (state.indexOf(previousState) < state.indexOf(currentState) && state.indexOf(previousState) + 1 === state.indexOf(currentState)) {
    switch ($('.content').data('$previousParent').siblings('h4').text()) {
      case 'Pending':
        fillModalWithTimePrompt(startTime, orderID);
        break;
      case 'Preparing':
        fillModalWithReadyPrompt(orderID);
        break;
    }

    $('#modal-dialog').dialog('open');
    $(this).append(ui.draggable);
  }
};

const undoDropEvent = function(event) {
  $(this).empty(); // Clear dialog window

  if ($('#modal-dialog').data('state') === 'complete') return;

  // On user Cancel/No append order back to original parent
  if (!$('.content').data('submit')) {
    $('.content').data('$previousParent').append($('.content').data('$selectedOrder'));
    $('.content').data('submit', null);
  }
};

/// CLICK EVENTS

const viewOrder = function(event) {
  event.stopPropagation();
  const orderID = $(this).closest('.order').find('.order-id').text();
  const customerName = $(this).closest('.order').find('.full-name').text();
  fillModalWithFoodOrder(orderID, customerName);
  $("#modal-order").toggleClass("show-modal");
  $("#modal-order").data("show", "true");
};

const completeOrder = function(event) {
  const orderID = $(this).closest('.order').find('.order-id').text();
  fillModalWithCompletePrompt(orderID, $(this));
  $('#modal-dialog').dialog('open');
};

const closeFoodModal = function(event) {
  $modalOrder = $("#modal-order");
  $modalOrder.empty();
  $modalOrder.toggleClass("show-modal");
};

/// DIALOG PROMPTS

const fillModalWithTimePrompt = (date, id) => {
  const $modalForm = $(`
    <label for="pickup-time">Enter time below (mins):</label>
    <input type="text" id="pickup-time" name="pickup-time">
  `);

  const $endTime = $(`<span class="end-time"></span>`);

  const $modalDialog = $("#modal-dialog");
  $modalDialog.append($modalForm);
  $modalDialog.dialog('option', 'title', 'Estimated Preparation Time');
  $modalDialog.data('state', 'preparing');

  $modalDialog.dialog('option', 'buttons',
    {
      'OK': function() {
        $.post(`/orders/${id}/prepare`,
        {
          createdDate: date,
          estimatedTime: $('#pickup-time').val()
        },
        function(estimatedTime) {
          $endTime.text(estimatedTime);
          $('.content').data('$selectedOrder').find('.footer').append($endTime);
          $('.content').data('submit', 'ok');
          $modalDialog.dialog('close');
        });
      },
      'Cancel': function() {
        $(this).dialog('close');
      }
    }
  );
};

const fillModalWithReadyPrompt = (id, completeButton) => {
  const $modalForm = $(`<span>Are you sure order is ready?</span>`);
  const $completeButton = $(`<button class="complete-order">Complete Order</button>`);

  const $modalDialog = $("#modal-dialog");
  $modalDialog.append($modalForm);
  $modalDialog.dialog('option', 'title', 'Confirm Ready Order');
  $modalDialog.data('state', 'ready');

  $modalDialog.dialog('option', 'buttons',
    {
      'Yes': () => {
        $.post(`/orders/${id}/ready`,
        function() {
          $('.content').data('$selectedOrder').find('.end-time').remove();
          $('.content').data('$selectedOrder').find('.footer').append($completeButton);
          $('.content').data('submit', 'ok');
          $modalDialog.dialog('close');
        });
      },
      'No': function() {
        $(this).dialog('close');
      }
    }
  );
};

const fillModalWithCompletePrompt = (id, $button) => {
  const $modalForm = $(`
    <input type="hidden" name="order-id" value="${id}">
    <span>Complete Order?</span>
  `);

  const $modalDialog = $("#modal-dialog");
  $modalDialog.append($modalForm);
  $modalDialog.dialog('option', 'title', 'Confirm Complete Order');
  $modalDialog.data('state', 'complete');

  $modalDialog.dialog('option', 'buttons',
    {
      'Yes': () => {
        $.post(`/orders/${id}/complete`,
        function() {
          $button.closest('.order').remove();
          $('.content').data('submit', 'ok');
          $modalDialog.dialog('close');
        });
      },
      'No': function() {
        $(this).dialog('close');
      }
    }
  );
};

const fillModalWithFoodOrder = (id, customerName) => {
  $.get(`/orders/${id}`,
    function(foodList) {

      const modalHeader = `
        <div class="modal-content">
          <span class="close-button">&times</span>
          <div class="food-header">
            <h3>${customerName}</h3>
            <h3>${id}</h3>
          </div>
          <div class="table">
      `;

      let modalBody = '';

      for(const food of foodList) {
        modalBody += `
            <div class="row">
              <span>• ${food.name}</span>
              <span class="quantity"> x ${food.quantity}</span>
            </div>
        `;
      }

      const modalFooter = `
          </div>
        </div>
      `;

      const $modalForm  = modalHeader + modalBody + modalFooter;
      $("#modal-order").append($modalForm);
    });
};
