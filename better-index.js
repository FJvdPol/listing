var http = require('http')
var fs = require('fs')
var path = require('path')
var listDirectoryString = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '   <head>',
    '       <meta charset="UTF-8">',
    '       <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '       <meta http-equiv="X-UA-Compatible" content="ie=edge">',
    '       <link rel="stylesheet" href="../css/style.css">',
    '       <title>About folder index</title>',
    '   </head>',
    '   <body>',
    '       <h1>Files in this folder:</h1>',
    '       <ul>'
].join('\n')

http.createServer(onEveryRequest).listen(8000)

var mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg'
}

function onEveryRequest(req, res){
    var route = path.join('static', req.url) // get the url from the request
    var location404 = path.join('static', 'four-o-four.html')

    fs.readFile(route, onread) // try to read the file requested via the route


    function onread(err, buf) {
        if (err) { // on error, a file doesn't exist. Call the 404 page
            console.log(err)
            if (err.code === 'EISDIR'){
                fs.readFile(path.join(route, 'index.html'), onreadIndex)
            } else {
                throwFourOFour()
            }
        } else { // if the file exist, serve it with the right content-type
            sendFile(buf)
        }
    }
    function onreadIndex(err, buf){
        if (err){
            fs.readdir(route, onreadDir)
        } else {
            route = path.join(route, 'index.html')
            sendFile(buf)
        }
    }
    function onreadDir(err, files){
        if (err) return res.end('500 can\'t read directory')
        res.write(listDirectoryString)
        files.forEach(file => res.write('\n            <li><a href="'+ path.join('images', file.split('static').join("")) +'">'+ file + '</a></li>'))
        res.end('\n        </ul>\n    </body>\n </html>')
    }
    function sendFile(buf){
        res.statusCode = 200
        res.setHeader('Content-Type', getType(route))
        res.end(buf)
    }
    function throwFourOFour(){
        fs.readFile(location404), function(err, buf){
            res.statusCode = 404
            res.setHeader('Content-Type', getType(location404))
            if (err) return res.end('404 page not found\n') // extra safeguard if four-o-four.html does not exist
            res.end(buf)
        }
    }

}
function getType(route){ // quick little optimization for similar task of getting the mime type
    var extension = path.extname(route)
    return mimeTypes[extension] || 'text/plain'
}
