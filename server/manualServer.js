const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

// Google Cloud Storage setup
const gc = new Storage({
    keyFilename: path.join(__dirname, "./munn-ai-1e8d70e12cce.json"),
    projectId: "munn-ai" 
  });
  
  // Define your GCS bucket name
  const bucketName = 'bucket-quickstart_munn-ai';

let fileName = 'metadata.jsonl'; 

async function uploadFile() {
  const bucket = gc.bucket(bucketName);
  const file = bucket.file(fileName);

  try {
    // Upload the file to Google Cloud Storage
    const fileContent = fs.readFileSync(fileName);

    // Upload the file content to Google Cloud Storage
    await file.save(fileContent);
    
    // Generate the public URL for the uploaded file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    console.log('File uploaded successfully. Public URL:', publicUrl);
  } catch (error) {
    console.error('Error uploading file to Google Cloud Storage:', error);
  }
}

// Call the upload function
uploadFile();