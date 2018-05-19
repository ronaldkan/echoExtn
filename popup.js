
document.addEventListener('DOMContentLoaded', function() {

    chrome.storage.local.get("uname", function (obj) {
        if (Object.keys(obj).length === 0){
            hideSignOut(); 
        }else {
            var unameDisplay = document.getElementById('unameDisplay');
            unameDisplay.innerHTML = "Welcome user "+obj.uname+" to Echo!";
            hideSignIn();
        }
    });

    var signInButton = document.getElementById('login');
    signInButton.addEventListener('click', function() {
        var uname = document.getElementById('uname');
        chrome.storage.local.set({ "uname": uname.value }, function () { });
        window.location.reload();
    });

    var signOutButton = document.getElementById('logout');
    signOutButton.addEventListener('click', function() {
        chrome.storage.local.remove("uname", function () {
            window.location.reload();
         });
    });

    var checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function() {
        console.log('clicked');
        var xhr = new XMLHttpRequest();
        http://localhost:3001/test
        xhr.open("GET", "http://localhost:3001/test", true);
        xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // JSON.parse does not evaluate the attacker's scripts.
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);
        }
        }
        xhr.send();
    });

  }, false);

console.log('page on load test');
var socket = io('http://localhost:3001');

function hideSignIn()  
{  
   document.getElementById("signIn").style.display="none";  
}

function hideSignOut()  
{  
   document.getElementById("signOut").style.display="none";  
}