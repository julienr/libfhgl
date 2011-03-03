//Creates a new gl view. 
//'doc' the HTML document on which to register Camera and keyboard controls
//'canvas' specify the HTML canvas element on which rendering will be done
//'logger' is an instance of Logger to be used to log GL-related events
function GLView (doc, canvas, logger) {
  this.width = -1;
  this.height = -1;

  this.canvas = canvas;

  this.camera = new Camera(doc, canvas);
  this.logger = logger;
  this.keyboard = new Keyboard(this.camera);
  this.gl = this._initGL();
  if (!this.gl)
    console.log("Error initializing WebGL");

  this.timer = new Timer();
  this.framerate = new Framerate("framerate");
}

GLView.prototype._drawFrame = function (drawCb) {
  this.timer.newFrame();
  // Make sure the canvas is sized correctly.
  this._reshape();

  this.keyboard.handleEvents(this.timer.frameElapsed);

  logger.log("viewMatrix");
  logger.log(matrix2html(this.camera.getViewMatrix()));

  logger.log("mouse down : " + this.camera.mouseDown);


  logger.log("position : " + this.camera.position.toString());

  // Clear the canvas
  var gl = this.gl;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.mvMatrix = this.camera.getViewMatrix();

  // Construct the normal matrix from the model-view matrix and pass it in
  gl.normalMatrix.load(gl.mvMatrix);
  gl.normalMatrix.invert();
  gl.normalMatrix.transpose();
  gl.normalMatrix.setUniform(gl, gl.u_normalMatrixLoc, false);

  // Construct the model-view * projection matrix and pass it in
  gl.mvpMatrix.load(gl.perspectiveMatrix);
  gl.mvpMatrix.multiply(gl.mvMatrix);
  gl.mvpMatrix.setUniform(gl, gl.u_modelViewProjMatrixLoc, false);

  //Draw world
  drawCb(gl);

  // Finish up.
  gl.flush();

  // Show the framerate
  this.framerate.snapshot();
}


GLView.prototype._reshape = function () {
  if (this.canvas.width() == this.width && this.canvas.height() == this.height)
    return;

  this.width = this.canvas.width();
  this.height = this.canvas.height();

  // Set the viewport and projection matrix for the scene
  this.gl.viewport(0, 0, this.width, this.height);
  this.gl.perspectiveMatrix = new J3DIMatrix4();
  this.gl.perspectiveMatrix.perspective(30, this.width/this.height, 1, 10000);
  console.log("Resized to ["+this.width+", "+this.height+"]");
}


GLView.prototype._initGL = function() /*WebGLRenderingContext */ {
  // Initialize
  var gl = initWebGL(
      // The id of the Canvas Element
      "canvas",
      // The ids of the vertex and fragment shaders
      "vshader", "fshader",
      // The vertex attribute names used by the shaders.
      // The order they appear here corresponds to their index
      // used later.
      [ "vPosition", "vNormal", "vColor"],
      // The clear color and depth values
      [ 0.2, 0.2, 0.2, 1 ], 10000);
  if (!gl) {
    return;
  }

  gl.console.log("Starting init...");

  // Set up a uniform variable for the shaders
  gl.uniform3f(gl.getUniformLocation(gl.program, "lightDir"), 0, 0, 1);

  // Create some matrices to use later and save their locations in the shaders
  gl.mvMatrix = new J3DIMatrix4();
  gl.u_normalMatrixLoc = gl.getUniformLocation(gl.program, "u_normalMatrix");
  gl.normalMatrix = new J3DIMatrix4();
  gl.u_modelViewProjMatrixLoc =
    gl.getUniformLocation(gl.program, "u_modelViewProjMatrix");
  gl.mvpMatrix = new J3DIMatrix4();

  // Enable all of the vertex attribute arrays.
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);

  return gl;
}

//Starts an infinite main loop
//'thinkCb' and 'drawCb' are two user-provided callbacks functions.
// thinkCb(elapsed) is called with the elapsed time for the current frame as argument 
// drawCb(gl) is called with the OpenGL context to be used for rendering
GLView.prototype.start = function (thinkCb, drawCb) {
  var v = this;

  var f = function () {
    WebGLUtils.requestAnimationFrame(v.canvas, f);
    logger.clear();
    thinkCb(v.timer.frameElapsed);
    v._drawFrame(drawCb);
  };
  f();
}
