// global constants
// things to work on tmrw
//make life 1 and life 2 more narrow and take away padding to give less of a
// button feel
var clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
var mistakes = 0;
var tonePlaying = false;
var gamePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
//var pattern = [2,2,4,5, 3, 5, 1, 2, 5];
//var pattern = [numGen(),numGen(),numGen(),numGen(), numGen(), numGen(), numGen(), numGen(), numGen()];
var progress = 0;
var guessCounter = 0;

function guess(btn){
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  } 
  if(btn == pattern[guessCounter]){ 
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        playClueSequence();
      }
    }
    else{
      guessCounter++;
    }
  }
  else{
    if(mistakes > 1){
     
    loseGame();
    }
    else{
      
      mistakes++;
      mistakeVisual();
      playClueSequence();
    }
  }
}  

/*function helper(){
 var number = Math.floor(Math.random()*10);
  return number
}

//basically keep calling helper until you get a number that is 1-5 and return that number
//do this by using a while loop and while helper is 
function numGen(){
  for(let i=0;i<=progress;i++){
    var number = helper
    
  }
}
*/
function Randomizer() {
  return Array.from({length: 9}, () => Math.floor(Math.random() * 5) + 1);
}
function startGame(){
    //initialize game variables
    
    progress = 0;
    gamePlaying = true;
    mistakes = 0;
    pattern = Randomizer();
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    document.getElementById("life1").classList.remove("hidden");
    document.getElementById("life2").classList.remove("hidden");
  
    playClueSequence();    
}
function stopGame(){
  gamePlaying = false;
  document.getElementById("stopBtn").classList.add("hidden");
document.getElementById("startBtn").classList.remove("hidden");
}
function mistakeVisual(){
  //if mistake is 1 then their should be 2 lives left if mistake
  //2 then their should be 1 life left 
  //
  if(mistakes == 1){
  document.getElementById("life1").classList.add("hidden");
  }
  else if(mistakes == 2){
  document.getElementById("life2").classList.add("hidden");
  alert("You are on your third life! Use it wisely");
  }
  else if(mistakes == 3){
  document.getElementById("life3").classList.add("hidden");

  }
  
  

}
function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    clueHoldTime = clueHoldTime - 25
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}
function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}
function winGame(){
  stopGame();
  alert("You are now a Memory Master good job");
}
// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 499.3
}
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
// swap the Start and Stop buttons
