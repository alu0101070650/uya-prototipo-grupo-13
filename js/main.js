// Materialize initialization
let parallaxElems = document.querySelectorAll(".parallax");
M.Parallax.init(parallaxElems, {});

let sidenavElems = document.querySelectorAll(".sidenav");
M.Sidenav.init(sidenavElems, {});

let selectElems = document.querySelectorAll("select");
M.FormSelect.init(selectElems, {});

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

// Functions

function logout() {
  firebase.auth().signOut();
}

function getGravatarImage(email) {
  const lowercaseEmail = email.toLowerCase().trim();
  return `https://www.gravatar.com/avatar/${CryptoJS.MD5(lowercaseEmail)}`;
}

function getDateFromTimestamp(timestamp) {
  const date = new Date(timestamp.seconds * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function advertIsFromCurrentUser(uid) {
  return firebase.auth().currentUser.uid === uid;
}

function advertIsAccepted(uid) {
  return firebase.auth().currentUser.uid === uid;
}

function renderAdvert(data, docId) {
  const advert = `
    <section class="card">
      <div class="row card-content">
        <div class="col s12 advrt-user-info">
          <img class="advrt-user-info-avatar" alt="" src="${getGravatarImage(
            data.userEmail
          )}">
          <div class="advrt-user-info-data">
            <span aria-label="nombre del usuario creador del anuncio">${
              data.userName
            }${advertIsFromCurrentUser(data.userId) ? " (Tú)" : ""}</span>
            <span aria-label="zona geográfica">${data.city}</span>
            <span aria-label="fecha de creación del anuncio">${getDateFromTimestamp(
              data.creationDate
            )}</span>
          </div>
        </div>

        <div class="col s12 advrt-content" aria-label="contenido del anuncio">
          ${data.content}
        </div>

        <div class="col s12 advrt-buttons">
          ${
            advertIsFromCurrentUser(data.userId)
              ? `<a href="#" onclick="deleteAdvert('${docId}')" class="btn waves-effect waves-light black-text"><i class="material-icons left">delete</i>Borrar anuncio</a>`
              : advertIsAccepted(data.acceptedBy)
              ? `<a href="#" onclick="cancelFavor('${docId}')" class="btn waves-effect waves-light black-text"><i class="material-icons left">clear</i>Cancelar favor</a>`
              : `<a href="#" onclick="acceptAdvert('${docId}')" class="btn waves-effect waves-light red">Me interesa</a>`
          }
        </div>

      </div>
    </section>
  `;

  return advert;
}

function goToMainPage() {
  if (window.location.pathname.startsWith("/uya-prototipo-grupo-13")) {
    window.location.href = "/uya-prototipo-grupo-13";
  } else {
    window.location.href = "/";
  }
}

function goToDashboard() {
  if (window.location.pathname.startsWith("/uya-prototipo-grupo-13")) {
    window.location.href = "/uya-prototipo-grupo-13/dashboard";
  } else {
    window.location.href = "/dashboard";
  }
}

function goToAcceptedFavors() {
  if (window.location.pathname.startsWith("/uya-prototipo-grupo-13")) {
    window.location.href = "/uya-prototipo-grupo-13/accepted_favors";
  } else {
    window.location.href = "/accepted_favors";
  }
}

function goToTrustGroups() {
  if (window.location.pathname.startsWith("/uya-prototipo-grupo-13")) {
    window.location.href = "/uya-prototipo-grupo-13/trust_groups";
  } else {
    window.location.href = "/trust_groups";
  }
}
