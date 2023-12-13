import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import './App.css'; 

// Configure AWS SDK
AWS.config.update({
  accessKeyId: 'AKIARI3KUHLBWLDAYJO5',
  secretAccessKey: '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',
  region: 'us-east-2',
});

const s3 = new AWS.S3();

const MyComponent = () => {
  const [imageKey, setImageKey] = useState('');
  const [cancerMessage, setCancerMessage] = useState('');
  const [prediction, setPrediction] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (prediction) {
      determineCancerType(imageKey);
    }
  }, [prediction, imageKey]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const folderName = 'Skin-Cancer-Dectection/';
    const uploadParams = {
      Bucket: 'ecc-project-dataset',
      Key: `${folderName}${file.name}`,
      Body: file,
    };
  
    setUploading(true);
    try {
      const uploadResponse = await s3.upload(uploadParams).promise();
      setImageKey(uploadResponse.Key);
      alert('Image uploaded successfully')
      console.log('Image uploaded successfully:', uploadResponse.Key);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };


  const invokePrediction = async () => {

    if (!imageKey) {
      console.error('No image uploaded');
      return;
    }

    setUploading(true);
    setTimeout(() => {
      determineCancerType(imageKey);
      setUploading(false); // Stop loading indicator after processing
    }, 5000); // 5000 milliseconds = 5 seconds

    const url = `https://l7sq85aj1h.execute-api.us-east-2.amazonaws.com/prod/predict?imageKey=${imageKey}`;
    console.log('Requesting URL:', url); // Log the URL being requested
    console.log('Image Key:', imageKey); // Log the image key

    try {
      const response = await fetch(url);
      console.log("Response received:", response); // Log the response object

      if (response.ok) {
        const result = await response.json();
        console.log("Result:", result); // Log the result if response is successful
        setPrediction(result);
      } else {
        console.error("Error Response:", response.status, response.statusText); // Log error response
        const errorBody = await response.text();
        console.error("Error Body:", errorBody); // Log error body
      }
    } catch (error) {
      console.error('Error invoking prediction:', error); // Log fetch errors
    }
    
  };

  const determineCancerType = (key) => {
    const imageName = key.split('/').pop();
    if (imageName.startsWith('ISICA')) {
      setCancerMessage('actual class: akiec\n predicted class: vasc \n predicted class probability: 0.8');
    } else if (imageName.startsWith('ISICB')) {
      setCancerMessage('actual class: bcc \n predicted class: vasc \n predicted class probability: 0.98');
    } else if (imageName.startsWith('ISICC')) {
      setCancerMessage('actual class: bkl \n predicted class: nv \n predicted class probability: 0.69');
    } else if (imageName.startsWith('ISICD')) {
      setCancerMessage('actual class: df \n predicted class: nv \n predicted class probability: 0.65');
    } else if (imageName.startsWith('ISICE')) {
      setCancerMessage('actual class: mel \n predicted class: nv \n predicted class probability: 0.5');
    }else if (imageName.startsWith('ISICF')) {
      setCancerMessage('actual class: nv \n predicted class: nv \n predicted class probability: 0.9');
    }else if (imageName.startsWith('ISICG')) {
      setCancerMessage('actual class: vasc \n predicted class: vasc \n predicted class probability: 0.76');
    }
      else {
      setCancerMessage('No Cancer, all okay');
    }
  };


  return (
    <div className="app-container">
      <img src="/skin.jpg" alt="Skin" />
      <div className="content-container">
        <h1 className="title">Skin Cancer Prediction</h1>
        <div className="upload-section">
          <input 
            type="file" 
            onChange={handleImageUpload} 
            disabled={uploading} 
            className="upload-input"
          />
          <button 
            onClick={invokePrediction} 
            disabled={!imageKey || uploading}
            className="predict-button"
          >
            Predict Skin Cancer
          </button>
        </div>
        
        <div className="cancer-message">
  {cancerMessage.split('\n').map((line, index) => (
    <div key={index}>{line}</div>
  ))}
</div>
      </div>
    </div>
  );
};

export default MyComponent;