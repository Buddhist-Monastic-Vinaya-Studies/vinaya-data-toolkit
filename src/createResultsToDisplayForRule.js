// createResultsToDisplayForRule.js
import fs from 'fs';
const availableParallels = JSON.parse(fs.readFileSync('./data/relationship/parallelsInAvailableText.json', 'utf-8'));
//'LzhDgBiPm.json',
const mergedTextFiles = [
  'LzhMuBiPm.json',
  'LzhMuBuPm.json',
  'LzhSarvBiPm.json',
  'LzhSarvBuPm.json',
  'LzhSarvBuPm2.json',
  'PliTvBiPm.json',
  'PliTvBuPm.json',
  'LzhDgBuPm.json',
  'LzhDgBiPm.json',
  'LzhDgBuPm2.json',
  'LzhKaBuPm.json',
  'LzhMgBiPm.json',
  'LzhMgBuPm.json',
  'LzhMiBiPm.json',
  'LzhMiBuPm.json'
];

let dataArray = createDataArray(mergedTextFiles);
console.log(dataArray.length);

// THIS IS IT - FOR EVERY RULE IN ANY OF THE AVAILABLE TEXTS (currently 4210 rules), CONSTRUCT THE PARALLEL RULES DATA AND WRITE TO A SEPARATE FILE FOR EACH RULE.  THESE WILL GO INTO THE QUERYRESULTS FOLDER
// dataArray.forEach(rule => {
//   console.log(rule.id);
//   writeResultsToQueryResultsFile(rule.id, createResultsToDisplayForRule(rule.id, dataArray));
// });

function createDataArray(fileNameArray) {
  let dataArray = [];
  fileNameArray.forEach(fName => {
    let fileName = "./data/mergedText/" + fName;

    let fileData = fs.readFileSync(fileName, "utf8", (err, data) => {
      if (err) {
        console.log('oh no!');
        console.error(err);
        return;
      };
      return (data);
    });
    JSON.parse(fileData).forEach(rule => {
      dataArray.push(rule);
    })
  });
  return (dataArray);
};

//TESTING
// rule with lots of bells and whistles pli-tv-bu-pm-pj4
//writeResultsToQueryResultsFile('pli-tv-bu-pm-pj4',createResultsToDisplayForRule('pli-tv-bu-pm-pj4', dataArray));

// writeResultsToQueryResultsFile('lzh-sarv-bu-pm-2-pd1',createResultsToDisplayForRule('lzh-sarv-bu-pm-2-pd1', dataArray));


// rule with only full parallels lzh-sarv-bu-pm-ss12
//console.log(JSON.stringify(createResultsToDisplayForRule('lzh-sarv-bu-pm-ss12', dataArray)));

// rule with only partial parallels lzh-dg-bi-pm-np20
//writeResultsToQueryResultsFile('lzh-dg-bi-pm-np20',createResultsToDisplayForRule('lzh-dg-bi-pm-np20', dataArray));

// first rule with only one full parallel
// second rule with only one full parallel lzh-mi-bi-pm-pc90
// rule with no parallels in availableText lzh-mi-bi-pm-pc131

// rule with both full and partial parallels lzh-mu-bi-pm-pc79
//writeResultsToQueryResultsFile('lzh-mu-bi-pm-pc79',createResultsToDisplayForRule('lzh-mu-bi-pm-pc79', dataArray));

//Doesn't have any parallels
createResultsToDisplayForRule('lzh-dg-bu-pm-as1', dataArray);
//------------------------------

// last updated: 09/12/2023 (dd/mm/yyyy) by: Ayya Niyyānika - initial creation

// parameter: ruleId for which to construct Base, FullParallels and PartialParallels 
// example: "lzh-dg-bu-pm-pj1"
// returns: result JSON object
function createResultsToDisplayForRule(ruleId, dataArray) {
  let ruleData = JSON.parse(getRuleDataFromDataArray(ruleId, dataArray));

  let results = {};
  let base = {};
  base.baseRuleHeader = constructBaseRuleHeader(ruleData);
  base.baseRule = constructBaseRule(ruleData);

  if ('translations' in ruleData) {
    let translations = constructTranslations(ruleData);
    base.translations = translations;
  }
  console.log(base);
  let parallelsMatches = availableParallels.find(element => {
    return element.parallels.includes(ruleId)
  });
  console.log("constructing parallels from: ");
  console.log(parallelsMatches);
  if (parallelsMatches) {
    let fullParallels = constructFullParallelsGroup(parallelsMatches, ruleId, dataArray);
    let partialParallels = constructPartialParallelsGroup(parallelsMatches, ruleId, dataArray);

    results.base = base;
    if (fullParallels.length > 0) {
      results.fullParallels = fullParallels;
    }
    if (partialParallels.length > 0) {
      results.partialParallels = partialParallels;
    }
    return results;
  }
};
// parameter: ruleId to find 
// example: "lzh-dg-bu-pm-pj1"
// returns: JSON object for the rule
// parameter: DataArray to search
function getRuleDataFromDataArray(ruleId, dataArray) {
  //console.log(ruleId);
  let ruleData = dataArray.find((item) => item.id === ruleId);
  if(ruleData === undefined) {
    console.log("NO DATA! for: ");
    console.log(ruleId);
    return "{}";
  };
  return JSON.stringify(ruleData);
};


// parameter: ruleId to find in the MergedText files
// example: "lzh-dg-bu-pm-pj1"
// returns: JSON object for the rule
function getRuleData(ruleId) {
  let fileName = determineFileName(ruleId);
  fileName = "./data/mergedText/" + fileName;

  let fileData = fs.readFileSync(fileName, "utf8", (err, data) => {
    if (err) {
      console.log('oh no!');
      console.error(err);
      return;
    };
    return (data);
  });

  let dataArray = JSON.parse(fileData);

  let ruleData = dataArray.find((item) => {
    if (item.id === ruleId) {
      return item;
    }
  });
  return ruleData;
};

//parameter: ruleId of a rule in the file that will be named
// example: "lzh-dg-bu-pm-pj1"
//returns: name of file
// example: LzhDgBuPm.json"
function determineFileName(ruleId) {
  let lang = "";
  let parts = ruleId.split("-", 5).map(element => {
    if (element[0].substring(0, 1) === "~") {
      lang = element[0].substring(1);
    } else {
      lang = element[0];
    }
    let camel = (lang.toUpperCase() + element.slice(1).toLowerCase());
    return camel;
  });
  let fileName = parts[0] + parts[1] + parts[2] + parts[3];

  if (parts[4] === "2")
    fileName += "2.json";
  else
    fileName += ".json";
  return fileName;
};


//parameter: ruleData JSON object from which to construct baseRuleHeader
//returns: baseRuleHeader JSON object
// example: 
//  baseRuleHeader: {
//    sourceText: "Taishō",
//    label: "Sarvāstivāda Bhikkhunī Pācittiya 79"
//  }
function constructBaseRuleHeader(ruleData) {

  let baseRuleHeader = {};
  baseRuleHeader["sourceText"] = ruleData.isPartOf;
  baseRuleHeader.label = ruleData.label;
  return baseRuleHeader;
};

//parameter: ruleData JSON from which to construct baseRule
//returns: baseRule JSON object
// example: 
//  baseRule: {
//    id: 'lzh-sarv-bi-pm-pc79',
//    name: 'Harituccārachaḍḍana',
//    nameDe: 'Stuhl auf Pflanzen entsorgen',
//    nameEn: 'Disposing Feces on Plants',
//    inLanguage: 'lzh', 
//    trad: 'Sarvāstivāda', 
//    ofClass: 'Pācittiya', 
//    rulNum: '79',
//    sourceText: 'Taishō',
//    text: '若比丘尼。棄屎尿著生草上。波夜提。',
//    label: 'Sarvāstivāda Bhikkhunī Pācittiya 79'
//  }
function constructBaseRule(ruleData) {

  let baseRule = {};
  baseRule.id = ruleData.id;
  // TO DO ADD name files data baseRule.name = ;
  baseRule.inLanguage = ruleData.inLanguage;
  baseRule.tradition = ruleData.about.VinayaTradition;
  baseRule.vinayaOffenseClass = ruleData.about.VinayaOffenseClass;
  let ruleNumber = ruleData.id.split('-').pop().slice(2);
  baseRule.ruleNumber = ruleNumber;
  baseRule.sourceText = ruleData.isPartOf;
  baseRule.text = ruleData.text;
  baseRule.label = ruleData.label;
  return baseRule;
};


//parameter: ruleId for which to construct metaTags
//returns: metaTags JSON object
function constructMetaTags(ruleId) {
  // example:
  // metaTags: {
  //   subject: ['feces','plants'],
  //   tags: ['Chinese', 'Sarvāstivāda', 'bhikkhunī','pācittiya', 'Disposing Feces on Plants']
  // }
}

//parameters: groupName for the group of rules, suchas fullParallels or partialParallels,
// ruleId for which to lookup parallel rules that belong in the group
//returns: array of JSON object with the groupName name
// example:
// fullParallels: [...
function constructFullParallelsGroup(rulesData, ruleId, dataArray) {
  let parallels = [];
  let rules = rulesData.parallels.forEach(element => {
    if (element != ruleId && element.substring(0, 1) != "~") {
      parallels.push(constructParallel(element, dataArray))
    }
  });
  return (parallels);
}

function constructPartialParallelsGroup(rulesData, ruleId, dataArray) {

  let parallels = [];
  let rules = rulesData.parallels.forEach(element => {
    if (element.substring(0, 1) === "~") {
      parallels.push(constructParallel(element.substring(1), dataArray))
    }
  });
  return (parallels);
}

//parameter: ruleId for which to construct JSON object
//returns: JSON object containing the rule and translations
function constructParallel(ruleId, dataArray) {
  //example:
  // {
  //    id: 'pli-tv-bi-pm-pc9',
  //    name: 'Harituccārachaḍḍana',
  //    nameDe: 'Stuhl auf Pflanzen entsorgen',
  //    nameEn: 'Disposing Feces on Plants',
  //    trad: 'Theravāda', 
  //    ofClass: 'Pācittiya',
  //    rulNum: '9',
  //    inLanguage: 'pli',
  //    sourceText: 'Mahāsaṅgīti_Tipiṭaka_Buddhavasse_2500',
  //    text: 'Yā pana bhikkhunī uccāraṁ vā passāvaṁ vā saṅkāraṁ vā vighāsaṁ vā harite chaḍḍeyya vā chaḍḍāpeyya vā, pācittiyaṁ.',
  //    label: 'Paḷī Text Bhikkhunī Pācittiya 9',
  //    summary: 'A nun who disposes of feces, urine, or rubbish on cultivated plants must confess the offense.',
  //    translations: [...
  let ruleData = JSON.parse(getRuleDataFromDataArray(ruleId, dataArray));
  console.log('ruleData for: ');
  console.log(ruleData.id);
  if (ruleData) {
    let parallelRule = {};
    parallelRule.id = ruleData.id;
    // TO DO ADD name files data baseRule.name = ;
    parallelRule.inLanguage = ruleData.inLanguage;
    parallelRule.tradition = ruleData.about.VinayaTradition;
    parallelRule.vinayaOffenseClass = ruleData.about.VinayaOffenseClass;
    let ruleNumber = ruleData.id.split('-').pop().slice(2);
    parallelRule.ruleNumber = ruleNumber;
    parallelRule.sourceText = ruleData.isPartOf;
    parallelRule.text = ruleData.text;
    parallelRule.label = ruleData.label;
    if ('translations' in ruleData) {
      let translations = constructTranslations(ruleData);
      parallelRule.translations = translations;
    }
    return parallelRule;
  } else {
    return undefined;
  }
};

//parameter: ruleData from which to construct translations
//returns: array of translations JSON object
function constructTranslations(ruleData) {
  let translations = [];
  let i = 0;
  ruleData.translations.forEach(translationData => {
    //let translation = {};
    // translation.id = translationData.id;
    // translation.translator = translationData.translator;
    // translation.inLanguage = translationData.inLanguage;
    // translation.text = translationData.text;
    // translations.push(translation);
    var id = translationData.id;
    var translator = translationData.translator;
    var inLanguage = translationData.inLanguage;
    var text = translationData.text;
    translations.push({
      id,
      translator,
      inLanguage,
      text
    });
  })
  return translations;
};

//parameter: ruleId of a translation
//returns: translation JSON object
function constructTranslation(ruleId) {
  // example:
  // {
  //       id: 'pli-tv-bi-pc9_de_huesken-nanadassana',
  //       translator: ['Ute Husken','Bhikkhu Nanadassana'],
  //       inLanguage: 'de',
  //       text: 'Welche Nonne aber Fäkalien, Urin, Abfall oder Essensreste auf ein Feld wirft, muß dafür sühnen.'
  //     }
};

function writeResultsToQueryResultsFile(ruleId, resultsData) {
  let fileName = "./data/queryResults/" + ruleId + ".json";
  let fileContent = "[" + JSON.stringify(resultsData) + "]";

  fs.writeFileSync(fileName, fileContent, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
};

export default createResultsToDisplayForRule;