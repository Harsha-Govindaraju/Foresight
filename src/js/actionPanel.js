import React, { useState, useEffect} from 'react';

const ActionPanel = ({ gapiReady, gapiSearch, textToAudio, iframeSrc }) => {
    const [iframeCont, setIframeCont] = useState(false);
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
      if(iframeSrc && !iframeCont)  {
        document.getElementById('iframeSrcBtn').click();
        ele[0].contentWindow.focus();
        setIframeCont(true);
        let focusableEls = document.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
        focusableEls[0].focus();
        const searchText = `Your result is ready ${iframeSrc.includes('youtube') && 'and you can play the video by using tab keyword '} and you can go back by pressing f5`;
        textToAudio(searchText, 'gSearch');

        //httpGet(iframeSrc);

        setTimeout(() => {
          //document.activeElement = null;
          //document.activeElement = document.getElementById('externalPageIframe');
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
          [...document.getElementsByTagName('iframe')].filter(a => a.classList.contains('iframeExternal'))[0].contentWindow.focus();
          if(iframeSrc.includes('youtube')) {
            document.getElementById("iframeSrcBtn").addEventListener("click", function() {
              autoPlayVideo();
            });
          }
          console.clear();
          setTimeout(() => {
            document.getElementById('iframeSrcBtn').click()
            // const ele = document.getElementById('iframeSrcBtn');
            // ele.addEventListener("click", function() { 
            //   console.log('hello')
            //   //$("#externalPageIframe")[0].src += "&autoplay=1";
            // });
          }, 4000);
        }, 1000);
      }
    });

    function autoPlayVideo() {
      document.getElementById('externalPageIframe').src += "&autoplay=1";
    }
    // useEffect(() => {
    //   document.addEventListener('keyUp', function(e) { 
    //     if (e.key === 'Tab') { 
    //       alert('hi')
    //     }
    //   });

      
    //     // setInterval(() => {
    //     //   if(iframeSrc.includes('youtube') && document.querySelector('.html5-main-video')) { 
    //     //     document.querySelector('.html5-main-video').play();
    //     //     clearInterval();
    //     //   }
    //     // }, 1000);
    //   setTimeout(() => {
    //     if(iframeSrc.includes('youtube') && document.querySelector('.html5-main-video')) { 
    //       document.querySelector('.html5-main-video').play();
    //       clearInterval();
    //     }
    //   }, 5000);

    //   // document.querySelector('iframe').onload = function(){
    //   //     console.log('iframe loaded');
    //   // };
      
    // });

    // function createDiv(responsetext)
    // {
    //     var _body = document.getElementsByTagName('body')[0];
    //     var _div = document.createElement('div');
    //     _div.innerHTML = responsetext;
    //     _body.appendChild(_div);
    // }


    // function httpGet(theUrl)
    // {
    //   let xmlhttp;
    //     if (window.XMLHttpRequest)
    //     {// code for IE7+, Firefox, Chrome, Opera, Safari
    //         xmlhttp=new XMLHttpRequest();
    //     }
    //     else
    //     {// code for IE6, IE5
    //         xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    //     }
    //     xmlhttp.onreadystatechange=function()
    //     {
    //         if (xmlhttp.readyState==4 && xmlhttp.status==200)
    //         {
    //             createDiv(xmlhttp.responseText);
    //         }
    //     }
    //     xmlhttp.open("GET", theUrl, true);
    //     xmlhttp.send();    
    // }

    // const loadIframeSrc = () => {
    //   if(iframeSrcCont.includes('youtube') && iframeSrcCont.includes('watch')) {
    //     let video_id = iframeSrc.split('v=')[1];
    //     let ampersandPosition = video_id.indexOf('&');
    //     if(ampersandPosition != -1) {
    //      video_id = video_id.substring(0, ampersandPosition);
    //     }
    //     let staticYouTube = `https://www.youtube.com/embed/${video_id}?autoplay=1&origin=http://youtube.com`;
    //     setState(staticYouTube);
    //     return staticYouTube;
    //   }
    //   else if(!iframeSrcCont){
    //     setState(iframeSrc);
    //     return iframeSrc;
    //   }
    // }

    // const frameLoaded = () => {
    //   setInterval(() => {
    //     console.clear();
    //       console.log('hi');
    //     if(iframeSrc.includes('youtube') && document.querySelector('.ytp-large-play-button')) { 
    //       console.log('hi 2');
    //       document.querySelector('.ytp-large-play-button').click();
    //     }
    //   }, 1000);
    // }

    return (
            <div className="col-md-8 col-xs-6">
              <h2>Action Panel</h2>
              <div className='gcse-searchbox'></div><div className="gcse-searchresults"></div>
              {iframeSrc && <>
                  <iframe src={iframeSrc} name="myFrame" className='iframeExternal' id='externalPageIframe'></iframe>
                  <p><a href={iframeSrc} target="myFrame" id="iframeSrcBtn"></a></p>
                  {/* <button className="backBtn">Back</button> */}
              </>}
            </div>
    );
}

export default ActionPanel;