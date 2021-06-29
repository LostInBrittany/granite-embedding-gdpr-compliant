import { LitElement, html, css } from 'lit';
import { showPrivacyCenter, getCookieValue } from './ovhcloud-privacy-center';

export class youtubeGdprCompliant extends LitElement {
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
    document.addEventListener('privacy-center-changed', () => this.privacyCenterChanged());
  }
  static get properties() {
    return {
      video: {
        type: String,
      },
      accepted: {
        type: Boolean,
        state: true,
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.verifyCookies();
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
  privacyCenterChanged() {
    console.log('Detected');
    this.verifyCookies();
  }
  render() {
    return html`
      <div id="container">
        ${
          this.accepted ? 
          html`
            <iframe id="video" src="https://youtube.com/embed/${this.video}" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          ` : 
          html`
            <div id="overlay">
              <p>YouTube conditions the playback of its videos on the deposit of tracers in order to offer you targeted advertising based on your browsing.</p>

              <p>In order to watch the video, you need to accept the <i>Sharing cookies on third-party platforms</i> privacy category in our Privacy Center. You have the option of withdrawing your consent at any time.</p>

              <p>For more information,visit <a href="https://policies.google.com/privacy?hl=en&gl=en" target="_blank">
                  the YouTube cookies policy
              </a> 
              and the 
              <a href="https://www.ovh.ie/support/termsofservice/cookies_ovh.xml" target="_blank">
                  OVHcloud cookies policy
              </a>.</p> 

              <div id="buttons_panel">
                <button id="ok" @click="${showPrivacyCenter}">Show Privacy Center</button> 
              </div>
            </div>
          `
        }
      </div>
    `;
  }
}


window.customElements.define('ovhcloud-gdrp-compliant-youtube', youtubeGdprCompliant);


