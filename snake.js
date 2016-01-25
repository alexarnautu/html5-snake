window.onload = function() {
	// Define canvas
	var canvas = document.getElementById("scene");
	var score_board = document.getElementById("score");

	var ctx = canvas.getContext('2d');

	// Set board size
	canvas.width = 508;
	canvas.height = 508;

	var active = 1; // 1 if the game is running
	
	snake = new Array(5); // The game starts with a snake of length 5

	// Create map  
	map = new Array(60);

	for(var i = 0; i < 60; i++)
		map[i] = new Array(60);

	/*
	Directions: 
	Up = 1
	Down = 2
	Left = 3
	Right = 4
	*/
	direction = 2;

	// Food coordinates 
	var food_x = 0;
	var food_y = 0;

	var score = 0; // Game score

	function clear_map() {
		// Clears the map
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for(var x = 0; x < map.length; x++) {
			for(var y = 0; y < map[x].length; y++) {
				map[x][y] = 0;
			}
		}
	}

	function create_food() {
		// Generate the food coordinates
		coord_x = Math.round(Math.random() * 46) + 2;
		coord_y = Math.round(Math.random() * 46) + 2;

		// If the place on the map is not free, it will generate another coordinates until the condition is met
		while(map[coord_x][coord_y] == 1 && coord_x != 0 && coord_x != 50 && coord_y != 0 && coord_y != 50) {
			coord_x = Math.round(Math.random() * 46) + 2;
			coord_y = Math.round(Math.random() * 46) + 2	;
		}

		food_x = coord_x;
		food_y = coord_y;
	}

	function create_snake() {
		// Generate the snake for the first time
		coord_x = 25;
		coord_y = 25;

		for(var i = 0; i < snake.length; i++) {
			snake[i] = {'x': coord_x, 'y': coord_y-i};
			map[coord_x][coord_y-i] = 1;
		} 
	}

	function render_map() {
		// Renders the elements of the map
		
		// Render the food
		ctx.fillStyle = "#ff6600";
		ctx.fillRect(food_x*10+1, food_y*10+1, 8, 8);

		// Render the snake
		for(var x = 0; x < map.length; x++) {
			for(var y = 0; y < map[x].length; y++) {
				if(map[x][y] == 1) {
					ctx.fillStyle = "#c68c53";
					ctx.fillRect(x*10, y*10, 10, 10);
					ctx.fillStyle = "#3366ff";
					ctx.fillRect(x*10+1, y*10+1, 8, 8);
				} 
			}
		}
	}

	function render_score() {
		// Show the score
		score_board.innerHTML = "Score: " + score;
	}

	function render_scene() {
		// Render the scene

		// Render the table
		ctx.fillStyle = '#c68c53';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Render the walls
		ctx.lineWidth = 4;
		ctx.strokeStyle = '#663200';	
		ctx.strokeRect(2, 2, canvas.width - 4, canvas.height-4);
	}

	function eat_food() {
		// Check if the snake ate the food, if so returns true
		for(var i = 0; i < snake.length; i++)
			if(snake[i]['x'] == food_x && snake[i]['y'] == food_y)
			{
				return true;
			} 	 
	}

	function check_for_canibalism() {
		// Checks if the snake ate himself, if so returns true
		for(var i = 0; i < snake.length; i++) {
			for(var j = 0; j < snake.length; j++)
			{
				if(i != j) {
					if(snake[i]['x'] == snake[j]['x'] && snake[i]['y'] == snake[j]['y'])
					{
						return true;
					}
				}
			}
		}
	}

	render_scene();
	create_snake();
	create_food();
	render_map();

	window.addEventListener('keydown', function(e) {
		// Check if the snake needs to change direction
		if(e.keyCode == 37 && direction != 3 && direction != 4) {
			direction = 3;
			setTimeout(function(){}, 700);
		}
		if(e.keyCode == 38 && direction != 1 && direction != 2) {
			direction = 1;
			setTimeout(function(){}, 700);
		} else 
		if(e.keyCode == 39 && direction != 4 && direction != 3) {
			direction = 4;
			setTimeout(function(){}, 700);
		} else 
		if(e.keyCode == 40 && direction != 2 && direction != 1) {
			direction = 2;
			setTimeout(function(){}, 700);
		}
	});

	window.setInterval(function() {
		if(active == 1) { 
			clear_map();

			// Update snake's coordinates

			newsnake = Array(5);

			for(var i = snake.length - 1 ; i > 0; i--) {
				newsnake[i] = snake[i-1];
				map[newsnake[i]['x']][newsnake[i]['y']] = 1;
			}

			newsnake[0] = {'x': 0, 'y': 0};

			if(direction == 1) {
				newsnake[0]['y'] = snake[0]['y'] - 1;
				newsnake[0]['x'] = snake[0]['x'];
			} else 
			if(direction == 2) { 
				newsnake[0]['y'] = snake[0]['y'] + 1;
				newsnake[0]['x'] = snake[0]['x'];
			} else 
			if(direction == 3) { 
				newsnake[0]['y'] = snake[0]['y'];
				newsnake[0]['x'] = snake[0]['x'] - 1;
			} else 
			if(direction == 4) {
				newsnake[0]['y'] = snake[0]['y'];
				newsnake[0]['x'] = snake[0]['x'] + 1;
			} 

			map[newsnake[0]['x']][newsnake[0]['y']] = 1;

			// Update snake position
			snake = newsnake;

			// Check if the snake hit the wall, if so, the game ends
			if(snake[0]['x'] == 0 || snake[0]['x'] == 50  || snake[0]['y'] == 0 || snake[0]['y'] == 50)
				active = 0;
			
			// Check if the snake ate the food
			if(eat_food() == true)
			{
				snake.push({'x': snake[snake.length-1]['x'], 'y': snake[snake.length-1]['y']});
				create_food();
				score = score + 1;
			} else { 
				// Check if the snake ate himself, if so the game ends
				if(check_for_canibalism() == true) {
					active = 0;
				}
			}

			// If everything went well, update the scene
			render_scene();
			render_map();
			render_score();
		} else {
			// If the game ended, print the message
			score_board.innerHTML = "Game over! Please refresh the page to try again.";
		}

	}, 100); 
		
};

