function World (gl) {
  this._box = makeBox(gl);
  this.cubes = [];
}

//Populate world with cubes at random positions/colors
World.prototype.populate = function (numCubes) {
  //cubes centers coordinate ranges for (x,y,z). [a,b] means the coordinate average is a and b is the 
  //range => the coordinate will be in [a-b/2, a+b/2]
  var worldSize = [[0,20],
                   [0,20],
                   [0,20]]; 

  //range[0] is average, range[1] is range
  randRange = function (range) {
    return range[0] + (Math.random()>0.5?1:-1)*Math.random()*range[1]/2.0;
  };
  
  for (var i=0; i<numCubes; i++) {
    var pos = [randRange(worldSize[0]), randRange(worldSize[1]), randRange(worldSize[2])];
    var col = [Math.random(), Math.random(), Math.random()];
    this.addCube(pos, col);
  }
}

World.prototype.addCube = function (position, color) {
  this.cubes.push({"pos":position, "color":color});
}

World.prototype.draw = function (gl) {
  // Set up all the vertex attributes for vertices, normals and colors
  gl.bindBuffer(gl.ARRAY_BUFFER, this._box.vertexObject);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this._box.normalObject);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

  //index
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._box.indexObject);

  for (var i=0; i<this.cubes.length; i++) {
    var cpos = this.cubes[i]["pos"];
    var ccol = this.cubes[i]["color"]
    gl.uniform4f(gl.getUniformLocation(gl.program, "u_worldPosition"), cpos[0], cpos[1], cpos[2], 1);
    gl.uniform4f(gl.getUniformLocation(gl.program, "u_color"), ccol[0], ccol[1], ccol[2], 1);
    gl.drawElements(gl.TRIANGLES, this._box.numIndices, gl.UNSIGNED_BYTE, 0);
  }
}

