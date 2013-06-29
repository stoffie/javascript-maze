// maze.js

var org = org || {};
org.stoffie = org.stoffie || {};
org.stoffie.maze = org.stoffie.maze || {};

(function() {
	var maze = org.stoffie.maze;
	maze.CELL_SIZE = 50; // How many pixels is big a cell?
	maze.DIRECTIONS = ['up','down','left','right'];
	maze.Wall = function () {
		this.exists = true; // Should the wall be drawn?
		this.neighbors = []; // The neighbors are 2 cells.
	}
	maze.Cell = function () {
		this.visited = false; // Has been the cell visited?
		this.neighbors = {}; // At most 4: up down left right. The neighbors are walls.
	};
	maze.Maze = function (rows, columns) {
		this.complete = false;
		this.cells = [];
		this.cell_stack = [];
		for (var i = 0; i < rows; i++) {
			this.cells[i] = [];
			for (var j = 0; j < columns; j++) {
				this.cells[i][j] = new maze.Cell();
			}
		}
		this.current_cell = this.cells[0][0];
	};
	maze.Maze.prototype.update = function () {
		this.current_cell.visited = true;
		var direction = MAZE.DIRECTIONS[Math.floor(Math.random() * 4)];
	};
	maze.Canvas = function (element) {
		this.context_2d = element.getContext("2d");
		this.columns = Math.floor(element.width / maze.CELL_SIZE);
		this.rows = Math.floor(element.height / maze.CELL_SIZE);
		if (this.columns % 2 == 0) this.columns--;
		if (this.rows % 2 == 0) this.rows--;
		this.x_span = (element.width - maze.CELL_SIZE * this.columns) / 2;
		this.y_span = (element.height - maze.CELL_SIZE * this.rows) / 2;
	};
	// Canvas used for drawing over the screen.
	maze.Canvas.prototype.draw = function () {
		var ctx = this.context_2d; // Alias.
		for (var i = 0; i < this.columns; i++) {
			for (var j = 0; j < this.rows; j++) {
				if ((i % 2 == 1 && j % 2 == 0) ||(i % 2 == 0 && j % 2 == 1)) continue;
				ctx.fillStyle="#FF0000";
				var x = this.x_span + maze.CELL_SIZE * i;
				var y = this.y_span + maze.CELL_SIZE * j;
				ctx.fillRect(x, y, maze.CELL_SIZE, maze.CELL_SIZE);
			}
		}
		/*var maze_rows = (rows -1)/2;
		var maze_columns = (columns -1)/2;
		maze = new maze.Maze(maze_rows, maze_columns);
		for (i = 0; i < maze_rows; i++) {
			for (j = 0; j < maze_columns; j++) {
				ctx.fillStyle = (maze.cells[i][j].visited ? '#999999' : '#111111');
				ctx.fillRect(x_span + 50 * i * 2 + 50, y_span + j * 50 * 2 + 50, 50, 50);
			}
		}
		for (i = 0; i < maze_columns; i++) {
			for (j = 0; j < maze_rows -1; j++) {
				ctx.fillStyle = (maze.cells[j][i].wall_down ? '#888888' : '#222222');
				ctx.fillRect(x_span + 50 * i * 2 + 50,
					y_span + j * 50 * 2 + 50 * 2, 50, 50);
			}
		}
		for (i = 0; i < maze_columns -1; i++) {
			for (j = 0; j < maze_rows; j++) {
				ctx.fillStyle = (maze.cells[j][i].wall_right ? '#777700' : '#222200');
				ctx.fillRect(x_span + 50 * i * 2 + 50 * 2,
					y_span + j * 50 * 2 + 50, 50, 50);

			}
		}*/
	}
})();
