const path = require("path");
const { Storage } = require("@google-cloud/storage");

// node manualGBucketUpload.js

// Google Cloud Storage setup
const gc = new Storage({
  keyFilename: path.join(__dirname, "./munn-ai-1e8d70e12cce.json"),
  projectId: "munn-ai",
});
// console.log(gc);

const bucketName = "bucket-quickstart_munn-ai"; // Corrected here, no need for gc.bucket() here
//this is where the code breaks... it does not continue further.
const bucket = gc.bucket(bucketName);
const fileName = "steve.jsonl";

// console.log({bucket, bucketName, fileName});


async function uploadFile() {

try {
    // Define the file path on your server
    const filePath = path.join(__dirname, fileName);
    // console.log(filePath);

    // Create a file object
    const file = bucket.file(fileName);
    // console.log(file);


        // Upload the file to Google Cloud Storage using the bucket's upload method
        const [fileUploadResponse] = await bucket.upload(filePath, {
          destination: fileName, // Specify the destination file name
        });
    

    // Generate the public URL for the uploaded file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    console.log(publicUrl);

    // Log success and the public URL
    console.log('File uploaded successfully. Public URL:', publicUrl);
  } catch (error) {
    console.error('Error uploading file to Google Cloud Storage:', error);
  }
}

uploadFile();





    // Upload the file to Google Cloud Storage
    // const [fileUploadResponse] = await file.upload(filePath);