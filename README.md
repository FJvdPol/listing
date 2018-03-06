# simple-server
Simple Node.js HTTP static file server.

## Install
Go into any folder in your terminal and type:
```
git clone https://github.com/FJvdPol/simple-server.git
```

## Usage
To start the server, navigate to the installation folder via your terminal and type `node index.js` in your terminal. Voila, the server will run at `localhost:8000`

Any files in the static folder will be accessible by typing their names as in the folder structure.

### Examples
```
localhost/8000/existing-filename.extension
```
Will respond with the requested file within the requested folder

```
localhost/8000/existing-foldername
```
Will respond with the index.html file within the requested folder

```
localhost/8000/existing-foldername-without-index-html-file
```
Will serve a page showing the contents of the files in an existing folder without an index.html file in it.

```
localhost/8000/nonexisting-file-or-folder
```
Shows the content of the page directly inside static called 'four-o-four.html'


## License
[MIT](license.md) © [Folkert-Jan van der Pol](https://github.com/FJvdPol)
