//HEY!! Get out of here, go play the game >:(
var consoleHandler;
var statsHandler;
var commandSplit;
inputDirector = 0;
var player = new Player();

function parseCommand(command){
	command = command.trim();
	consoleHandler.addToHistory(command, true);
	consoleHandler.clearSubmitField();
	switch(inputDirector) {
		//Naming character
		case 0:
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
				case "interact":
					if (commandSplit.length != 2){return "'interact'" + shouldHaveOneWord;}
					var objIndex = player.currentRoom.hasObject(commandSplit[1]);
					if (objIndex > -1) {return player.currentRoom.interact(objIndex);}
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
				return "Correct";
			}
			else {
				consoleHandler.addToHistory("This doesn't feel right. You erase what you wrote. Try writing again or 'back' to exit.", false);
				player.decreaseSanity(10, consoleHandler, true);
				return "";
			}
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
	if (response.length > 0) {consoleHandler.addToHistory(response, false);}
	
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