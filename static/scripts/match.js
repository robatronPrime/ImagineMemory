//private variables
var cards = []
var Hard_card_value = ["1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A", "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B"];
var Medi_card_value = ["1A", "2A", "3A", "4A", "5A", "6A", "1B", "2B", "3B", "4B", "5B", "6B"];
var Easy_card_value = ["1A", "2A", "3A", "4A", "1B", "2B", "3B", "4B"];

var started = false;
var matches_found = 0;
var card1 = false,  card2 = false;

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

var sec = 0;

//turn card face down
function hideCard(id) {
  cards[id].firstChild.src = "cards/back.png";
  with(cards[id].style) {
    WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
  }
};

// move card to pack
function moveToPack(id) {
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
// move card to pack
function moveToPackMobile(id) {
  hideCard(id);
  cards[id].matched = true;
  with(cards[id].style) {
    zIndex = "1000";
    top = "-110px";
    left = "140px";
    WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    zIndex = "0";
  }
};

// deal card
function moveToPlace(id) {
  cards[id].matched = false;
  with(cards[id].style) {
    zIndex = "1000";
    top = cards[id].fromtop + "em";
    left = cards[id].fromleft + "em";
    WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    zIndex = "0";
  }
};

//Timer
function pad(val) {
  return val > 9 ? val : "0" + val;
};

setInterval(function () {
  if (started) {
    var seconds = document.getElementById("seconds").innerHTML = pad(++sec % 60);
    var minutes = document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
    started = true;
  }
  return seconds, minutes
}, 1000);

//end of game api
function endGame(seconds, minutes){
  if (typeof(Storage) !== "undefined") {

  } else {
    console.log("No Web Storage for you!");
    alert("Web Storage is not available for your browser!");
  }
}

function clickCounter() {
  if (typeof(Storage) !== "undefined") {
    if (localStorage.clickcount) {
      localStorage.clickcount = Number(localStorage.clickcount)+1;
    } else {
      localStorage.clickcount = 1;
    }
    document.getElementById("clickCountResult").innerHTML = "You have clicked " + localStorage.clickcount + " time(s).";
  } else {
    console.log("No Web Storage for you!");
    alert("Web Storage is not available for your browser!");
  }
}

/* Hard Game Initialise */
function MatchGame(targetID) {
  //clicking the cards
  function cardClick(id) {
    if (started) {
      showCard(id);
    } else {
      //shuffle and deal cards
      Hard_card_value.sort(function () {
        return Math.round(Math.random()) - 0.5;
      });
      for (i = 0; i < 16; i++) {
        (function (idx) {
          setTimeout(function () {
            moveToPlace(idx);
          }, idx * 100);
        })(i);
      }
      started = true;
    }
  };

  // turn card face up, check for match
  function showCard(id) {
    if (id === card1) return
    if (cards[id].matched) return;
    clickCounter();

    cards[id].firstChild.src = "cards/" + Hard_card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(Hard_card_value[card1]) == parseInt(Hard_card_value[card2])) { //match found
        (function (card1, card2) {
          setTimeout(function () {
            if (w >= 640) {
              moveToPack(card1);
              moveToPack(card2);
            } else if (w <= 640) {
              moveToPackMobile(card1);
              moveToPackMobile(card2);
            }
          }, 1000);
        })(card1, card2);
        if (++matches_found == 8) { //game over, reset
          endGame(seconds, minutes);
          matches_found = 0;
          started = false;
          seconds = 0;
          minutes = 0;
          sec = 0;
        }
      } else { //no match
        (function (card1, card2) {
          setTimeout(function () {
            hideCard(card1);
            hideCard(card2);
          }, 800);
        })(card1, card2);
      }
      card1 = card2 = false;
    } else { // first card turned over
      card1 = id;
    }
  };

  //initialise
  var stage = document.getElementById(targetID);
  var felt = document.createElement("div");
  var exit = document.createElement("span");
  var hide = document.getElementById("hide");

  //exit game button
  exit.innerHTML = "Quit Game";
  exit.addEventListener("click", function () {
    document.getElementById("felt").remove();
    document.getElementById("exit").remove();
    seconds = 0;
    minutes = 0;
    sec = 0;
    started = false;
    content.appendChild(hide);
  });

  exit.id = "exit";
  stage.appendChild(exit);

  felt.id = "felt";
  stage.appendChild(felt);

  //template for card
  var card = document.createElement("div");
  card.innerHTML = '<img src="cards/back.png">';

  if (w <= 640) {
    for (var i = 0; i < 16; i++) {
      var newCard = card.cloneNode(true);

      newCard.fromtop = 1 + 7 * Math.floor(i / 4);
      newCard.fromleft = 1 + 4.5 * (i % 4);
      (function (idx) {
        newCard.addEventListener("click", function () {
          cardClick(idx);
        }, false);
      })(i);

      felt.appendChild(newCard);
      cards.push(newCard);
    }
  } else {
    for (i = 0; i < 16; i++) {
      newCard = card.cloneNode(true);

      newCard.fromtop = 1 + 7 * Math.floor(i / 4);
      newCard.fromleft = 1 + 4.5 * (i % 4);
      (function (idx) {
        newCard.addEventListener("click", function () {
          cardClick(idx);
        }, false);
      })(i);

      felt.appendChild(newCard);
      cards.push(newCard);
    }
  }
};

/* Medium game */
var MatchGameMedi = function (targetID) {
  // turn card face up, check for match
  var showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;
    clickCounter();

    cards[id].firstChild.src = "cards/" + Medi_card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(Medi_card_value[card1]) == parseInt(Medi_card_value[card2])) { //match found
        (function (card1, card2) {
          setTimeout(function () {
            if (w >= 640) {
              moveToPack(card1);
              moveToPack(card2);
            } else if (w <= 640) {
              moveToPackMobile(card1);
              moveToPackMobile(card2);
            }
          }, 1000);
        })(card1, card2);
        if (++matches_found == 6) { //game over, reset
          matches_found = 0;
          started = false;
          seconds = 0;
          minutes = 0;
          sec = 0;
        }
      } else { //no match
        (function (card1, card2) {
          setTimeout(function () {
            hideCard(card1);
            hideCard(card2);
          }, 800);
        })(card1, card2);
      }
      card1 = card2 = false;
    } else { // first card turned over
      card1 = id;
    }
  };

  //initialise
  var stage = document.getElementById(targetID);
  var felt = document.createElement("div");
  var exit = document.createElement("span");
  var hide = document.getElementById("hide");

  //exit game button
  exit.innerHTML = "Quit Game";
  exit.addEventListener("click", function () {
    document.getElementById("felt").remove();
    document.getElementById("exit").remove();
    seconds = 0;
    minutes = 0;
    sec = 0;
    started = false;
    content.appendChild(hide);
  });

  exit.id = "exit";
  stage.appendChild(exit);


  felt.id = "felt";
  stage.appendChild(felt);

  //template for card
  var card = document.createElement("div");
  card.innerHTML = "<img src=\"cards/back.png\">";

  if (w <= 640) {

    for (var i = 0; i < 12; i++) {
      var newCard = card.cloneNode(true);

      newCard.fromtop = 1 + 7 * Math.floor(i / 4);
      newCard.fromleft = 1 + 4.5 * (i % 4);
      (function (idx) {
        newCard.addEventListener("click", function () {
          cardClick(idx);
        }, false);
      })(i);

      felt.appendChild(newCard);
      cards.push(newCard);
    }

  } else {

    for (i = 0; i < 12; i++) {
      newCard = card.cloneNode(true);

      newCard.fromtop = 1 + 7 * Math.floor(i / 4);
      newCard.fromleft = 1 + 4.5 * (i % 4);
      (function (idx) {
        newCard.addEventListener("click", function () {
          cardClick(idx);
        }, false);
      })(i);

      felt.appendChild(newCard);
      cards.push(newCard);
    }

  }
};

/* Easy game */
var MatchGameEasy = function (targetID) {
  // turn card face up, check for match
  var showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;
    clickCounter();

    cards[id].firstChild.src = "cards/" + Easy_card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(Easy_card_value[card1]) == parseInt(Easy_card_value[card2])) { //match found
        (function (card1, card2) {
          setTimeout(function () {
            if (w >= 640) {
              moveToPack(card1);
              moveToPack(card2);
            } else if (w <= 640) {
              moveToPackMobile(card1);
              moveToPackMobile(card2);
            }
          }, 1000);
        })(card1, card2);
        if (++matches_found == 4) { //game over, reset
          matches_found = 0;
          started = false;
          seconds = 0;
          minutes = 0;
          sec = 0;
        }
      } else { //no match
        (function (card1, card2) {
          setTimeout(function () {
            hideCard(card1);
            hideCard(card2);
          }, 800);
        })(card1, card2);
      }
      card1 = card2 = false;
    } else { // first card turned over
      card1 = id;
    }
  };

  var cardClick = function (id) {
    if (started) {
      showCard(id);
    } else {
      //shuffle and deal cards
      Easy_card_value.sort(function () {
        return Math.round(Math.random()) - 0.5;
      });
      for (i = 0; i < 8; i++) {
        (function (idx) {
          setTimeout(function () {
            moveToPlace(idx);
          }, idx * 100);
        })(i);
      }
      started = true;
    }
  };

  //initialise
  var stage = document.getElementById(targetID);
  var felt = document.createElement("div");
  var exit = document.createElement("span");
  var hide = document.getElementById("hide");

  //exit game button
  exit.innerHTML = "Quit Game";
  exit.addEventListener("click", function () {
    document.getElementById("felt").remove();
    document.getElementById("exit").remove();
    seconds = 0;
    minutes = 0;
    sec = 0;
    started = false;
    content.appendChild(hide);
  });

  exit.id = "exit";
  stage.appendChild(exit);

  felt.id = "felt";
  stage.appendChild(felt);

  //template for card
  var card = document.createElement("div");
  card.innerHTML = "<img src=\"cards/back.png\">";

  if (w <= 640) {

    for (var i = 0; i < 8; i++) {
      var newCard = card.cloneNode(true);

      newCard.fromtop = 1 + 7 * Math.floor(i / 4);
      newCard.fromleft = 1 + 4.5 * (i % 4);
      (function (idx) {
        newCard.addEventListener("click", function () {
          cardClick(idx);
        }, false);
      })(i);

      felt.appendChild(newCard);
      cards.push(newCard);
    }

  } else {

    for (i = 0; i < 8; i++) {
      newCard = card.cloneNode(true);

      newCard.fromtop = 1 + 7 * Math.floor(i / 4);
      newCard.fromleft = 1 + 4.5 * (i % 4);
      (function (idx) {
        newCard.addEventListener("click", function () {
          cardClick(idx);
        }, false);
      })(i);

      felt.appendChild(newCard);
      cards.push(newCard);
    }

  }
};
