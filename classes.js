var inputDirector;
var room0;
var room1;

class Item {
	#id;
	#name;
	#description;
	constructor(id, name, description) {
		this.#id = id;
		this.#name = name;
		this.#description = description;
	}
	get name() {
		return this.#name;
	}
	get description() {
		return this.#description;
	}
	get id() {return this.#id;}
	getArticle() {
		if (this.#name.charAt(0) in vowels) {return "an";}
		else {return "a";}
	}
	use(player) {return "Nothing happens.";}
}

class Matches extends Item {
	constructor(id) {super(id, "Matches", "A box of matches.");}
	use(player) {
		if (player.currentRoom.dark) {
			player.currentRoom.light();
			return "You strike a match to illuminate the space around you.";
		}
		else {return "There is already enough light in this room.";}
	}
}
class Key extends Item {
	constructor(id) {super(id, "Key", "A small brass key.");}
	use(player) {
		for(var k of Object.keys(player.currentRoom.connections)) {
			if (player.currentRoom.connections[k].idRequired == super.id) {
				player.currentRoom.connections[k].locked = false;
				player.removeItem(super.id);
				return "You unlocked the " + k + " door.";
			}
		}
		return "You can't use that here.";
	}
}
//Have room connectors that keys can be used on to unlock
//or unlock automatically if player uses 'go' with key in their inventory

class RoomObject {
	#name;
	#description;
	#searchItems;
	constructor(name, searchItems) {
		this.#name = name;
		this.#searchItems = searchItems;
	}
	get name() {return this.#name;}
	get description() {return this.#description;}
	set description (d) {this.#description = d;}
	examine() {return "It's nothing interesting.";}
	interact() {return "You can't interact with that."}
	search(player) {
		if (this.#searchItems.length > 0) {
			var namesList = [];
			for (var item of this.#searchItems) {
				player.giveItem(item);
				namesList.push(item.getArticle() + " " + item.name);
			}
			this.#searchItems = [];
			return "You find " + stringListToSentence(namesList) + ".";
		}
		else {return "You don't find anything interesting."}
	}
}

class Boxes extends RoomObject {
	constructor(searchItems) {
		super("boxes", searchItems);
		super.description = "Just some worn, empty boxes.";
	}
	//get name() {return super.name;}
	examine() {return super.description;}
}
class DoorStandard extends RoomObject {
	constructor(searchItems) {
		super("door", searchItems);
		super.description = "A weathered but sturdy wooden door." 
	}
	examine() {return super.description;}
}
class Shelves extends RoomObject {
	constructor(searchItems) {
		super("shelves", searchItems);
		super.description = "Metal shelving units.";
	}
	examine() {return super.description;}
}
var boxes = new Boxes([]);
var door = new DoorStandard([]);
var shelves = new Shelves([new Key(1)]);

class RoomConnector {
	#id;
	#locked;
	#goMessage;
	#unlockMessage;
	#refuseMessage;
	#map;
	#idRequired;
	constructor(id, locked, goMessage, unlockMessage, refuseMessage, map, idRequired){
		this.#id = id;
		this.#locked = locked;
		this.#goMessage = goMessage;
		this.#unlockMessage = unlockMessage;
		this.#refuseMessage = refuseMessage;
		this.#map = map;
		this.#idRequired = idRequired;
	}
	get locked() {return this.#locked;}
	set locked(l) {this.#locked = l;}
	get goMessage() {return this.#goMessage;}
	get unlockMessage() {return this.#unlockMessage;}
	get refuseMessage() {return this.#refuseMessage;}
	get map() {return this.#map;}
	get idRequired() {return this.#idRequired;}
}
var connector0 = new RoomConnector(0, true, "You head through the door.", "You unlock the door.", "You do not have the key for this door.", {0:1, 1:0}, 1);


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
	get connections() {return this.#connections;}
	get dark() {return this.#dark;}
	light() {this.#dark = false;}
	hasObject(objectName) {
		//Returns the index of object in roomObjects array or -1 if not found
		for (let i=0; i<this.#roomObjects.length; i++) {
			if (this.#roomObjects[i].name.toLowerCase() == objectName) {return i;}
		}
		return -1;
	}
	examine(objectIndex) {
		if (this.#dark) {return tooDark;}
		else {return this.#roomObjects[objectIndex].examine();}
	}
	search(objectIndex, player) {
		if (this.#dark) {return tooDark;}
		else {return this.#roomObjects[objectIndex].search(player);}
	}
	go(direction, player) {
		//console.log(direction);
		//console.log(this.#connections.toString())
		if (this.#dark) {return tooDark;}
		if (direction in this.#connections) {
			//console.log(this.#connections[direction]);
			if (this.#connections[direction].locked) {
				//Check if we have the key
				var has = player.hasItem(this.#connections[direction].idRequired);
				if (has > -1) {
					this.#connections[direction].locked = false;
					player.removeItem(this.#connections[direction].idRequired);
					player.currentRoom = roomList[this.#connections[direction].map[this.#id]];
					return this.#connections[direction].unlockMessage + "<br>" + this.#connections[direction].goMessage;
				}
				else {return this.#connections[direction].refuseMessage;}
			}
			else {
				if (this.#id in this.#connections[direction].map) {
					player.currentRoom = roomList[this.#connections[direction].map[this.#id]];
					return this.#connections[direction].goMessage;
				}
				else {return "The door is unlocked, but you can't go that way.";}
			}
		}
		else {return "You can't go that way.";}
	}
}
room0 = new Room(0, "This is a supply closet. There are some shelves against the walls and battered empty boxes by your feet.<br>The only door is to the north.", [], {"north":connector0}, [], [boxes, door, shelves], true);
room1 = new Room (1, "You are in what appears to be an abandoned classroom. Tables and chairs are placed untidily across the room and the floors and surfaces are littered with stationary.<br>To the north is a large teachers desk and a blackboard with something written on it.<br>To the east, there is a set of windows but they are too dirty to outside.<br> To the west is a door leading to a hallway.<br>To the south is the door to the supply closet.", [], {"south":connector0}, [], [], false);

var roomList = [room0, room1];

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
		if (typeof itemName == "string"){
			for (const e of this.#inventory) {
				if (e.name == itemName) {
					this.#inventory.splice(i, 1);
					break;
				}
				i++;
			}
		}
		else {
			for (const e of this.#inventory) {
				if (e.id == itemName) {
					this.#inventory.splice(i, 1);
					break;
				}
				i++;
			}
		}
	}
	hasItem(itemName) {
		if (typeof itemName == "string"){
			//Returns the index of specified item in inventory or -1 if missing
			itemName = itemName.toLowerCase();
			for (let i=0; i<this.#inventory.length; i++){
				if (itemName == this.#inventory[i].name.toLowerCase()){return i;}
			}
			return -1;
		}
		else {
			//Same but for item id rather than name
			for (let i=0; i<this.#inventory.length; i++) {
				if (itemName == this.#inventory[i].id) {return i;}
			}
			return -1;
		}
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