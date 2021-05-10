import React, { Component } from "react";
import "./../css/style.css";
import AnyControl from "./speechUtility";
import Google from "./gapi";
import ActionPanel from "./actionPanel";
import DataUri from './dataUri';
import { nodeName } from "jquery";

const ctrl = new AnyControl();
var utt = new SpeechSynthesisUtterance();

const welcomeText = 'Hey there, I am listening, please speak and start with google like google play billgates interview video'

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
      iframeSrc: {},
      spaceBtnClicked: false
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
    console.log(ctrl);
    const _this = this;
    //ctrl.debug(true);
    ctrl.addCommand("google ${firstPhrase} ${secondPhrase} ${thirdPhrase}", function (ctx) {
      if(ctx.transcript.split("google")) {
        _this.setState({ gapiSearch: ctx.transcript.split("google")[1].trim() }, () => _this.setFocusOnSearchResult());
      }
    });
    ctrl.start();

    
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
        // if ( e.shiftKey ) /* shift + tab */ {
        //   if (document.activeElement === firstFocusableEl) {
        //     lastFocusableEl.focus();
        //     e.preventDefault();
        //   }
        // } 
        // else /* tab */ {
          let anything_is_focused = (
            document.hasFocus() &&
            document.activeElement !== null &&
            document.activeElement !== document.body &&
            document.activeElement !== document.documentElement
          );
          let { type, nodeName, textContent, innerText } = document.activeElement;
          if(anything_is_focused && (nodeName || type)) {
            console.log(type, document.activeElement.nodeName, document.activeElement.textContent || document.activeElement);
            speech.text = _this.customTextGoogleSearch(document.activeElement);
            window.speechSynthesis.speak(speech);
          }
        //}
      } 
      else if(e.code === "Space" && Object.keys(_this.state.iframeSrc).length) { //&& _this.state.iframeSrc.type === "youtube"
        _this.setState(prevState  => ({ spaceBtnClicked: !prevState.spaceBtnClicked }));
        //localStorage.setItem('tubeVideoKey', 'no');
      }      
      // else if(e.code === "Space" && _this.state.iframeSrc && _this.state.iframeSrc.includes('youtube')) {
      //   if(document.querySelector("#iframeSrcBtn") && document.querySelector("#iframeSrcBtn").classList.contains('paused')) {
      //       document.getElementById('externalPageIframe').src = _this.state.iframeSrc;
      //       document.getElementById('externalPageIframe').src += "&autoplay=1";
      //       document.querySelector("#iframeSrcBtn").classList.remove('paused');
      //       localStorage.setItem('tubeVideoKey', 'no');
      //       return;
          
      //   }
      //   else {
      //     localStorage.setItem('tubeVideoKey', 'yes');
      //     document.getElementById("iframeSrcBtn").click();
      //     document.querySelector("#iframeSrcBtn").classList.add('paused');
      //     return;
      //   }
      // }
    });

    document.addEventListener(`click`, e => {
      const origin = e.target.closest("a");
      
      if (origin) {
        console.clear();
        console.log(`You clicked ${origin.href}`);
        let url = origin.dataset.ctorig ? origin.dataset.ctorig :origin.href;
        let video_id = "";
        if(url.includes('youtube') && url.includes('watch')) {
          video_id = url.split('v=')[1];
          let ampersandPosition = video_id.indexOf('&');
          if(ampersandPosition != -1) {
           video_id = video_id.substring(0, ampersandPosition);
          }
          //let staticYouTube = `https://www.youtube.com/embed/${video_id}?origin=http://example.com`;
          url = video_id;
        }
        this.setState({ iframeSrc: { id: url, type: ((url.includes('youtube') && url.includes('watch')) ? 'youtube' : 'google') } });
        e.preventDefault();
        return false;
      }
    });
  }

  setFocusOnSearchResult = () => {
    var focusableEls = document.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
  }

  textToAudio = (text=welcomeText, gSearch='') => {
    let speech = new SpeechSynthesisUtterance();
    speech.lang = "en-US";
    speech.text = text;
    speech.volume = 1;
    speech.rate = 0.7;
    speech.pitch = 1;
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
        else if (nodeName === "BUTTON" && ele.classList.contains('assistYouBtn')) {
          return textContent || innerText;
        }
        else return `You're on ${textContent || innerText}`;
  }

  handleVideoCtrls = () => this.setState({  });

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
            <button className='assistYouBtn'> I am here to assist you, please speak something with google as a started keyword, Example like :</button>
          </div>
          <ul>
            <li>
              <button className='assistYouBtn'><b>google</b> show bill gates interview</button>
            </li>
            <button className='assistYouBtn'>
              <b>NOTE:</b> google is must
            </button>
          </ul>
        </div>
        <ActionPanel 
          gapiReady={this.state.gapiReady} 
          gapiSearch={this.state.gapiSearch} 
          textToAudio={this.textToAudio} 
          iframeSrc={this.state.iframeSrc} 
          spaceBtnClicked={this.state.spaceBtnClicked}
        />
      </div>
        
      </>
    );
  }
}

export default App;
