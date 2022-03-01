import { LitElement, html, css } from 'lit';
import { showPrivacyCenter, getCookieValue } from './ovhcloud-privacy-center';
import fetchJsonp from 'fetch-jsonp-es6/src/fetch-jsonp';



export class spreakerGdprCompliant extends LitElement {
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
        #container.content {
          height: 100%;
          padding-bottom: 0;
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
  }
  static get properties() {
    return {
      spreaker: {
        type: String,
      },
      accepted: {
        type: Boolean,
        state: true,
      },
      
    };
  }
  connectedCallback() {
    super.connectedCallback();
    console.log('Spreaker Id:', this.spreaker)
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
      <div id="container" class=${ this.accepted ? 'content' : 'cookie'}>
        ${
          this.accepted ? 
          html`
            <div
              class="spreaker-widget"
              style="display: flex; max-width: ${this
                .dataWidth}; width: 100%; margin-top: 10px; margin-bottom: 10px;"
            >
            <iframe src="https://widget.spreaker.com/player?episode_id=${this.spreaker}&theme=light&playlist=false&cover_image_url=https%3A%2F%2Fd3wo5wojvuv7l.cloudfront.net%2Fimages.spreaker.com%2Foriginal%2F7a3995c37bb49670550a292596744393.jpg" width="100%" height="400px" frameborder="0"></iframe>
            </div>

            
          ` : 
          html`          
            <div id="overlay">
              <p>Spreaker conditions the listening of its posdcats on the deposit of tracers in order to offer you targeted advertising based on your browsing.</p>

              <p>In order to listen the podcast, you need to accept the <i>Sharing cookies on third-party platforms</i> privacy category in our Privacy Center. You have the option of withdrawing your consent at any time.</p>

              <p>For more information,visit <a href="https://www.spreaker.com/cookies" target="_blank">
                  the Spreaker cookies policy
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


window.customElements.define('ovhcloud-gdrp-compliant-spreaker', spreakerGdprCompliant);


