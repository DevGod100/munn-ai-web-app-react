const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');


const filename = 'steve.jsonl';

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

const gc = new Storage({
  keyFilename: path.join(__dirname, './munn-ai-1e8d70e12cce.json'),
  projectId: 'munn-ai',
});

const bucketName = 'your-own-bucket-name'; // Replace with your GCS bucket name

// Function to upload an image to your GCS bucket
async function uploadImage(imageURL, objectID) {
  const bucket = gc.bucket(bucketName);
  const imageName = `${objectID}.webp`; // Change the file extension if necessary

  try {
    // Download the image from the original URL (assuming it's publicly accessible)
    const imageResponse = await fetch(imageURL);

    if (imageResponse.ok) {
      const imageBuffer = await imageResponse.buffer();

      // Upload the image to your GCS bucket
      const imageFile = bucket.file(imageName);
      await imageFile.save(imageBuffer);

      // Generate the public URL for the uploaded image
      const imagePublicUrl = `https://storage.googleapis.com/${bucketName}/${imageName}`;
      console.log(`Successfully uploaded image for object ${objectID} to: ${imagePublicUrl}`);

      return imagePublicUrl;
    } else {
      console.error(`Failed to download image for object ${objectID}`);
      return null;
    }
  } catch (error) {
    console.error(`Error uploading image for object ${objectID} to GCS:`, error);
    return null;
  }
}

// Iterate over your cleaned JSON data to upload images and update the seedImageURL
const cleanedData = data.map((item) => {
  const imageURL = item['event.seedImageURL'];
  const objectID = item['id'];

  if (imageURL) {
    // Upload the image and update the seedImageURL
    const newImageURL = await uploadImage(imageURL, objectID);
    if (newImageURL) {
      item['event.seedImageURL'] = newImageURL;
    }
  }

  return item;
});

// Continue with your code to save the updated JSON data and upload it to GCS
const fieldsToRetain = [
  'enqueue_time',
  'event.height',
  'event.textPrompt',
  'event.seedImageURL',
  'event.eventType',
  'full_command',
  'id',
  'prompt',
  'user_id',
  'username',
];

const cleanedDataJSON = cleanedData.map((item) => {
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

const cleanedJsonData = JSON.stringify(cleanedDataJSON, null, 2);
const id = cleanedData.length > 0 ? cleanedData[0].id : 'unknown';
const outputFilename = `${id}.json`;

fs.writeFileSync(outputFilename, cleanedJsonData);
console.log(`Cleaned JSON saved to: ${outputFilename}`);