const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    if (window.location.pathname.startsWith("/uya-prototipo-grupo-13")) {
      window.location.href = "/uya-prototipo-grupo-13";
    } else {
      window.location.href = "/";
    }
  }
});

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

function createNewAdvert() {
  // TODO
  /*
  db.collection("adverts")
    .add({
      content: "Ejemplo de anuncio",
      creationDate: new Date(),
      userEmail: firebase.auth().currentUser.email,
      userId: firebase.auth().currentUser.uid,
      userName: firebase.auth().currentUser.displayName,
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
    */
}

function deleteAdvert(advertId) {
  db.collection("adverts").doc(advertId).delete();
}

const container = $(".advrt-list");
db.collection("adverts").onSnapshot((querySnapshot) => {
  container.html("");
  querySnapshot.forEach((doc) => {
    const advert = `
    <section class="card">
      <div class="row card-content">
        <div class="col s12 advrt-user-info">
          <img class="advrt-user-info-avatar" alt="" src="${getGravatarImage(
            doc.data().userEmail
          )}">
          <div class="advrt-user-info-data">
            <span aria-label="nombre del usuario creador del anuncio">${
              doc.data().userName
            }${advertIsFromCurrentUser(doc.data().userId) ? " (Tú)" : ""}</span>
            <span aria-label="fecha de creación del anuncio">${getDateFromTimestamp(
              doc.data().creationDate
            )}</span>
          </div>
        </div>

        <div class="col s12 advrt-content" aria-label="contenido del anuncio">
        ${doc.data().content}
        </div>

        <div class="col s12 advrt-buttons">
          ${
            advertIsFromCurrentUser(doc.data().userId)
              ? `<a href="#" onclick="deleteAdvert('${doc.id}')" class="btn waves-effect waves-light black-text"><i class="material-icons left">delete</i>Borrar anuncio</a>`
              : '<a href="#" class="btn waves-effect waves-light red">Me interesa</a>'
          }
        </div>

      </div>
    </section>
    `;

    container.append(advert);
  });
});
