class Item {
	#name;
	#description;
	
	constructor(name, description) {
		this.#name = name;
		this.#description = description;
	}
	get name() {
		return this.#name;
	}
	get description() {
		return this.#description;
	}
	use(player) {return "Nothing happens.";}
}

class Matches extends Item {
	constructor() {
		super("Matches", "A box of matches.");
	}
	use(player) {
		if (player.currentRoom.dark) {
			player.currentRoom.light();
			return "You strike a match to illuminate the space around you.";
		}
		else {return "There is already enough light in this room.";}
	}
}

class RoomConnector {
	#locked;
	
	constructor(){}
}

class RoomObject {
	#name;
	#description;
	constructor(name) {
		this.#name = name;
	}
	get name() {return this.#name;}
	get description() {return this.#description;}
	set description (d) {this.#description = d;}
	examine() {return "It's nothing interesting.";}
	interact() {return "You can't interact with that."}
	search() {return "You don't find anything interesting."}
}

class Boxes extends RoomObject {
	constructor() {
		super("boxes");
		super.description = "Just some worn, empty boxes.";
	}
	//get name() {return super.name;}
	examine() {return super.description;}
}
var boxes = new Boxes();


class Room {
	#id;
	#description;
	#items;
	#connections;
	#interactables;
	#roomObjects;
	#dark;
	
	constructor(id, description, items, connections, interactables, roomObjects, dark) {
		this.#id = id;
		this.#description = description;
		this.#items = items;
		this.#connections = connections;
		this.#interactables = interactables;
		this.#roomObjects = roomObjects;
		this.#dark = dark;
	}
	get description() {
		if (this.#dark) {return "It's too dark to see anything."}
		else {return this.#description;}
	}
	get dark() {return this.#dark;}
	light() {this.#dark = false;}
	hasObject(objectName) {
		//Returns the index of object in roomObjects array or -1 if not found
		for (let i=0; i<this.#roomObjects.length; i++) {
			if (this.#roomObjects[i].name.toLowerCase() == objectName) {return i;}
		}
		return -1;
	}
	examine(objectIndex) {return this.#roomObjects[objectIndex].examine();}
}
var room0 = new Room(0, "This is a supply closet. There are some shelving units against the walls and battered empty boxes by your feet.<br>The only door is to the north.", [], [], [], [boxes], true);
var room1 = new Room (1, "You are in what appears to be an abandoned classroom. Tables and chairs are placed untidily across the room and the floors and surfaces are littered with stationary.<br>To the north is a large teachers desk and a blackboard with something written on it.<br>To the east, there is a set of windows but they are too dirty to outside.<br> To the west is a door leading to a hallway.<br>To the south is the door to the supply closet.", [], [], [], [], false);

class Player {
	#name;
	#sanity;
	#inventory;
	#currentRoom;
	
	constructor() {
		this.#name = "";
		this.#sanity = 100;
		this.#inventory = [];
		this.#currentRoom = null;
	}
	
	get name() {
		return this.#name;
	}
	set name(newName){
		this.#name = newName;
	}
	get sanity() {
		return this.#sanity;
	}
	get currentRoom() {return this.#currentRoom;}
	set currentRoom(r) {this.#currentRoom = r;}
	increaseSanity(x) {
		var newSan = this.#sanity + x;
		if (newSan >= 100) {
			this.#sanity = 100;
		}
		else {
			this.#sanity = newSan;
		}
	}
	decreaseSanity(x) {
		var newSan = this.#sanity - x;
		if (newSan <= 0) {
			this.#sanity = 0;
		}
		else {
			this.#sanity = newSan;
		}
	}
	get inventory() {
		return this.#inventory;
	}
	giveItem(item) {
		this.#inventory.push(item);
	}
	removeItem(itemName) {
		var i = 0;
		for (const e of this.#inventory) {
			if (e.name == itemName) {
				this.#inventory.splice(i, 1);
				break;
			}
			i ++;
		}
	}
	hasItem(itemName) {
		//Returns the index of specified item in inventory or -1 if missing
		itemName = itemName.toLowerCase();
		for (let i=0; i<this.#inventory.length; i++){
			if (itemName == this.#inventory[i].name.toLowerCase()){return i;}
		}
		return -1;
	}
	useItem(itemName) {
		var has = this.hasItem(itemName);
		if (has > -1){return this.#inventory[has].use(this);}
		else {return "You don't have that item.";}
	}
}

class StatsHandler {
	#titleField;
	#sanityField;
	#inventoryField;
	
	constructor(titleField, sanityField, inventoryField) {
		this.#titleField = document.getElementById(titleField);
		this.#sanityField = document.getElementById(sanityField);
		this.#inventoryField = document.getElementById(inventoryField);
	}
	
	setTitle(title) {
		this.#titleField.innerHTML = "<b>" + title + "</b>";
	}
	updateSanity(sanity) {
		this.#sanityField.innerText = sanity.toString();
	}
	updateInventory(inventory) {
		var invList = ""
		for (const e of inventory) {
			invList += "<li>";
			invList += e.name;
			invList += "</li>";
		}
		this.#inventoryField.innerHTML = invList;
	}
}

class ConsoleHandler {
	
	#submitField;
	#historyDiv;
	#historyId;
	#commandHistory;
	#historyPointer;
	#searchPointer;
	#historyMemory;
	
	constructor(submitField, historyDiv, historyMemory) {
		this.#submitField = document.getElementById(submitField);
		this.#historyDiv = document.getElementById(historyDiv);
		this.#historyId = 0;
		this.#historyMemory = historyMemory;
		this.#commandHistory = Array(historyMemory).fill("");
		this.#historyPointer = 0;
		this.#searchPointer = 0;
		//Listen for up and down arrows to recall command history
		this.#submitField.addEventListener('keydown', (event) => {
			if (event.keyCode == 38){
				if (this.#searchPointer > 0){
					this.#searchPointer --;
					this.#submitField.value = this.#commandHistory[this.#searchPointer];
				}
			}
			else if (event.keyCode == 40) {
				var out = "";
				if (this.#searchPointer < 29){
					this.#searchPointer ++;
					out = this.#commandHistory[this.#searchPointer];
				}
				this.#submitField.value = out;
			}
		});
	}
	
	readInput() {
		return this.#submitField.value;
	}
	
	addToHistory(message, chevs) {
		var out = "";
		if (chevs) {
			if (this.#historyPointer >= this.#historyMemory){
				//Remove oldest commands from begining and add new one
				this.#commandHistory = this.#commandHistory.slice(1);
				this.#commandHistory.push(message);
			}
			else {
				this.#commandHistory[this.#historyPointer] = message;
				this.#historyPointer ++;
			}
			this.#searchPointer = this.#historyPointer;
			out += ">>> ";
		}
		out += message;
		var para = document.createElement("p");
		para.setAttribute("id", this.#historyId.toString());
		this.#historyDiv.appendChild(para);
		document.getElementById(this.#historyId.toString()).innerHTML = out;
		this.#historyId ++;
	}
	
	clearSubmitField() {
		this.#submitField.value="";
	}
}