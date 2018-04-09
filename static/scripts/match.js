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

  //Timer
  let minutesDis = document.createElement("span");
  let secondsDis = document.createElement("span");
  let minutesSide = document.createElement("span");
  let secondsSide = document.createElement("span");

  function pad(val) {
    return val > 9 ? val : "0" + val;
  };

  setInterval(function () {
    if (started) {
      let seconds = secondsDis.innerHTML = " " + pad(++sec % 60);
      let minutes = minutesDis.innerHTML = "</br>" +pad(parseInt(sec / 60, 10)) + " :";
      let secondsS = secondsSide.innerHTML = " " + pad(++sec % 60);
      let minutesS = minutesSide.innerHTML = "</br>" +pad(parseInt(sec / 60, 10)) + " :";
      started = true;
    }
  }, 1000);

  /* Count the clicks that the player does */
  let clicks = 0;
  let clicksS = 0;
  const displayA = document.createElement('span');
  const displayS = document.createElement('span');
  const displaySideA = document.createElement('span');
  const displaySideS = document.createElement('span');

  function matchAttempts() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem('clicks')) {
        clicks++;
        localStorage.setItem("clicks", clicks);
      } else {
        clicks = 0;
      }
      displayA.innerHTML = clicks + " unsuccessful attempt(s) to find matches.";
      displaySideA.innerHTML = clicks + " unsuccessful attempt(s) to find matches.";
    } else {
      console.log("No Web Storage for you!");
      alert("Web Storage is not available for your browser!");
    }
  }

  function matchSuccess() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem('clicksS')) {
        clicksS++;
        localStorage.setItem("clicksS", clicksS);
      } else {
        clicksS = 0;
      }
      displayS.innerHTML = clicksS + " successful attempt(s) to find matches.";
      displaySideS.innerHTML = clicksS + " successful attempt(s) to find matches.";
    } else {
      console.log("No Web Storage for you!");
      alert("Web Storage is not available for your browser!");
    }
  }

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
      zIndex = "0";
      top = "100px";
      left = "-140px";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    }
  };

  // move card to pack
  const moveToPackMobile = function (id) {
    hideCard(id);
    cards[id].matched = true;
    with(cards[id].style) {
      zIndex = "0";
      top = "-110px";
      left = "140px";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    }
  };

  // deal card
  const moveToPlace = function (id) {
    cards[id].matched = false;
    with(cards[id].style) {
      zIndex = "0";
      top = cards[id].fromtop + "em";
      left = cards[id].fromleft + "em";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    }
  };

  // turn card face up, check for match
  const showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;

    cards[id].firstChild.src = "cards/" + hard_card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(hard_card_value[card1]) == parseInt(hard_card_value[card2])) { //match found
        (function (card1, card2) {
          matchSuccess();
          setTimeout(function () {
            if (w >= 700) {
              moveToPack(card1);
              moveToPack(card2);
            } else if (w <= 700) {
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
          secondsS = 0;
          minutesS = 0;
          sec = 0;
          gameComplete(seconds, minutes);
          gameComplete(secondsS, minutesS);
          clicks = 0;
          clicksS = 0;
          localStorage.setItem("clicks", clicks);
          localStorage.setItem("clicksS", clicksS);
        }
      } else { //no match
        (function (card1, card2) {
          matchAttempts();
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
            document.getElementById('results').innerHTML = null;
          }, idx * 100);
        })(i);
      }
      started = true;
    }
  };

  //end of game
  function gameComplete() {
    document.getElementById('results').innerHTML = "<h2>Congratulations, You Have WON! </h2>" +
    "<h3>Here are the results of your game! </h3>" + "Your total time is: " ;
  }

  //initialise
  const stage = document.getElementById(targetID);
  const felt = document.createElement("div");
  const results = document.createElement("span");
  const gameInfo = document.createElement("section");
  const clock  = document.createElement("section");
  const gameTitle = document.createElement("section");
  const sideInfo = document.getElementById('sideInfo');
  const gameTitleSide = document.createElement("section");
  const resultsSide = document.createElement("span");
  const clockSide = document.createElement("section");

  felt.id = "felt";
  stage.appendChild(felt);

  gameInfo.id = "gameInfo";
  stage.appendChild(gameInfo);

  gameTitle.id = "gameTitle";
  gameInfo.appendChild(gameTitle);
  gameTitle.innerHTML = "<h2>You Have Selected the Hardest Difficulty!</h2>";

  gameTitleSide.id = "gameTitleSide";
  sideInfo.appendChild(gameTitleSide);
  gameTitleSide.innerHTML = "<h2>You Have Selected the Hardest Difficulty!</h2>";

  results.id = "results";
  gameInfo.appendChild(results);

  resultsSide.id = "resultsSide";
  sideInfo.appendChild(resultsSide);

  clock.id = "clock";
  gameInfo.appendChild(clock);

  clockSide.id = "clockSide";
  sideInfo.appendChild(clockSide);

  minutesDis.id = "minutesDis";
  clock.appendChild(minutesDis);
  minutesDis.innerHTML = "00 : "

  minutesSide.id = "minutesSide";
  clockSide.appendChild(minutesSide);
  minutesSide.innerHTML = "00 : ";

  secondsDis.id = "secondsDis";
  clock.appendChild(secondsDis);
  secondsDis.innerHTML = "00"

  secondsSide.id = "secondsSide";
  clockSide.appendChild(secondsSide);
  secondsSide.innerHTML = "00";

  displayA.id = "display";
  gameInfo.appendChild(displayA);
  displayA.innerHTML = "0 unsuccessful attempt(s) to find matches."

  displaySideA.id = "display";
  sideInfo.appendChild(displaySideA);
  displaySideA.innerHTML = "0 unsuccessful attempt(s) to find matches.";

  displayS.id = "display";
  gameInfo.appendChild(displayS);
  displayS.innerHTML = "0 successful attempt(s) to find matches."

  displaySideS.id = "displayS";
  sideInfo.appendChild(displaySideS);
  displaySideS.innerHTML = "0 successful attempt(s) to find matches.";

  //template for card
  let card = document.createElement("div");
  card.innerHTML = '<img src="cards/back.png">';

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

  //Timer
  let minutesDis = document.createElement("span");
  let secondsDis = document.createElement("span");
  let minutesSide = document.createElement("span");
  let secondsSide = document.createElement("span");

  function pad(val) {
    return val > 9 ? val : "0" + val;
  };

  setInterval(function () {
    if (started) {
      let seconds = secondsDis.innerHTML = " " + pad(++sec % 60);
      let minutes = minutesDis.innerHTML = "</br>" +pad(parseInt(sec / 60, 10)) + " :";
      let secondsS = secondsSide.innerHTML = " " + pad(++sec % 60);
      let minutesS = minutesSide.innerHTML = "</br>" +pad(parseInt(sec / 60, 10)) + " :";
      started = true;
    }
  }, 1000);

  /* Count the clicks that the player does */
  let clicks = 0;
  let clicksS = 0;
  const displayA = document.createElement('span');
  const displayS = document.createElement('span');
  const displaySideA = document.createElement('span');
  const displaySideS = document.createElement('span');

  function matchAttempts() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem('clicks')) {
        clicks++;
        localStorage.setItem("clicks", clicks);
      } else {
        clicks = 0;
      }
      displayA.innerHTML = clicks + " unsuccessful attempt(s) to find matches.";
      displaySideA.innerHTML = clicks + " unsuccessful attempt(s) to find matches.";
    } else {
      console.log("No Web Storage for you!");
      alert("Web Storage is not available for your browser!");
    }
  }

  function matchSuccess() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem('clicksS')) {
        clicksS++;
        localStorage.setItem("clicksS", clicksS);
      } else {
        clicksS = 0;
      }
      displayS.innerHTML = clicksS + " successful attempt(s) to find matches.";
      displaySideS.innerHTML = clicksS + " successful attempt(s) to find matches.";
    } else {
      console.log("No Web Storage for you!");
      alert("Web Storage is not available for your browser!");
    }
  }

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
      zIndex = "0";
      top = "100px";
      left = "-140px";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    }
  };

  // move card to pack
  const moveToPackMobile = function (id) {
    hideCard(id);
    cards[id].matched = true;
    with(cards[id].style) {
      zIndex = "0";
      top = "-110px";
      left = "140px";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    }
  };

  // deal card
  const moveToPlace = function (id) {
    cards[id].matched = false;
    with(cards[id].style) {
      zIndex = "0";
      top = cards[id].fromtop + "em";
      left = cards[id].fromleft + "em";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    }
  };

  // turn card face up, check for match
  const showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;

    cards[id].firstChild.src = "cards/" + medi_card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(medi_card_value[card1]) == parseInt(medi_card_value[card2])) { //match found
        (function (card1, card2) {
          matchSuccess();
          setTimeout(function () {
            if (w >= 700) {
              moveToPack(card1);
              moveToPack(card2);
            } else if (w <= 700) {
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
          secondsS = 0;
          minutesS = 0;
          sec = 0;
          gameComplete(seconds, minutes);
          gameComplete(secondsS, minutesS);
          clicks = 0;
          clicksS = 0;
          localStorage.setItem("clicks", clicks);
          localStorage.setItem("clicksS", clicksS);
        }
      } else { //no match
        (function (card1, card2) {
          matchAttempts();
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
            document.getElementById('results').innerHTML = null;
          }, idx * 100);
        })(i);
      }
      started = true;
    }
  };

  //end of game
  function gameComplete() {
    document.getElementById('results').innerHTML = "<h2>Congratulations, You Have WON! </h2>" +
    "<h3>Here are the results of your game! </h3>" + "Your total time is: " ;
  }

  //initialise
  const stage = document.getElementById(targetID);
  const felt = document.createElement("div");
  const gameInfo = document.createElement("section");
  const results = document.createElement("span");
  const gameTitle = document.createElement("section");
  const clock  = document.createElement("section");
  const sideInfo = document.getElementById('sideInfo');
  const gameTitleSide = document.createElement("section");
  const resultsSide = document.createElement("span");
  const clockSide = document.createElement("section");

  felt.id = "felt";
  stage.appendChild(felt);

  gameInfo.id = "gameInfo";
  stage.appendChild(gameInfo);

  gameTitle.id = "gameTitle";
  gameInfo.appendChild(gameTitle);
  gameTitle.innerHTML = "<h2>You Have Selected Medium Difficulty!</h2>";

  gameTitleSide.id = "gameTitleSide";
  sideInfo.appendChild(gameTitleSide);
  gameTitleSide.innerHTML = "<h2>You Have Selected the Medium Difficulty!</h2>";

  results.id = "results";
  gameInfo.appendChild(results);

  resultsSide.id = "resultsSide";
  sideInfo.appendChild(resultsSide);

  clock.id = "clock";
  gameInfo.appendChild(clock);

  clockSide.id = "clockSide";
  sideInfo.appendChild(clockSide);

  minutesDis.id = "minutesDis";
  clock.appendChild(minutesDis);
  minutesDis.innerHTML = "00 : "

  minutesSide.id = "minutesSide";
  clockSide.appendChild(minutesSide);
  minutesSide.innerHTML = "00 : ";

  secondsDis.id = "secondsDis";
  clock.appendChild(secondsDis);
  secondsDis.innerHTML = "00"

  secondsSide.id = "secondsSide";
  clockSide.appendChild(secondsSide);
  secondsSide.innerHTML = "00";

  displayA.id = "display";
  gameInfo.appendChild(displayA);
  displayA.innerHTML = "0 unsuccessful attempt(s) to find matches.";

  displaySideA.id = "display";
  sideInfo.appendChild(displaySideA);
  displaySideA.innerHTML = "0 unsuccessful attempt(s) to find matches.";

  displayS.id = "display";
  gameInfo.appendChild(displayS);
  displayS.innerHTML = "0 successful attempt(s) to find matches.";

  displaySideS.id = "displayS";
  sideInfo.appendChild(displaySideS);
  displaySideS.innerHTML = "0 successful attempt(s) to find matches.";

  //template for card
  let card = document.createElement("div");
  card.innerHTML = "<img src=cards/back.png>";

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

  //Timer
  let minutesDis = document.createElement("span");
  let secondsDis = document.createElement("span");
  let minutesSide = document.createElement("span");
  let secondsSide = document.createElement("span");

  function pad(val) {
    return val > 9 ? val : "0" + val;
  };

  setInterval(function () {
    if (started) {
      let seconds = secondsDis.innerHTML = " " + pad(++sec % 60);
      let minutes = minutesDis.innerHTML = "</br>" +pad(parseInt(sec / 60, 10)) + " :";
      let secondsS = secondsSide.innerHTML = " " + pad(++sec % 60);
      let minutesS = minutesSide.innerHTML = "</br>" +pad(parseInt(sec / 60, 10)) + " :";
      started = true;
    }
  }, 1000);

  /* Count the clicks that the player does */
  let clicks = 0;
  let clicksS = 0;
  const displayA = document.createElement('span');
  const displayS = document.createElement('span');
  const displaySideA = document.createElement('span');
  const displaySideS = document.createElement('span');

  function matchAttempts() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem('clicks')) {
        clicks++;
        localStorage.setItem("clicks", clicks);
      } else {
        clicks = 0;
      }
      displayA.innerHTML = clicks + " unsuccessful attempt(s) to find matches.";
      displaySideA.innerHTML = clicks + " unsuccessful attempt(s) to find matches.";
    } else {
      console.log("No Web Storage for you!");
      alert("Web Storage is not available for your browser!");
    }
  }

  function matchSuccess() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem('clicksS')) {
        clicksS++;
        localStorage.setItem("clicksS", clicksS);
      } else {
        clicksS = 0;
      }
      displayS.innerHTML = clicksS + " successful attempt(s) to find matches.";
      displaySideS.innerHTML = clicksS + " successful attempt(s) to find matches.";
    } else {
      console.log("No Web Storage for you!");
      alert("Web Storage is not available for your browser!");
    }
  }

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
      zIndex = "0";
      top = "100px";
      left = "-140px";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    }
  };

  // move card to pack
  const moveToPackMobile = function (id) {
    hideCard(id);
    cards[id].matched = true;
    with(cards[id].style) {
      zIndex = "0";
      top = "-110px";
      left = "140px";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    }
  };

  // deal card
  const moveToPlace = function (id) {
    cards[id].matched = false;
    with(cards[id].style) {
      zIndex = "0";
      top = cards[id].fromtop + "em";
      left = cards[id].fromleft + "em";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
    }
  };

  // turn card face up, check for match
  const showCard = function (id) {
    if (id === card1) return
    if (cards[id].matched) return;

    cards[id].firstChild.src = "cards/" + easy_card_value[id] + ".png";

    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(0deg)";
    }

    if (card1 !== false) {
      card2 = id;
      if (parseInt(easy_card_value[card1]) == parseInt(easy_card_value[card2])) { //match found
        (function (card1, card2) {
          matchSuccess();
          setTimeout(function () {
            if (w >= 700) {
              moveToPack(card1);
              moveToPack(card2);
            } else if (w <= 700) {
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
          secondsS = 0;
          minutesS = 0;
          sec = 0;
          gameComplete(seconds, minutes);
          gameComplete(secondsS, minutesS);
          clicks = 0;
          clicksS = 0;
          localStorage.setItem("clicks", clicks);
          localStorage.setItem("clicksS", clicksS);
        }
      } else { //no match
        (function (card1, card2) {
          matchAttempts();
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
            document.getElementById('results').innerHTML = null;
          }, idx * 100);
        })(i);
      }
      started = true;
    }
  };

  //end of game
  function gameComplete() {
    document.getElementById('results').innerHTML = "<h2>Congratulations, You Have WON! </h2>" +
    "<h3>Here are the results of your game! </h3>" + "Your total time is: " ;
  }

  //initialise
  const stage = document.getElementById(targetID);
  const felt = document.createElement("div");
  const gameInfo = document.createElement("section");
  const results = document.createElement("span");
  const gameTitle = document.createElement("section");
  const clock = document.createElement("section");
  const sideInfo = document.getElementById('sideInfo');
  const gameTitleSide = document.createElement("section");
  const resultsSide = document.createElement("span");
  const clockSide = document.createElement("section");

  felt.id = "felt";
  stage.appendChild(felt);

  gameInfo.id = "gameInfo";
  stage.appendChild(gameInfo);

  gameTitle.id = "gameTitle";
  gameInfo.appendChild(gameTitle);
  gameTitle.innerHTML = "<h2>You Have Selected the Easiest Difficulty!</h2>";

  gameTitleSide.id = "gameTitleSide";
  sideInfo.appendChild(gameTitleSide);
  gameTitleSide.innerHTML = "<h2>You Have Selected the Easiest Difficulty!</h2>";

  results.id = "results";
  gameInfo.appendChild(results);

  resultsSide.id = "resultsSide";
  sideInfo.appendChild(resultsSide);

  clock.id = "clock";
  gameInfo.appendChild(clock);

  clockSide.id = "clockSide";
  sideInfo.appendChild(clockSide);

  minutesDis.id = "minutesDis";
  clock.appendChild(minutesDis);
  minutesDis.innerHTML = "00 : ";

  minutesSide.id = "minutesSide";
  clockSide.appendChild(minutesSide);
  minutesSide.innerHTML = "00 : ";

  secondsDis.id = "secondsDis";
  clock.appendChild(secondsDis);
  secondsDis.innerHTML = "00";

  secondsSide.id = "secondsSide";
  clockSide.appendChild(secondsSide);
  secondsSide.innerHTML = "00";

  displayA.id = "display";
  gameInfo.appendChild(displayA);
  displayA.innerHTML = "0 unsuccessful attempt(s) to find matches.";

  displaySideA.id = "display";
  sideInfo.appendChild(displaySideA);
  displaySideA.innerHTML = "0 unsuccessful attempt(s) to find matches.";

  displayS.id = "displayS";
  gameInfo.appendChild(displayS);
  displayS.innerHTML = "0 successful attempt(s) to find matches.";

  displaySideS.id = "displayS";
  sideInfo.appendChild(displaySideS);
  displaySideS.innerHTML = "0 successful attempt(s) to find matches.";

  //template for card
  let card = document.createElement("div");
  card.innerHTML = "<img src=cards/back.png>";

  if (w <= 700) {
     for (let i = 0; i < 8; i++) {
       let newCard = card.cloneNode(true);

       newCard.fromtop = 1 + 8 * Math.floor(i / 4);
       newCard.fromleft = 1 + 6 * (i % 4);
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
