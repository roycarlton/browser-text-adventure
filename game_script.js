var consoleHandler;
var statsHandler;
var commandSplit;
var inputDirector = 0;
var player = new Player();

function parseCommand(command){
	switch(inputDirector) {
		//Naming character
		case 0:
			consoleHandler.addToHistory(command, true);
			consoleHandler.clearSubmitField();
			player.name = command
			statsHandler.setTitle(command);
			var matches = new Matches();
			player.giveItem(matches);
			player.currentRoom = room0;
			inputDirector = 1;
			return introP;
			break;
		//Normal input
		case 1:
			command = command.toLowerCase();
			consoleHandler.addToHistory(command, true);
			consoleHandler.clearSubmitField();
			commandSplit = command.split(" ");
			switch(commandSplit[0]) {
				case "help":
					return helpP;
					break;
				case "use":
					if (commandSplit.length != 2){return "'use' should have exactly 1 word after it.";}
					return player.useItem(commandSplit[1]);
					break;
				case "look":
					return player.currentRoom.description;
					break;
				case "examine":
					if (commandSplit.length != 2){return "'examine' should have exactly 1 word after it.";}
					var objIndex = player.currentRoom.hasObject(commandSplit[1]);
					if (objIndex > -1) {return player.currentRoom.examine(objIndex);}
					objIndex = player.hasItem(commandSplit[1]);
					if (objIndex > -1) {return player.inventory[objIndex].description;}
					return "'" + commandSplit[1] + "' is not in this area or you inventory."
					//Add checks for the players' inventory
					break;
			}
			return "Invalid input";
			break;
	}
}

function submitForm(event){
	//Prevent automatic page refresh on submitting form
	event.preventDefault();
	
	//Get field value
	var command = consoleHandler.readInput();
	
	//Parse the input
	var response = parseCommand(command);
	
	//Print response
	consoleHandler.addToHistory(response, false);
	
	//Update stats
	statsHandler.updateSanity(player.sanity);
	statsHandler.updateInventory(player.inventory);
	
	//auto scroll to the bottom of console to keep the command line visible
	var consoleDiv = document.getElementById("console");
	consoleDiv.scrollTop = consoleDiv.scrollHeight;
		
}

function bodyOnLoad(){
	var promptForm = document.getElementById("prompt");
	promptForm.addEventListener('submit', submitForm);
	
	consoleHandler = new ConsoleHandler("command", "history", 30);
	statsHandler = new StatsHandler("stats_title", "sanity", "inventory");
	
	//Focus cursor on input field
	document.getElementById("command").focus();
}