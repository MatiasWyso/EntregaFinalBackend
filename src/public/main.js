const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("mensaje");
const history = document.getElementById("chatHistory");
const cleanButton = document.getElementById("cleanHistory");
let usuario = null;

socket.on("bienvenida", (msj) => {
  console.log(msj.message);
  Swal.fire({
    title: "Bienvenido",
    text: "Ingrese su nombre de usuario",
    input: "text",
    confirmButtonText: "Ingresar",
    allowOutsideClick: false,
    preConfirm: (usuario) => {
      if (!usuario) {
        Swal.showValidationMessage("Debe ingresar un nombre de ususario");
      }
    },
  }).then((obj) => {
    usuario = obj.value;
    socket.emit("nuevoIngreso", usuario);
  });
});

socket.on("chat", (chatObj) => {
  history.innerHTML = "";
  chatObj.forEach((el) => {
    history.innerHTML += `
    <span class="user ${el.user === usuario ? "own" : ""}">${
      el.user === usuario ? "Yo" : el.user
    }</span>
        <p class="message ${el.user === usuario ? "own" : ""}">${el.message}</p>
    `;
  });
  history.scrollTop = "9999";
});

socket.on("nuevoIngreso", (user) => {
  Toastify({
    text: `${user} se ha conectado`,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    //onClick: function(){} // Callback after click
  }).showToast();
});

form.onsubmit = (e) => {
  e.preventDefault();
  const msj = input.value;
  msj !== "" && socket.emit("chat", { user: usuario, message: msj });
  input.value = "";
};

cleanButton.onclick = () => {
  socket.emit("clean", { message: "Borra historial" });
};
