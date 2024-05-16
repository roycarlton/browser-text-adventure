var helpP = "<b>look</b> - describes what can be seen around you.<br><b>use</b> [item] - to use an item from your inventory, e.g. 'use matches'.<br><b>examine</b> [subject] - takes a closer look at either an item in your inventory or something around you.<br><b>go</b> [direction] - use this to move either north, south, east or west e.g. 'go north'.<br><b>search</b> [subject] - search something in the area around you to find hidden items or information.";
var introP = "Instructions: In this game, you will play by entering commands after the three chevrons (>>>) below. To see a list of helpful commands, type 'help'. To the right, you will see your sanity and inventory, if your sanity score reaches 0, you will go insane.<br><br>You begin in a completely dark room, unable see anything but it smells damp and you can feel that the walls are close. You don't remember how you got here.";
var shouldHaveOneWord = " should have exactly 1 word after it.";
var tooDark = "It's too dark for that.";
var vowels = ["a", "e", "i", "o", "u"];
function stringListToSentence(l) {
	var len = l.length;
	if (len == 1) {return l[0];}
	out = "";
	for (let i=0; i<len-1; i++) {
		out += (l[i] + ", ");
	}
	out += ("and " + l[len-1])
	return out;
}