var consoleHandler;
var statsHandler;
var commandSplit;
inputDirector = 0;
var player = new Player();

function parseCommand(command){
	switch(inputDirector) {
		//Naming character
		case 0:
			consoleHandler.addToHistory(command, true);
			consoleHandler.clearSubmitField();
			player.name = command;
			statsHandler.setTitle(command);
			var matches = new Matches(0);
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
					if (commandSplit.length != 2){return "'use'" + shouldHaveOneWord;}
					return player.useItem(commandSplit[1]);
					break;
				case "look":
					return player.currentRoom.description;
					break;
				case "examine":
					if (commandSplit.length != 2){return "'examine'" + shouldHaveOneWord;}
					var objIndex = player.currentRoom.hasObject(commandSplit[1]);
					if (objIndex > -1) {return player.currentRoom.examine(objIndex);}
					objIndex = player.hasItem(commandSplit[1]);
					if (objIndex > -1) {return player.inventory[objIndex].description;}
					return "'" + commandSplit[1] + "' is not in this area or your inventory."
					break;
				case "search":
					if (commandSplit.length != 2){return "'search'" + shouldHaveOneWord;}
					var objIndex = player.currentRoom.hasObject(commandSplit[1]);
					if (objIndex > -1) {return player.currentRoom.search(objIndex, player);}
					return "'" + commandSplit[1] + "' is not in this area.";
					break;
				case "go":
					if (commandSplit.length != 2){return "'go'" + shouldHaveOneWord;}
					return player.currentRoom.go(commandSplit[1], player);
					break;
				case "hint":
					return player.currentRoom.hint;
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
	//console.log("Hello");
	//sleep(1000).then(() => {console.log("world!");});
	
	//console.log(document.getElementById("history").innerText);
	
	var promptForm = document.getElementById("prompt");
	promptForm.addEventListener('submit', submitForm);
	
	consoleHandler = new ConsoleHandler("command", "history", 30);
	statsHandler = new StatsHandler("stats_title", "sanity", "inventory");
	
	//Focus cursor on input field
	document.getElementById("command").focus();
}