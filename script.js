const dom = {}
const state = {}

cacheDom();
render();

// queries necessary static html elements
function cacheDom() {
  dom.container = document.getElementById('container');
}

// displays dynamic elements
function render() {
  getRaces();
}

function getRaces() {
  fetchRaces().then(races => {
    state.races = races;
  }).catch(err => console.log(err));
}

async function fetchRaces() {
  const res = await fetch(' https://dog.ceo/api/breeds/list/all');
  if (!res.ok) {
    throw new Error(`dogAPI fetch failed with status ${res.status}`);
  }
  return res.json();
}
