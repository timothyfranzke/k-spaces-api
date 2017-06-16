let commonNouns = require('../config/common-nouns');

module.exports = {
    generatePassword: function () {
        let nouns = commonNouns.nouns;
        let max =  nouns.length;

        let firstIndex = Math.floor((Math.random() * max) + 1);
        let secondIndex = Math.floor((Math.random() * max) + 1);
        //return "bad";
        return nouns[firstIndex] + "_" + nouns[secondIndex];
    }
};