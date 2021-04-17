import React, { Component } from "react";
import "./../css/style.css";
import AnyControl from "./speechUtility";
import Google from "./gapi";
import ActionPanel from "./actionPanel";
import DataUri from './dataUri';
import { nodeName } from "jquery";

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
        _this.setState({ gapiSearch: ctx.transcript.split("google")[1].trim() }, () => _this.setFocusOnSearchResult());
      }
    });
    ctrl.start();

    // window.addEventListener('keydown', function(event) {
    //   if (event.key === "Tab") {
    //       console.log(document.activeElement);
    //   }
    //   else if (event.key === 'Enter') {
    //       alert('enter was pressed');
    //   }
    // }, true);
    
    document.addEventListener('keyup', function(e) {
      var focusableEls = document.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
      var firstFocusableEl = focusableEls[0];  
      var lastFocusableEl = focusableEls[focusableEls.length - 1];
      let speech = new SpeechSynthesisUtterance();
      speech.lang = "en-US";
      speech.text = '';
      speech.volume = 1;
      speech.rate = 0.7;
      speech.pitch = 1;
      if (e.key === 'Tab') {
        if ( e.shiftKey ) /* shift + tab */ {
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
            e.preventDefault();
          }
        } else /* tab */ {
          let anything_is_focused = (
            document.hasFocus() &&
            document.activeElement !== null &&
            document.activeElement !== document.body &&
            document.activeElement !== document.documentElement
          );
          //console.log(document.activeElement ,anything_is_focused);
          let { type, nodeName, textContent, innerText } = document.activeElement;
          if(anything_is_focused && (nodeName || type)) {
            console.log(type, document.activeElement.nodeName, document.activeElement.textContent || document.activeElement);
            //speech.text = textContent || innerText;
            speech.text = _this.customTextGoogleSearch(document.activeElement);
            window.speechSynthesis.speak(speech);
            // switch(eleType) {
            //   case 'text':
            //     return '';
            //   case 'button':
            //     return '';
            //   case 'submit':
            //     return '';
            // }
            // if(eleType === "text" && document.activeElement.title === "search") {
            //   speech.text = document.activeElement.title || document.activeElement.name;
            //   window.speechSynthesis.speak(speech);
            // } else if(eleType === "button") {
            //   speech.text = document.activeElement.innerHTML;
            //   window.speechSynthesis.speak(speech);
            // }
          }
          // if (document.activeElement === lastFocusableEl) {
          //   //console.log(document.activeElement, 'after');
          //   firstFocusableEl.focus();
          //   if(eleType === "button") {
          //     speech.text = document.activeElement.innerHTML;
          //     window.speechSynthesis.speak(speech);
          //   }
          //   e.preventDefault();
          // }
        }
      }
    });

    document.addEventListener(`click`, e => {
      const origin = e.target.closest("a");
      
      if (origin) {
        console.clear();
        console.log(`You clicked ${origin.href}`);
        let url = origin.dataset.ctorig ? origin.dataset.ctorig :origin.href;
        if(url.includes('youtube') && url.includes('watch')) {
          let video_id = url.split('v=')[1];
          let ampersandPosition = video_id.indexOf('&');
          if(ampersandPosition != -1) {
           video_id = video_id.substring(0, ampersandPosition);
          }
          let staticYouTube = `https://www.youtube.com/embed/${video_id}?enablejsapi=1&origin=http://youtube.com`;
          url = staticYouTube;
        }
        this.setState({ iframeSrc: url });
        e.preventDefault();
        return false;
      }
    });
  }

  setFocusOnSearchResult = () => {
    var focusableEls = document.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
  }

  textToAudio = (text="Hey there, I am listening and please speak", gSearch='') => {
    let speech = new SpeechSynthesisUtterance();
    speech.lang = "en-US";
    speech.text = text;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    // if(gSearch) {
    //   document.getElementsByClassName('gsc-tabhActive')[0].click();
    //   document.getElementsByClassName('gsc-tabhActive')[0].focus();
    // }

    window.speechSynthesis.speak(speech);
  };

  customTextGoogleSearch = (ele) => {
    let { type, nodeName, textContent, innerText } = ele;
        if(this.state.gapiSearch && nodeName === "A" && ele.classList.contains('gs-title')) {
          return `You're on link ${textContent || innerText} and - press enter if you wish to visit the site`
        } else if((nodeName === "BUTTON" || type === "button") && ele.classList.contains('gsc-search-button')) {
          return `You're on ${textContent || innerText} button and - press enter if you wish to do`;
        } else if((type === 'text' || nodeName === 'INPUT') && ele.classList.contains('gsc-input')) {
          return `You're on search box and - please enter your input`
        } else if(type === "button") {
          return textContent || innerText
        } else if (nodeName === "A" && textContent === "" && innerText === "" && ele.classList.contains('gs-image')) {
          return `you're seeing an image with link - click enter to visit`
        }
        else return `You're on ${textContent || innerText}`;
  }

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
              <p><b>google</b> show bill gates interview</p>
            </li>
            <small>
              <b>NOTE:</b> google is must
            </small>
          </ul>
        </div>
        <ActionPanel gapiReady={this.state.gapiReady} gapiSearch={this.state.gapiSearch} textToAudio={this.textToAudio} iframeSrc={this.state.iframeSrc} />
      </div>
        
      </>
    );
  }
}

export default App;
