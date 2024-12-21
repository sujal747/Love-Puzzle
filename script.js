// Replace this with your Pixabay API key
const apiKey = '37967399-51f0d48676dcec6022e00a062'; 
const genre = 'love'; // Genre to fetch images
let images = [];
let currentIndex = 0;
let totalClicks = 0;

// Function to fetch images from Pixabay
async function fetchImages() {
  try {
    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${genre}&image_type=photo&per_page=10`);
    const data = await response.json();
    images = data.hits.map(hit => hit.webformatURL); // Collect image URLs
    if (images.length > 0) {
      randomizeImage(); // Set the first image
    } else {
      console.error("No images found for the specified genre.");
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// Function to randomize the image and reset the puzzle
function randomizeImage() {
  if (images.length === 0) return; // No images available
  const root = document.documentElement;
  root.style.setProperty('--image', `url(${images[currentIndex]})`);
  currentIndex = (currentIndex + 1) % images.length;

  const puzzleItems = document.querySelectorAll('#puzz i');
  puzzleItems.forEach(item => {
    item.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    item.style.top = Math.random() * (window.innerHeight - 100) + 'px';
  });
}

// Function to reload the puzzle
function reloadPuzzle() {
  const doneItems = document.querySelectorAll('.done');
  doneItems.forEach(element => element.classList.remove('done'));

  const droppedItems = document.querySelectorAll('.dropped');
  droppedItems.forEach(element => element.classList.remove('dropped'));

  const allDoneElement = document.querySelector('.allDone');
  if (allDoneElement) {
    allDoneElement.style = '';
    allDoneElement.classList.remove('allDone');
  }
}

// Event listeners for mobile functionality
const puzzleItemsMobile = document.querySelectorAll('#puzz i');
puzzleItemsMobile.forEach(element => {
  element.addEventListener('mousedown', () => {
    totalClicks++;
    document.querySelector('#clicks').textContent = totalClicks;
  });

  element.addEventListener('click', () => {
    if (document.querySelector('.clicked')) {
      document.querySelector('.clicked').classList.remove('clicked');
      element.classList.add('clicked');
    } else {
      element.classList.add('clicked');
    }
  });
});

// Event listeners for desktop functionality
const puzzleItemsDesktop = document.querySelectorAll('#puz i');
puzzleItemsDesktop.forEach(element => {
  element.addEventListener('click', () => {
    if (document.querySelector('.clicked')) {
      const clickedElement = document.querySelector('.clicked');
      if (clickedElement.classList.contains(element.classList[0])) {
        element.classList.add('dropped');
        clickedElement.classList.add('done');
        clickedElement.classList.remove('clicked');

        if (document.querySelectorAll('.dropped').length === 9) {
          document.querySelector('#puz').classList.add('allDone');
          document.querySelector('#puz').style.border = 'none';
          document.querySelector('#puz').style.animation = 'allDone 1s linear forwards';

          setTimeout(() => {
            reloadPuzzle();
            randomizeImage();
          }, 1500);
        }
      }
    }
  });
});

// Drag-and-drop functionality for desktop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.className);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");

  if (ev.target.className === data) {
    ev.target.classList.add('dropped');
    document.querySelector(`.${data}[draggable='true']`).classList.add('done');

    if (document.querySelectorAll('.dropped').length === 9) {
      document.querySelector('#puz').classList.add('allDone');
      document.querySelector('#puz').style.border = 'none';
      document.querySelector('#puz').style.animation = 'allDone 1s linear forwards';

      setTimeout(() => {
        reloadPuzzle();
        randomizeImage();
      }, 1500);
    }
  }
}

// Initialize the game
fetchImages();
