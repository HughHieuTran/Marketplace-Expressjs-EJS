const menuToggle = document.querySelector('#side-menu-toggle');
const sideDrawer = document.querySelector('#mobile-menu');
const backdrop = document.querySelector('#backdrop');

const profileButton = document.querySelector('#user-menu-button');
const profileDropdown = document.querySelector('#profile-dropdown');

function menuToggleClickHandler() {
  sideDrawer.classList.toggle('hidden');
}

function dropDownToggleClickHandler() {
  profileDropdown.classList.toggle('hidden');
  backdrop.classList.toggle('hidden');
}

function backdropClickHandler() {
  sideDrawer.classList.add('hidden');
  profileDropdown.classList.add('hidden');
  backdrop.classList.add('hidden');
}

backdrop.addEventListener('click', backdropClickHandler);

menuToggle.addEventListener('click', menuToggleClickHandler);

profileButton.addEventListener('click', dropDownToggleClickHandler);
