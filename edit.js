var mouse = {
  pos: v(),
  down: false,
};

var mousedown = null,
  lines = data,
  circles = new Array();

document.addEventListener("mousedown", (e) => {
  if (e.button == 0) {
    mousedown = v(e.offsetX, e.offsetY);
    mouse.down = true;
  } else {
    circles.push({
      x: e.offsetX,
      y: e.offsetY,
    });
  }
});
document.addEventListener("keydown", (e) => {
  circles.push({
    x: mouse.pos.x,
    y: mouse.pos.y,
  });
});
document.addEventListener("mouseup", (e) => {
  var click = v(e.offsetX, e.offsetY);
  lines.push({
    x1: mousedown.x,
    y1: mousedown.y,
    x2: click.x,
    y2: click.y,
  });
  mouse.down = false;
});
document.addEventListener("mousemove", (e) => {
  mouse.pos = v(e.offsetX, e.offsetY);
});
