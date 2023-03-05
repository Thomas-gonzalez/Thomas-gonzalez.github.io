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
}

// renders dog breeds page
function renderBreeds() {
  // clean page
  dom.container.innerHTML = '';

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
    domBreedName.textContent = breedName; 
    domBreedName.classList.add('breed-name');
    domBreedGroup.appendChild(domBreedName);
    
    // add image to group
    const domBreedImg = document.createElement('img');
    domBreedImg.src = './dog_placeholder.jpg';
    domBreedImg.classList.add('card-img-bottom')
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
  dom.container.innerHTML = '';

  // add back to breeds button
  const back = document.createElement('button');
  back.onclick = renderBreeds;
  back.textContent = 'Back';
  back.classList.add('btn', 'btn-primary');
  dom.container.appendChild(back);

  // add subtitle

  // add container for sub-breeds
  dom.subBreeds = document.createElement('div');
  dom.subBreeds.classList.add('breed-container');
  dom.container.appendChild(dom.subBreeds);

  // check if array is empty (optional using .forEach)

  // add every sub-breed
  state.breeds[breed].forEach(subBreed => {
    console.log(`subbreed: ${subBreed}`);
    // add group for name and image
    const group = document.createElement('div');
    group.classList.add('breed-group', 'card');
    dom.subBreeds.appendChild(group);

    // add name to group
    const name = document.createElement('div');
    name.textContent = subBreed;
    name.classList.add('breed-name');
    group.appendChild(name);

    // add img to group
    const img = document.createElement('img');
    img.src = './dog_placeholder.jpg';
    img.classList.add('card-img-bottom');
    group.appendChild(img);

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

