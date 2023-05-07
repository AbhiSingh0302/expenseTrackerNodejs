const form = document.querySelector('form');
console.log('loginF');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        axios.post('/login/user', form, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((result) => {
                console.log(result.data.token);
                alert("User successfully logged in");
                document.querySelector('#email').value = "";
                document.getElementById('password').value = "";
                localStorage.setItem('token', result.data.token);
                expensePage();
            })
            .catch((err) => {
                console.log(err);
                setTimeout(() => {
                    document.getElementById('error').innerHTML = "";
                }, 2000)
                document.getElementById('error').innerHTML = err.response.data.message;
                document.getElementById('error').style.color = "red";
                document.querySelector('#email').value = "";
                document.getElementById('password').value = "";
            })
    })
    function expensePage() {
        window.location.href = "/expense";
    }
    // Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
const forgotPasswordForm = document.getElementById('forgot-password-form');
const forgotPasswordButton = document.getElementById('forgot-password-submit');
forgotPasswordButton.addEventListener('click',async (e) => {
    try {
    e.preventDefault();
    const forgetPass = await axios.post('/password/forgotpassword',forgotPasswordForm,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
    console.log(forgetPass.data)
    if(forgetPass.data.messageId){
        alert('Mail has been sent');
        document.getElementById('forget-email').value = "";
        modal.style.display = "none";
    }
    } catch (error) {
        console.log(error);
    }
})