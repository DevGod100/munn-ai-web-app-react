import React, { useState } from 'react';

function MetadataUploadForm() {
  const [file, setFile] = useState(null);

  // Function to handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a metadata.json file.');
      return;
    }

    const formData = new FormData();
    formData.append('metadata', file);

    try {
      // Send the formData to your backend endpoint for processing
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Metadata uploaded successfully.');
      } else {
        alert('Failed to upload metadata.');
      }
    } catch (error) {
      console.error('Error uploading metadata:', error);
      alert('An error occurred while uploading metadata.');
    }
  };

  return (
    <div>
      <h2>Upload metadata.json</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="file"
            accept=".jsonl"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <button type="submit">Confirm</button>
        </div>
      </form>
    </div>
  );
}

export default MetadataUploadForm;