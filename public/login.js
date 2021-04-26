var modal = document.getElementById('loginButton');
document.getElementById("email").value = 'pcopp@hotmail.ca';
document.getElementById("pwd").value = '12345678901234567890123456789012';
// When the user clicks anywhere outside of the modal, close it
modal.onclick = async function(event) {
    const response = await fetch('http://localhost:3000/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("pwd").value
        })
    });
    const myJson = await response.json();
    if(myJson.statusMessage == 'login.successful'){
        window.location.replace("http://localhost:3000");
    }
    console.log(myJson)
}