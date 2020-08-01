const fs = require("fs");
const http = require("http");

async function handleRequest(req, res) {
     
    if (req.method == "GET") {
        if (req.url === "/") req.url = "/index.html";
        return new FileRequestHandler(req, res).getResponse();
    }
    
    // If the request was not handled respond with an error message
    res.write("failed to handle request: "+req.url);
    return res.end();
}

class FileRequestHandler {
    
    static validExtensions() { return ["png", "gif", "ico", "html", "css", "js"]; }
    
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.url = req.url;
    }
    
    getExtension() {
        if (this.url.includes(".")) {
            return this.url.substring( this.url.lastIndexOf(".") + 1 );
        }
    }
    
    getMediaType(extension) {
        switch (extension) {
            case "png":
            case "gif":
            case "ico":     return "image";
            
            case "html": 
            case "css":
            case "js":
            default:        return "text";
        }            
    }
    
    getHeader() {
        let ext = this.getExtension();
        let type = this.getMediaType(ext);
        return {"Content-Type" : type+"/"+ext};
    }
    
    getPath() {
        return "." + this.url.split("%20").join(" ");
    }
    
    getContent() {
        let path = this.getPath();
        if(fs.existsSync(path)) {
            return fs.readFileSync(path);
        } else {
            console.error("Could not find file: "+path);
            return "";
        }
    }
    
    getResponse() {
        this.res.writeHead( 200, this.getHeader() );
        this.res.write(this.getContent());
        return this.res.end();
    }
}

// Start the server
try {
    let port = process.argv[2];
    if (port != undefined) port = parseInt(port);
    if (port == "NaN" || port == undefined) port = 8080;
    console.log("Staring server on port: "+port);
    http.createServer(handleRequest).listen(port);
} 
catch (err) {
    console.error("Error while processesing request: "+req.url);
    console.error(err.stack);
}