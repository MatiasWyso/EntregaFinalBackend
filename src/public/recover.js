const recoverForm = document.getElementById("recoverForm");

recoverForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const data = Object.fromEntries(new FormData(recoverForm));
  fetch("/api/session/recover", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        recoverForm.firstChild.textContent = `${res.error}`;
        console.log(res.error);
        return;
      } else {
        console.log(res);
        location.assign("http://localhost:8080/session/login");
        return;
      }
    });
});
