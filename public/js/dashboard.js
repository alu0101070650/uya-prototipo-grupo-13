const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    goToMainPage();
  }
});

function deleteAdvert(advertId) {
  const feedbackLoading = $(".feedback-loading");
  feedbackLoading.removeClass("hidden");

  db.collection("adverts")
    .doc(advertId)
    .delete()
    .then(() => {
      M.toast({
        html:
          '<span role="alert" aria-atomic="true" aria-hidden="true">Anuncio eliminado correctamente</span>',
        displayLength: 6000,
      });
      feedbackLoading.addClass("hidden");
    });
}

function acceptAdvert(advertId) {
  const feedbackLoading = $(".feedback-loading");
  feedbackLoading.removeClass("hidden");

  db.collection("adverts")
    .doc(advertId)
    .update({ acceptedBy: firebase.auth().currentUser.uid })
    .then(() => {
      M.toast({
        html:
          '<span role="alert" aria-atomic="true" aria-hidden="true">Favor aceptado correctamente</span>',
        displayLength: 6000,
      });
      feedbackLoading.addClass("hidden");
    });
}

const container = $(".advrt-list");
db.collection("adverts").onSnapshot((querySnapshot) => {
  container.html("");
  querySnapshot.forEach((doc) => {
    if (!doc.data().acceptedBy || doc.data().acceptedBy === "") {
      const advert = renderAdvert(
        {
          userEmail: doc.data().userEmail,
          userName: doc.data().userName,
          userId: doc.data().userId,
          creationDate: doc.data().creationDate,
          content: doc.data().content,
          acceptedBy: doc.data().acceptedBy,
          city: doc.data().city,
        },
        doc.id
      );

      container.append(advert);
    }
  });

  if (container.html() === "") {
    container.html("Actualmente no hay ningún anuncio publicado en el tablón.");
  }
});
