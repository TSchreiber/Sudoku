async function require(req, callback) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", req, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        
        xhttp.send();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            if (callback) 
                callback(xhttp.responseText);
            resolve(xhttp.responseText);
          }
        };
    });
}