const https = require("https");
const { Buffer } = require("buffer");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const { firebaseConfig } = require("../../firebase");

const { initializeApp } = require("firebase/app");
initializeApp(firebaseConfig);

const storage = getStorage();

/**
 *
 * @param {*} fileName
 * @param {*} fileBuffer
 * @returns uploaded firebase url
 */
const uploadFile = async (fileName, fileBuffer, mediaType) => {
  const dateTime = new Date();
  const storageRef = ref(storage, `files/${fileName + "       " + dateTime}`);

  // Create file metadata including the content type
  const metadata = {
    contentType: mediaType || "image/jpeg",
  };

  // Upload the file in the bucket storage
  const snapshot = await uploadBytesResumable(storageRef, fileBuffer, metadata);

  // Grab the public url
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

/**
 *
 * @param {*} url
 * @returns buffer array
 */
const getBufferFromUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (response) => {
      const body = [];
      response
        .on("data", (chunk) => {
          body.push(chunk);
        })
        .on("end", () => {
          resolve(Buffer.concat(body));
        });
    });
  });
};

module.exports = {
  getBufferFromUrl,
  uploadFile,
};
