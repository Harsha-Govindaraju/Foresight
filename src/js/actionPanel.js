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
        const searchText = `Your result is ready and you can go back by pressing f5`;
        textToAudio(searchText, 'gSearch');
        setTimeout(() => {
          //document.activeElement = null;
          //document.activeElement = document.getElementById('externalPageIframe');
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
          [...document.getElementsByTagName('iframe')].filter(a => a.classList.contains('iframeExternal'))[0].contentWindow.focus();
          console.clear();
          console.log('f after',document.activeElement);
        }, 1000);

        document.addEventListener('keydown', function(e) { 
          if (e.key === 'Tab') { 
            alert('hi')
          }
        });
      } 
    });

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