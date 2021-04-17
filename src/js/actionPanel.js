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

        setTimeout(() => {
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
          [...document.getElementsByTagName('iframe')].filter(a => a.classList.contains('iframeExternal'))[0].contentWindow.focus();
          if(iframeSrc.includes('youtube')) {
            document.getElementById("iframeSrcBtn").addEventListener("click", function() {
              autoPlayVideo();
            });
          }
          console.clear();
          setTimeout(() => {
            document.getElementById('iframeSrcBtn').click();
          }, 4000);
        }, 1000);
      }
    });

    function autoPlayVideo() {
      document.getElementById('externalPageIframe').src += "&autoplay=1";
    }
    

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
