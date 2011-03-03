var logger = null;

function main () {
  logger = new Logger($('#log'));
  var c = $('#canvas');

  var glview = new GLView($(document), c);

  var world = new World(glview.gl);
  world.populate(20);

  glview.start(function (elapsed) { logger.log("elapsed : " + elapsed + " [s]"); }, 
               bind(world, world.draw));
}
