'use strict';


// Declare app level module which depends on filters, and services
angular.module('diabloApp', ['diabloApp.filters', 'diabloApp.services', 'diabloApp.directives']);//.
  // config(['$routeProvider', function($routeProvider) {
    // $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
    // $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    // $routeProvider.otherwise({redirectTo: '/view1'});
  // }]);



// this is likely not the right place to be putting this stuff, but for now, here is some camera code

// Called when capture operation is finished
//
function captureSuccess(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile(mediaFiles[i]);
    }
}

// Called if something bad happens.
//
function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Uh oh!');
}

// A button will call this function
//
function captureImage() {
    // Launch device camera application,
    // allowing user to capture up to 2 images
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 2});
}

// Upload files to server
function uploadFile(mediaFile) {
    var ft = new FileTransfer(),
    path = mediaFile.fullPath,
    name = mediaFile.name;
    
    ft.upload(path,
              "http://my.domain.com/upload.php",
              function(result) {
              console.log('Upload success: ' + result.responseCode);
              console.log(result.bytesSent + ' bytes sent');
              },
              function(error) {
              console.log('Error uploading file ' + path + ': ' + error.code);
              },
              { fileName: name });
}
