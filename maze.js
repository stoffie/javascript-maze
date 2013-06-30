// maze.js

var org = org || {};
org.stoffie = org.stoffie || {};
org.stoffie.maze = org.stoffie.maze || {};

(function () {

var maze = org.stoffie.maze;
maze.CELL_SIZE = 25; // How many pixels is big a cell?
maze.BACKGROUND = '#000000';
maze.FOREGROUND = '#FFFFFF';

/* A wall is done of concrete.
 */
maze.Wall = function (x, y) {
	this.exists = true; // Should the wall be drawn? NOT USED
	this.x = x;
	this.y = y;
}

/* A cell is surrounded by walls.
 */
maze.Cell = function (x, y) {
	this.visited = false; // Has been the cell visited?
	this.neighbors = {}; // At most 4: up down left right.
	this.neighbor_walls = {};
	this.x = x;
	this.y = y;
};

maze.Cell.prototype.unvisited_neighbors = function () {
	var map = {};
	for (var key in this.neighbors) {
		if (!this.neighbors[key].visited) {
			map[key] = this.neighbors[key];
		}
	}
	return map;
}

/* Data structure that keeps track of the cells.
 */
maze.Canvas = function (element, cell_size = maze.CELL_SIZE) {
	this.ctx = element.getContext("2d");
	this.cell_size = cell_size
	this.complete = false;
	this.cells = [];
	this.cell_stack = [];
	columns = Math.floor(element.width / cell_size);
	rows = Math.floor(element.height / cell_size);
	if (columns % 2 == 0) columns--;
	if (rows % 2 == 0) rows--;
	this.x_span = (element.width - cell_size * columns) / 2;
	this.y_span = (element.height - cell_size * rows) / 2;
	this.rows = (rows -1)/2;
	this.columns = (columns -1)/2;
	for (var i = 0; i < rows; i++) {
		this.cells[i] = [];
		for (var j = 0; j < columns; j++) {
			this.cells[i][j] = new maze.Cell(j * 2, i * 2);
		}
	}

	for (var i = 0; i < this.rows -1; i++) {
		for (j = 0; j < this.columns; j++) {
			var wall = new maze.Wall(j * 2, i * 2 + 1);
			var cell_above = this.cells[i][j];
			var cell_down = this.cells[i + 1][j];
			cell_above.neighbors['down'] = cell_down;
			cell_above.neighbor_walls['down'] = wall;
			cell_down.neighbors['up'] = cell_above;
			cell_down.neighbor_walls['up'] = wall;
		}
	}
	for (var i = 0; i < this.rows; i++) {
		for (j = 0; j < this.columns -1; j++) {
			var wall = new maze.Wall(j * 2 + 1, i * 2);
			var cell_left = this.cells[i][j];
			var cell_right = this.cells[i][j + 1];
			cell_left.neighbors['right'] = cell_right;
			cell_left.neighbor_walls['right'] = wall;
			cell_right.neighbors['left'] = cell_left;
			cell_right.neighbor_walls['left'] = wall;
		}
	}
	var i = Math.floor(Math.random() * this.rows);
	var j = Math.floor(Math.random() * this.columns);
	this.cell_stack.push(this.cells[i][j]);

	this.ctx.fillStyle = maze.BACKGROUND;
	this.ctx.fillRect(0, 0, element.width, element.height);
	this.ctx.fillStyle = maze.FOREGROUND;
};

maze.Canvas.prototype.draw = function (object) {
	var x = this.x_span + this.cell_size * (object.x + 1);
	var y = this.y_span + this.cell_size * (object.y + 1);
	this.ctx.fillRect(x, y, this.cell_size, this.cell_size);
}

maze.Canvas.prototype.update = function () {
	var current_cell = this.cell_stack[this.cell_stack.length -1];
	current_cell.visited = true;
	this.draw(current_cell);
	while (this.cell_stack.length > 0) {
		var neighbors = current_cell.unvisited_neighbors();
		var neighbors_count = 0;
		var neighbors_list = [];
		for (var key in neighbors) {
			neighbors_count++;
			neighbors_list.push(key);
		}
		if (neighbors_count > 0) {
			// Chose a random neighbor and insert it into the stack.
			var i = Math.floor(Math.random() * neighbors_count);
			var direction = neighbors_list[i];
			var wall = current_cell.neighbor_walls[direction];
			this.draw(wall);
			//wall.exists = false;
			this.cell_stack.push(current_cell.neighbors[direction]);
			break;
		} else {
			this.cell_stack.pop();
			current_cell = this.cell_stack[this.cell_stack.length -1];
		}
	}
	if (this.cell_stack.length == 0)
		this.complete = true;
};

})();
