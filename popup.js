
document.addEventListener('DOMContentLoaded', function() {

    
    chrome.storage.local.get("uname", function (uname) {
        console.log('name',uname);
        if (Object.keys(uname).length === 0){
            hideSignOut(); 
        }else {
            hideSignIn();
        }
    });

    var signInButton = document.getElementById('signIn');
    signInButton.addEventListener('click', function() {
        chrome.storage.local.set({ "uname": "random" }, function () { });
        window.location.reload();
    });

    var signOutButton = document.getElementById('signOut');
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