document.getElementById("login").addEventListener('submit', async function (event) {

    event.preventDefault();
    const userName = document.getElementById("inputUserName").value;
    const password = document.getElementById("inputPassword").value;

    if(!userName.trim() || !password.trim()) {
        alert("Username and Password are required");
    }
    try {
        var response = await fetch('/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ userName: userName, password: password })
        });
        var data = await response.json();
        console.log(data);
        if(data.success == true) {
            location.href='/chart/emp';
        } else {
            if(data.error === 'Invalid User Name') {
                alert("Username is not valid");
            } else if (data.error === 'Invalid Password') {
                alert("Password is not valid");
            } else {
                alert("Invalid Data");
            }
        }
    } catch (error) {
        console.log('Error fetching data:', error);
    }
    
});
