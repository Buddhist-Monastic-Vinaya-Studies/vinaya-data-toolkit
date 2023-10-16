rootText = require('./data/rootText/PliTvBiPm.json');
translationEn = require('./data/translationText/JSONTranslationTextInstancesPliTvBiPm_en_thanissaro.json');
translationDe = require('./data/translationText/JSONTranslationTextInstancesPliTvBiPm_de_huesken-nanadassana.json');
translationId = require('./data/translationText/JSONTranslationTextInstancesPliTvBiPm_id_karniawan.json');

// merges tranaslations into the root Text file
function mergeRootAndTranslations() {
 //iterate through the rootText rules to add translations
 rootText.map(root => {
  let id = root.id;

  //returns true for the translation if it is for this id
  function isInTrans(trans) {
   let index = trans.mainEntity.indexOf(id);
   return index > -1;
  };

  function constructTranslationElements() {
   // construct German Translation
   let deTrans = translationDe.find(isInTrans);
   let deTransId = deTrans['@id'].substring(deTrans['@id'].indexOf("TranslationText_") + 16);
   let deTransText = deTrans.text;
   let deTransLang = deTrans.inLanguage;
   let deTransTranslators = deTrans.translator.map(person => person.substring(person.indexOf("Person_") + 7).replace("_", " "))
   let deTransObj = {
    id: deTransId,
    translator: deTransTranslators,
    inLanguage: deTransLang,
    text: deTransText
   };

   // construct English Translation
   let enTrans = translationEn.find(isInTrans);
   console.log(enTrans['@id']);
   let enTransId = enTrans['@id'].substring(enTrans['@id'].indexOf("TranslationText_") + 16);
   let enTransText = enTrans.text;
   let enTransLang = enTrans.inLanguage;
   let enTransTranslators = "";
   if (Array.isArray(enTrans)) {
    enTransTranslators = enTrans.translator.map(person => person.substring(person.indexOf("Person_") + 7).replace("_", " "));
   } else {
    enTransTranslators = enTrans.translator.substring(enTrans.translator.indexOf("Person_") + 7).replace("_", " ");
   };
   let enTransObj = {
    id: enTransId,
    translator: enTransTranslators,
    inLanguage: enTransLang,
    text: enTransText
   };

   // construct Indonisian Translation
   let idTrans = translationId.find(isInTrans);
   let idTransId = idTrans['@id'].substring(idTrans['@id'].indexOf("TranslationText_") + 16);
   let idTransText = idTrans.text;
   let idTransLang = idTrans.inLanguage;
   let idTransTranslators = "";
   if (Array.isArray(idTrans)) {
    idTransTranslators = idTrans.translator.map(person => person.substring(person.indexOf("Person_") + 7).replace("_", " "));
   } else {
    idTransTranslators = idTrans.translator.substring(idTrans.translator.indexOf("Person_") + 7).replace("_", " ");
   };
   let idTransObj = {
    id: idTransId,
    translator: idTransTranslators,
    inLanguage: idTransLang,
    text: idTransText
   };

   // create array of translations
   let translations = [deTransObj, enTransObj, idTransObj]
   return (translations);
  }

   root.translations = constructTranslationElements();
   //console.log(root);
   return root;
 });
}

function createFile(fileName, content) {
 let fs = require('fs');
 //console.log(content);
 fs.writeFile(fileName, JSON.stringify(content), function (err) {
  if (err) {
   console.log(err);
  }
 });
}

//TESTING - to find bug for TypeError: Cannot read properties of undefined (reading '@id')
 mergeRootAndTranslations();
// TESTING - mergeRoot... seems to die at pli-tv-pm:TranslationText_pli-tv-bi-pd2_en_thanissaro
// but if I comment out the mergeRoot... line the next lines run fine
translationEnPd = translationEn.find(obj => obj['@id'] === "pli-tv-pm:TranslationText_pli-tv-bi-pd1_en_thanissaro");
console.log(translationEnPd);
translationEnPd = translationEn.find(obj => obj['@id'] === "pli-tv-pm:TranslationText_pli-tv-bi-pd2_en_thanissaro");
console.log(translationEnPd);

//createFile('./data/mergedText/PliTvBiPm.json',mergeRootAndTranslations());