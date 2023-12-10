import fs from 'fs';

const  bhikkuPM = JSON.parse(fs.readFileSync('./data/mergedText/PliTvBuPm.json', 'utf-8'));

const  bhikkuniPM = JSON.parse(fs.readFileSync('./data/mergedText/PliTvBiPm.json', 'utf-8'));

function getRuleNumberFromRuleId(ruleId) {
 let parts = ruleId.split("-");
 let len = parts.length;
 let num = parts[len-1].substring(2);
 return num;
};

let newData = bhikkuniPM.map(ruleData => {
 let lang = ruleData.inLanguage;
 let trad = ruleData.about.VinayaTradition;
 let order = ruleData.about.MonasticOrder;
 let offense = ruleData.about.VinayaOffenseClass;
 let num = getRuleNumberFromRuleId(ruleData.id);
 let label = lang + " " + trad + " " + order + " " + offense + " " + num;
 ruleData.label = label;
 return(JSON.stringify(ruleData));
})
fs.writeFileSync('./data/mergedText/PliTvBiPm2.json',newData.toString(), function (err) {
  if (err) throw err;
  console.log('Saved!');
});
