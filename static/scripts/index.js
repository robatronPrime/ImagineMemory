window.addEventListener('load', init);

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
