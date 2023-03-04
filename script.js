// for storing DOM elements and state
const dom = {}
const state = {}

// cache DOM elements, fetch race data from dogAPI, then render races page
cacheDom();
fetchRaces().then(renderRaces).catch(err => console.log(err));

// queries and stores static DOM elements
function cacheDom() {
  dom.container = document.getElementById('container');
}

// renders dog races list
function renderRaces() {
  // add container for races
  const domRaceContainer = document.createElement('div');
  domRaceContainer.classList.add('race-container');
  dom.container.appendChild(domRaceContainer);

  // add every race
  for (let raceName in state.races.message) {
    // add group for name and image
    const domRaceGroup = document.createElement('div');
    domRaceGroup.classList.add('race-group', 'card');
    domRaceContainer.appendChild(domRaceGroup);
    
    // add name to group
    const domRaceName = document.createElement('div');
    domRaceName.textContent = raceName; 
    domRaceName.classList.add('race-name');
    domRaceGroup.appendChild(domRaceName);
    
    // add image to group !CHANGE FROM DIV TO IMG!
    const domRaceImg = document.createElement('img');
    domRaceImg.src = './dog_placeholder.jpg';
    domRaceImg.classList.add('card-img-bottom')
    domRaceGroup.appendChild(domRaceImg);
  }
}

// fetches race data, then stores it in state.races
async function fetchRaces() {
  const res = await fetch(' https://dog.ceo/api/breeds/list/all');
  if (!res.ok) {
    throw new Error(`dogAPI fetch failed with status ${res.status}`);
  }
  const races = await res.json();
  state.races = races;
}
