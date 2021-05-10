import React, { useState, useEffect, useRef } from 'react';

const ActionPanel = ({ gapiReady, gapiSearch, textToAudio, iframeSrc, spaceBtnClicked, handleVideoCtrls }) => {
    const [iframeCont, setIframeCont] = useState(false);
    const [makeAutoPlay, setAutoPlay]= useState(true);
    let player = "";

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
        document.querySelector(".assistYouBtn").focus();
        setIframeCont(true);
        let focusableEls = document.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
        focusableEls[0].focus();
        const searchText = `Your result is ready ${iframeSrc.type === 'youtube' && 'you can stop or re-start the video by pressing space bar in keyboard'} or if you want to go back by press f5`;
        // textToAudio(searchText, 'gSearch');
        if (!window.YT) { // If not, load the script asynchronously
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
    
          // onYouTubeIframeAPIReady will load the video after the script is loaded
          window.onYouTubeIframeAPIReady = loadVideo;
    
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
        } else { // If script is already there, load the video directly
          loadVideo();
        }

        // setTimeout(() => {
        //   if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        //   [...document.getElementsByTagName('iframe')].filter(a => a.classList.contains('iframeExternal'))[0].contentWindow.focus();
        //   document.querySelector(".assistYouBtn").focus();
        //   // if(iframeSrc.includes('youtube')) {
        //   //   document.querySelector(".assistYouBtn").focus();
        //   //   localStorage.setItem('tubeVideoKey', 'no');
        //   //   document.getElementById("iframeSrcBtn").addEventListener("click", function() {
        //   //     if(document.querySelector("#iframeSrcBtn").classList.contains('paused')) return;
        //   //     else autoPlayVideo();
        //   //   });
        //   // }
        //   console.clear();
        //   setTimeout(() => {
        //     //document.getElementById('iframeSrcBtn').click();
        //     document.getElementById('externalPageIframe').src +=  '&autoplay=1';
        //     document.getElementById('iframeSrcBtn').click();
        //     //setAutoPlay(true);
        //   }, 5200);
        // }, 1000);
      }
    });

    useEffect(() => {
      if(iframeSrc.id && iframeCont)  { 
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
        if(spaceBtnClicked) player.stopVideo();
        // else  { 
        //   playVideoYT();
        //   handleVideoCtrls(false);
        // }
      }
    }, [spaceBtnClicked]);

    function autoPlayVideo() {
      const videoPlaying = localStorage.getItem('tubeVideoKey');
      if(videoPlaying === 'yes') {
        document.getElementById('externalPageIframe').src = iframeSrc;
        document.getElementById('externalPageIframe').src +=  '&autoplay=0';
      }
      // document.getElementById('externalPageIframe').src += `&autoplay=${videoPlaying === 'yes' ? '0' : '1'}`;
      else document.getElementById('externalPageIframe').src +=  '&autoplay=1';
    }

    const loadVideo = () => {
      //const { iframeSrc } = props;
  
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
    };

    const onPlayerReady = event => {
      event.target.setVolume(100);
      event.target.playVideo();
      document.querySelector(".assistYouBtn").focus();
      // bind events
      // var playButton = document.getElementById("play-button");
      // playButton.addEventListener("click", function() {
      //   player.playVideo();
      // });
      
      // var pauseButton = document.getElementById("pause-button");
      // pauseButton.addEventListener("click", function() {
      //   player.pauseVideo();
      // });
    };

    const onPlayerStateChange = e => {
      if(iframeSrc.id && iframeCont)  { 
        if(spaceBtnClicked) stopVideo();
        else  { 
          startVideo();
         // handleVideoCtrls(false);
        }
      }
      console.log(e.target);
    }
    
    function stopVideo() {
      player.stopVideo();
    }

    function startVideo() {
      player.startVideo();
    }

    return (
            <div className="col-md-8 col-xs-6">
              <h2>Action Panel</h2>
              <div className='gcse-searchbox'></div><div className="gcse-searchresults"></div>
              {iframeSrc.id && <>
                  {/* <iframe src={iframeSrc} name="myFrame" className='iframeExternal' id='externalPageIframe'  allow={makeAutoPlay}></iframe> */}
                  <div id={`youtube-player-${iframeSrc.id}`} className='iframeYtExternal'></div>
                  {/* <p><a href={iframeSrc} target="myFrame" id="iframeSrcBtn"></a></p> */}
                  {/* <button id="pause-button" style={{  position: 'absolute',
                      bottom: '15px' }}>Pause</button> */}
              </>}
            </div>
    );
}

export default ActionPanel;