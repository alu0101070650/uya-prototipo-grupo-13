const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    goToMainPage();
  }
});

$("input#input_text, textarea#content").characterCounter();

// New advert form
$("#new-advrt").submit((event) => {
  const feedbackContainer = $("#new-advrt .feedback");

  feedbackContainer.html("");
  feedbackContainer.attr("aria-hidden", "true");

  let hasFeedback = false;
  const addFeedbackMessage = (message) => {
    feedbackContainer.append(`<p>${message}</p>`);
    hasFeedback = true;
  };

  const showFeedbackContainer = () => {
    feedbackContainer.attr("aria-hidden", "false");
    feedbackContainer.focus();
  };

  const content = $("#new-advrt #content");
  const city = $("#new-advrt #city");
  const group = $("#new-advrt #group");
  const submitButton = $("#new-advrt #submit");
  const loadingSpinner = $("#new-advrt .spinner");

  if (content.val() === "") {
    addFeedbackMessage("Por favor, introduzca el contenido del anuncio.");
  }

  if (city.val() === "") {
    addFeedbackMessage("Por favor, seleccione una zona geográfica.");
  }

  if (group.val() === "") {
    addFeedbackMessage(
      "Por favor, seleccione el grupo donde quiere publicar el anuncio."
    );
  }

  if (hasFeedback) {
    showFeedbackContainer();
  } else {
    submitButton.addClass("hidden");
    loadingSpinner.removeClass("hidden");
    db.collection("adverts")
      .add({
        content: content.val(),
        creationDate: new Date(),
        userEmail: firebase.auth().currentUser.email,
        userId: firebase.auth().currentUser.uid,
        userName: firebase.auth().currentUser.displayName,
        acceptedBy: "",
        city: city.val(),
        group: group.val(),
      })
      .then(() => {
        M.toast({
          html:
            '<span role="alert" aria-atomic="true" aria-hidden="true">Anuncio creado y publicado correctamente en el tablón de anuncios</span>',
          displayLength: 6000,
        });
        content.val("");
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;

        addFeedbackMessage(
          `Error al intentar crear el anuncio: ${errorMessage}`
        );

        showFeedbackContainer();
      })
      .finally(() => {
        submitButton.removeClass("hidden");
        loadingSpinner.addClass("hidden");
      });
  }

  return false;
});
