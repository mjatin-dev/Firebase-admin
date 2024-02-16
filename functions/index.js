// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");

const { firebaseConfig } = require("../firebase");
// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase/app");

const { getUserInfo } = require("./controller/user.controller");

initializeApp(firebaseConfig);


/**
 * Get User Info
 * Params: username
 */
exports.getUserInfo = onRequest(async (request, response) => {
  try {
    const userDetails = await getUserInfo(request.query);
    response.send(userDetails);
  } catch (error) {

    response.send(error.message || "Something went wrong");
  }
});
