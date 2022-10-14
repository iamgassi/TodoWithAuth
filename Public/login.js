   const login = document.getElementById('login');
   console.log(login)
//    if(window.history.replaceState)
//    {
//        window.history.replaceState(null,null,window.location.href)
//    }
   login.addEventListener("click",()=>{
       
       if(window.history.replaceState)
           {
               window.history.replaceState(null,null,window.location.href)
           }
        console.log("Inside click")

    })

// window.onload = function() {
//     history.replaceState(null,null,window.location.href );
// }