import React, { useState, useEffect, useRef } from 'react';

const ActionPanel = ({ gapiReady, gapiSearch, textToAudio, iframeSrc }) => {
    const [iframeCont, setIframeCont] = useState(false);
    const [makeAutoPlay, setAutoPlay]= useState(true);
    let player = "", timeout = 1000;

    useEffect(() => {
        let focusableEls = document.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
        if(!gapiReady && document.getElementById("gsc-i-id1")) document.getElementById("gsc-i-id1").disabled = true;
        if(gapiSearch) {
          document.getElementById("gsc-i-id1").value = gapiSearch;
          document.getElementsByClassName('gsc-search-button-v2')[0].click();
        }
    });

    useEffect(() => {
      const ele = document.getElementsByClassName('iframeExternal');
      if(iframeSrc.id && !iframeCont)  {
        // document.querySelector(".assistYouBtn").focus();
        setIframeCont(true);
        // let focusableEls = document.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
        // focusableEls[0].focus();
        const searchText = `Your result is ready ${iframeSrc.type === 'youtube' && 'you can pause the video by pressing keyboard space bar'} or if you wish to go back press f5`;
        textToAudio(searchText, 'gSearch');
        if (!window.YT && iframeSrc.type === "youtube") {
          timeout = 6500;
          // If not, load the script asynchronously
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
    
          // onYouTubeIframeAPIReady will load the video after the script is loaded
          window.onYouTubeIframeAPIReady = loadVideo;
    
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
        } else if(iframeSrc.type === "youtube"){ // If script is already there, load the video directly
          timeout = 6500;
          loadVideo();
        }
      }
    });

    const loadVideo = () => {
      setTimeout(() => {
        // the Player object is created uniquely based on the id in props
        player = new window.YT.Player(`youtube-player-${iframeSrc.id}`, {
          videoId: iframeSrc.id,
          height: '600',
          width: '870',
          playerVars: {
            autoplay: 1
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
          },
        });
      }, timeout);
    };

    const onPlayerReady = event => {
      event.target.setVolume(100);
      event.target.playVideo();
      // document.querySelector(".assistYouBtn").focus();
      document.addEventListener('keyup', function(e) { 
        if(e.code === "Space") {
          player.getPlayerState() === 1 && player.pauseVideo();
          player.getPlayerState() === 2 && player.playVideo();
        } 
      });
    };

    const onPlayerStateChange = e => {
      console.log(e.target);
    }

    return (
            <div className="col-md-8 col-xs-6">
              <h2>Action Panel</h2>
              <div className='gcse-searchbox'></div><div className="gcse-searchresults"></div>
              {iframeSrc.id && iframeSrc.type === "youtube" && <>
                  {/* <iframe src={iframeSrc} name="myFrame" className='iframeExternal' id='externalPageIframe'  allow={makeAutoPlay}></iframe> */}
                  <div id={`youtube-player-${iframeSrc.id}`} className='iframeYtExternal'></div>
                  {/* <p><a href={iframeSrc} target="myFrame" id="iframeSrcBtn"></a></p> */}
                  {/* <button id="pause-button" style={{  position: 'absolute',
                      bottom: '15px' }}>Pause</button> */}
              </>}
              {iframeSrc.id && iframeSrc.type === "google" && <>
                  <iframe src={iframeSrc.id} name="myFrame" className='iframeExternal' id='externalPageIframe' ></iframe>
                </>
              }
            </div>
    );
}

export default ActionPanel;