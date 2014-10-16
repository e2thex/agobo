var coolApp = angular.module('coolApp', []);

coolApp.controller('coolAppSelectorCtrl', function ($scope, $http) {
  $scope.scores = [];
  $scope.choice = 'a';
  $scope.choiceA = {
    class: '',
    items: []
  };
  $scope.choiceB = {
    class: '',
    items:[]
  };
  var getEventsFromId = function(ids) {
    return ids.map(function(id) { return $scope.items[id]; });
  }
  $scope.initChoice = function() {
    $scope.currentEvent = $scope.engine.createEvent();
    $scope.choiceA.items = getEventsFromId($scope.currentEvent.choiceA);
    $scope.choiceB.items = getEventsFromId($scope.currentEvent.choiceB);
    $scope.scores = $scope.engine.score();
  };
  $scope.setChoice = function(choice) {
    $scope.engine.recordEventResult($scope.currentEvent, choice)
    $scope.initChoice();
  }

  $http.get('itemlib/test1.json')
    .then(function(res){
    $scope.items = res.data;                
    $scope.engine = engine($scope.items, [], eloEngine(), eventEngine2());
    $scope.initChoice();
  });

});
