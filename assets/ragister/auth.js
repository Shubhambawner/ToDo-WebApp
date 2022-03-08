var userName = document.querySelector('.input')
var password = document.querySelector('.input')
const login = document.querySelector('.login')
const ragister = document.querySelector('.ragister')

ragisterUser = async ()=>{
    let response = await fetch('/auth/ragister', {
        method: 'POST',
        body: JSON.stringify({ 'user_name': userName.value, 'user_password': password.value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r=>r.json())
    window.alert(response.status)
    if(response.status== 'ragistration successfull !  now please login '){
        login.click(); //! why does it not work?
    }
}

ragister.addEventListener('click', ragisterUser)
