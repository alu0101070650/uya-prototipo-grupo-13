const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    goToMainPage();
  } else {
    const profileLoadingContainer = $(".profile-loading");

    const profileImageContainer = $(".profile-image");
    profileImageContainer.append(
      `<img src="${getGravatarImage(user.email)}"></img>`
    );

    const profileNameContainer = $(".profile-name");
    profileNameContainer.append(`<p>${user.displayName}</p>`);

    profileLoadingContainer.addClass("hidden");
  }
});
