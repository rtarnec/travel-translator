# travel-translator

## Description

This is the code of a Vue.js application that works with Firebase as a backend.

The app is called "Travel Translator" because it allows translating pictures of text to English. So it may be useful during travels, in order to translate road signs, restaurant menus, museum flyers, etc....

It has only one page that contains a button which allows users uploading an image (or to take a photo when opened on a smartphone).

The image is uploaded to Cloud Storage and a Cloud Function is triggered and OCR-izes the image, through the Google Cloud Vision API. The text resulting from the OCR is saved to a Firestore document and a Firebase Extension is triggered to translate this text to English and to save it back to the Firestore document. All of these steps are done through Cloud Functions, **in the backend**.

In the front-end, a Firestore listener is declared which updates the UI as soon as the translated text is added to the Firestore document.

## How to use it

- Adapt the `firebaseConfig.js` file with the Firebase config object of your own Firebase project. See https://firebase.google.com/docs/web/setup#config-object.

- Compile the Vue.js app for production

```
npm run build
```

- Copy/paste the resulting files (to be found in the `dist` folder) to the `public` folder of the Firebase project.

- Deploy your Firebase project

## Corresponding Firebase project

The corresponding Firebase project is to be found at https://github.com/rtarnec/travel-translator-backend
