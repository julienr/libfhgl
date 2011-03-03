function Keyboard (camera) {
  this.keyMap = {} //maintain callbacks for each key
  this.keyPressed = {} //state of each key

  this._configure(camera);
  this._attachCallbacks(camera);
  this.camera = camera;
}

Keyboard.Actions = {
  FORWARD:0,
  BACKWARD:1,
  LEFT:2,
  RIGHT:3
};

Keyboard.prototype._configure = function (camera) {
  this.keyMap[65] = Keyboard.Actions.LEFT;
  this.keyMap[68] = Keyboard.Actions.RIGHT;
  this.keyMap[87] = Keyboard.Actions.FORWARD;
  this.keyMap[83] = Keyboard.Actions.BACKWARD;

  for (var k in this.keyMap) {
    this.keyPressed[k] = false;
  }
};

//Apply keyboard events
//FIXME: we might miss some event if we're lagging a lot and the key is pressed/unpressed during the same frame
Keyboard.prototype.handleEvents = function (frameTime) {
  var xmove = 0;
  var zmove = 0;
  for (var k in this.keyPressed) {
    if (this.keyPressed[k]) {
      switch (this.keyMap[k]) {
        case Keyboard.Actions.LEFT: xmove += 1; break;
        case Keyboard.Actions.RIGHT: xmove -= 1; break;
        case Keyboard.Actions.FORWARD: zmove += 1; break;
        case Keyboard.Actions.BACKWARD: zmove -= 1; break;
      }
    }
  }
  logger.log("xmove : " + xmove + ", zmove : " + zmove);
  this.camera.move(zmove, xmove, frameTime);
};

Keyboard.prototype._attachCallbacks = function (camera) {
  $(document).keydown(bind(this, function(event) {
    var w = event.which;
    if (w in this.keyPressed) {
      this.keyPressed[w] = true;
    }
  }));

  $(document).keyup(bind(this, function(event) {
    var w = event.which;
    if (w in this.keyPressed) {
      this.keyPressed[w] = false;
    }
  }));
};
