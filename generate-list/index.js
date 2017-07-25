var shortid = require('shortid');
var fs = require('fs-extra');

var list = fs.readJsonSync('initial-list.json');
var finalList = [];


for (var i = 0; i < list.length; i++) {
  var wordObject = {
    sequence: i + 1,
    word: list[i],
    complete: false,
    practice: false,
    id: shortid.generate(),
  };

  finalList.push(wordObject);
}

fs.writeJsonSync('./sight-words-list.json', finalList);