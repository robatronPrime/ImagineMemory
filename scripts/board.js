var MatchGame = function(targetID) {
	//private variables
	var cards = []
	var card_value = ["1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A", "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B"];
	
	var started = false;
	var matches_found = 0;
	var card1 = false, card2 = false;
	
	//turn card face down
	var hideCard = function(id) {
		cards[id].firstChild.src = "cards/back.png";
		with(cards[id].style){
			WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
		}
	};
	
	// move card to pack
	var moveToPack = function(id) {
		hideCard(id);
		cards[id].matched = true;
		with(cards[id].style) {
			zIndex = "1000";
			top = "100px";
			left = "-140px";
			WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
			zIndex = "0";
		}
	};
	
	// deal card
	var moveToPlace = function(id) {
		cards[id].matched = false;
		with(cards[id].style) {
			zIndex = "1000";
			top = cards[id].fromtop + "em";
			left = cards[id].fromleft + "em";
			WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
			zIndex = "0";			
		}
	};
	
	// turn card face up, check for match
	var showCard = function(id) {
		if(id === card1) return;
		if(cards[id].matched) return;
		
		cards[id].firstChild.src = "cards/" + card_value[id] + ".png";
		with(cards[id].style) {
			WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
		}
		
		if(card1 !== false) {
			card2 = id;
			if(parseInt(card_value[card1]) == parseInt(card_value[card2])) { //match found
				(function(card1, card2){
					setTimeout(function() {moveToPack(card1); moveToPack(card2);}, 1000);
				})(card1, card2);
				if(++matches_found == 8) { //game over, reset
					matches_found = 0;
					started = false;
				}
			} else { //no match
				(function(card1, card2) {
					setTimeout(function() {hideCard(card1); hideCard(card2);}, 800);
				})(card1, card2);
			}
			card1 = card2 = false;
		} else { // first card turned over
			card1 = id;
		}
	};
	
	var cardClick = function(id) {
		if(started) {
			showCard(id);
		} else {
			//shuffle and deal cards
			card_value.sort(function(){ return Math.round(Math.random()) - 0.5; });
			for(i=0; i < 16; i++) {
				(function(idx) {
					setTimeout(function() { moveToPlace(idx); }, idx * 100);
				})(i);
			}
			started = true;
		}
	};
	
	//initialise
	
	var stage = document.getElementById(targetID);
	var felt = document.createElement("div");
	felt.id = "felt";
	stage.appendChild(felt);
	
	//template for card
	var card = document.createElement("div");
	card.innerHTML = "<img src=\"cards/back.png\">";
	
    if (document.getElementByID('stage').style))
	for(var i=0; i < 16; i++) {
		var newCard = card.cloneNode(true);
		
		newCard.fromtop = 1 + 7 * Math.floor(i/4);
		newCard.fromleft = 1 + 7 * (i%4);
		(function(idx){
			newCard.addEventListener("click", function() {cardClick(idx); }, false);
		})(i);
		
		felt.appendChild(newCard);
		cards.push(newCard);
	}
	
}