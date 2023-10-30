const fs = require('fs');

const filename = 'steve.jsonl';

// node vitalFieldsPlusGiveIdAsName.js


// transform jsonl => JSON
const parseJSONLFile = () => {
  const data = fs.readFileSync(filename, 'utf-8');
  const lines = data.split('\n');

  const jsonData = lines.map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      console.error(`Error parsing JSON at line ${index + 1}:`, error);
      return null;
    }
  });

  return jsonData.filter(item => item !== null);
};

const data = parseJSONLFile();

// Define the fields to retain
const fieldsToRetain = [
  'enqueue_time',
  'event.height',
  'event.width',
  'event.textPrompt',
  // 'event.seedImageURL',
  "image_paths",  // array of the 4 images generated
  'event.eventType',
  'full_command',
  'id',
  // 'prompt', // unneccessary duplicate
  'user_id',
  'username',
];

// Process the JSON data to extract the desired fields
const cleanedData = data.map((item) => {
  const cleanedItem = {};

  fieldsToRetain.forEach((field) => {
    const fieldParts = field.split('.');
    let source = item;

    fieldParts.forEach((part) => {
      if (source && source[part]) {
        source = source[part];
      } else {
        source = undefined;
      }
    });

    if (source !== undefined) {
      const fieldName = fieldParts[fieldParts.length - 1];
      cleanedItem[fieldName] = source;
    }
  });

  return cleanedItem;
});

// Get the ID from the first item (assuming all items have the same ID)
const id = cleanedData.length > 0 ? cleanedData[0].id : 'unknown';
// const username = cleanedData.length > 0 ? cleanedData[0].username : 'unknown';

// Convert the cleaned data back to JSON
const cleanedJsonData = JSON.stringify(cleanedData, null, 2);

// Save the cleaned data to a new file (e.g., cleanedData.json)
fs.writeFileSync(`${id}.json`, cleanedJsonData);

console.log('Cleaned data saved to cleanedData.json');














// // Google Cloud Storage setup
// const gc = new Storage({
//     keyFilename: path.join(__dirname, "./munn-ai-1e8d70e12cce.json"),
//     projectId: "munn-ai" 
//   });
  
//   // Define your GCS bucket name
//   const bucketName = 'bucket-quickstart_munn-ai';

// let fileName = 'metadata.jsonl'; 

// async function uploadFile() {
//   const bucket = gc.bucket(bucketName);
//   const file = bucket.file(fileName);

//   try {
//     // Upload the file to Google Cloud Storage
//     const fileContent = fs.readFileSync(fileName);

//     // Upload the file content to Google Cloud Storage
//     await file.save(fileContent);
    
//     // Generate the public URL for the uploaded file
//     const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
//     console.log('File uploaded successfully. Public URL:', publicUrl);
//   } catch (error) {
//     console.error('Error uploading file to Google Cloud Storage:', error);
//   }
// }

// Call the upload function
// uploadFile();