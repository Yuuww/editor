const workspace = document.getElementById('workspace');

let hoverState = null;
let pressedTool = null;

const toolFunctions = [toggleItems, openSettings];

document.addEventListener('mouseup', (data) => {
  if(hoverState != null && hoverState === pressedTool[1]) {
    toolFunctions[pressedTool[1]]();
    if(pressedTool[0].children[0].classList.contains('isPressed')) {
      pressedTool[0].children[0].classList.remove('isPressed');
    }
  } else if(pressedTool != null && pressedTool[0].children[0].classList.contains('isPressed')) {
    pressedTool[0].children[0].classList.remove('isPressed');
  }
});

Array.from(workspace.children[0].getElementsByTagName('div')[0].getElementsByTagName('div')).forEach((tool, i) => {
  tool.addEventListener('mousedown', (data) => {
    pressedTool = [tool, i];
    if(!tool.children[0].classList.contains('isPressed')) {
      tool.children[0].classList.add('isPressed');
    }
  });
  tool.addEventListener('mouseenter', (data) => {
    hoverState = i;
  });
  tool.addEventListener('mouseleave', (data) => {
    hoverState = null;
  });
});

function toggleItems() {
  workspace.children[0].classList.toggle('isClosed');
}

function openSettings() {
  read();
}

let pw = null;

// API Stuff
function login() {
  const password = prompt('Enter Passwort:');
  if (!password) { return; }
  fetch('https://api.get-done.de:3001/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })
  .then(response => response.json())
  .then(data => {
    if(data.response === true) {
      pw = password;
      loadData();
    } else {
      pw = null;
    }
  })
  .catch(error => {
    console.error('Fehler bei der API-Anfrage:', error);
  });
}

function read() {
  if(pw === null) {
    login();
  }
  fetch('https://api.get-done.de:3001/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })
  .then(response => response.json())
  .then(data => {
    if(data.response === true) {
      console.log(data);
    }
  })
  .catch(error => {
    console.error('Fehler bei der API-Anfrage:', error);
  });
}