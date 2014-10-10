var coolApp = angular.module('coolApp', []);

coolApp.controller('coolAppSelectorCtrl', function ($scope) {
  $scope.items = {
    /*
    'a1':{
      'url': "http://1.bp.blogspot.com/_XdcdGxtaSos/S-RU_E1iQwI/AAAAAAAAAOg/CDByo2t3Cp4/s1600/The+Garden+Series+-+Reading+Together.jpg",
      'name': "The Garden Series eading Togeather"
    },
    'a2':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/d/d6/Claude_Monet_-_Graystaks_I.JPG",
      'name': "Graystaks I"
    },
    'a3':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/1/1b/Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg",
      'name': "Woman with a Parasol"
    },
    'a4':{
      'url': "http://paintings-art-picture.com/paintings/wp-content/uploads/2012/03/21/Karl-Albert-Buehr-The-Bridge-to-the-Artists-House-1908-11-Impressionism-Paintings-4.jpeg",
      'name': "The Bridge to the Artists"
    },
    'a5':{
      'url': "http://www.artwallpaper.eu/Paintings/wp-content/uploads/2013/01/21/2707/Henry-Moret-Nothern-Sea-1900-Impressionism-Paintings-Art-Images-22.jpeg",
      'name': "Henry"
    },
    'a6':{
      'url': "https://img1.etsystatic.com/000/0/5711041/il_fullxfull.308392231.jpg",
      'name': "Jazz"
    },
    'a7':{
      'url': "http://triviumproject.com/wp-content/uploads/2011/12/1280px-Vincent_van_Gogh_Starry_Night-1024x817.jpg",
      'name': "Starry Night"
    }*/
    'dollar1':{
      'url': "http://i46.tinypic.com/24n1d82.jpg",
      'name': "One"
    },
    'dollar5':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/f/f9/US_$5_Series_2006_obverse.jpg",
      'name': "Five"
    },
    'dollar5-1':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/f/f9/US_$5_Series_2006_obverse.jpg",
      'name': "Five"
    },
    'dollar5-2':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/f/f9/US_$5_Series_2006_obverse.jpg",
      'name': "Five"
    },
    'dollar5-3':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/f/f9/US_$5_Series_2006_obverse.jpg",
      'name': "Five"
    },
    'dollar10':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/4/49/US10dollarbill-Series_2004A.jpg",
      'name': "Ten"
    },
    'dollar20':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/b/bf/US20-front.jpg",
      'name': "Twenty"
    },
    'dollar20-2':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/b/bf/US20-front.jpg",
      'name': "Twenty -1"
    },
    'dollar20-3':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/b/bf/US20-front.jpg",
      'name': "Twenty -2"
    },
    'dollar50':{
      'url': "http://img.4plebs.org/boards/hr/image/1403/75/1403754418629.jpg",
      'name': "Fifty"
    },
    'dollar100':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/4/4d/Usdollar100front.jpg",
      'name': "One Hundred"
    },
    'dollar2':{
      'url': "http://upload.wikimedia.org/wikipedia/commons/9/94/US_$2_obverse-high.jpg",
      'name': "Two"
    },
  };
  $scope.engine = engine($scope.items, [], eloEngine(), randomEventWithLevelsEngine());
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
  $scope.initChoice();


});
