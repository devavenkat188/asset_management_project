async function register() {
    const firstName = document.getElementById("inputFirstName").value;
    const lastName = document.getElementById("inputLastName").value;
    const email = document.getElementById("inputEmail").value;
    const userName = document.getElementById("inputUserName").value;
    const password  = document.getElementById("inputPassword").value;
    const confirmPassword = document.getElementById("inputPasswordConfirm").value;

    if(password !== confirmPassword) {
        alert("Check the Password and Confirm Password");
    };

try {
    var response = await fetch('/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, userName: userName, password: password, confirmPassword: confirmPassword })
    });
    var data = await response.json();
    console.log(data);
} catch (error) {
    console.log('Error fetching data:', error);
}
}