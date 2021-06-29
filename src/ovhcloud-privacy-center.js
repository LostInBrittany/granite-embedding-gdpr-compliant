export function showPrivacyCenter() {
  console.log('OVHcloud Privacy Center - Show');
  window.tc_closePrivacyCenter = function() {
    console.log('OVHcloud Privacy Center - Close');
    document.dispatchEvent(new Event('privacy-center-changed'));
  }
  tC.privacyCenter.showPrivacyCenter();
}



export const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

window.tc_closePrivacyButton_orig = window.tc_closePrivacyButton;
window.tc_closePrivacyButton = function() {
  console.log('Privacy button closed');
  document.dispatchEvent(new Event('privacy-center-changed'));
  window.tc_closePrivacyButton_orig();
}
