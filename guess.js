var $tree = $("#tree"),
    $apples = $("#apples"),
    $message = $("#message"),
    $spaces = $("#spaces"),
    $guesses = $("#guesses"),
    $message = $("#message")
    $replay = $("#replay");

var randomWord = (function() {
  var words = ["goldfish", "popular", "gosh", "fucking", "goddamn"];

  function removeWord(word) {
    var new_words = [];
    words.forEach(function(w) {
      if ( w !== word ) {
        new_words.push(w);
      }
    })
    return new_words;
  }

  return function() {
    var word = words[(Math.floor(Math.random() * words.length))];
    words = removeWord(word);
    return word;
  }
})();

Game.prototype = {
  setBackground: function(status) {
    if (!status) { 
      $(document.body).removeClass();
      return;
     }
    $(document.body).addClass(status);
  },
  lose: function() {
    this.displayMessage("Sorry. You lost.");
    this.togglePlayAgain(true);
    this.unbind();
    this.setBackground("lose");
  },
  win: function() {
    this.displayMessage("Congratulations! You won!");
    this.togglePlayAgain(true);
    this.unbind();
    this.setBackground("win");
  },
  setClass: function() {
    $apples.removeClass();
    $apples.addClass("guess_" + this.incorrect);
  },
  markGuess: function(letter) {
    $guesses.append("<span>" + letter + "</span>");
  },
  fill: function(letter) {
    var self = this;
    this.word.forEach(function(l, i) {
      if (l === letter) {
        $spaces.find("span").eq(i).text(l);
        self.correct++;
      }
    })
  },
  removeGuesses: function() {
    $guesses.find("span").remove();
  },
  removePreviousWord: function() {
    $spaces.find("span").remove();
  },
  alreadyGuessed: function(letter) {
    if (this.guesses.includes(letter)) { return true;}
    this.guesses.push(letter);
    return false
  },
  processGuess: function(e) {
    var code = e.which;
        letter = String.fromCharCode(code);
        
    if (code < 97 || code > 122) { return; }
    if (this.alreadyGuessed(letter)) { return; }
    //correct
    if (this.word.includes(letter)) {
      this.fill(letter);
      this.markGuess(letter);

      //winning condition
      if (this.correct === this.word.length ) {
        this.win();
      }
    }
    else {
      this.markGuess(letter);
      this.incorrect++;
      this.setClass();
      //losing condition
      if (this.incorrect === this.total_guesses) {
        this.lose();
      }
    }
  },
  displayMessage: function(msg) {
    $message.text(msg);
  },
  togglePlayAgain: function(input) {
    $replay.toggle(input);
  },
  bind: function() {
    $(document.body).on("keypress", this.processGuess.bind(this));
  },
  unbind: function() {
    $(document.body).off();
  },
  displaySpaces: function() {
    for (var i = 0; i < this.word.length; i++ ) {
      $spaces.append("<span></span>");
    }
  },
  init: function() {
    this.togglePlayAgain(false);
    this.displaySpaces();
    this.bind();
  }
}

function Game() {
  this.guesses = [];
  this.incorrect = 0;
  this.correct = 0;
  this.displayMessage("");
  this.total_guesses = 6;
  this.setClass();
  this.setBackground();
  this.removeGuesses();
  this.removePreviousWord();
  this.word = randomWord();
  if (!this.word) {
    this.togglePlayAgain(false);
    this.displayMessage("Oops! Looks like we're all out of words!");
    return;
  }
  this.word = this.word.split("");
  this.init();
}

$replay.on("click", function(e) {
    e.preventDefault();
    new Game();
});


new Game();