var http = require('http')
var fs = require('fs')
var path = require('path')
var directoryListingString = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><link rel="stylesheet" href="../css/style.css"><title>About folder index</title></head><body><h1>Files in this folder:</h1><ul>'

http.createServer(onEveryRequest).listen(8000)

var mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg'
}

function onEveryRequest(req, res){
    var route = req.url // get the url from the request
    var staticRoute = path.join('static', route)

    if(route.indexOf('.') === -1) {
        // requesting a folder folder

        // check if folder contains an index.html, if so, send that
        if (fs.existsSync(path.join(staticRoute, 'index.html'))){
            route = path.join(staticRoute, 'index.html')  // request is for a directory, not a file. Default to that folder's index.html
            fs.readFile(route, onread) // try to read the file requested via the route
        } else {
            // if no index.html is present, send a list of items of the folder.
            fs.readdir(staticRoute, (err, files) => {
                if (err) return throwFourOFour()
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/html')
                res.write(directoryListingString)
                files.forEach(file => {
                    res.write('<li><a href="'+path.join(route, file.toString())+'">' + file.toString() + '</a></li>')
                })
                res.end('</ul></body></html')
            })
        }
    } else {
        // file
        fs.readFile(staticRoute, onread) // try to read the file requested via the route
    }

    function onread(err, buf) {
        if (err) { // on error, a file doesn't exist. Call the 404 page
            throwFourOFour()
        } else { // if the file exist, serve it with the right content-type
            res.statusCode = 200
            res.setHeader('Content-Type', getType(route))
            res.end(buf)
        }
    }
    function throwFourOFour(){
        route = 'four-o-four.html'
            fs.readFile(path.join('static', route), function(err, buf){
            res.statusCode = 404
            res.setHeader('Content-Type', getType(route))
            if (err) return res.end('404 page not found\n') // extra safeguard if four-o-four.html does not exist
            res.end(buf)
        })
    }

}
function getType(route){ // quick little optimization for similar task of getting the mime type
    var extension = path.extname(route)
    return mimeTypes[extension] || 'text/plain'
}
