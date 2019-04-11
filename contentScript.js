
//alert("Hello from contentScript!");


// can't see page-script-added properties
console.log("test content script!");  // undefined
//var usuario = window.Aura.initConfig.context.globalValueProviders[0].values.CurrentUser.Email
//console.log("El usuario es: + usuario");
alert("Hola desde content!");

var els = document.querySelectorAll("a[href^='http://devappcentral:8383/CSRallyGate/user/mpastrana/searcher/true']");
debugger;
console.log("enlace: " + els);
//var currentUser=window.Aura.initConfig.context.globalValueProviders[0].values.CurrentUser.Email;
//console.log("Current user: " + window.Aura.initConfig.context.globalValueProviders[0].values.CurrentUser.Email);
const divs = document.getElementsByTagName("a");
console.log("enlaces: " + divs);





