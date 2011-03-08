/**
 * A class that will handle mouse and keyboard events
 * and translate them to FPS-style movements
 */
function Camera(document, canvas) {
  canvas.mousedown(bind(this, this.handleMouseDown));
  document.mouseup(bind(this, this.handleMouseUp));
  document.mousemove(bind(this, this.handleMouseMove));

  this.mouseDown = false;
  this.lastMouseX = null;
  this.lastMouseY = null;
  this.sensitivity = 0.05;
  this.totX = 0;
  this.totY = 0;
  this.position = new J3DIVector3(0, 0, -15);
  this.rotMatrix = new J3DIMatrix4(); //only view rotation
  this.viewMatrix = new J3DIMatrix4(); //viewMatrix is rotMatrix + position translation
  this.moveSpeed = 4;
  this._refresh();
}

//translate the camera by the given J3DIVector3
Camera.prototype.translate = function (vec) {
  this.position.add(vec);
  this._refresh();
};

Camera.prototype.setPosition = function (vec) {
  this.position.load(vec);
  this._refresh();
};

//return the Z axis (in world coordinates) of this camera
Camera.prototype.getZAxis = function () {
  var m = this.rotMatrix.$matrix;
  return new J3DIVector3(m.m13, m.m23, m.m33);
};

//return the X axis (in world coordinates) of this camera
Camera.prototype.getXAxis = function () {
  var m = this.rotMatrix.$matrix;
  return new J3DIVector3(m.m11, m.m21, m.m31);
};

//return the Y axis (in world coordinates) of this camera
Camera.prototype.getYAxis = function () {
  var m = this.rotMatrix.$matrix;
  return new J3DIVector3(m.m12, m.m22, m.m32);
};

//zaxis, xaxis should be {-1,0,1}, indicating the movement dir on each axis
Camera.prototype.move = function (zaxis, xaxis, yaxis, time) {
  if (zaxis != 0) {
    var tr = this.getZAxis().mult(time*this.moveSpeed*zaxis);
    this.translate(tr);
  }
  if (xaxis != 0) {
    var tr = this.getXAxis().mult(time*this.moveSpeed*xaxis);
    this.translate(tr);
  }
  if (yaxis != 0) {
    var tr = this.getYAxis().mult(time*this.moveSpeed*yaxis);
    this.translate(tr);
  }
};


Camera.prototype.getViewMatrix = function() {
  return this.viewMatrix;
};

Camera.prototype.handleMouseDown = function(event) {
  this.mouseDown = true;
  this.lastMouseX = event.clientX;
  this.lastMouseY = event.clientY;
};

Camera.prototype.handleMouseUp = function(event) {
  this.mouseDown = false;
};

Camera.prototype.handleMouseMove = function(event) {
  if (!this.mouseDown) {
    return;
  }
  var newX = event.clientX;
  var newY = event.clientY;

  var dX = newX - this.lastMouseX;
  var dY = newY - this.lastMouseY;

  this.totX -= dY*this.sensitivity;
  this.totY -= dX*this.sensitivity;

  this.totX = clamp(this.totX, -180, 180);

  this._refresh();
 
  this.lastMouseX = newX;
  this.lastMouseY = newY;
};

//refresh viewMatrix after internal state change
Camera.prototype._refresh = function () {
  this.rotMatrix.makeIdentity();

  this.rotMatrix.rotate(this.totX, 1, 0, 0);
  this.rotMatrix.rotate(this.totY, 0, 1, 0);

  this.viewMatrix.load(this.rotMatrix);
  this.viewMatrix.translate(this.position);
}
