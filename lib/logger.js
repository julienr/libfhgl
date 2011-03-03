/**
 * A class that allow to use a DIV on the page to log text
 */
function Logger (div) {
  this.div = div;
}

Logger.prototype.log = function (msg) {
  var old = this.div.html();
  this.div.html(old+msg+"<br />");
};

Logger.prototype.clear = function (msg) {
  this.div.html("");
};
