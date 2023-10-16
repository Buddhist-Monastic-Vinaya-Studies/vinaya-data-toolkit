//findParallelsQuery.js

const parallels = require('./includedPatimokkhaParallels.json');
const rootText = require('./rootText');

// **** getParallels(ruleId) *****
// last modified: 09-10-2023 (dd-mm-yyyy) by: Ayya Niyyānika - initial writing
// parameter: ruleId  ex: "pli-tv-bi-pm-pj4", "lzh-mu-bi-pm-pc79"
// returns: the matching parallels object 
// ex: [
//   {
//     full: [
//       'lzh-mi-bi-pm-pc137',
//       'lzh-sarv-bi-pm-pc79',
//       'lzh-mu-bi-pm-pc79',
//       'lzh-mg-bi-pm-pc139'
//     ],
//     partial: [ 'pli-tv-bi-pm-pc9', 'lzh-dg-bi-pm-pc77' ]
//   }
// ]
function getParallels(ruleId) {
  return parallels.filter((set) => {
    return (set.full.includes(ruleId));
  })[0];
}

// **** getParallelsData(parallels) *****
// last modified: 09-10-2023 (dd-mm-yyyy) by: Ayya Niyyānika - initial writing
// parameter: ruleId  ex: "pli-tv-bi-pm-pj4", "lzh-mu-bi-pm-pc79"
// returns: the matching parallels object with expanded parallel object data
// ex: 
// {
//   full: [
//     {
//       id: 'lzh-mi-bi-pm-pc137',
//       about: [Object],
//       inLanguage: 'Lzh',
//       isPartOf: 'Taishō',
//       text: 'text here',
//       label: 'Mahīśāsaka Bhikkhunī Pacitiya 137'
//     },
//     {...
//   ],
//   partial: [
//     {
//       id: 'pli-tv-bi-pm-pc9',
function getParallelsData(ruleId) {
  const parallels = getParallels(ruleId);
  const expandedFull = parallels.full.map(ruleId => {
      return(rootText.getRuleData(ruleId));
    });
  const expandedPartial = parallels.partial.map(ruleId => {
      return(rootText.getRuleData(ruleId));
    });
    return { full: expandedFull, partial: expandedPartial};
};


//Test
// data not in files for this one yet //getParallels("pli-tv-bi-pm-pj4");
// console.log(getParallelsData("lzh-mu-bi-pm-pc79"));

module.exports =  {getParallelsData};