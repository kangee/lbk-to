Meteor.Sorter = {

  shuffle : function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  },

 mergeSort : function(array, compare) {

    var length = array.length,
        middle = Math.floor(length / 2);

    if (length < 2)
      return array;

    return Meteor.Sorter.merge(
      Meteor.Sorter.mergeSort(array.slice(0, middle),compare),
      Meteor.Sorter.mergeSort(array.slice(middle, length),compare),
      compare
    );
  },

  merge : function(left, right, compare) {

    var result = [];

    while (left.length > 0 || right.length > 0) {
      if (left.length > 0 && right.length > 0) {
        if (compare(left[0], right[0]) <= 0) {
          result.push(left[0]);
          left = left.slice(1);
        }
        else {
          result.push(right[0]);
          right = right.slice(1);
        }
      }
      else if (left.length > 0) {
        result.push(left[0]);
        left = left.slice(1);
      }
      else if (right.length > 0) {
        result.push(right[0]);
        right = right.slice(1);
      }
    }
    return result;
  },
  IndexOf : function(array, element){
	for (var i = array.length - 1; i >= 0; i--) {
		if(array[i]===element){
			return i
		}
	};
	return -1
	},

	pointsFromGame : function(game,playerId){
	if(game.Result === null){
		return 0;
	}
	var result = game.Result.split("-");
	if (game.PlayerOne === playerId){
		return Number(result[0]);
	}
	if (game.PlayerTwo === playerId){
		return Number(result[1]);
	}
	return 0;
},

PlayedInGame : function(game,playerId){
	if (game.PlayerOne === playerId || game.PlayerTwo === playerId){
		return true;
	}
	return false;
}

};