firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (window.location.pathname.startsWith("/uya-prototipo-grupo-13")) {
      window.location.href = "/uya-prototipo-grupo-13/dashboard";
    } else {
      window.location.href = "/dashboard";
    }
  }
});

// Login form
$("#login-form").submit((event) => {
  const feedbackContainer = $("#login-form .feedback");

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

  const email = $("#login-form #email").val();
  const password = $("#login-form #password").val();
  const submitButton = $("#login-form #submit");
  const loadingSpinner = $("#login-form .spinner");

  if (email === "") {
    addFeedbackMessage("Por favor introduzca su email.");
  }

  if (password === "") {
    addFeedbackMessage("Por favor introduzca su contraseña.");
  }

  if (hasFeedback) {
    showFeedbackContainer();
  } else {
    submitButton.addClass("hidden");
    loadingSpinner.removeClass("hidden");
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;

        console.log(errorCode);

        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/user-not-found"
        ) {
          addFeedbackMessage("Las credenciales de acceso no son correctas.");
        } else {
          addFeedbackMessage(`Error de inicio de sesión: ${errorMessage}`);
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
