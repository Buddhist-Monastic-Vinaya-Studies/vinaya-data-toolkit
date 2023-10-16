function getRuleMetaDataQuery(ruleId) {
 const fileName = './data/rootText/' + getDataFileNameIncludingRule(ruleId);
 
 const data = require(fileName);

 return data;
}

function getVinayaRuleInstanceFor(ruleId, data) {


}


function getDataFileNameIncludingRule(ruleId) {
 //separate the segments
 let segments = ruleId.split("-",4);

 //make them UpperCamelCase in one string
 let end = segments
  .map(seg => {
  return (seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase())
 })
 .reduce((first, next) => first + next);

 //return filename
 return "JSONVinayaSegmentInstances" + end;
}


console.log(getRuleMetaDataQuery("lzh-mu-bi-pm-pc79"));