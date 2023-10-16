//rootText.js

// ***** getFileGivenRuleId(ruleId) *****
// last modified: 09-10-2023 (dd-mm-yyyy) by: Ayya Niyyānika - initial writing
// parameter: the ruleId of one rule as arguements
// returns: the JSON array from the file that should contain the rule with the given ruleId 
// this script is expected to run from the main code area and access files in the ./data/rootText directory
function getFileGivenRuleId(ruleId) {
//separate the segments
 let segments = ruleId.split("-",4);

 //make them UpperCamelCase in one string
 let end = segments
  .map(seg => {
  return (seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase())
 })
 .reduce((first, next) => first + next);

 const fileName = "./data/rootText/" + end + ".json";
 const data = require(fileName);

 //return JSON contents of the file
 return data;
};

// **** getRuleData(ruleId) *****
// last modified: 09-10-2023 (dd-mm-yyyy) by: Ayya Niyyānika - initial writing
// parameter: the ruleId of one rule as arguements
// returns: that rule's data if in the array found in the file associate with this rule that is found by calling getFileGivenRuleId(ruleId)
// ex: output for getFileGivenRuleId(lzh-mu-bi-pm-pc79): 
//   {
//     id: 'lzh-mu-bi-pm-pc79',
//     about: { vinayaTradition: 'Mūlasarvāstivāda', offenseClass: 'Pārajika' },
//     inLanguage: 'Lzh',
//     isPartOf: 'Taishō',
//     text: '若復苾芻尼在生草上。大小便洟唾者。波逸底迦。',
//     label: 'Mūlasarvāstivāda Bhikkhunī Pācittiya 79'
//   }
function getRuleData(ruleId) {
 // get the file data
 let data = getFileGivenRuleId(ruleId);

 // return JSON object for this rule
 return data.filter(rule => rule.id === ruleId)[0];
};

//test
//console.log(getRuleData("lzh-mu-bi-pm-pc79"));

module.exports =  {getRuleData};