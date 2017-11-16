var card = function () {
	"use strict";
	var settings = {
		rows : 2,
		cols : 3,
		baseScore : 50,
		numCardTypes : 3
	};
	
	return {
		settings : settings
	};
};
	
card.board = (function () {
	"use strict";
	var settings,
		cards,
		cols,
		rows,
		baseScore,
		numCardsTypes;
		
	function initialize() {
		settings = card.settings;
		numCardsTypes = settings.numCardTypes;
		baseScore = settings.baseScore;
		cols = settings.cols;
		rows = settings.rows;
		fillBoard();
	}
		
	function fillBoard() {}
		
	function getCard() {}
//3456789
	function print() {
		var str = " ",
			y,
			x;
		for (y = 0; y < rows; y++) {
			for (x = 0; x < cols; x++) {
				str += getCard(x, y) + " ";
			}
			str += "\r\n";
		}
		console.log(str);
	}
		
	return {
		initialize : initialize,
		print : print
	};
});

