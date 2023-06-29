const form = document.getElementById('recoverForm');

form.addEventListener('submit', event => {
    event.preventDefault();

    let password = document.getElementById('passwordInput').value;
    let token = document.getElementById('token').innerHTML;

    let data = {
        token,
        password
    }

    fetch('/api/session/recoverPassword', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(result => result.json()).then(json => {
        console.log(json);
        if (json.status == "Ok") {
            Swal.fire({
                icon: 'success',
                title: 'Se ha enviado un mail',
                text: 'Confirmalo para reestablecer tu contraseña'
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Email no valido',
                text: json.message || "Email no valido"
            })
        }
    });
});