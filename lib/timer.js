/**
 * A timer that measure frame time
 */
function Timer () {
  this.start = timems();
  this.lastFrame = this.start;
  this.frameElapsed = 0;
};

Timer.prototype.newFrame = function () {
  var currentTime = timems();
  this.frameElapsed = (currentTime-this.lastFrame)/1000.0;
  this.lastFrame = currentTime;
};

