'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('diabloApp.services', [])
  .factory('appConstants', function () {
  	var appConstants = {};

  	appConstants.rootUrl = 'http://www.acheevos.com';
  	appConstants.authDBname = 'AUTH';

  	return appConstants;
  }).factory('localDB', ['$log', 'appConstants', function ($log, appConstants) {

  	var initlized = false;

  	var initDB = function (tx) {
		tx.executeSql('DROP TABLE IF EXISTS ' + appConstants.authDBname);
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + appConstants.authDBname + '(token)');
		initlized = true;
  	};

  	var errorDB = function (err) {
  		$log.log('Error processing SQL: ' + err.code + ' ' + angular.toJson(err));
  	};

  	var successDB = function () {
  		$log.log("success!");
  	};

  	var db = window.openDatabase("localDB", "1.0", "Acheevos", 1000000);

  	if (!initlized) {
  		db.transaction(initDB, errorDB, successDB);
  	}
  	
  	return db;

  }]).factory('dbUtils', ['$log', 'localDB', 'appConstants', function ($log, localDB, appConstants) {
  	// simple utils for the db object
  	return {
  		saveAuth: function (token) {
  			if(!_.isString(token)) {
  				$log.log('Must use string for token!');
  			}

  			var createTokenDB = function (tx) {
  				//$log.log('Running this sql: ' + 'INSERT INTO ' + appConstants.authDBname + ' (token) VALUES ("' + token + '")');
  				tx.executeSql('INSERT INTO ' + appConstants.authDBname + ' (token) VALUES ("' + token + '")');
  			};

			localDB.transaction(createTokenDB, 
			function (error) {
				$log.log("Couldn't Create TOKEN!!!" + angular.toJson(error));
			});	
  		}, getAuth: function (onSuccess, onError) {
  			
  			var getTokenDB = function (tx) {
  				// $log.log('Getting auth ' + 'SELECT * FROM ' + appConstants.authDBname);
  				tx.executeSql('SELECT * FROM ' + appConstants.authDBname, [],
  					function (tx, results) {
  						// $log.log("Got this out of db " + angular.toJson(results.rows));
  						// allways return last token
              try {
                onSuccess(results.rows.item(results.rows.length - 1).token);
              } catch(error) {
                onError(error);
              }
  						
  					},
  					function (error){
  						$log.log("error getting data out of db");
  					});
  			};

  			localDB.transaction(getTokenDB, 
  				function (err) {
  					$log.log('ERROR getting token' + angular.toJson(err));
  				});
  		}

  	}
  }]);
