// maze.js

var org = org || {};
org.stoffie = org.stoffie || {};
org.stoffie.maze = org.stoffie.maze || {};

//(function () {
console.log('hi maze.js');
	var maze = org.stoffie.maze;
	maze.CELL_SIZE = 50; // How many pixels is big a cell?
	maze.DIRECTIONS = ['up','down','left','right'];
	/* A wall is done of concrete.
	 */
	maze.Wall = function () {
		this.exists = true; // Should the wall be drawn?
	}
	
	/* A cell is surrounded by walls.
	 */
	maze.Cell = function () {
		this.visited = false; // Has been the cell visited?
		this.neighbors = {}; // At most 4: up down left right.
		this.neighbor_walls = {};
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
	maze.Maze = function (rows, columns) {
		this.complete = false;
		this.rows = rows;
		this.columns = columns;
		this.cells = [];
		this.cell_stack = [];
		for (var i = 0; i < rows; i++) {
			this.cells[i] = [];
			for (var j = 0; j < columns; j++) {
				this.cells[i][j] = new maze.Cell();
			}
		}

		for (var i = 0; i < this.rows -1; i++) {
			for (j = 0; j < this.columns; j++) {
//console.log('vertical wall i:' + i + ' j:' + j);
				var wall = new maze.Wall();
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
//console.log('horizontal wall i:' + i + ' j:' + j);
				var wall = new maze.Wall();
				var cell_left = this.cells[i][j];
				var cell_right = this.cells[i][j + 1];
				cell_left.neighbors['right'] = cell_right;
				cell_left.neighbor_walls['right'] = wall;
				cell_right.neighbors['left'] = cell_left;
				cell_right.neighbor_walls['left'] = wall;
			}
		}
		this.current_cell = this.cells[0][0];
		this.cell_stack.push(this.cells[0][0]);
	};
	maze.Maze.prototype.continue_generation = function () {
//console.log('continue_generation');
		var current_cell = this.cell_stack[this.cell_stack.length -1];
		current_cell.visited = true;
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
				var direction = neighbors_list[Math.floor(Math.random() * neighbors_count)];
				current_cell.neighbor_walls[direction].exists = false;
				this.cell_stack.push(current_cell.neighbors[direction]);
				break;
			} else {
				this.cell_stack.pop();
				current_cell = this.cell_stack[this.cell_stack.length -1];
			}
		}
		if (this.cell_stack.length == 0) {
			this.complete = true;
		}
	};
	
	/* Canvas used for drawing over the screen.
	 */
	maze.Canvas = function (element) {
		this.context_2d = element.getContext("2d");
		this.columns = Math.floor(element.width / maze.CELL_SIZE);
		this.rows = Math.floor(element.height / maze.CELL_SIZE);
		if (this.columns % 2 == 0) this.columns--;
		if (this.rows % 2 == 0) this.rows--;
		this.x_span = (element.width - maze.CELL_SIZE * this.columns) / 2;
		this.y_span = (element.height - maze.CELL_SIZE * this.rows) / 2;
		this.width = element.width;
		this.height = element.height;
		this.maze_rows = (this.rows -1)/2;
		this.maze_columns = (this.columns -1)/2;
		// Is this used?
		if (this.maze_rows * this.maze_columns > 1)
console.log('creating the maze structure');
			this.structure = new maze.Maze(this.maze_rows, this.maze_columns);
	};
	maze.Canvas.prototype.draw = function () {
		if (!this.structure.complete)
			this.structure.continue_generation();
		var ctx = this.context_2d; // Alias.
		ctx.fillStyle="#000000";
		ctx.fillRect(0, 0, this.width, this.height);
		// Paint the cells.
		for (i = 0; i < this.maze_rows; i++) {
			for (j = 0; j < this.maze_columns; j++) {
				// Note j is used for the x coordinate and i for the y.
				var x = this.x_span + maze.CELL_SIZE * j * 2 + maze.CELL_SIZE;
				var y = this.y_span + maze.CELL_SIZE * i * 2 + maze.CELL_SIZE;
				ctx.fillStyle = (this.structure.cells[i][j].visited ? '#FFFFFF' : '#000000');
				ctx.fillRect(x, y, maze.CELL_SIZE, maze.CELL_SIZE);
			}
		}
		// Paint the horizontal walls.
		for (i = 0; i < this.maze_rows; i++) {
			for (j = 0; j < this.maze_columns -1; j++) {
				var wall = this.structure.cells[i][j].neighbor_walls['right'];
				// Note j is used for the x coordinate and i for the y.
				var x = this.x_span + maze.CELL_SIZE * j * 2 + maze.CELL_SIZE * 2;
				var y = this.y_span + maze.CELL_SIZE * i * 2 + maze.CELL_SIZE;
				ctx.fillStyle = (wall.exists ? '#000000' : '#FFFFFF');
				ctx.fillRect(x, y, maze.CELL_SIZE, maze.CELL_SIZE);
			}
		}
		// Paint the vertical walls.
		for (i = 0; i < this.maze_rows -1; i++) {
			for (j = 0; j < this.maze_columns; j++) {
				var wall = this.structure.cells[i][j].neighbor_walls['down'];
				// Note j is used for the x coordinate and i for the y.
				var x = this.x_span + maze.CELL_SIZE * j * 2 + maze.CELL_SIZE;
				var y = this.y_span + maze.CELL_SIZE * i * 2 + maze.CELL_SIZE * 2;
				ctx.fillStyle = (wall.exists ? '#000000' : '#FFFFFF');
				ctx.fillRect(x, y, maze.CELL_SIZE, maze.CELL_SIZE);
			}
		}
	};
console.log('goodbye maze.js');
//})();
