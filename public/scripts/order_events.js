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

});

const handleDropEvent = function(event , ui) {
  $(this).append(ui.draggable);


}
