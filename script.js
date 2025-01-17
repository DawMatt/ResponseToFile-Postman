const express = require('express'),
  app = express(),
  fs = require('fs'),
  shell = require('shelljs'),

   // Modify the folder path in which responses need to be stored
  folderPath = './Responses/',
  defaultFileExtension = 'json', // Change the default file extension
  bodyParser = require('body-parser'),
  path = require('path');

// Create the folder path in case it doesn't exist
shell.mkdir('-p', folderPath);

 // Change the limits according to your response size
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 

app.get('/', (req, res) => res.send('Hello, I write data to file. Send them requests!'));

app.post('/write', (req, res) => {
  // Allow for request specific sub-folders to be created
  let requestFolderPath = folderPath;
  if (req.body.subFolder != null) {
    requestFolderPath = `${path.join(folderPath, req.body.subFolder)}`;

    // Create the folder path in case it doesn't exist
    shell.mkdir('-p', requestFolderPath);
  };

  let extension = req.body.fileExtension || defaultFileExtension;
  let filePath = `${path.join(requestFolderPath, req.body.requestName)}.${extension}`;

  fs.writeFile(filePath, req.body.responseData, (err) => {
    if (err) {
      console.log(err);
      res.send('Error');
    }
    else {
      res.send('Success');
    }
  });
});

app.listen(3000, () => {
  console.log('ResponsesToFile App is listening now! Send them requests my way!');
  console.log(`Data is being stored at location: ${path.join(process.cwd(), folderPath)}`);
});