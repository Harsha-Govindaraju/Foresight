import React, { Component } from "react";
import "./../css/style.css";
import AnyControl from "./speechUtility";
import Google from "./gapi";
import ActionPanel from "./actionPanel";
import DataUri from './dataUri';

const ctrl = new AnyControl();
var utt = new SpeechSynthesisUtterance();


function say(s) {
  utt.text = s;
  say.queue.push(utt);
  var root = document.getElementsByTagName( 'html' )[0];
  root.classList.add('hide');
}

function deQueue() {
  if (say.queue.length) {
    speechSynthesis.speak(say.queue.pop());
    var root = document.getElementsByTagName('html')[0];
    root.classList.remove('hide');
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gapiReady: false,
      gapiSearch: false,
      iframeSrc:""
    }
  }

  componentDidMount() {
    (function() {
      var cx = 'd00afc8f54e21828a';
      var gcse = document.createElement('script');
      gcse.type = 'text/javascript';
      gcse.async = true;
      gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(gcse, s);
    })();
    
    // say.queue = [];
    // //$(document).on("click mousemove", deQueue);
    // //document.addEventListener("click mousemove", deQueue);
    // ["click", "mousemove"].forEach(e => document.addEventListener(e, deQueue));
    // say("hello");
    
    //const ctrl = new AnyControl();
    console.log(ctrl);
    const _this = this;
    //ctrl.debug(true);
    ctrl.addCommand("google ${firstPhrase} ${secondPhrase} ${thirdPhrase}", function (ctx) {
      if(ctx.transcript.split("google")) {
        _this.setState({ gapiSearch: ctx.transcript.split("google")[1].trim() });
      }
    });
    ctrl.start();

    window.addEventListener('keydown', function(event) {
      if (event.keyCode == 9) {
          alert('tab was pressed');
  
      }
      else if (event.key === 'Enter') {
          alert('enter was pressed');
      }
  }, true);
  }

  textToAudio = () => {
    let speech = new SpeechSynthesisUtterance();
    speech.lang = "en-US";
    speech.text = "Hey there, I am listening and please speak"
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
    // speech.onend = function (event) {
    //   window.speechSynthesis.cancel();
    //   console.log(event);
    //   ctrl.start();
    // };
  };

  render() {
    return (
      <>
      <div className="row">
        <div className="col-md-4 col-xs-6">
          <h2>Welcome</h2>
          <div>
            {/* <input
              type="text"
              id="text-to-speech"
              placeholder="Enter text to speak..."
            /> */}
            <img src={DataUri} alt="Bot Icon" className="jBot"/>
          </div>
          <div className="hiddenTextSpeech">Activate</div>
          <div>
            <button type="button" onClick={this.textToAudio} id="listenBtn">
              Hey there, I am listening and please speak
            </button>
          </div>
          <br />
          <div>
            <small> I am here to assist you, please speak something with google as a started keyword, Example like :</small>
          </div>
          <ul>
            <li>
              <p><b>google</b> show tom and jerry videos</p>
            </li>
            <small>
              <b>NOTE:</b> google is must
            </small>
          </ul>
        </div>
        <ActionPanel gapiReady={this.state.gapiReady} gapiSearch={this.state.gapiSearch} />
      </div>
        
      </>
    );
  }
}

export default App;
