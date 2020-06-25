firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "/";
  }
});

function logout() {
  firebase.auth().signOut();
}
