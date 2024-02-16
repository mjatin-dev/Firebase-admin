const axios = require("axios");
const { getBufferFromUrl, uploadFile } = require("../utils/image.utils");

const getUserDetailByUsername = async (username) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.hikerapi.com/v1/user/by/username?username=${username}`,
        { headers: { "x-access-key": "FyfTt6FyyRzhV7UuwO220O8hZsBka77T" } }
      )
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const getUserFeedsByUserId = async (userId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.hikerapi.com/v1/user/medias/chunk?user_id=${userId}`, {
        headers: { "x-access-key": "FyfTt6FyyRzhV7UuwO220O8hZsBka77T" },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
};

const uploadImageToFirestore = async (url, mediaType = "image/jpeg") => {
  //Create buffer from image profile url
  const bufferImage = await getBufferFromUrl(url);

  //Upload buffer image to firebase storage.
  const getFile = await uploadFile("media", bufferImage, mediaType);

  return getFile;
};

module.exports = {
  getUserDetailByUsername,
  getUserFeedsByUserId,
  uploadImageToFirestore,
};
