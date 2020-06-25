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
  const password = $("#join-form #password").val();
  const repeatPassword = $("#join-form #repeat_password").val();
  const termsAccepted = $("#join-form #terms").prop("checked");
  const submitButton = $("#join-form #submit");
  const loadingSpinner = $("#join-form .spinner");

  if (name === "") {
    addFeedbackMessage("Por favor introduzca su nombre y apellidos.");
  }

  if (email === "") {
    addFeedbackMessage("Por favor introduzca su email.");
  }

  if (password === "") {
    addFeedbackMessage("Por favor introduzca su contraseña.");
  }

  if (password !== repeatPassword) {
    addFeedbackMessage("Las contraseñas deben coincidir.");
  }

  if (!termsAccepted) {
    addFeedbackMessage("Por favor acepta los términos y condiciones de uso.");
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
        window.location.href = "/dashboard";
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
