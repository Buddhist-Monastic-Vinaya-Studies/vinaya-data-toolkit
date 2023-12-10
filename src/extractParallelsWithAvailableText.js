// extractParallelsWithAvailableText.js
// creates file 'parallelsInAvailableText.json' in the data/relationship folder
// when new texts are added you will need to edit the regular expressions that filter to the current available texts for patimokkhas

import createDataFile from './createFiles.js';

//TO DO: Learn proper way to import json data
import parallels from "../data/relationship/parallels.json" assert { type: "json" };

// select only the parallels that contain patimokkha rules (i.e. those with pattern *-pm-* in them.)
let patimokkhaParallels = reduceParallelsToPatimokkhas(parallels);

function reduceParallelsToPatimokkhas(parallels) {
 // get just the parallels from the file not the mentions
  let fullParallels = parallels.filter((set) => {
    return (set.parallels);
  });
  let filtered = [];
  const reg = new RegExp(/[a-z-]*-pm-[a-z0-9-]*/);
  let i = fullParallels.length;
  while (i--) {
    if (reg.test(fullParallels[i].parallels)) {
        filtered.push(fullParallels[i]);
    }
  }
  return filtered;
}

// select only the patimokkha parallels that contain patimokkha rules in the available files
let reducedPatimokkhaParallels = reducePatimokkhaParallelsToAvailableTexts(patimokkhaParallels);

function reducePatimokkhaParallelsToAvailableTexts(patimokkhaParallels) {
  let filtered = [];
  const reg = new RegExp(/^lzh-dg|^lzh-ka|^lzh-mg|^lzh-mi|^lzh-mu|^lzh-sarv|^pli-tv/);
  const subReg = new RegExp(/(^~?lzh-dg|^~?lzh-ka|^~?lzh-mg|^~?lzh-mi|^~?lzh-mu|^~?lzh-sarv|^~?pli-tv).*-pm-[2apns]/);
  const notPartialReg = new RegExp(/^(?!~).+/);
  let i = patimokkhaParallels.length;
  while (i--) {
    if (reg.test(patimokkhaParallels[i].parallels)) {
        // console.log('currently filtered parallels: ');
        // console.log(patimokkhaParallels[i]);
        let subParallels = [];
        let curParallels = patimokkhaParallels[i].parallels;
        let j = 0;
        while (j<curParallels.length) {
          if (subReg.test(curParallels[j])) {
            subParallels.push(curParallels[j]);
          }
          j++;
        }
        // console.log('subParallels: ');
        // console.log(subParallels);
        if(notPartialReg.test(subParallels[0])) {
          let reducedElement = {};
          reducedElement.parallels = subParallels;
          filtered.push(reducedElement);
        }
        // console.log('reducedElement: ');
        // console.log(reducedElement);
    }
  }
  return filtered;
}

createDataFile('relationship','parallelsInAvailableText', reducedPatimokkhaParallels);

// -------------------------------------------------//
// 

// json files containing the root and translation texts for the patimokkhas

const mergedTextFiles = ['LzhDgBiPm.json',
'LzhDgBuPm.json',
'LzhDgBuPm2.json',
'LzhKaBuPm.json',
'LzhMgBiPm.json',
'LzhMgBuPm.json', 
'LzhMiBiPm.json',
'LzhMiBuPm.json',
'LzhMuBiPm.json',
'LzhMuBuPm.json',
'LzhSarvBiPm.json',
'LzhSarvBuPm.json',
'LzhSarvBuPm2.json',
'PliTvBiPm.json',
'PliTvBuPm.json'];