//Returns a HTML multi-line string representation of the given J3DIMatrix
function matrix2html (matrix) {
  return _matrix2str(matrix, '[', ']', ' ', '<br />', 2);
}

/** Utility function to transform a matrix to a textual representation
/*  @param left is the seperator to show the beginning of a line
 *  @param right is the separator to show the end of a line
 *  @param sep is the separator in-between matrix elements
 *  @param linesep is the line separator
 *  @param precision the number of decimals to show
 */
function _matrix2str (matrix, left, right, sep, linesep, precision) {
  var matArr = matrix.getAsArray();
  var str = left + matArr[0].toFixed(precision);
  for (var i=1; i<matArr.length; i++) {
    if (i%4 == 0) {
      str += right + linesep + left + matArr[i].toFixed(precision);
    } else {
      str += " "+sep+matArr[i].toFixed(precision);
    }
  }
  str += right;
  return str;
}

//Bind a function to a given object scope. Useful when creating callbacks
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

//Clamp val to [min, max]
function clamp (val, min, max) {
  if (val < min)
    return min;
  else if (val > max)
    return max;
  else
    return val;
}

//Return current time in milliseconds since EPOCH
function timems () {
  return new Date().getTime();
}
