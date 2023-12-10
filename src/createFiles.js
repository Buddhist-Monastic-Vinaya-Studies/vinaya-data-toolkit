import fs from 'fs';

 export default function createDataFile(directoryName, fileName, content) {
 let filePath = './data/' + directoryName + '/' + fileName + '.json';
 console.log(filePath);
  fs.writeFile(filePath, JSON.stringify(content), function(err) {
      if (err) {
          console.log(err);
      }
  });
}

//createDataFile('relationship','test','hi world');

