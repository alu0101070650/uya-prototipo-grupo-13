const db = firebase.firestore();

function cancelFavor(advertId) {
  const feedbackLoading = $(".feedback-loading");
  feedbackLoading.removeClass("hidden");

  db.collection("adverts")
    .doc(advertId)
    .update({ acceptedBy: "" })
    .then(() => {
      M.toast({
        html:
          '<span role="alert" aria-atomic="true" aria-hidden="true">Favor cancelado correctamente</span>',
        displayLength: 6000,
      });
      feedbackLoading.addClass("hidden");
    });
}

const container = $(".accepted-favors-list");
db.collection("adverts").onSnapshot((querySnapshot) => {
  container.html("");
  querySnapshot.forEach((doc) => {
    if (doc.data().acceptedBy === firebase.auth().currentUser.uid) {
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
    container.html(
      "Actualmente no tienes ningún favor pendiente, puedes ver los favores anunciados en el tablón de anuncios."
    );
  }
});
