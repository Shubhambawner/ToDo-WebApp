var userName = document.querySelector('.input')
var password = document.querySelector('.input')
const login = document.querySelector('.login')


let authoriseUser = async ()=>{
    let response = await fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ 'user_name': userName.value, 'user_password': password.value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r=>r.json())
    window.alert(response.status)
    if(response.status== 'authorisation successfull !  now you are loged inn '){
        localStorage.setItem("user_ID",response.user_ID);
        
        window.location.href +='home'; 
        //! how to hit/move to perticular route of backend with JS, 
        //! like here I would like to hit "/home" (also passing parameters) route that is there in backend
    }
}

login.addEventListener('click', authoriseUser)
