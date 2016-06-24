import { View } from "./view/view";

var view, time;
function main() {
  view = new View(document.getElementById("main-canvas"));
  time = Date.now();
  schedule_draw();
}

window.addEventListener("load", () => {
  main();
});


function draw(t) {
  view.render(t);
}

function draw_loop() {
  const t = (Date.now() - time) * 0.001;
  draw(t);
  schedule_draw();
}
function schedule_draw() {
  window.requestAnimationFrame(draw_loop);
}
