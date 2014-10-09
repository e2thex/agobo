var engine = function(items, events, scoringEngine, eventEngine) {
  var that = {};
  that.items = items;
  that.events = typeof events == 'undefined' ? [] : events;
  that.scoringEngine = typeof scoringEngine =='undefined' ? scoringEngine() : scoringEngine ;
  that.eventEngine = typeof eventEngine =='undefined' ? eventEngine() : eventEngine ;
  that.eventEngine = eventEngine,
  that.currentRank =[];
  that.recordEventResult = function recordEvent(eEvent, result) {
    if (result != null) {
      eEvent.recordResult(result, Date.now());
      that.events.push(eEvent);
    }
  }
  that.createEvent = function() {
    return this.eventEngine.createEvent(this.score(), this.events);
  }
  that.score = function() {
    return this.scoringEngine.score(this.items, this.events);
  }
  that.getNewEvent = function() {
    // shuffle all items
    var items = shuffle(this.getRankedItems());
    // pick a random first itle
    var itemA = items.pop();
    //complile helpfull data
    //max diff max Events and all candidates
    var data = items.reduce(function(data, item) {
      data.maxEvents = item.events>data.maxEvents ? item.events: data.maxEvents;
      data.minEvents = item.events<data.minEvents ? item.events: data.minEvents;
      var diff = Math.abs(itemA.score - item.score);
      data.maxDiff = diff>data.maxDiff ? diff: data.maxDiff;
      data.minDiff = diff<data.minDiff ? diff: data.minDiff;
      //add a combo of this item with each of the previous items as a candidate
      var newDCs =data.previous.map(function(pitem) {
        return [item, pitem];
      });
      data.candidates = data.candidates.concat(newDCs)
      //add this item as a candidate
      data.candidates.push([item]);
      
      data.previous.push(item);
      return data;
    }, {maxEvents:0, minEvents:10000, maxDiff:0, minDiff:15000, previous:[], candidates: []});
    //create a next score for each candidate
    var candidates = data.candidates.map(function(items) {
      var cData = items.reduce(function(cData, item) {
        cData.score += item.score;
        cData.events = item.events>cData.events ? item.events : cData.events;
        cData.items.push(item.item);
        return cData;
      }, {score:0, events:0, items:[]});
      var nextScore = 
        10*(cData.events/data.maxEvents) +
        10*(Math.abs(itemA.score-cData.score)/data.maxDiff) +
        Math.random();
        
      return {
        nextScore:nextScore,
        items:cData.items
      };
    });
    candidates.sort(function(a,b) {return a.nextScore-b.nextScore});
    console.log("cand", candidates);
    return engineEvent([itemA.item], candidates[0].items);
  }
  that.getRankedItems = function() {
    var start = 1000;
    var factor = .1;
    var initScores = this.items.reduce(function(scores, item) {
      scores[item.key] = {score: start, item:item, events:0};
      return scores;
    }, {});
    var scores = this.events.reduce(function(scores, eEvent) {
      var winnersScore = eEvent.winners.reduce(function(score, item) {
        return score + scores[item.key].score;
      },0);
      var losersScore = eEvent.losers.reduce(function(score, item) {
        return score + scores[item.key].score;
      },0);
      var scoreDiff = winnersScore - losersScore;
      var scoreChange = (Math.max(winnersScore, losersScore)-scoreDiff) *factor
      var maxScore = start;
      eEvent.winners.map(function(item) {
        scores[item.key].score = Math.floor(scores[item.key].score + scoreChange/eEvent.winners.length);
        maxScore = scores[item.key].score >maxScore ? scores[item.key].score : maxScore;
        scores[item.key].events ++;
      });
      eEvent.losers.map(function(item) {
        scores[item.key].score = Math.floor(scores[item.key].score - scoreChange/eEvent.losers.length);
        scores[item.key].events ++;
      });
      for (key in scores) {
        scores[key].score = start * (scores[key].score/maxScore);
      }
      return scores;
    }, initScores);
    var scoreTable = Object.keys(scores).map(function(key) {
      return scores[key];
    }).sort(function(a,b) { return b.score-a.score});
    return scoreTable;
  }
  return that;
}

var engineEvent = function(choiceA, choiceB) {
  var that = {
    choiceA:choiceA,
    choiceB:choiceB,
    outcome: null,
    time: null,
  }
  that.recordResult = function (result, time) {
    this.outcome = result;
    this.time = time;
  }
  return that;
}

var eventEngine1 = function EventEngine1() {
  that = {}
  that.createEvent = function() {
    // shuffle all items
    var items = shuffle(this.getRankedItems());
    // pick a random first itle
    var itemA = items.pop();
    //complile helpfull data
    //max diff max Events and all candidates
    var data = items.reduce(function(data, item) {
      data.maxEvents = item.events>data.maxEvents ? item.events: data.maxEvents;
      data.minEvents = item.events<data.minEvents ? item.events: data.minEvents;
      var diff = Math.abs(itemA.score - item.score);
      data.maxDiff = diff>data.maxDiff ? diff: data.maxDiff;
      data.minDiff = diff<data.minDiff ? diff: data.minDiff;
      //add a combo of this item with each of the previous items as a candidate
      var newDCs =data.previous.map(function(pitem) {
        return [item, pitem];
      });
      data.candidates = data.candidates.concat(newDCs)
      //add this item as a candidate
      data.candidates.push([item]);
      
      data.previous.push(item);
      return data;
    }, {maxEvents:0, minEvents:10000, maxDiff:0, minDiff:15000, previous:[], candidates: []});
    //create a next score for each candidate
    var candidates = data.candidates.map(function(items) {
      var cData = items.reduce(function(cData, item) {
        cData.score += item.score;
        cData.events = item.events>cData.events ? item.events : cData.events;
        cData.items.push(item.item);
        return cData;
      }, {score:0, events:0, items:[]});
      var nextScore = 
        10*(cData.events/data.maxEvents) +
        10*(Math.abs(itemA.score-cData.score)/data.maxDiff) +
        Math.random();
        
      return {
        nextScore:nextScore,
        items:cData.items
      };
    });
    candidates.sort(function(a,b) {return a.nextScore-b.nextScore});
    console.log("cand", candidates);
    return engineEvent([itemA.item], candidates[0].items);
  }
  return that;
}

var randomEventEngine = function() {
  var that = {};
  that.createEvent = function randomEventEngineNewEvent(scores, events, items) {
    scores = shuffle(scores);
    return engineEvent([scores[0].id], [scores[1].id]);
  }
  return that;
}


var randomScoringEngine = function() {
  var that = {};
  that.score = function(items, events) {
    return Object.keys(items).map(function(id) {
      return {
        id:id,
        score:Math.random()*1000,
        events:Math.random()*100
      }
    });
  }
  return that;
}
var eloEngine = function(factor, start, kfactor) {
  var that = {};
  that.factor = typeof factor == 'undefined' ? 400 : factor;
  that.kfactor = typeof kfactor == 'undefined' ? 32 : kfactor;
  that.start = typeof start == 'undefined' ? 1450 : start;
  var computedE = function(outcome,score, oscore) {
    //http://en.wikipedia.org/wiki/Elo_rating_system#Mathematical_details
    var eOutcome = 1/(1 + 10^((oscore-score)/that.factor));
    var delta = that.kfactor*(outcome-eOutcome);
    return delta;
  };
  that.score = function(items, events) {
    var start = this.start;
    var scores = Object.keys(items).reduce(function (scores, id) {
      scores[id] = {score: start, events:0};
      return scores;
    }, {});
    events.forEach(function(e) {
      console.log("event", e);
      var itemA = e.choiceA;
      var itemB = e.choiceB;
      scores[e.choiceA[0]].score += computedE(e.outcome, scores[e.choiceA[0]].score, scores[e.choiceB[0]].score);
      scores[e.choiceB[0]].score += computedE(1-e.outcome, scores[e.choiceB[0]].score, scores[e.choiceA[0]].score);
      scores[e.choiceA[0]].events ++;
      scores[e.choiceB[0]].events ++;
    });
    return Object.keys(scores).map(function(id) {
      return {
        id:id,
        score: scores[id].score,
        events: scores[id].events,
      }
    }).sort(function(a,b) { return b.score-a.score});
  }
  return that;
}
var scoringEngine1 = function ScoringEngine1() {
  that = {}
  that.getRanks = function(items, events) {
    var start = 1000;
    var factor = .1;
    var initScores = this.items.reduce(function(scores, item) {
      scores[item.key] = {score: start, item:item, events:0};
      return scores;
    }, {});
    var scores = this.events.reduce(function(scores, eEvent) {
      var winnersScore = eEvent.winners.reduce(function(score, item) {
        return score + scores[item.key].score;
      },0);
      var losersScore = eEvent.losers.reduce(function(score, item) {
        return score + scores[item.key].score;
      },0);
      var scoreDiff = winnersScore - losersScore;
      var scoreChange = (Math.max(winnersScore, losersScore)-scoreDiff) *factor
      var maxScore = start;
      eEvent.winners.map(function(item) {
        scores[item.key].score = Math.floor(scores[item.key].score + scoreChange/eEvent.winners.length);
        maxScore = scores[item.key].score >maxScore ? scores[item.key].score : maxScore;
        scores[item.key].events ++;
      });
      eEvent.losers.map(function(item) {
        scores[item.key].score = Math.floor(scores[item.key].score - scoreChange/eEvent.losers.length);
        scores[item.key].events ++;
      });
      for (key in scores) {
        scores[key].score = start * (scores[key].score/maxScore);
      }
      return scores;
    }, initScores);
    var scoreTable = Object.keys(scores).map(function(key) {
      return scores[key];
    }).sort(function(a,b) { return b.score-a.score});
    return scoreTable;
  }
  return that;
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
