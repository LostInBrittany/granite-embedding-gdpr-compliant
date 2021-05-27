import { LitElement, html, css } from '../_snowpack/pkg/lit.js';


export class youtubeGdprComplaiant extends LitElement {
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
  }
  static get properties() {
    return {
      video: {
        type: String,
      },
      accepted: {
        type: Boolean,
      }
    };
  }
  accept() {
    console.log('do accept');
    this.accepted=true;

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

              <p>By clicking on "I authorize" the tracers will be deposited and you will be able to view the video. You have the option of withdrawing your consent at any time.</p>

              <p>By clicking on "I refuse", you will not be able to access the video.</p>

              <p><a href="https://policies.google.com/privacy?hl=en&gl=en">
                For more information, visit the YouTube "cookies" policy
              </a></p> 

              <div id="buttons_panel">
                <button id="ok" @click="${this.accept}">Accept</button> 
                <button id="ko">Reject</button> 
              </div>
            </div>
          `
        }
      </div>
    `;
  }
}


window.customElements.define('granite-youtube-gdpr-compliant', youtubeGdprComplaiant);


