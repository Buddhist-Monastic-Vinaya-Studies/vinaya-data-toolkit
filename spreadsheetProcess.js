/**
 * @NotOnlyCurrentDoc
 */
function concatSelectedLines() {
  var spreadsheet = SpreadsheetApp.getActive();
  var rangeContent = spreadsheet.getSelection().getActiveRange().getValues();
  var curCell = spreadsheet.getCurrentCell();
  var rowNum = curCell.getRow();
  var curVal = curCell.getValue();

  var len = rangeContent.length;

  for(var i=2;i<len;i=i+2) {
    curVal = curVal + " " + rangeContent[i][0];
  }

  curCell.setValue(curVal);
  spreadsheet.deleteRows(rowNum+1,len-1);
}

function constructMergedRuleDataForWebApp() {
  var spreadsheet = SpreadsheetApp.getActive();
  var paliSheetContent = spreadsheet.getSheetByName("pli-tv-bu-pm_root-pli-ms").getDataRange().getValues();
  var enSheetContent = spreadsheet.getSheetByName("pli-tv-bu-pm/en/brahmali").getDataRange().getValues();
  var deSheetContent = spreadsheet.getSheetByName("pli-tv-bu-pm/de/nanadassana").getDataRange().getValues();
  var esSheetContent = spreadsheet.getSheetByName("pli-tv-bu-pm/es/chandako").getDataRange().getValues();
  var textJSONArray = [];

  var idPrefix = '{"id": "' + paliSheetContent[0][1];
  var idPostfix = '",';
  var aboutPrefix = '"about": {"' + paliSheetContent[1][1] + '": "' + paliSheetContent[1][2] + '",';
    aboutPrefix = aboutPrefix + '"' + paliSheetContent[2][1] + '": "' + paliSheetContent[2][2] + '",';
    aboutPrefix = aboutPrefix + '"' + paliSheetContent[3][1] + '": "';
  var aboutPostfix = '"},';
  var inLanguage = '"inLanguage": "' + paliSheetContent[4][1] + '",';
  var isPartOf = '"isPartOf": "' + paliSheetContent[5][1] + '",';
  var textPrefix = '"text": "';
  var textPostfix = '",';
  var labelPrefix = '"label": "Paḷī Theravāda Bhikkhu ';
  var labelPostfix = '",';

  var curDataRowNum = locateStartOfData(paliSheetContent);

  var translationsPrefix = '"translations": [{';
  var translationsPostfix = ']}';

  var deIdPrefix = '"id": "' + deSheetContent[0][1];
  var enIdPrefix = '"id": "' + enSheetContent[0][1];
  var esIdPrefix = '"id": "' + esSheetContent[0][1];
  var deIdPostfix = deSheetContent[0][2] + '",';
  var enIdPostfix = enSheetContent[0][2] + '",';
  var esIdPostfix = esSheetContent[0][2] + '",';
  var deTranslator = '"translator"; "' + deSheetContent[1][1] + '",';
  var enTranslator = '"translator"; "' + enSheetContent[1][1] + '",';
  var esTranslator = '"translator"; "' + esSheetContent[1][1] + '",';
  var deInLanguage = '"inLanguage": "' + deSheetContent[2][1] + '",';
  var enInLanguage = '"inLanguage": "' + enSheetContent[2][1] + '",';
  var esInLanguage = '"inLanguage": "' + esSheetContent[2][1] + '",';
  var deTextPrefix = '"text": "';
  var enTextPrefix = '"text": "';
  var esTextPrefix = '"text": "';  
  var deTextPostfix = '"}, {';
  var enTextPostfix = '"}, {';
  var esTextPostfix = '"}';
  
  varTransCurDataRowNum = locateStartOfData(deSheetContent);

  // extract patimokkha data
  const patimokkhaData = paliSheetContent.slice(curDataRowNum);
  const dePatimokkhaData = deSheetContent.slice(varTransCurDataRowNum);
  const enPatimokkhaData = enSheetContent.slice(varTransCurDataRowNum);
  const esPatimokkhaData = esSheetContent.slice(varTransCurDataRowNum);

  var curData;
  var JSONData = "";

  for (i=0;i<patimokkhaData.length;i = i+4) {
   if (i>0) JSONData += ", ";
   //split out metadata
    curData = patimokkhaData[i][0];
    locPeriod = curData.indexOf(".");
    locNumber = curData.indexOf(" ",locPeriod-5);
    offenseClass = curData.substring(0,locNumber);
    offenseNumber = curData.substring(locNumber+1,locPeriod);
    ruleName = curData.substring(locPeriod+2);
    label = curData.substring(0,locPeriod);
    offenseClassAbbreviation = getOffenseClassAbbreviation(offenseClass);
    //offenseClassSimplified = getOffenseClassSimplified(offenseClass);
    ruleText = patimokkhaData[i+2][0];
    deText = dePatimokkhaData[i+2][0];
    enText = enPatimokkhaData[i+2][0];
    esText = esPatimokkhaData[i+2][0];

    JSONData += idPrefix + offenseClassAbbreviation + offenseNumber + idPostfix;
    JSONData += aboutPrefix + offenseClass + aboutPostfix;
    JSONData += inLanguage;
    JSONData += isPartOf;
    JSONData += textPrefix + ruleText + textPostfix;
    JSONData += translationsPrefix;
    JSONData += deIdPrefix + offenseClassAbbreviation + offenseNumber + deIdPostfix;
    JSONData += deTranslator;
    JSONData += deInLanguage;
    JSONData += deTextPrefix + deText + deTextPostfix;
    JSONData += enIdPrefix + offenseClassAbbreviation + offenseNumber + enIdPostfix;
    JSONData += enTranslator;
    JSONData += enInLanguage;
    JSONData += enTextPrefix + enText + enTextPostfix;
    JSONData += esIdPrefix + offenseClassAbbreviation + offenseNumber + esIdPostfix;
    JSONData += esTranslator;
    JSONData += esInLanguage;
    JSONData += esTextPrefix + esText + esTextPostfix;
    JSONData += translationsPostfix;
   
    textJSONArray.push(textJSON);
  } // end for loop

  var jsonObject = textJSONArray.toString();
 
  createDocWithJSONContent("PliTvBuPm.json",jsonObject, "159kJwe3w4y8lM1cxD-6V6kjytH2y-Kak");
  
}

/***
 * 
 */
function constructJSONforPatimokkhaRuleInstances() {
/*** example output
 * { 
 * "@id" : "pli-tv-pm:PatimokkhaRule_pli-tv-bi-pm-pc101", 
 * "@type" : "http://samanasara.org/ontology/VinayaStudiesOntology#PatimokkhaRule", 
 * "label" : "Bhikkhunī Pācittiya 101" 
 * },
 */
/*** spreadsheet looks like
 0 PatimokkhaRule	  id	      type	      label ...
 1 pre	            "@id" : "pli-tv-pm:PatimokkhaRule_pli-tv-bu-pm-	"@type" : "http://samanasara.org/ontology/VinayaStudiesOntology#PatimokkhaRule", 	"label" : "Paḷī Text Bhikkhu 
 2 post	            ", 		"
 3 content	        pj1		  Pārājika 1
 4 VinayaSegment	  id	    type	        about ... 
 5 pre	            "@id" : "pli-tv-pm:VinayaSegment_pli-tv-bu-pm-	"@type" : "http://samanasara.org/ontology/VinayaStudiesOntology#VinayaSegment", 	"about" : [ "http://samanasara.org/VinayaCore#VinayaOffenseClass_
 6 post	            ", 		", "http://samanasara.org/VinayaCore#VinayaTradition_PaliTextTheravada" ], 
 7 content	        pj1		Parajika
 8 DATA			
 9 Pārājika 1. Methunadhamma			
10			
11 Yo pana bhikkhu bhikkhūnaṁ sikkhāsājīvasamāpanno sikkhaṁ appaccakkhāya dubbalyaṁ anāvikatvā methunaṁ dhammaṁ paṭiseveyya, antamaso tiracchānagatāyapi, pārājiko hoti asaṁvāso.			
12			
13 Pārājika 2. Adinnādāna			
14		
15 Yo pana bhikkhu gāmā vā araññā vā adinnaṁ theyyasaṅkhātaṁ ādiyeyya, yathārūpe adinnādāne rājāno coraṁ gahetvā haneyyuṁ vā bandheyyuṁ vā pabbājeyyuṁ vā corosi bālosi mūḷhosi thenosīti, tathārūpaṁ bhikkhu adinnaṁ ādiyamāno ayampi pārājiko hoti asaṁvāso.			
16		
17 Pārājika 3. Manussaviggaha			
 */
  var spreadsheet = SpreadsheetApp.getActive();
  var spreadsheetContent = spreadsheet.getDataRange().getValues();
  
  // first row of patimokkha data
  var curDataRowNum = locateStartOfData(spreadsheetContent);
  // extract patimokkha data
  const patimokkhaData = spreadsheetContent.slice(curDataRowNum);
  
  // number of Classes
  var classCount = Math.floor(curDataRowNum / 4);
  var i;
  for (i = 1; i <= classCount; i++) {
    // get the codePieces to construct the JSON content
    var codePieces = getCodePieces(spreadsheetContent,4*(i-1));
    switch (codePieces[0][0]) {
      case "PatimokkhaRule" : 
        constructJSONPatimokkhaRule(codePieces,patimokkhaData);
        break;
      case "VinayaSegment" : 
        constructJSONVinayaSegment(codePieces,patimokkhaData);
        break;
    }
  } 
}

/*** example output
 {
    "@id" : "pli-tv-pm:VinayaSegment_pli-tv-bi-pm-np25",
    "@type" : "http://samanasara.org/ontology/VinayaStudiesOntology#VinayaSegment",
    "about" : [ "http://samanasara.org/VinayaCore#VinayaTradition_PaliTextTheravada", "http://samanasara.org/VinayaCore#VinayaOffenseClass_NissaggiyaPacittiya" ],
    "inLanguage" : "pli",
    "isPartOf" : "http://samanasara.org/VinayaCore#VinayaText_Mahāsaṅgīti_Tipiṭaka_Buddhavasse_2500",
    "mainEntity" : "pli-tv-pm:PatimokkhaRule_pli-tv-bi-pm-np25", 
    "name" : "Bhesajjasikkhāpadaṁ",
    "text" : "Yāni kho pana tāni gilānānaṁ bhikkhunīnaṁ paṭisāyanīyāni bhesajjāni, seyyathidaṁ: sappi navanītaṁ telaṁ madhu phāṇitaṁ, tāni paṭiggahetvā sattāhaparamaṁ sannidhikārakaṁ paribhuñjitabbāni. Taṁ atikkāmentiyā, nissaggiyaṁ pācittiyaṁ.",
    "label" : "Paḷī Text Bhikkhunī Nissaggiya Pācittiya 25"
  },
 */
function constructJSONVinayaSegment(codePieces, patimokkhaData) {
  var textJSONArray = [];
  var textJSON;
  var jsonObject;
  var offenseClass;
  var offenseClassAbbreviation;
  var offenseNumber;
  var offenseClassSimplified;
  var ruleText;
  var ruleName;
  var label;
  var locPeriod;
  var locNumber;
  var curData;
 
  var i;
  // iterate over all lines in the data
  for (i=0;i<patimokkhaData.length;i = i+4) {
    
    //split out metadata
    curData = patimokkhaData[i][0];
    locPeriod = curData.indexOf(".");
    locNumber = curData.indexOf(" ",locPeriod-5);
    offenseClass = curData.substring(0,locNumber);
    offenseNumber = curData.substring(locNumber+1,locPeriod);
    ruleName = curData.substring(locPeriod+2);
    label = curData.substring(0,locPeriod);
    offenseClassAbbreviation = getOffenseClassAbbreviation(offenseClass);
    offenseClassSimplified = getOffenseClassSimplified(offenseClass);
    ruleText = patimokkhaData[i+2][0];
      // @id, @type, about, inLanguage, isPartOf, mainEntitiy, name, text, label
    textJSON = "{ " + codePieces[1][1] + offenseClassAbbreviation + offenseNumber + codePieces[2][1] + codePieces[1][2] + codePieces[1][3] + offenseClassSimplified + codePieces[2][3] + codePieces[1][4] + codePieces[1][5] + codePieces[1][6] + offenseClassAbbreviation + offenseNumber + codePieces[2][6] + codePieces[1][7] + ruleName + codePieces[2][7] + codePieces[1][8] + ruleText + codePieces[2][8] + codePieces[1][9] + label + codePieces[2][9] + " }";

    textJSONArray.push(textJSON);
  } // end for loop
  jsonObject = textJSONArray.toString();
 
  createDocWithJSONContent("JSONVinayaSegmentInstancesPliTvBuPm",jsonObject, "159kJwe3w4y8lM1cxD-6V6kjytH2y-Kak");
}

function constructJSONPatimokkhaRule(codePieces, patimokkhaData) {
  var textJSONArray = [];
  var textJSON;
  var jsonObject;
  var offenseClass;
  var offenseClassAbbreviation;
  var offenseNumber;
  var comment;
  var label;
  var locPeriod;
  var locNumber;
  var curData;
  var i;
  // iterate over all lines in the data
  for (i=0;i<patimokkhaData.length;i = i+4) {
    
    //split out metadata
    curData = patimokkhaData[i][0];
    locPeriod = curData.indexOf(".");
    locNumber = curData.indexOf(" ",locPeriod-5);
    offenseClass = curData.substring(0,locNumber);
    offenseNumber = curData.substring(locNumber+1,locPeriod);
    label = curData.substring(0,locPeriod);
    offenseClassAbbreviation = getOffenseClassAbbreviation(offenseClass);

    textJSON = "{ " + codePieces[1][1] + offenseClassAbbreviation + offenseNumber + codePieces[2][1] + codePieces[1][2] + codePieces[1][3] +  label + codePieces[2][3] + " }";

    textJSONArray.push(textJSON);
  } // end for loop
  jsonObject = textJSONArray.toString();
 
  createDocWithJSONContent("JSONPatimokkhaRuleInstancesPliTvBuPm",jsonObject, "159kJwe3w4y8lM1cxD-6V6kjytH2y-Kak");
}

function getOffenseClassAbbreviation(offenseClass) {
  var abbrev;
  switch (offenseClass) {
    case "Adhikaraṇasamatha" : abbrev = "as"; break;
    case "Nissaggiya pācittiya" : abbrev =  "np"; break;
    case "Pācittiya" : abbrev =  "pc"; break;
    case "Pārājika" : abbrev =  "pj"; break;
    case "Pāṭidesanīya" : abbrev =  "pd"; break;
    case "Saṅghādisesa" : abbrev =  "ss"; break;
    case "Sekhiya" : abbrev =  "sk"; break;
  }
  return abbrev;
}

function getOffenseClassSimplified(offenseClass) {
  var simp;
  switch (offenseClass) {
    case "Adhikaraṇasamatha" : simp = "Adhikaranasamatha"; break;
    case "Nissaggiya pācittiya" : simp =  "NissaggiyaPacittiya"; break;
    case "Pācittiya" : simp =  "Pacittiya"; break;
    case "Pārājika" : simp =  "Parajika"; break;
    case "Pāṭidesanīya" : simp =  "Patidesaniya"; break;
    case "Saṅghādisesa" : simp =  "Sanghadisesa"; break;
    case "Sekhiya" : simp =  "Sekhiya"; break;
  }
  return simp;
}

function getCodePieces(spreadsheetContent,startRow) {
  const codePieces = spreadsheetContent.slice(startRow,startRow + 4);
  return codePieces;
}

function locateStartOfData(spreadsheetContent) {
  var testStr;
  var i = 0;
  // locate row of the DATA header
  while (spreadsheetContent[i][0] != "DATA") i++;

  // return row number where data starts
  return i + 1;
  
}

function createDocWithJSONContent(docName, content, folderId) {
  var doc = DriveApp.getFolderById(folderId).createFile(docName,content);
}
 




