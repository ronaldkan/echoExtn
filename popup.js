
document.addEventListener('DOMContentLoaded', function() {
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