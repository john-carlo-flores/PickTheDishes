$(() => {
  $('.orders').droppable({
    opacity: '0.6',
    revert: invalid,
    containment: '.content',
    cursor: move,
    stack: orders
  });
  $('.orders').droppable({
    accept: '.order',
    drop: handleDropEvent
  });
});

const handleDropEvent = function(event , ui) {
  ui.draggable.draggable( 'option', 'revert', false );
}
