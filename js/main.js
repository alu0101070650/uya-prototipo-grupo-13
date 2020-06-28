// Materialize initialization
var parallaxElems = document.querySelectorAll(".parallax");
M.Parallax.init(parallaxElems, {});

var sidenavElems = document.querySelectorAll(".sidenav");
M.Sidenav.init(sidenavElems, {});

let carouselElems = document.querySelectorAll(".carousel");
M.Carousel.init(carouselElems, {
  duration: 0,
  indicators: true,
  fullWidth: true,
});

carouselElems.forEach((carouselElem) => {
  let instance = M.Carousel.getInstance(carouselElem);
  let prevButton = carouselElem.querySelector("button.prev");
  let nextButton = carouselElem.querySelector("button.next");

  prevButton.onclick = () => {
    instance.prev();
  };

  nextButton.onclick = () => {
    instance.next();
  };
});

// Firebase initialization
var firebaseConfig = {
  apiKey: "AIzaSyARHzKpgB9nUTbU5E3IW6K6fotRxLnGKQ8",
  authDomain: "banco-tiempo-fe841.firebaseapp.com",
  databaseURL: "https://banco-tiempo-fe841.firebaseio.com",
  projectId: "banco-tiempo-fe841",
  storageBucket: "banco-tiempo-fe841.appspot.com",
  messagingSenderId: "262764826548",
  appId: "1:262764826548:web:c3defccd2e5ea1c9ae6ce1",
  measurementId: "G-92CR92L8DM",
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
