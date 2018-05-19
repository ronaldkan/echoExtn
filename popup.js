
document.addEventListener('DOMContentLoaded', function() {

    chrome.storage.local.get("uname", function (obj) {
        if (Object.keys(obj).length === 0) {
            hideSignOut(); 
        } else {
            var unameDisplay = document.getElementById('unameDisplay');
            unameDisplay.innerHTML = "Welcome user "+obj.uname+" to Echo!";
            hideSignIn();
        }
    });

    var signInButton = document.getElementById('login');
    signInButton.addEventListener('click', function() {
        signIn();
    });

    var signOutButton = document.getElementById('logout');
    signOutButton.addEventListener('click', function() {
        signOut();
    });

    // var checkPageButton = document.getElementById('checkPage');
    // checkPageButton.addEventListener('click', function() {
    //     console.log('clicked');
    //     var xhr = new XMLHttpRequest();
    //     http://localhost:3001/test
    //     xhr.open("GET", "http://localhost:3001/test", true);
    //     xhr.onreadystatechange = function() {
    //     if (xhr.readyState == 4) {
    //         // JSON.parse does not evaluate the attacker's scripts.
    //         var resp = JSON.parse(xhr.responseText);
    //         console.log(resp);
    //     }
    //     }
    //     xhr.send();
    // });

  }, false);

console.log('page on load test');
var socket = io('http://localhost:3001');

function signIn() 
{
    var uname = document.getElementById('uname').value;
    var password = document.getElementById('psw').value;
    $.post("http://40.74.71.24/login", {username: uname, password: password}, function(data, status) { 
        if (Object.keys(data).length === 0) {
            register();
        } else {
            chrome.storage.local.set({ "uname": data.content.name }, function () { });
            window.location.reload();
        }
    });
}

function register() 
{
    var uname = document.getElementById('uname').value;
    var password = document.getElementById('psw').value;
    $.post("http://40.74.71.24/register", {username: uname, password: password}, function(data, status) { 
        chrome.storage.local.set({ "uname": data.content.name }, function () { });
        window.location.reload();
    });
}

function signOut() 
{
    chrome.storage.local.remove("uname", function () {
        window.location.reload();
    });
}

function hideSignIn()  
{  
   document.getElementById("signIn").style.display="none";  
}

function hideSignOut()  
{  
   document.getElementById("signOut").style.display="none";  
}