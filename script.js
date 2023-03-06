// for storing DOM elements and state
const dom = {}
const state = {
  breeds: {},
  images: {},
}


// cache DOM elements, fetch breed data from dogAPI, then render breeds page
cacheDom();
fetchBreeds()
.then(renderBreeds) // render breeds page
.then(() => { // fetch images for sub-breeds
  for (let breed in state.breeds) {
    state.breeds[breed].forEach(subBreed => {
      fetchSubBreedImg(breed, subBreed);
    })
  }
})
.catch(err => console.log(err));


// queries and stores static DOM elements
function cacheDom() {
  dom.container = document.getElementById('container');
  dom.header = document.querySelector('.header');
  dom.navBar = document.querySelector('.nav-bar');
  dom.navBarLeft = document.querySelector('.nav-bar .left');
  dom.navBarRight = document.querySelector('.nav-bar .right');
}

// renders dog breeds page
function renderBreeds() {
  // clean page
  dom.container.innerHTML = '';
  dom.navBarLeft.innerHTML = '';

  // add nav bar button to refresh (for new images)
  const refresh = document.createElement('div');
  refresh.onclick = () => window.location.reload();
  refresh.textContent = 'All Breeds';
  refresh.classList.add('text-btn');
  dom.navBarLeft.appendChild(refresh); 

  // add container for breeds
  dom.breedContainer = document.createElement('div');
  dom.breedContainer.classList.add('breed-container');
  dom.container.appendChild(dom.breedContainer);

  // add every breed
  for (let breedName in state.breeds) {
    // add group for name and image
    const domBreedGroup = document.createElement('div');
    domBreedGroup.classList.add('breed-group', 'card');
    domBreedGroup.onclick = () => renderSubBreeds(breedName); // render sub-breeds on click
    if (state.breeds[breedName].length) {
      domBreedGroup.classList.add('has-sub-breeds');
    }
    dom.breedContainer.appendChild(domBreedGroup);
    
    // add name to group
    const domBreedName = document.createElement('div');
    domBreedName.textContent = capitalize(breedName); 
    domBreedName.classList.add('breed-name');
    domBreedGroup.appendChild(domBreedName);
    
    // add image to group
    const domBreedImg = document.createElement('img');
    domBreedImg.src = './dog_placeholder.jpg';
    domBreedImg.classList.add('card-img-bottom', 'small-img')
    domBreedGroup.appendChild(domBreedImg);
    
    
    // get image source
    if (!state.images[breedName]) {
      fetchBreedImg(breedName)
      .then(src => {
        state.images[breedName] = src;
        domBreedImg.src = src;
      })
      .catch(err => console.log(err));
    }
    else { // image already fetched
      domBreedImg.src = state.images[breedName];
    }
  }
}

// renders dog sub-breed page
function renderSubBreeds(breed) {
  // clean page
  dom.navBarLeft.innerHTML = '';
  dom.container.innerHTML = '';

  // add back to breeds button
  const back = document.createElement('div');
  back.onclick = renderBreeds;
  back.textContent = 'Back to All Breeds';
  back.classList.add('text-btn');
  dom.navBarLeft.appendChild(back);

  // add name header
  const name = document.createElement('div');
  name.textContent = capitalize(breed) + ' Sub-Breeds';
  name.classList.add('name-header');
  dom.container.appendChild(name);

  // if no sub-breeds
  if (!state.breeds[breed].length) {
    // add message to inform about lack of sub-breeds
    const msg = document.createElement('div');
    msg.textContent = `This breed has no sub-breeds`;
    dom.container.appendChild(msg);

    // add full-scale picture for generic breed
    const breedImg = document.createElement('img');
    breedImg.classList.add('large-img');
    dom.container.appendChild(breedImg);
    // get image source
    if (!state.images[breed]) {
      fetchBreedImg(breed)
      .then(src => {
        state.images[breed] = src;
        breedImg.src = src;
      })
      .catch(err => console.log(err));
    }
    else { // image already fetched
      breedImg.src = state.images[breed];
    }
  }

  // add container for sub-breeds
  dom.subBreeds = document.createElement('div');
  dom.subBreeds.classList.add('sub-breed-container');
  dom.container.appendChild(dom.subBreeds);

  
  // check if array is empty (optional using .forEach)
  const length = state.breeds[breed].length;
  if (!length) return;

  // add every sub-breed
  state.breeds[breed].forEach(subBreed => {
    console.log(`subbreed: ${subBreed}`);
    // add group for name and image
    const group = document.createElement('div');
    group.classList.add('breed-group', 'card');
    dom.subBreeds.appendChild(group);
    // place single sub-breed in middle column
    if (length == 1) group.style["grid-column"] = "2 / 3";

    // add img to group
    const img = document.createElement('img');
    img.src = './dog_placeholder.jpg';
    img.classList.add('card-img-top', 'small-img');
    group.appendChild(img);
    
    // add name to group
    const name = document.createElement('div');
    name.textContent = capitalize(subBreed);
    name.classList.add('breed-name');
    group.appendChild(name);


    // get image source
    if (!state.images[breed+subBreed]) {
      fetchSubBreedImg(breed, subBreed)
      .then(src => {
        state.images[breed+subBreed] = src;
        img.src = src;
      })
      .catch(err => console.log(err));
    }
    else { // image already fetched
      img.src = state.images[breed+subBreed];
    }
  });
}

// fetches breed data, then stores it in state.breeds
async function fetchBreeds() {
  const res = await fetch('https://dog.ceo/api/breeds/list/all');
  if (!res.ok) {
    throw new Error(`dogAPI fetch failed with status ${res.status}`);
  }
  const breeds = await res.json();
  state.breeds = breeds.message;
}

// fetches a random image source for a given breed
async function fetchBreedImg(breed) {
  const res = await fetch(` https://dog.ceo/api/breed/${breed}/images/random`);
  if (!res.ok) {
    throw new Error(`dogAPI fetch failed with status ${res.status}`);
  }
  const img = await res.json();
  return img.message;
}

// fetches a random image source for a give sub-breed
async function fetchSubBreedImg(breed, subBreed) {
  const res = await fetch(`https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`);
  if (!res.ok) {
    throw new Error(`dogAPI fetch failed with status ${res.status}`);
  } 
  const img = await res.json();
  state.images[breed+subBreed] = img.message;
  return img.message;
}

// capitalizes string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


