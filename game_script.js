//HEY!! Get out of here, go play the game >:(
var consoleHandler;
var statsHandler;
var commandSplit;
inputDirector = 0;
var player = new Player();
var mapLinks = {0:"images/map0.jpg", 1:"images/map1.jpg"};

//Sounds
var doorKnockSound = new Audio("sounds/door_knock_boosted.wav");

function parseCommand(command){
	command = command.trim();
	consoleHandler.addToHistory(command, true);
	consoleHandler.clearSubmitField();
	switch(inputDirector) {
		//insanity
		case -2:
			inputDirector = -1;
			return "<b>As the final dregs of sanity slip from your mind, you see your surroundings dissolve into nothingness and hear the faint sound of someone crying out in the distance.<br><br>GAME OVER</b>";
			break;
		//Game over
		case -1:
			return "";
			break;
		//Naming character
		case 0:
			for (var c of command) {
				if (c == " ") {return "Name must not contain spaces.";}
			}
			player.name = command;
			statsHandler.setTitle(command);
			var matches = new Matches(0);
			player.giveItem(matches);
			player.currentRoom = room2;
			inputDirector = 1;
			return introP;
			break;
		//Normal input
		case 1:
			command = command.toLowerCase();
			commandSplit = command.split(" ");
			switch(commandSplit[0]) {
				case "help":
					return helpP;
					break;
				//case "map":
					//var mapProgress = player.mapProgress;
					
					//break;
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
					objIndex = player.currentRoom.hasItem(commandSplit[1]);
					if (objIndex > -1) {return "You should take it first.";}
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
				case "interact":
					if (commandSplit.length != 2){return "'interact'" + shouldHaveOneWord;}
					var objIndex = player.currentRoom.hasObject(commandSplit[1]);
					if (objIndex > -1) {return player.currentRoom.interact(objIndex);}
					return "'" + commandSplit[1] + "' is not in this area.";
					break;
				case "take":
					if (commandSplit.length != 2){return "'take'" + shouldHaveOneWord;}
					var itemIndex = player.currentRoom.hasItem(commandSplit[1]);
					if (itemIndex > -1) {return player.currentRoom.take(itemIndex, player);}
					return "You can't take that.";
					break;
				case "hint":
					return player.currentRoom.hint;
					break;
			}
			return "Invalid input.";
			break;
		//Interacting with blackboard in room 1
		case 2:
			if (command == "back") {
				inputDirector = 1;
				return "You put down the chalk.";
			}
			if (command.trim().toLowerCase() == player.name.toLowerCase()) {
				blackboard.complete = true;
				inputDirector = 1;
				//Add new key to supply closet room, change description and add sound effects
				room0.addItem(key2);
				room0.description = "This is the supply closet, it looks the same but there is now a key on the floor.";
				doorKnockSound.play();
				return "You write your name on the blackboard and put down the chalk.<br><br>There is a knock coming from the door to the supply closet.";
			}
			else {
				consoleHandler.addToHistory("This doesn't feel right. You erase what you wrote. Try writing again or 'back' to exit.", false);
				player.decreaseSanity(10, consoleHandler, true);
				return "";
			}
			break;
		//Interacting with switches in room 2
		case 3:
			if (command == "back") {
				inputDirector = 1;
				return "You step back from the switches.";
			}
			if (command.length != 8) {return "Invalid input, you must enter a single string of 8 1's or 0's.";}
			for (var digit of command){
				if (digit != "1" && digit != "0"){return "Invalid input, you must enter a single string of 8 1's or 0's.";}
			}
			if (command == "01101010") {
				connector2.locked = false;
				inputDirector = 1;
				return "The north door swings open.";
			}
			else if (command == "11011010") {
				player.giveItem(pills);
				return "A hatch below the switches opens, revealing a pill bottle with several pills inside. You take it.";
			}
			else {
				player.decreaseSanity(10, consoleHandler, true);
				return "A feeling of nausea comes over you. This must be the wrong combination, try a different one.";
			}
			break;
		case 4:
			if (command.toLowerCase() == "back") {
				inputDirector = 1;
				return "You step back from the kiosk.";
			}
			else if (command.toLowerCase() == "brixton"){
				inputDirector = -1;
				player.currentRoom.viewLink = "room3view_dithered_train.png";
				return "You enter your destination and the kiosk's screen turns black.<br><br>Moments later, you hear the rumbling of metal wheels as a train emerges from the tunnel and comes to a stop at the platform.<br><br><b>Thankyou for playing! The rest of this game is still under development, please check back soon to continue :)</b>";
			}
			else {
				player.decreaseSanity(10, consoleHandler, true);
				return "This doesn't feel right.";
			}
			break;
	}
}

function submitForm(event){
	//Prevent automatic page refresh on submitting form
	event.preventDefault();
	
	//Update players' map progress
	if (player.currentRoom.id > player.mapProgress) {player.mapProgress = player.currentRoom.id}
	
	//Get field value
	var command = consoleHandler.readInput();
	
	//Parse the input
	var response = parseCommand(command);
	
	//Print response
	if (response.length > 0) {consoleHandler.addToHistory(response, false);}
	
	//If player is in room 3, lock door behind them
	if (player.currentRoom.id == 3) {connector2.locked = true;}
	
	//If sanity drops to zero, end game
	if (player.sanity <= 0){inputDirector = -2;}
	
	//Update stats
	statsHandler.updateSanity(player.sanity);
	statsHandler.updateInventory(player.inventory);
	statsHandler.updateView(player.currentRoom);
	
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
	statsHandler = new StatsHandler("stats_title", "sanity", "inventory", "view_box");
	
	//Focus cursor on input field
	document.getElementById("command").focus();
}

//Easter egg cause I know u wanted one
/*
MMMMMMMMMMMMMMMMMMMMMMMMMWXOl;..........;lOXWMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMWKxc:::ldxkOOOOkxol::;cd0NMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMXx:;:oOXWWWWWWWWWWWWNNXOdc;:o0NMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMW0l,';lxxkkkkkOOOOOOOOOkkxxxxo;'':xXWMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMW0c'.:oodddoooooddddddddddoollllool,.,dXMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMKl..cddodxxxxkkkkkkkkkkkkkkkxxdddddddo:.'dXWMMMMMMMMMMMM
MMMMMMMMMMMMNx'.cdddxxxkkkOOOkkkkkkkkkkkkxxxxxxxxxxddd:.,OWMMMMMMMMMMM
MMMMMMMMMMMK:'cddxxxxxxxkkkkkkkkkkkkkkxxxxxxxdxxxxxxxxxo;'lXMMMMMMMMMM
MMMMMMMMMWk'.oXNNNNXKK0OOOkkkkkxxxxxxxxxxxkkkkOO00KXXNNNXx';0WMMMMMMMM
MMMMMMMMNd.,lckNNNNNNNNNNNNNNNNXkddddddx0NNNNNNNNNNNNNNNNKc.'kWMMMMMMM
MMMMMMMXl.:xkclKNNNWWWWWWWNNNN0lcdxxkkdlcxXNNNNNNNNNNNNNNd:o,.dWMMMMMM
MMMMMMXc.ckkd:dXNNNWWWWWNNNNNXockkkkkkkko:ONNNNNNNNNNNNNNd:xx;.dNMMMMM
MMMMMNc.,lollxXNNXOkxxkKNNXNNXo:xkkkkkkkl:ONNNNNXK00KNNNN0ocod;.dWMMMM
MMMMNl.cxxkOXNNXkllloollo0NNNN0ocldxxxdlckXNNN0dooooooxKNNXOddo,.xWMMM
MMMWd.lXNNNNNNNx:okkkkkklcONNNNXOxdddddkKNNNNOclxkkkkxclKNNNNNN0,'0MMM
MMMk.:KNNNNNNNXo:kkkkkkkd:xNNNNNNNNNNNNNNNNNXo:kkkkkkkd:xNNNNNNNk.:XMM
MMK;'ONNXNNNNNNkclxkkkkxclKNNNNNNNNNNNNNNNNNNx:okkkkkklcONNNNNNNXl.dWM
MWl.;xkO0KXNNNNN0dooolooxKNNNNNNNNNNNNNNNNNXNXkllloolloONNNNNXK0Od.'0M
MO..cclooddddddxxkkxdxOKXXXNNNNNNNNNNNNNNNNXXXX0xolcloxxddddddooll,.oW
Nc 'oddddoollcccclllooddddddddddddddddddddddddddoooolllllccllooddd; ,0
O'.;dNNNXK0Oo;';oddddddoooolcclllllllllllolclooddddddxl,,cdkkO0KXOc..d
o.:l:ONNNXOdoxkldXNNXXKKKkl;;;oOkkkkkkkOkl;;:d0KKXXNN0loxlcxKXXX0c:c.:
;.ox:lKXkook000OloKNNNNKxlok0dcxXNNNNNNKdlk0xldKNNNN0loOkxoccd0Xd;od.'
..:c:,:lokKK0000OloKWXxlokK000kloKNNNNkloO0000dlxXNOclxxxxxxdccc;:lc..
..,,,,';looooddxxxccoloOKKKKK0K0dlONKdlkKKKKKK0Oolo::ollccc:::;',;;,. 
.:dolllc::cccccclol:;looooooooooo:,;,;looooooooll;',:;;,,,,,,;;:cllo;.
.oKKKkolc:codddddddooolllccccccccccc:ccccccccc::::cccllloooolclok0KKl.
.oKxc;;;;;;:dKXXXXKK00OOkkkxxxxxoccccldxxxxxxxkkkOO00KKKK0o:;;;;:cdkc.
 lx;,cccccc:,oKKKKKXXXXXXXXXXXOl:::;;::oOKKKKKKKKKKKKKKK0c,:c:cc:,'lc.
.:l,;cc:ccc:,lKKKKKKKKKKKKKKKx,,:ccccc:,:OKKKKKKKKKKKKKKx;;cc:::;;';;.
.,d:,;cccc:,:kKKKKKKKKKKKKKKKl,:cc::ccc;,dKKKKKKKKKKKKKK0c,:c:;;;''c,.
;.oxl::::ccdOKKK0kdoodk0KKKKKx;,ccc::c:,:OKKKKK0OkkO0KKKK0o:,,'',;oo.,
d.;xxxxkO0KKKKKd:;;;;;;:xKKKKKkl:;;;;;:oOKKKKOo::;;::oOKK0Oxoolodxk:.o
X;.lxxxxkO0KKKd,;cccccc;;xKKKKKK0kxxxk0KKKKKk:,:cccc:,:xkxxxxxxxxxl.,0
Wk.'dxxxxxxkO0o,:c:cccc:,dKKKKKKKKKKKKKKKKKKo,:cc::::;'cxxxxxxxxdl'.dW
MWd.;dxxxxxxxkd;,;:ccc;,cOKKKKKKKKKKKKKKKKKKx;,::;;;;''oxxxxxxdol,.lNW
MMNo.':cccloddxdc:;;;:cd0KKKKKKKKKKKKKK0000Okd:,'''',:oxxddol:;;..cXMM
MMMNd..::::::ccccc:::clooddxxxxkkkxxxxxxddoooolc;,',;ccc::;;,,,..lXMMM
MMMMWk,.'::::::::::::::::::::::ccccccccccc:::::::::::::;;,,,,'..dNMMMM
MMMMMWKl.,lolllcccccccccc:::::::::::::::c::ccccccc:::;;;;:::'.;0WMMMMM
MMMMMMMWO:..,::cccllllllooooooolloooooooooooolllc::;;;;;;,..,xNMMMMMMM
MMMMMMMMMNO:..',,,,,;;;;:::::::::::::::;;;;;;;,,,,,,,,,'..;xXMMMMMMMMM
MMMMMMMMMMMW0o;...',;;;;;;,,;;;;,,,,,,,,,,,,,,,,;;;,...'cONMMMMMMMMMMM
MMMMMMMMMMMMMMN0o:,'',;:ccc:::::::::::::::::ccc:;'.';lkXWMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMWXOdc:,''',,;;;:::::::;;,,''',;:lx0NMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMWMMWKko:,...         ..';cdOXWMMMMMMMMMMMMMMMMMMMMM
*/