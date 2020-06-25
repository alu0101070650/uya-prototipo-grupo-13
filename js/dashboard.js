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
