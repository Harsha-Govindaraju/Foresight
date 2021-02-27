const ctrl = new anycontrol();
// ctrl.debug(true);
ctrl.addCommand("next page", function () {
  alert('Switching to next page');
});

ctrl.addCommand("previous page", function() {
  alert('Switching to previous page');
});
ctrl.start();
function textToAudio() {                
    let speech = new SpeechSynthesisUtterance();
    speech.lang = "en-US";
    speech.text = 'hello';
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}
