import React, {useEffect} from 'react';

const ActionPanel = ({gapiReady, gapiSearch}) => {

    useEffect(() => {
        if(!gapiReady && document.getElementById("gsc-i-id1")) document.getElementById("gsc-i-id1").disabled = true;
        if(gapiSearch) {
          document.getElementById("gsc-i-id1").value = gapiSearch;
          document.getElementsByClassName('gsc-search-button-v2')[0].click();
        }
    });

    return (
            <div className="col-md-8 col-xs-6">
              <h2>Action Panel</h2>
              {/* <div className={`gcse-searchbox ${this.state.gapiReady ? 'showGoogleSearch': ''}`}></div><div className={`gcse-searchresults ${this.state.gapiReady ? 'showGoogleSearchResults': ''}`}></div> */}
              <div className="gcse-searchbox"></div><div className="gcse-searchresults"></div>
              {/* <object data={this.state.iframeSrc}></object> */}
              {/* <a href={this.state.iframeSrc} dangerouslySetInnerHTML={{__html: `${this.state.iframeSrc ? `<object data=${this.state.iframeSrc} />` : ''}`}}></a> */}
              {/* <iframe src={this.state.iframeSrc}></iframe> */}
            </div>
    );
}

export default ActionPanel;