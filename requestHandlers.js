var exec = require("child_process").exec;
var querystring = require("querystring");
var formidable = require('formidable');

function start(res, req) {
    console.log("Request handler 'start' was called.");

    var body = '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input id="file" type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>';
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(body);


}
function upload(res, req) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = "./uploads/"; //set path
    form.keepExtensions = true; //keep file original extensions

    form

        .on('fileBegin', function (name, file) {
            //rename the incoming file to the file's name and handle empty uploads
            file.path = form.uploadDir + (file.name ? file.name : 'error_no_upload.txt');
        })

        .parse(req, function (err, field, file) {
            if (err) console.log(err);
            exec('ls -sh uploads', function (error, stdout, stderr) {
                res.writeHead(200, { 'content-type': 'text/plain' });
                res.write(file.upload.name + (file.upload.name ? " was succesfully uploaded:\n\n" : "No file uploaded: make sure you choose a file!\n\n"));
                res.write("Current state of directory:\n\n");
                res.write(stdout);
                res.end();
            })

        });

}
exports.start = start;
exports.upload = upload;