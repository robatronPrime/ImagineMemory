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


async function loadRoles() {
  if (runningTests) return; // ignoring
  const el = document.querySelector('.auth .roles');
  el.textContent = 'loading…';

  const response = await callAPI('GET', '/api/user/roles');

  if (!response.ok) {
    // handle the error
    el.textContent = 'error: ' + response.status;
    return;
  }

  // handle the response
  try {
    const data = await response.json();
    if (data.length) {
      el.textContent = data.join(', ');
    } else {
      el.textContent = 'none';
    }
  } catch (e) {
    el.textContent = 'error: ' + e;
    console.error(e);
  }
}


async function register() { // eslint-disable-line no-unused-vars
  if (runningTests) return; // ignoring
  const el = document.querySelector('.auth .register-status');
  try {
    el.textContent = 'requesting…';

    const response = await callAPI('POST', '/api/user/request');

    if (!response.ok) {
      // handle the error
      el.textContent = 'error: ' + response.status;
      return;
    }

    // handle the response
    el.textContent = 'done, status ' + response.status;
  } catch (e) {
    el.textContent = 'error: ' + e;
    console.error(e);
  }
}

// a helper method that calls the API at the given path, with the given method and optional data
// it returns the fetch() response
// it gets the Google ID token
async function callAPI(method, path, data) {
  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const fetchOptions = {
    credentials: 'same-origin',
    method: method || 'GET',
    body: data,
    headers: { Authorization: 'Bearer ' + idToken },
  };

  return fetch(path, fetchOptions);
}

// react to computer sleeps, get a new token, because it seems gapi doesn't do this reliably
// eslint-disable-next-line max-len
// adapted from http://stackoverflow.com/questions/4079115/can-any-desktop-browsers-detect-when-the-computer-resumes-from-sleep/4080174#4080174
(function () {
  const CHECK_DELAY = 2000;
  let lastTime = Date.now();

  setInterval(() => {
    const currentTime = Date.now();
    if (currentTime > (lastTime + (CHECK_DELAY*2))) { // ignore small delays
      gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
    }
    lastTime = currentTime;
  }, CHECK_DELAY);
}());
