export const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMThiMzhjOC0yMDMwLTRiODUtYTZlMS05NDFkM2RjZTIyMTYiLCJlbWFpbCI6InJhbG9tYTE2ODFAZG93bmxvci5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjBjZDQwMDk3NWNmMjQ5YzZlY2UiLCJzY29wZWRLZXlTZWNyZXQiOiJkOGNmOGExNmFhMTNmZTM0OTdiMmRhMTkwNDFkMTZhNThjODNlMGM4NGQwMjA0MjdiNDIwYjJjMzY3MTUxNTk1IiwiZXhwIjoxNzY4NjU5Mzk0fQ.xO1JnBeBMLpCr-253maJE1_jI3t2mKpuJ2zOzOM79gM";
export const RPC_API_KEY = "0B9d9S5th5cr7IGb3tjSomBZVCw_4Zq1";

import axios from 'axios';

/**
 * Uploads a file to IPFS using Pinata
 * @param file - The file to upload
 * @returns The IPFS URL of the uploaded file
 */
export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const options = {
      pinataMetadata: {
        name: `PikaVault-${Date.now()}`,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    };
    
    formData.append('pinataOptions', JSON.stringify(options.pinataOptions));
    formData.append('pinataMetadata', JSON.stringify(options.pinataMetadata));

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`,
        'Content-Type': 'multipart/form-data',
      },
      maxBodyLength: Infinity, // needed for large files
    });

    if (response.status !== 200) {
      throw new Error(`Failed to upload to IPFS: ${response.statusText}`);
    }

    // Return the IPFS gateway URL
    return `https://ipfs.io/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
    }
    throw error;
  }
};

/**
 * Uploads multiple files to IPFS
 * @param files - Array of files to upload
 * @returns Array of IPFS URLs
 */
export const uploadMultipleToIPFS = async (files: File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadToIPFS(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

/**
 * Converts a base64 data URL to a File object
 * @param dataUrl - The data URL
 * @param filename - The filename to use
 * @returns A File object
 */
export const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

/**
 * Converts a blob URL to a File object
 * @param blobUrl - The blob URL
 * @param filename - The filename to use
 * @returns A Promise that resolves to a File object
 */
export const blobURLtoFile = async (blobUrl: string, filename: string): Promise<File> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}; 