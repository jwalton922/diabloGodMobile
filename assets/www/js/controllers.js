'use strict';

/* Controllers */

function DiabloController($scope, $log, $http, $rootScope, appConstants) {

    $scope.selectedAffixes = [];
    $scope.affixesToSelect = [];
    $scope.showAddItemButton = true;
    $scope.affixMap = {};
    $scope.currentSelection = null;
    $scope.previousSelections = [];

    $scope.resetSelectionMenu = function(){
        $scope.currentSelection = null;
        $scope.previousSelections = [];
    }
    
    //handle add item click
    $scope.handleAddItemAffixClick = function(){
        $scope.showAddItemButton = false;
        $scope.affixesToSelect = $scope.affixMap["root"];
        //$scope.previousSelections.push("root");
        $scope.currentSelection = "root";
    //$log.log("Root menu: "+angular.toJson($scope.affixMap["root"]));
    //$log.log("Root menu: "+angular.toJson($scope.rootAffixMenu));


    }
    //handle item affix selection press
    $scope.handleItemAffixClick = function(menu){
        $log.log("User selected: "+menu+" menu item");
        var nextMenu = null;
        if(menu == "Back"){
            var previousMenuName = $scope.previousSelections.pop();
            $log.log("Previous Menu = "+previousMenuName);
            nextMenu = $scope.affixMap[previousMenuName];
        } else if(menu == "Cancel"){
            $scope.affixesToSelect = [];
            $scope.showAddItemButton = true;
            //no need to continue
            return;
        } else {
            nextMenu = $scope.affixMap[menu];
            if(nextMenu != null){
                $scope.previousSelections.push($scope.currentSelection);
                $scope.currentSelection = menu;
            }
        }
        if(nextMenu != null){
            $scope.affixesToSelect = nextMenu;
        } else {
            $log.log("Have an attribute to search on!");
            $scope.selectedAffixes.push(menu);
            $scope.resetSelectionMenu();
            $scope.showAddItemButton = true;
        }

    }

    $scope.removeWhiteSpaces = function(string){
        var modifiedString = string.replace(/ /g, "_");
        $log.log(string+" with white spaces replaced = "+modifiedString);
        return modifiedString;
    }

    $scope.evaluateItem = function(){
        $log.log("evaluateItem called");
        var paramData = {};
        for(var i = 0; i < $scope.selectedAffixes.length; i++){
            var affixSpacesReplaced = $scope.removeWhiteSpaces($scope.selectedAffixes[i]);
            var affixValue = $("#"+affixSpacesReplaced).val();
            paramData[affixSpacesReplaced] = affixValue;
            $log.log("Added search param: "+affixSpacesReplaced+" = "+affixValue);
        }
        paramData["callback"] = "JSON_CALLBACK"
        var requestUrl = "http://localhost:3000/calculateItemWorth";
        var headerData = {
            "Accepts": "application/json",
            "Content-Type": "application/json"
        };
        var request = {};
        request.success = function(xhr){
            $log.log("Received item results: "+angular.toJson(xhr));

        };
        request.error = function(xhr){
            $log.log("Error getting item results: "+angular.toJson(xhr));
        };
        $http.jsonp(requestUrl, {
            params : paramData,
            headers: headerData
        }).
        success(function(data, status, headers, config){
            $log.log("Success! data from server: "+angular.toJson(data));
            $scope.createCharts(data);

        }).error(function(data, status, headers, config){
            $log.log("Error :(");
        });
      
    }


    $scope.rootAffixMenu = ["Cancel", "Primary Attributes", "Life Gain", "Adventuring", "Class Resource Bonus","Skill Bonus"]
    $scope.primaryAttributesMenu = ["Back", "Strength", "Dexterity", "Intelligence", "Vitality", "Cancel"];

    $scope.affixMap["root"] = $scope.rootAffixMenu;
    $scope.affixMap["Primary Attributes"] = $scope.primaryAttributesMenu;

    $scope.createCharts = function(data){
        var accountEliteKills = $.jqplot('accountEliteKills', [data["account_elite_kills"]], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !$.jqplot.use_excanvas,
            title: "Account Elite Kills",
            seriesColors : ["#CC0000"],
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: {
                    show: false
                },
                renderOptions : {
                    barWidth : 8,
                    barMargin : 0,
                    barPadding : 0
                }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    tickOptions : {

                    },
                    renderOptions : {
                        barWidth : 5
                    }
                }
            },
            highlighter: {
                show: false
            }
        });

        var accountProgress = $.jqplot('accountProgress', [data["account_progress"]], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !$.jqplot.use_excanvas,
            title: "Account Progress",
            seriesColors : ["#CC0000"],
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: {
                    show: false
                },
                renderOptions : {
                    barWidth : 8,
                    barMargin : 0,
                    barPadding : 0
                },
                shadow : false
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    tickOptions : {
                        showLabel : false,
                        show: false
                    }
                    
                }
            },
            highlighter: {
                show: false
            }
        });
    }

};
