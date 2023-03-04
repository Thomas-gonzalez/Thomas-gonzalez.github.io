// for storing DOM elements and state
const dom = {}
const state = {}

// cache DOM elements, fetch breed data from dogAPI, then render breeds page
cacheDom();
fetchBreeds().then(renderBreeds).catch(err => console.log(err));

// queries and stores static DOM elements
function cacheDom() {
  dom.container = document.getElementById('container');
}

// renders dog breeds list
function renderBreeds() {
  // add container for breeds
  const domBreedContainer = document.createElement('div');
  domBreedContainer.classList.add('breed-container');
  dom.container.appendChild(domBreedContainer);

  // add every breed
  for (let breedName in state.breeds.message) {
    // add group for name and image
    const domBreedGroup = document.createElement('div');
    domBreedGroup.classList.add('breed-group', 'card');
    domBreedContainer.appendChild(domBreedGroup);
    
    // add name to group
    const domBreedName = document.createElement('div');
    domBreedName.textContent = breedName; 
    domBreedName.classList.add('breed-name');
    domBreedGroup.appendChild(domBreedName);
    
    // add image to group !CHANGE FROM DIV TO IMG!
    const domBreedImg = document.createElement('img');
    domBreedImg.src = './dog_placeholder.jpg';
    domBreedImg.classList.add('card-img-bottom')
    domBreedGroup.appendChild(domBreedImg);
  }
}

// fetches breed data, then stores it in state.breeds
async function fetchBreeds() {
  const res = await fetch(' https://dog.ceo/api/breeds/list/all');
  if (!res.ok) {
    throw new Error(`dogAPI fetch failed with status ${res.status}`);
  }
  const breeds = await res.json();
  state.breeds = breeds;
}
