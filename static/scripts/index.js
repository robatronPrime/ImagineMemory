//remove html elements function
Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
}

/* global gapi:false */
window.addEventListener('load', init);

function init() {
  keepLoadingRandom();
}

function onSignIn(googleUser) { // eslint-disable-line no-unused-vars
  if (runningTests) {
    resolveGlobalPromise();
    return;
  }

  const profile = googleUser.getBasicProfile();
  const els = document.querySelectorAll('.auth');
  for (const el of els) {
    el.classList.add('logged-in');
    el.querySelector('.name').textContent = profile.getName();
  }
  loadRoles();
}

async function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  await auth2.signOut();

  const els = document.querySelectorAll('.auth');
  for (const el of els) {
    el.classList.remove('logged-in');
    el.querySelector('.name').textContent = 'logged out';
  }
}
