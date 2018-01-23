var MatchGame = function (targetID) {
  //private variables
  var cards = []
  var card_value = ["1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A", "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B"];

  var started = false;
  var matches_found = 0;
  var card1 = false,
      card2 = false;

  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  var sec = 0;

  //turn card face down
  var hideCard = function (id) {
    cards[id].firstChild.src = "cards/back.png";
    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
    }
  };

  // move card to pack
  var moveToPack = function (id) {
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
  var moveToPackMobile = function (id) {
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
  var moveToPlace = function (id) {
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

  // turn card face up, check for match
  var showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;

    cards[id].firstChild.src = "cards/" + card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(card_value[card1]) == parseInt(card_value[card2])) { //match found
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
      card_value.sort(function () {
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

  //initialise
  var stage = document.getElementById(targetID);
  var felt = document.createElement("div");
  var exit = document.createElement("span");
  var hide = document.getElementById("hide");

  felt.id = "felt";
  stage.appendChild(felt);

  exit.id = "exit";
  stage.appendChild(exit);

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

//Medium game
var MatchGameMedi = function (targetID) {
  //private variables
  var cards = []
  var card_value = ["1A", "2A", "3A", "4A", "5A", "6A", "1B", "2B", "3B", "4B", "5B", "6B"];

  var started = false;
  var matches_found = 0;
  var card1 = false,
      card2 = false;

  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  var sec = 0;

  //turn card face down
  var hideCard = function (id) {
    cards[id].firstChild.src = "cards/back.png";
    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
    }
  };

  // move card to pack
  var moveToPack = function (id) {
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
  var moveToPackMobile = function (id) {
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
  var moveToPlace = function (id) {
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

  // turn card face up, check for match
  var showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;

    cards[id].firstChild.src = "cards/" + card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(card_value[card1]) == parseInt(card_value[card2])) { //match found
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

  var cardClick = function (id) {
    if (started) {
      showCard(id);
    } else {
      //shuffle and deal cards
      card_value.sort(function () {
        return Math.round(Math.random()) - 0.5;
      });
      for (i = 0; i < 12; i++) {
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

  felt.id = "felt";
  stage.appendChild(felt);

  exit.id = "exit";
  stage.appendChild(exit);

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

//Easy game
var MatchGameEasy = function (targetID) {
  //private variables
  var cards = []
  var card_value = ["1A", "2A", "3A", "4A", "1B", "2B", "3B", "4B"];

  var started = false;
  var matches_found = 0;
  var card1 = false,
      card2 = false;

  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  var sec = 0;

  //turn card face down
  var hideCard = function (id) {
    cards[id].firstChild.src = "cards/back.png";
    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
    }
  };

  // move card to pack
  var moveToPack = function (id) {
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
  var moveToPackMobile = function (id) {
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
  var moveToPlace = function (id) {
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

  // turn card face up, check for match
  var showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;

    cards[id].firstChild.src = "cards/" + card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(card_value[card1]) == parseInt(card_value[card2])) { //match found
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
      card_value.sort(function () {
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

  felt.id = "felt";
  stage.appendChild(felt);

  exit.id = "exit";
  stage.appendChild(exit);

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
