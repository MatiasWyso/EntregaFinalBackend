const btn = document.querySelector(".productsContainer");

async function addToCart(id) {
  await fetch(`api/cart/63f12e9a3dcd14466d2d0ed7/products/${id}`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
  });
  Swal.fire({
    toast: true,
    icon: "success",
    position: "center",
    html: "Producto agregado con exito",
    timer: 1000,
    showConfirmButton: false,
  });
}

async function logout() {
  const response = await fetch(`http://localhost:8080/api/session/logout`, {
    method: "POST",
    body: "",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();
  console.log(res);
  location.assign("/session/login");
}
