const db = firebase.firestore();

$(document).ready(function () {
  $("input#input_text, textarea#content").characterCounter();
});

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

  const content = $("#new-advrt #content").val();
  const submitButton = $("#new-advrt #submit");
  const loadingSpinner = $("#new-advrt .spinner");

  if (content === "") {
    addFeedbackMessage("Por favor escriba el contenido del anuncio.");
  }

  if (hasFeedback) {
    showFeedbackContainer();
  } else {
    submitButton.addClass("hidden");
    loadingSpinner.removeClass("hidden");
    db.collection("adverts")
      .add({
        content: content,
        creationDate: new Date(),
        userEmail: firebase.auth().currentUser.email,
        userId: firebase.auth().currentUser.uid,
        userName: firebase.auth().currentUser.displayName,
      })
      .then(() => {
        if (window.location.pathname.startsWith("/uya-prototipo-grupo-13")) {
          window.location.href = "/uya-prototipo-grupo-13/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
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
