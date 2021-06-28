import { LitElement, html, css } from '../_snowpack/pkg/lit.js';
import {unsafeHTML} from '../_snowpack/pkg/lit/directives/unsafe-html.js';
import fetchJsonp from '../_snowpack/pkg/fetch-jsonp-es6/src/fetch-jsonp.js';


window.tc_closePrivacyButton_orig = window.tc_closePrivacyButton;
window.tc_closePrivacyButton = function() {
  console.log('Privacy button closed');
  document.dispatchEvent(new Event('privacy-center-changed'));
  window.tc_closePrivacyButton_orig();
}

const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

export class twitterGdprCompliant extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          display: flex;
          font-size: 14px;
        }        
        #container {
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 56.25%;
          overflow: auto;
        }        
        #overlay {
          position: absolute;
          top: 0;
          left: 0;
          background-color: #333;
          color: white;
          z-index: 2; 
          width: 100%;
          height: 100%;
          font-size: small;
          font-family: sans-serif;
          text-align: center;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }
        #overlay > * {
          margin: 0.5rem 2rem;
        }
        #overlay  a {
          color: #4596EC;
          text-decoration: none;
        }
        #video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        #buttons_panel {
          display: flex;
          flex-flow: row;
          justify-content: center;
          width: 100%;
        }
        #buttons_panel > button {
          margin: 0 0.5rem;
          padding: 0.5rem;
          background-color: #4596EC;
          border-color: #4596EC;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }
        @media (max-width: 512px) {
          #overlay {
            height: 125%;
            justify-content: flex-start;
          }
        }    
        @media (max-width: 400px) {
          #overlay {
            height: 175%;
          }
        }
        @media (max-width: 320px) {
          #overlay {
            height: 250%;
          }
        }
      `,
    ];
  }
  constructor() {
    super();
    this.accepted=false;
    this.poorTweet = '';
    this.richTweet = '';
    this.oEmbedApiRoot='https://publish.twitter.com/oembed';
    document.addEventListener('privacy-center-changed', () => this.privacyCenterChanged());
  }
  static get properties() {
    return {
      tweetUrl: {
        type: String,
      },
      accepted: {
        type: Boolean,
        state: true,
      },
      poorTweet: {
        type: String,
        state: true,
      },
      richTweet: {
        type: String,
        state: true,
      },
      
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.getTweetText();
    this.verifyCookies();
  }
  async getTweetText() {
    let response = await fetchJsonp(
      `${this.oEmbedApiRoot}?url=${this.tweetUrl}`,
      { mode: 'cors'});
    let responseJson = await response.json();
    this.richTweet = responseJson.html;
    this.poorTweet = responseJson.html.replace(/<script.*<\/script>/, '');
    console.log(responseJson)
  }
  verifyCookies() {
    let cookieValue = decodeURIComponent(getCookieValue('TC_PRIVACY_CENTER'));
    if (!cookieValue) {
      this.accepted = false;
      console.log('Third part cookies refused');
      return;
    }
    console.log(cookieValue, cookieValue.split(','));
    if (cookieValue.split(',').indexOf('4') < 0) {
      this.accepted = false;
      console.log('Third part cookies refused');
      return;
    } 
    this.accepted = true;
    console.log('Third part cookies accepted');
  }

  showPrivacyCenter() {
    console.log('Showing Privacy Center');
    window.tc_closePrivacyCenter = function() {
      console.log('Privacy center closed');
      document.dispatchEvent(new Event('privacy-center-changed'));
    }
    tC.privacyCenter.showPrivacyCenter();
  }
  privacyCenterChanged() {
    console.log('Detected');
    this.verifyCookies();
  }
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <div id="container">
        ${
          this.accepted ? 
          html`
            <div
              class="twitter-tweet twitter-tweet-rendered"
              style="display: flex; max-width: ${this
                .dataWidth}; width: 100%; margin-top: 10px; margin-bottom: 10px;"
            >
              <iframe
                sandbox="allow-same-origin allow-scripts ${this.allowPopups}"
                scrolling="no"
                frameborder="0"
                loading="lazy"
                allowtransparency="true"
                allowfullscreen
                style="position: static; visibility: visible; width: ${this
                  .dataWidth}; height: 498px; display: block; flex-grow: 1;"
                title="Twitter Tweet"
                src="https://platform.twitter.com/embed/index.html?dnt=true&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=1400028026147115008&amp;lang=en&amp;origin=http%3A%2F%2Flocalhost%3A8000%2Felements%2Ftwitter-embed%2Fdemo%2Findex.htm&amp;widgetsVersion=223fc1c4%3A1596143124634&amp;width=250"
                data-tweet-id="1400028026147115008"
              >
              </iframe>
            </div>

            
          ` : 
          html`          
            <div id="overlay">
              <p>Twitter conditions the displaying of its tweets on the deposit of tracers in order to offer you targeted advertising based on your browsing.</p>

              <p>In order to watch the tweet, you need to accept the <i>Sharing cookies on third-party platforms</i> privacy category in our Privacy Center. You have the option of withdrawing your consent at any time.</p>

              <p>For more information,visit <a href="https://help.twitter.com/en/rules-and-policies/twitter-cookies" target="_blank">
                  the Twitter cookies policy
              </a> 
              and the 
              <a href="https://www.ovh.ie/support/termsofservice/cookies_ovh.xml" target="_blank">
                  OVHcloud cookies policy
              </a>.</p> 

              <div id="buttons_panel">
                <button id="ok" @click="${this.showPrivacyCenter}">Show Privacy Center</button> 
              </div>
            </div>
          `
        }
      </div>
    `;
  }
}


window.customElements.define('ovhcloud-gdrp-compliant-twitter', twitterGdprCompliant);


