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

});

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
  console.log('undoDropEvent', !$('.content').data('submit'));

  // On user Cancel/No append order back to original parent
  if (!$('.content').data('submit')) {
    $('.content').data('$previousParent').append($('.content').data('$selectedOrder'));
    $('.content').data('submit', null);
  }
};

/// DIALOG PROMPTS

const fillModalWithTimePrompt = (date, id) => {
  const $modalForm = $(`
    <input type="hidden" name="order-id" value="${id}">
    <span hidden class="created-date">${date}</span>
    <label for="pickup-time">Enter time below (mins):</label>
    <input type="text" id="pickup-time" name="pickup-time">
  `);

  const $endTime = $(`<span class="end-time"></span>`);

  const $modalDialog = $("#modal-dialog");
  $modalDialog.append($modalForm);
  $modalDialog.dialog('option', 'title', 'Estimated Preparation Time');

  $modalDialog.dialog('option', 'buttons',
    {
      'OK': function() {
        $.post(`/orders/${id}/prepare`, {
          createdDate: $(this).find('.created-date').text(),
          estimatedTime: $('#pickup-time').val()
        }, function(estimatedTime) {
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

const fillModalWithReadyPrompt = (id) => {
  const $modalForm = $(`
    <input type="hidden" name="order-id" value="${id}">
    <span>Are you sure order is ready?</span>
  `);

  const $modalDialog = $("#modal-dialog");
  $modalDialog.append($modalForm);
  $modalDialog.dialog('option', 'title', 'Confirm Ready Order');

  $modalDialog.dialog('option', 'buttons',
    {
      'Yes': () => {
        $.post(`/orders/${id}/ready`, function() {
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
