const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    $(".account-tab").each((index, element) => {
      $(element)
        .html(`<a href="profile" tabindex="0"><i class="material-icons left" aria-hidden="true">account_circle</i>Mi perfil</a>`);
    });
  }
});

$("input#input_text, textarea#description").characterCounter();

// Join/register form
$("#join-form").submit((event) => {
  const feedbackContainer = $("#join-form .feedback");

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

  const name = $("#join-form #name").val();
  const email = $("#join-form #email").val();
  const description = $("#join-form #description").val();
  const password = $("#join-form #password").val();
  const repeatPassword = $("#join-form #repeat_password").val();
  const termsAccepted = $("#join-form #terms").prop("checked");
  const submitButton = $("#join-form #submit");
  const loadingSpinner = $("#join-form .spinner");

  if (name === "") {
    addFeedbackMessage("Por favor, introduzca su nombre y apellidos.");
  }

  if (email === "") {
    addFeedbackMessage("Por favor, introduzca su email.");
  }

  if (description === "") {
    addFeedbackMessage("Por favor, introduzca una breve descripción personal.");
  }

  if (password === "") {
    addFeedbackMessage("Por favor, introduzca su contraseña.");
  }

  if (password !== repeatPassword) {
    addFeedbackMessage("Las contraseñas deben coincidir.");
  }

  if (!termsAccepted) {
    addFeedbackMessage("Por favor, acepta los términos y condiciones de uso.");
  }

  if (hasFeedback) {
    showFeedbackContainer();
  } else {
    submitButton.addClass("hidden");
    loadingSpinner.removeClass("hidden");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        return result.user.updateProfile({
          displayName: name,
        });
      })
      .then(() => {
        return db.collection("profiles").add({
          description: description,
          displayName: name,
          email: email,
          uid: firebase.auth().currentUser.uid,
        });
      })
      .then(() => {
        goToDashboard();
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;

        if (errorCode == "auth/weak-password") {
          addFeedbackMessage(
            "La contraseña es muy debil, añada más caracteres."
          );
        } else if (errorCode == "auth/email-already-in-use") {
          addFeedbackMessage("El email proporcionado ya está siendo usado.");
        } else {
          addFeedbackMessage(`Error de registro: ${errorMessage}`);
        }

        showFeedbackContainer();
      })
      .finally(() => {
        submitButton.removeClass("hidden");
        loadingSpinner.addClass("hidden");
      });
  }

  return false;
});
