const hard_card_value = ["1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A", "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B"];
const medi_card_value = ["1A", "2A", "3A", "4A", "5A", "6A", "1B", "2B", "3B", "4B", "5B", "6B"];
const easy_card_value = ["1A", "2A", "3A", "4A", "1B", "2B", "3B", "4B"];

/*Hard game*/
const MatchGame = function (targetID) {
  //private variables
  let cards = []
  let started = false;
  let matches_found = 0;
  let card1 = false;
  let card2 = false;

  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  let sec = 0;

  //turn card face down
  const hideCard = function (id) {
    cards[id].firstChild.src = "cards/back.png";
    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
    }
  };

  // move card to pack
  const moveToPack = function (id) {
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
  const moveToPackMobile = function (id) {
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
  const moveToPlace = function (id) {
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
  const showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;
    clickCounter();

    cards[id].firstChild.src = "cards/" + hard_card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(hard_card_value[card1]) == parseInt(hard_card_value[card2])) { //match found
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
          gameComplete(seconds, minutes);
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

  const cardClick = function (id) {
    if (started) {
      showCard(id);
    } else {
      //shuffle and deal cards
      hard_card_value.sort(function () {
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

  //Timer
  let minutesDis = document.createElement("span");
  let secondsDis = document.createElement("span");

  function pad(val) {
    return val > 9 ? val : "0" + val;
  };

  setInterval(function () {
    if (started) {
      let seconds = secondsDis.innerHTML = " " + pad(++sec % 60);
      let minutes = minutesDis.innerHTML = "</br>" +pad(parseInt(sec / 60, 10)) + " :";
      started = true;
    }
  }, 1000);

  /* Count the clicks that the player does */
  let clicks = 0;
  const display = document.createElement('clickResult');

  if(localStorage.getItem('clicks')) {
    let saveCount = localStorage.getItem('clicks');
    clicks = localStorage.getItem('clicks');
    console.log('foo');
  } else {
    clicks = 0;
    localStorage.setItem("clicks", clicks);
    console.log('bar');
  }

  display.innerHTML = "</br>" + "You have clicked " + clicks + " time(s).";
  function clickCounter() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem('clicks')) {
        clicks++;
        localStorage.setItem("clicks", clicks);
      } else {
        clicks = 0;
      }
      display.innerHTML = "</br>" + "You have clicked " + clicks + " time(s).";
    } else {
      console.log("No Web Storage for you!");
      alert("Web Storage is not available for your browser!");
    }
  }

  //end of game
  function gameComplete() {
    document.getElementById('results').innerHTML = "</br>" + "<h2>Congratulations, You Have WON! </h2>" +
    "<h3>Here are the results of your game! </h3>" + "Your total time is: " ;
  }

  //initialise
  const stage = document.getElementById(targetID);
  const felt = document.createElement("div");
  const exit = document.createElement("span");
  const hide = document.getElementById("hide");
  const results = document.createElement("span");

  exit.id = "exit";
  stage.appendChild(exit);

  results.id = "results";
  stage.appendChild(results);

  minutesDis.id = "minutesDis";
  stage.appendChild(minutesDis);

  secondsDis.id = "secondsDis";
  stage.appendChild(secondsDis);

  display.id = "display";
  stage.appendChild(display);


  felt.id = "felt";
  stage.appendChild(felt);

  //exit game button
  exit.innerHTML = "Quit Game";

  exit.addEventListener("click", function () {
    let clickCount = localStorage.getItem("clickCount");
    felt.remove();
    exit.remove();
    results.remove();
    display.remove();
    minutesDis.remove();
    secondsDis.remove();
    seconds = 0;
    minutes = 0;
    sec = 0;
    started = false;
    content.appendChild(hide);
    localStorage.removeItem("clicks");
  });

  //template for card
  let card = document.createElement("div");
  card.innerHTML = '<img src="cards/back.png">';

  if (w <= 640) {
    for (let i = 0; i < 16; i++) {
      let newCard = card.cloneNode(true);

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
const MatchGameMedi = function (targetID) {
  //private variables
  let cards = []

  let started = false;
  let matches_found = 0;
  let card1 = false;
  let card2 = false;

  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  let sec = 0;

  //turn card face down
  const hideCard = function (id) {
    cards[id].firstChild.src = "cards/back.png";
    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
    }
  };

  // move card to pack
  const moveToPack = function (id) {
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
  const moveToPackMobile = function (id) {
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
  const moveToPlace = function (id) {
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
  const showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;
    clickCounter();

    cards[id].firstChild.src = "cards/" + medi_card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(medi_card_value[card1]) == parseInt(medi_card_value[card2])) { //match found
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
          gameComplete(seconds, minutes);
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

  const cardClick = function (id) {
    if (started) {
      showCard(id);
    } else {
      //shuffle and deal cards
      medi_card_value.sort(function () {
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

  //Timer
  let minutesDis = document.createElement("span");
  let secondsDis = document.createElement("span");

  function pad(val) {
    return val > 9 ? val : "0" + val;
  };

  setInterval(function () {
    if (started) {
      let seconds = secondsDis.innerHTML = " " + pad(++sec % 60);
      let minutes = minutesDis.innerHTML = "</br>" +pad(parseInt(sec / 60, 10)) + " :";
      started = true;
    }
  }, 1000);

  /* Count the clicks that the player does */
  let clicks = 0;
  const display = document.createElement('clickResult');

  if(localStorage.getItem('clicks')) {
    let saveCount = localStorage.getItem('clicks');
    clicks = localStorage.getItem('clicks');
    console.log('foo');
  } else {
    clicks = 0;
    localStorage.setItem("clicks", clicks);
    console.log('bar');
  }

  display.innerHTML = "</br>" + "You have clicked " + clicks + " time(s).";
  function clickCounter() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem('clicks')) {
        clicks++;
        localStorage.setItem("clicks", clicks);
      } else {
        clicks = 0;
      }
      display.innerHTML = "</br>" + "You have clicked " + clicks + " time(s).";
    } else {
      console.log("No Web Storage for you!");
      alert("Web Storage is not available for your browser!");
    }
  }

  //end of game
  function gameComplete() {
    document.getElementById('results').innerHTML = "</br>" + "<h2>Congratulations, You Have WON! </h2>" +
    "<h3>Here are the results of your game! </h3>" + "Your total time is: " ;
  }

  //initialise
  const stage = document.getElementById(targetID);
  const felt = document.createElement("div");
  const exit = document.createElement("span");
  const hide = document.getElementById("hide");
  const results = document.createElement("span");

  exit.id = "exit";
  stage.appendChild(exit);

  results.id = "results";
  stage.appendChild(results);

  minutesDis.id = "minutesDis";
  stage.appendChild(minutesDis);

  secondsDis.id = "secondsDis";
  stage.appendChild(secondsDis);

  display.id = "display";
  stage.appendChild(display);


  felt.id = "felt";
  stage.appendChild(felt);

  //exit game button
  exit.innerHTML = "Quit Game";

  exit.addEventListener("click", function () {
    let clickCount = localStorage.getItem("clickCount");
    felt.remove();
    exit.remove();
    results.remove();
    display.remove();
    minutesDis.remove();
    secondsDis.remove();
    seconds = 0;
    minutes = 0;
    sec = 0;
    started = false;
    content.appendChild(hide);
    localStorage.removeItem("clicks");
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
const MatchGameEasy = function (targetID) {
  //private variables
  let cards = []

  let started = false;
  let matches_found = 0;
  let card1 = false;
  let card2 = false;

  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  let sec = 0;

  //turn card face down
  const hideCard = function (id) {
    cards[id].firstChild.src = "cards/back.png";
    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
    }
  };

  // move card to pack
  const moveToPack = function (id) {
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
  const moveToPackMobile = function (id) {
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
  const moveToPlace = function (id) {
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
  const showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;
    clickCounter();

    cards[id].firstChild.src = "cards/" + easy_card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(easy_card_value[card1]) == parseInt(easy_card_value[card2])) { //match found
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
          gameComplete(seconds, minutes);
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

  const cardClick = function (id) {
    if (started) {
      showCard(id);
    } else {
      //shuffle and deal cards
      easy_card_value.sort(function () {
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

  //Timer
  let minutesDis = document.createElement("span");
  let secondsDis = document.createElement("span");

  function pad(val) {
    return val > 9 ? val : "0" + val;
  };

  setInterval(function () {
    if (started) {
      let seconds = secondsDis.innerHTML = " " + pad(++sec % 60);
      let minutes = minutesDis.innerHTML = "</br>" +pad(parseInt(sec / 60, 10)) + " :";
      started = true;
    }
  }, 1000);

  /* Count the clicks that the player does */
  let clicks = 0;
  const display = document.createElement('clickResult');

  if(localStorage.getItem('clicks')) {
    let saveCount = localStorage.getItem('clicks');
    clicks = localStorage.getItem('clicks');
    console.log('foo');
  } else {
    clicks = 0;
    localStorage.setItem("clicks", clicks);
    console.log('bar');
  }

  display.innerHTML = "</br>" + "You have clicked " + clicks + " time(s).";
  function clickCounter() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem('clicks')) {
        clicks++;
        localStorage.setItem("clicks", clicks);
      } else {
        clicks = 0;
      }
      display.innerHTML = "</br>" + "You have clicked " + clicks + " time(s).";
    } else {
      console.log("No Web Storage for you!");
      alert("Web Storage is not available for your browser!");
    }
  }

  //end of game
  function gameComplete() {
    document.getElementById('results').innerHTML = "</br>" + "<h2>Congratulations, You Have WON! </h2>" +
    "<h3>Here are the results of your game! </h3>" + "Your total time is: " ;
  }

  //initialise
  const stage = document.getElementById(targetID);
  const felt = document.createElement("div");
  const exit = document.createElement("span");
  const hide = document.getElementById("hide");
  const results = document.createElement("span");

  exit.id = "exit";
  stage.appendChild(exit);

  results.id = "results";
  stage.appendChild(results);

  minutesDis.id = "minutesDis";
  stage.appendChild(minutesDis);

  secondsDis.id = "secondsDis";
  stage.appendChild(secondsDis);

  display.id = "display";
  stage.appendChild(display);


  felt.id = "felt";
  stage.appendChild(felt);

  //exit game button
  exit.innerHTML = "Quit Game";

  exit.addEventListener("click", function () {
    let clickCount = localStorage.getItem("clickCount");
    felt.remove();
    exit.remove();
    results.remove();
    display.remove();
    minutesDis.remove();
    secondsDis.remove();
    seconds = 0;
    minutes = 0;
    sec = 0;
    started = false;
    content.appendChild(hide);
    localStorage.removeItem("clicks");
  });

  //template for card
  let card = document.createElement("div");
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
