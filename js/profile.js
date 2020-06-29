const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    goToMainPage();
  } else {
    if (isCurrentUser(getProfileUserId())) {
      loadProfile(user);
    } else {
      db.collection("profiles")
        .where("uid", "==", getProfileUserId())
        .get()
        .then((querySnapshot) => {
          loadProfile(querySnapshot.docs[0].data());
        });
    }
  }
});

$("input#input_text, textarea#content").characterCounter();

function getProfileUserId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userId = urlParams.get("uid");

  if (userId) {
    return userId;
  } else {
    return firebase.auth().currentUser.uid;
  }
}

function renderReview(data) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (data.score >= i + 1) {
      stars[i] = "star";
    } else {
      stars[i] = "star_border";
    }
  }

  return `
    <div class="review">
      <div class="card">
        <div class="card-content">
          <p class="review-name">${data.name}</p>
          <div class="stars">
            <i class="material-icons red-text">${stars[0]}</i>
            <i class="material-icons red-text">${stars[1]}</i>
            <i class="material-icons red-text">${stars[2]}</i>
            <i class="material-icons red-text">${stars[3]}</i>
            <i class="material-icons red-text">${stars[4]}</i>
          </div>
          <p class="review-content">${data.content}</p>
        </div>
      </div>
    </div>
  `;
}

function loadProfile(user) {
  loadReviews();

  const reviewFormContainer = $(".review-form");
  const profileHeaderContent = $(".profile-header-content");
  const profileContainer = $(".profile");
  const profileLoadingContainer = $(".profile-loading");

  const profileImageContainer = $(".profile-image");
  profileImageContainer.append(
    `<img src="${getGravatarImage(user.email)}"></img>`
  );

  const profileNameContainer = $(".profile-name");
  profileNameContainer.append(`<p>${user.displayName}</p>`);

  const profileDescriptionContainer = $(".profile-description");

  db.collection("profiles")
    .where("uid", "==", user.uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        profileDescriptionContainer.append(`<p>${doc.data().description}</p>`);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    })
    .finally(() => {
      if (isCurrentUser(user.uid)) {
        reviewFormContainer.addClass("hidden");
        profileHeaderContent.text("Mi perfil");
      } else {
        reviewFormContainer.removeClass("hidden");
        profileHeaderContent.text(`Perfil de ${user.displayName}`);
      }

      profileLoadingContainer.addClass("hidden");
      profileContainer.removeClass("hidden");
    });
}

function loadReviews() {
  const profileReviewsHeaderContainer = $(".reviews-header");
  const profileReviewsListContainer = $(".reviews-list");
  db.collection("reviews")
    .where("toUser", "==", getProfileUserId())
    .onSnapshot((querySnapshot) => {
      profileReviewsListContainer.html("");

      let totalScore = 0;
      let numberOfReviews = 0;
      querySnapshot.forEach((doc) => {
        profileReviewsListContainer.append(renderReview(doc.data()));
        totalScore += Number.parseInt(doc.data().score, 10);
        numberOfReviews++;
      });

      totalScore /= numberOfReviews;
      if (numberOfReviews > 0) {
        profileReviewsHeaderContainer.text(
          `Reseñas (${totalScore.toFixed(1)}/5)`
        );
      } else {
        profileReviewsHeaderContainer.text(`Reseñas`);
      }

      if (profileReviewsListContainer.html() === "") {
        profileReviewsListContainer.append(
          "<p>Todavía no se ha publicado ninguna reseña.</p>"
        );
      }
    });
}

// Publish review form
$("#publish-review").submit((event) => {
  const feedbackContainer = $("#publish-review .feedback");

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

  const review = $("#publish-review #review");
  const stars = $("#publish-review #stars");
  const submitButton = $("#publish-review #submit");
  const loadingSpinner = $("#publish-review .spinner");

  if (review.val() === "") {
    addFeedbackMessage("Por favor, introduzca la reseña.");
  }

  if (stars.val() === "") {
    addFeedbackMessage(
      "Por favor, seleccione la cantidad de estrellas que desea otorgarle en la reseña."
    );
  }

  if (hasFeedback) {
    showFeedbackContainer();
  } else {
    submitButton.addClass("hidden");
    loadingSpinner.removeClass("hidden");
    db.collection("reviews")
      .add({
        content: review.val(),
        fromUser: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        score: stars.val(),
        toUser: getProfileUserId(),
      })
      .then(() => {
        M.toast({
          html:
            '<span role="alert" aria-atomic="true" aria-hidden="true">Reseña publicada correctamente</span>',
          displayLength: 6000,
        });
        review.val("");
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;

        addFeedbackMessage(
          `Error al intentar crear la reseña: ${errorMessage}`
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
