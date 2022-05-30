window.onload = function(){
    const entrarButton = document.querySelector("#sendData");
    const userInput = document.querySelector("#user");
    const passwordInput = document.querySelector("#password");


    var Login = async function(){
        var login = await fetch("./usuario.json");
        var loginJson = await login.json();

        for(let userData of loginJson.users){
            if(userData.user === userInput.value){
                if(userData.pws === passwordInput.value){
                    location.href = '../panel/index.html';
                }
            }
            
        }
        alert("Nome de usuário ou senha não foram encontrados.");
    }

    entrarButton.addEventListener('click', function(){
        Login();
    })
}