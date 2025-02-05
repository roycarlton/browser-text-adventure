var helpP = "<b>look</b> - describes what can be seen around you.<br><br><b>use</b> [item] - to use an item from your inventory, e.g. 'use matches'.<br><br><b>examine</b> [subject] - takes a closer look at either an item in your inventory or something around you.<br><br><b>take</b> [subject] - take an item from the area around you and put it in your inventory.<br><br><b>go</b> [direction] - use this to move either north, south, east or west e.g. 'go north'.<br><br><b>search</b> [subject] - search something in the area around you to find hidden items or information.<br><br><b>interact</b> [subject] - interact with something in the space around you.<br><br><b>hint</b> - type this if you get stuck.";
var introP = "Instructions: In this game, you will play by entering commands after the three chevrons (>>>) below. To see a list of helpful commands, type 'help'. To the right, you will see your sanity and inventory, if your sanity score reaches 0, you will go insane.<br><br>You begin in a completely dark room, unable see anything but it smells damp and you can feel that the walls are close. You don't remember how you got here.";
var shouldHaveOneWord = " should have exactly 1 word after it.";
var tooDark = "It's too dark for that.";
var vowels = ["a", "e", "i", "o", "u"];
var spinChars = ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}'];
var numSpinChars = spinChars.length;
var stockwellSign = `<span style="white-space:pre;">
                0000000000000                
             000             000             
          00     000     000     00          
         0    00             00    0         
       00   00                 00   00       
      00  00                     00  00      
      00  0                       0  00      
000000000000000000000000000000000000000000000
0                                           0
0                 STOCKWELL                 0
0                                           0
000000000000000000000000000000000000000000000
      00  0                       0  00      
      00  00                     00  00      
       00   00                 00   00       
         0    00             00    0         
          00     000     000     00          
             000             000             
                0000000000000                
				</span>`;
function getRandomChar() {
	return spinChars[Math.floor(Math.random()*spinChars.length)];
}
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
function splitStringToList(s) {
	var out = [];
	for (var i=0; i<s.length; i++) {
		out.push(s[i]);
	}
	return out;
}