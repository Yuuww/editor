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
let sitedata = null;
let openfile = null;

// API Stuff
function login() {
  const password = prompt('Enter Passwort:');
  if (!password) { return; }
  fetch('https://api.get-done.de:3001/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password })
  })
  .then(response => response.json())
  .then(data => {
    if(data.response === true) {
      pw = password;
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
    body: JSON.stringify({ password: pw })
  })
  .then(response => response.json())
  .then(data => {
    sitedata = data;
    reloadItems();
  })
  .catch(error => {
    console.error('Fehler bei der API-Anfrage:', error);
  });
}

// Reload

function reloadItems() {
  let items = "";
  for (const file of sitedata.data) {
    items += `<div onClick="openFile('${file.name}')">${file.name}</div>`
  }
  workspace.children[0].getElementsByTagName('div')[0].innerHTML = items;
}

function reloadEditor() {
  let lines = ""
  for (const file of sitedata.data) {
    if(file.name == openfile) {
      for (const line of file.content.split('\n')) {
        lines += `<div>${line}</div>`;
      }
    }
  }
  workspace.children[1].innerHTML = lines;
}

function openFile(name) {
  openfile = name;
  reloadEditor();
  console.log(name);
}