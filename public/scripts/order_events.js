let $selectedOrder = null;
let $previousParent = null;

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
        fillModalWithReadyPrompt(startTime, orderID);
        break;
    }

    $('#modal-dialog').dialog('open');
    $(this).append(ui.draggable);
  }
};

const undoDropEvent = function(event) {
  $(this).empty();
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

  const $modalDialog = $("#modal-dialog");
  $modalDialog.append($modalForm);
  $modalDialog.dialog('option', 'title', 'Estimated Preparation Time');

  $modalDialog.dialog('option', 'buttons',
    {
      'OK': (id) => {
        $.post(`/orders/${id}/prepare`, {
          state: $(this).closest('h4').text(),
          pickupTime: $(this).find('.created-date').text()
        }, function() {
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

  $("#modal-dialog").append($modalForm);
  $("#modal-dialog").dialog('option', 'title', 'Confirm Ready Order');

  $('#modal-dialog').dialog('option', 'buttons',
    {
      'Yes': (id) => {
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
