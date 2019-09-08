
//-------------------------SET GLOBAL VARIABLE---------------------------

//Set round counter
var roundCounter = 0;

//Insert words for game
var words = '';

//Insert our global variable contain random word for game - at this moment without value 
var wordForGame = '';

//Add array for our random word to split it into letters
var lettersFromWord = [];

//Define special variables for counting matches
var matchesCounter = 0;

//Set the showMessage function 
function showMessage(text) {
	$( "#result" ).animate({left: '150px', opacity:'0'},400,function() {
	$("#result").css( "left", "-150px" );
	$( "#result" ).text(text).animate({left: '0px', opacity:'1'}, 400);
	});

}

//Set 'clean up the user input and put cursor on input' function
function CleanUpUserInput() {
$('#user-guess').val('');
$("#user-guess").focus();
}


//Set the 'game-win' function
function gameWin() {	
	$('#user-guess').prop('disabled', true);
	$("#submit-button").focus().text('Another round!');
	//$("#submit-button").css('background-color',' #FC4325');
	$("#submit-button").toggleClass("btn-success");
	roundCounter += 1;
}


//Clean the user input if page was reload
window.onload = function(){
	CleanUpUserInput();
};


//-------------------------CREATE ARRAY OF WORDS---------------------------
//Use json file to fetch list of words
$.getJSON("./levels/3rd-grade.json", function(response) {

//Transform response to array
words = response.map(wordsArray => wordsArray)

//When all thing is load - start the game
startTheGame();
})


//-------------------------START THE GAME---------------------------

//Set function that start the game
function startTheGame() {

//Clean up our array (important if its a new round)
lettersFromWord = [];

//Write the name of button and change style class
$("#submit-button").focus().text('Submit');
$("#submit-button").removeClass('btn-success');

//Make input enabled
$('#user-guess').prop('disabled', false);
$("#user-guess").focus();

//Delete all the block if they are exist 
$('.block').remove();

//Get the random word and definition from array
randomWordAndDef = words[Math.floor(Math.random()* words.length)];

wordForGame = randomWordAndDef.word;

//Put letters from random word to array and add hidden blocks on the screen 
for (i = 0; i < wordForGame.length; i++) {

//put our letters
lettersFromWord.push(wordForGame[i]);

//add to main screen blocks and hidden letters
var createBlock = "<div class='block'><p class='letter-in-block'>" + wordForGame[i] + "</p></div>";
$('#container-for-blocks').append(createBlock);
};

//good version
let definition = randomWordAndDef.description;

// the same action but in definition nothing change
$('#description').text(definition);

}



//-------------------------GENERAL GAME LOOP---------------------------

function generalGameLoop() {


//Get the users guess and convert it to lower case
var userGuess = $( "#user-guess" ).val().toLowerCase();


//Check the type of users answer:

//It might be empty
if (userGuess == '') {
	showMessage('Please, enter the single letter or whole word!');
	CleanUpUserInput();
}

//...or might be the whole word
else if (userGuess.length > 1) {
if (userGuess == wordForGame) {
	showMessage('Yes, you right! The answer is ' + userGuess + '!');
	$('.letter-in-block').css('opacity','1');
	CleanUpUserInput();
	gameWin();

}

else {
	showMessage('no... Maybe another try will be more close!');
	CleanUpUserInput();
}
}


//----Single Letter Answer Type----

//...and yes, user answer might be a single letter
else if (userGuess.length == 1 ) {



//Define special variables for counting mismatches
var mismatchesCounter = 0;

//Set the loop for compare letters 
	for (i = 0; i < lettersFromWord.length; i++) {

//Check if the users guess is right
if (userGuess == lettersFromWord[i]) {
	showMessage("Yep, we found '" + lettersFromWord[i] + "'!");
$('.letter-in-block').eq(i).css('opacity','1');
	matchesCounter += 1;
	CleanUpUserInput();
	lettersFromWord[i] = '';

//Check if all the letters are open
if (matchesCounter == lettersFromWord.length) {
showMessage('Yes, you right! The answer is ' + wordForGame + '!');
$('#user-guess').prop('disabled', true);
gameWin();
}

}

//...and if not
else {
mismatchesCounter += 1;


//Check if all the letters in word are mismatches 
if (mismatchesCounter == wordForGame.length) {
	showMessage('Sorry,no matches');
	CleanUpUserInput();
}
}
};



}
}

;

//-------------------------ADD EVENT ON ENTER AND CLICK---------------------------

//Define function on enter key
$( "#user-guess" ).keypress(function() {
	 
	 if(event.which == '13'){
                generalGameLoop(); 
            }
});


//Define function on button
$( "#submit-button" ).click( function() {

//Check if its a new round
if (roundCounter > 0) {
	roundCounter -= 1;
	startTheGame();
	matchesCounter = 0;

//Remove the final message
	$( "#result" ).animate({left: '150px', opacity:'0'},400);
}

else {
generalGameLoop();
};
}); 
