// BORDA count for an object with an array of objects as an input

// let data = {polls:[{option: "TODAY",rank: 1,users_name: "Sarah"},{option: "NEXT WEEK",rank: 3,users_name: "Sarah"},{option: "TOMORROW", rank: 2,users_name: "Sarah"},{option:"NEXT WEEK",rank:3,users_name:"Jon"},{option:"TODAY",rank:2,users_name: "Jon"},{option: "TOMORROW",rank: 1,users_name: "Jon"},{option: "TODAY",rank: 1,users_name: "Simon"},{option: "TOMORROW", rank: 2, users_name: "Simon"},{option: "NEXT WEEK",rank: 3, users_name: "Simon"}]}

// create an object with options as keys and their rankings as values (in an array) {NEXT WEEK: [2,3,2], TOMORROW: [3,1,3]} etc.
// apply a multiplier to these array values based on the number of options (n)
// get an aggregated value for each options
// sort these options and return the one with the highest scores

let borda = function(data) {
  // calculate a list of unique options and set the length as num (used for multiplier)
  let options = [];
  let pollData = data.polls
  for (obj of pollData) {
    options.push(obj.option);
  }
  const optionsUnique = [...new Set(options)];
  const num = optionsUnique.length;

  // create an object with arrays of rankings for each option
  optRanks = {};
  for (val of pollData) {
    if (!optRanks[val.option]) {
      optRanks[val.option] = [];
      optRanks[val.option].push(val.rank);
    } else {
    optRanks[val.option].push(val.rank);
    }
    // console.log('optRanks: ', optRanks);
  }

  // multiplier array to weight option ranks
  multiplier = []
  for (i = num; i > 0; i--) {
    multiplier.push(i);
  }
  // console.log('multiplier: ', multiplier)

  // create a rankings object with options as keys total weighted sums as values
  let rankings = {}
  for (opts in optRanks) {
    // console.log('ranks: ',opts);
    // console.log('array of option ranks: ', optRanks[opts]);
    rankings[opts] = 0;
    for (i = 0; i < optRanks[opts].length; i++) {
      rankings[opts] += (multiplier[optRanks[opts][i] - 1]);
      // console.log('ranking: ', optRanks[opts][i])
      // console.log('multiplier: ', multiplier[optRanks[opts][i] - 1] )
    }
  }
  // console.log(rankings);

  let sortable = [];
  for (let sums in rankings) {
      sortable.push([sums, rankings[sums]]);
  }
  sortable.sort(function(a, b) {
    return b[1] - a[1];
  })
  // console.log(sortable);
  return sortable;

}
borda(data);

module.exports = { borda };
