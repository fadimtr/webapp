var netcraftApp = angular.module('netcraftApp', ['ngRoute','ngStorage']);


netcraftApp.controller('netcraftController', function($scope,$sce,$localStorage) {


	// INITIALIZE VARIABLES
	$scope.rows=[0,1,2];
	$scope.netcraftForms = {quickReportsForm:[],teamFoldersForm:[]};
	$scope.netcraftUrlLists = {quickReports:[],teamFolders:[]};
	$scope.myFoldersTabURL = 'http://www.w3schools.com';
	$scope.publicFoldersTabURL = 'http://www.frontend.com'
	$scope.searchedReportName = "";
	$scope.activeObj = {activeTab:'quickReports'};






	// INIT ENVIRONMENT

	// initialize url list from localstorage
	$scope.initUrlList = function(listName){
		var i=0;
		$scope.netcraftUrlLists[listName]=[];
		while($localStorage.netcraftWebData[listName][i]){
			$scope.netcraftUrlLists[listName].push($localStorage.netcraftWebData[listName][i]);
			i++;
		}
	};

	// initialize the environment
	$scope.initializeEnvironment = function(){
		$scope.selectedIndex = {quickReports:0,teamFolders:0}; // initialize selected index as first one
		var qRarray = [{name:'ynet',url:'http://www.ynet.co.il'}];
		var tFarray = [{name:'w3schools',url:'http://www.w3schools.com'}];
		var localStorageData;
		// Initialize Local Storage
		var netcraftWebData = {quickReports: qRarray, teamFolders:tFarray};
		localStorageData=$localStorage.netcraftWebData; // extract localStorage data
		// if no data found , need to initalize
		if(!localStorageData){
			$localStorage.netcraftWebData = netcraftWebData;
			$scope.netcraftUrlLists['quickReports'].push(netcraftWebData.quickReports[0]);
			$scope.netcraftUrlLists['teamFolders'].push(netcraftWebData.teamFolders[0]);
		}else{
			// if tab data not exist or is empty , init it , otherwise load it using $scope.initUrlList()
			if(!localStorageData.quickReports || localStorageData.quickReports.length === 0){
				var netcraftWebData = {quickReports: qRarray, teamFolders:localStorageData.teamFolders};
				$localStorage.netcraftWebData = netcraftWebData;
				$scope.netcraftUrlLists['quickReports'].push(netcraftWebData.quickReports[0]);
			}else{
				$scope.initUrlList('quickReports');
			} 
			if(!localStorageData.teamFolders || localStorageData.teamFolders.length === 0){
				var netcraftWebData = {quickReports: localStorageData.quickReports, teamFolders:tFarray};
				$localStorage.netcraftWebData = netcraftWebData;
				$scope.netcraftUrlLists['teamFolders'].push(netcraftWebData.teamFolders[0]);
			}else{
				$scope.initUrlList('teamFolders');
			}
		}	
		
	};

	$scope.initializeEnvironment();	







	// HANDLE SEARCH

	$scope.searchReport =function(){
		var i=0;
		// search in quick reports data
		while($scope.netcraftUrlLists['quickReports'] && $scope.netcraftUrlLists['quickReports'][i]){
			if( ($scope.netcraftUrlLists['quickReports'][i].name).indexOf($scope.searchedReportName) != -1){
				$scope.selectedIndex['quickReports'] = i;
				$scope.activeObj.activeTab = 'quickReports';
				return true;
			}
			i++;
		}
		i=0;
		// search in team folders data
		while($scope.netcraftUrlLists['teamFolders'] && $scope.netcraftUrlLists['teamFolders'][i]){
			if(($scope.netcraftUrlLists['teamFolders'][i].name).indexOf($scope.searchedReportName) != -1){
				$scope.selectedIndex['teamFolders'] = i;
				$scope.activeObj.activeTab = 'myTeamFolders';
				return true;
			}
			i++;
		}
		window.alert($scope.searchedReportName + " not found in your reports.");
		return false;
	};







	// MAINTAIN URLs LISTs ( lists on 'quick reports' and 'team folders' tabs )

	// get selected name on the list
	$scope.getSelectedName = function(listName){
		return $scope.netcraftUrlLists[listName][$scope.selectedIndex[listName]].name;
	};

	// get the list header URL for quick reports tab
	$scope.getQRListHeaderURL = function(index){
		if(index){
			if($scope.netcraftUrlLists['quickReports'][index]){
				return $scope.netcraftUrlLists['quickReports'][index].url;
			}else{
				return null;
			}
		}else{
			return $scope.netcraftUrlLists['quickReports'][$scope.selectedIndex['quickReports']].url;
		}
	};

	// get the list header URL for team folders tab
	$scope.getTFListHeaderURL = function(index){
		if(index){
			if($scope.netcraftUrlLists['teamFolders'][index]){
				return $scope.netcraftUrlLists['teamFolders'][index].url;
			}else{
				return null;
			}
		}else{
			return $scope.netcraftUrlLists['teamFolders'][$scope.selectedIndex['teamFolders']].url;
		}
	};

	// update the selected index in the urls list
	$scope.updateIndex = function(index,listName){
		$scope.selectedIndex[listName] = index;
	};








	// FORMs FUNCTIONS

	// init form from local storage
	$scope.initForm = function(formName){
		var listName = 'teamFolders';
		if(formName === 'quickReportsForm') {
			listName = 'quickReports';
		}
		$scope.validObj = {isValid:true};
		$scope.netcraftForms[formName] = [];
		for(var i=0;i<3;i++){
			if($localStorage.netcraftWebData[listName][i]){
				$scope.netcraftForms[formName].push($localStorage.netcraftWebData[listName][i]);
			}
		}
	};

	// submit form data into lists
	$scope.saveFormInList = function(formName){
		var listName = 'teamFolders';
		if(formName === 'quickReportsForm') {
			listName = 'quickReports';
		}
		var i=0,length=0;
		// check if form have empty fields
		if($scope.netcraftForms[formName]){
			for(i=0;i<$scope.netcraftForms[formName].length;i++){
				if($scope.netcraftForms[formName][i] && ($scope.netcraftForms[formName][i].name === "" || 
					$scope.netcraftForms[formName][i].name === undefined ||
					$scope.netcraftForms[formName][i].name === null) ){
					break;
				}else if($scope.netcraftForms[formName][i]){
					length++;
				}
			}
		}
		i=0;
		$scope.netcraftUrlLists[listName] = [];
		// if form is not empty , data will be copied to the list , otherwise will be initialized again
		if($scope.netcraftForms[formName] && length !== 0){
			while($scope.netcraftForms[formName][i] && $scope.netcraftForms[formName][i].name){
				var currentUrl = $scope.addHttp($scope.netcraftForms[formName][i].url);
				var tmp = {name:$scope.netcraftForms[formName][i].name,url:currentUrl};
				$scope.netcraftUrlLists[listName].push(tmp);
				i++;	
			}
			$localStorage.netcraftWebData[listName] = $scope.netcraftUrlLists[listName];
		}else{
			var qRarray = [{name:'ynet',url:'http://www.ynet.co.il'}];
			$scope.netcraftUrlLists[listName].push(qRarray[0]);
			$localStorage.netcraftWebData[listName]= qRarray;
		}
	};

	// check if form is valid 
	$scope.isFormValid = function(formName){
		var i=0;
		while($scope.netcraftForms[formName] && $scope.netcraftForms[formName][i] ){
			if($scope.netcraftForms[formName][i].isInvalidUrl || $scope.netcraftForms[formName][i].isInvalidName){
				return false;
			}
			i++;
		}
		return true;
	}
	
	// validate url
	$scope.validURL = function(index,formName) {
		if(!$scope.netcraftForms[formName][index] || !$scope.netcraftForms[formName][index].url){
			return true;
		}
  		var expression = /^(?:(ftp|http|https):\/\/)?(?:[\w-]+\.)+[a-z]{2,6}$/;
 		var regex = new RegExp(expression);
 		if(($scope.netcraftForms[formName][index].url).match(regex)){
 			return true;
 		}else{
 			return false;
 		}
	};

	// add 'http' to the url if missing
	$scope.addHttp = function(url) {
   		if (!/^(f|ht)tps?:\/\//i.test(url)) {
      		url = "http://" + url;
   		}
   		return url;
	};

	// check if field in the form is required
	$scope.isRequired = function(index,formName){
		return $scope.netcraftForms[formName][index].name && !$scope.netcraftForms[formName][index].url;
	};



});


// localstorage
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, obj);
}
Storage.prototype.getObj = function(key) {
    return 
    this.getItem(key);
}

// directive to handle the quick reports tab
netcraftApp.directive('quickReportsDirective',function(){
	return {
		restrict: 'A',
		controller: 'netcraftController',
		templateUrl : '../quickReportsDirective.html'
	}
});

// directive to handle the team folders tab
netcraftApp.directive('teamFoldersDirective',function(){
	return {
		restrict: 'A',
		controller: 'netcraftController',
		templateUrl : '../teamFoldersDirective.html'
	}
});


// filter for secure url
netcraftApp.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

