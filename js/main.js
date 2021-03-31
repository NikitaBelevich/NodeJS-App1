'use strict';


// console.warn('Hello, I am client JS');

addActiveClassOnMenuItem();
function addActiveClassOnMenuItem() {
    const regexp1 = /[\w\-]+(?=\.html)/;
    const path = document.location.pathname;
    const nameOfCurrentPage = (path == '/') ? 'index' : path.match(regexp1)[0];
    const currentMenuItem = document.querySelector(`[data-page-name="${nameOfCurrentPage}"]`);
    currentMenuItem.classList.add('header-of-site__menu-item_active');
    // console.log(currentMenuItem);
}