let dataFormat = {
 "id": "",
 "about": {
  "vinayaTradition": "",
  "offenseClass": ""},
  "inLanguage": "",
  "isPartOf": "",
  "text": "",
 "label": ""
};

const fileNames = ["JSONVinayaSegmentInstancesLzhDgBiPm.json","JSONVinayaSegmentInstancesLzhDgBuPm.json","JSONVinayaSegmentInstancesLzhDgBuPm2.json","JSONVinayaSegmentInstancesLzhKaBuPm.json","JSONVinayaSegmentInstancesLzhMgBiPm.json","JSONVinayaSegmentInstancesLzhMgBuPm.json","JSONVinayaSegmentInstancesLzhMiBiPm.json","JSONVinayaSegmentInstancesLzhMiBuPm.json","JSONVinayaSegmentInstancesLzhMuBiPm.json","JSONVinayaSegmentInstancesLzhMuBuPm.json","JSONVinayaSegmentInstancesLzhSarvBiPm.json","JSONVinayaSegmentInstancesLzhSarvBuPm.json","JSONVinayaSegmentInstancesLzhSarvBuPm2.json","JSONVinayaSegmentInstancesPliTvBiPm.json","JSONVinayaSegmentInstancesPliTvBuPm.json"];

function constructAboutElement(aboutList) {
  let locUnderScore = 0;
  let locPound = 0;
  let newKey = "";
  let newVal = "";
  let newObj = {};

  let about = aboutList.map(element => {
    locPound = element.indexOf("#");
    locUnderScore = element.indexOf("_");
    newKey = element.slice(locPound+1,locUnderScore);
    newVal = element.slice(locUnderScore+1);
    newObj = {};
    Object.assign(newObj, { [newKey]: newVal})
    return(newObj);
  });
  //console.log(about);
  return (JSON.stringify(about));
}

function getFile(directory, fileName) {

  return 
};

function createFile(fileName, content) {
  let fs = require('fs');
  //console.log(content);
  fs.writeFile(fileName, JSON.stringify(content), function(err) {
      if (err) {
          console.log(err);
      }
  });
}
//createFileContent parses the data from the ontology file into JSON format for the Vinaya Studies App
//parameter: data of an ontology file for a Patimokkha's Vinaya Segments
//returns: JSON format of data for Vinaya Studies App
function createFileContent(data) {

  let newData = data.map((element) => {
    //pull id out of element.@id
    let start = element['@id'].indexOf("_");
    let id = element['@id'].slice(start+1);
    //construct about element
    let about = constructAboutElement(element.about);
    //pull source out of element.isPartOf
    start = element.isPartOf.indexOf("_");
    let source = element.isPartOf.slice(start+1);
    var newElement = {id: id, about: about, inLanguage: element.inLanguage, isPartOf: source, text: element.text, label: element.label};
   // var newKey = "about";
  //  newElement[newKey] = about;
    return newElement;
  });
  //console.log(newData);
  return newData;
}

//createFiles function parses the content of the files into the JSON format for use in the Vinaya Studies App and puts it in new files with the base part of the RuleIds as the file name. ex: 'LzhDgBuPm.json'
//parameters: directory - which subdirectory within the data directory to find and place the files
//and fileNames - array of filenames
function createFiles(directory, fileNames) {
fileNames.forEach(element => {
  let fileName = './data/' + directory + '/' + element;
  let data = require(fileName);
  fileName = './data/' + directory + '/' + element.slice(element.indexOf("Instances")+9)

  createFile(fileName, createFileContent(data));
});
}

//test on one file
//createFiles("rootText", ["JSONVinayaSegmentInstancesLzhDgBuPm2.json"], dataFormat);
//create all files
createFiles("rootText", fileNames);

//In files afterwards, first beautify and then, for
// "about": "[{\"VinayaTradition\":\"Mūlasarvāstivāda\"},{\"VinayaOffenseClass\":\"Pacittiya\"}]",
// use replace
// "[{\  -> {
// \"},{\ -> ",
// \"}]" -> "}
// \ -> 
// "about": {"VinayaTradition":"Mūlasarvāstivāda","VinayaOffenseClass":"Pacittiya"},
