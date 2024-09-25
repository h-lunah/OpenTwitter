<br />

![](/.github/assets/presentation.png)

<p align="center">- lunar tweeter -</p>

<p align="center">
  Improved Twitter clone based on https://github.com/ccrsxx/twitter-clone
</p>

## Features ✨

- Authentication with Firebase Authentication
- Strongly typed React components with TypeScript
- Users can add tweets, like, retweet, and reply
- Users can delete tweets, add a tweet to bookmarks, and pin their tweet
- Users can add images, GIFs and videos to tweet
- Users can follow and unfollow other users
- Users can see their and other followers and the following list
- Users can search for users and see the trending list
- Users can message each other
- Users get reminded of their popularity (likes, follows)
- Realtime update likes, retweets, and user profile
- Realtime local trending data
- User can edit their profile
- Responsive design for mobile, tablet, and desktop
- Users can customize the site color scheme and color background
- All images uploads are stored on Firebase Cloud Storage

## Tech 🛠

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com)
- [SWR](https://swr.vercel.app)
- [Headless UI](https://headlessui.com)
- [React Hot Toast](https://react-hot-toast.com)
- [Framer Motion](https://framer.com)

## Development 💻

Here are the steps to run the project locally.

1. Clone the repository

   ```bash
   git clone https://github.com/piotr25691/lunar-tweeter
   ```

1. Install dependencies

   ```bash
   yarn install
   ```

1. Create a Firebase project and select the web app

1. Add your Firebase config to `.env.development`. Note that `NEXT_PUBLIC_MEASUREMENT_ID` is optional

1. Make sure you have enabled the following Firebase services:

   - Authentication. Enable the Google sign-in method.
   - Cloud Firestore. Create a database and set its region to your nearest location.
   - Cloud Storage. Create a storage bucket.
   - Real-time Database. Create a real time database and set its region to your nearest location.
   - Firebase Admin. Create a Firebase service account and add its credenials to your `.env` file.

1. Install Firebase CLI globally

   ```bash
   npm i -g firebase-tools
   ```

1. Log in to Firebase

   ```bash
   firebase login
   ```

1. Get your project ID

   ```bash
   firebase projects:list
   ```

1. Select your project ID

   ```bash
   firebase use your-project-id
   ```

1. At this point, you have two choices. You can deploy this to Vercel or run locally.

- Using the Firebase Cloud Backend:

  - Deploy Firestore rules, Firestore indexes, and Cloud Storage rules

  ```bash
  firebase deploy --except functions
  ```

  - Run it locally

  ```bash
  npm run dev
  ```

  - Deploy to Vercel to run it on the internet

- Using Firebase Local Emulator:

  - Install [Java JDK version 11 or higher](https://jdk.java.net/) before proceeding. This is required to run the emulators.

  - Set the environment variable `NEXT_PUBLIC_USE_EMULATOR` to `true` in `.env.development`. This will make the app use the emulators instead of the cloud backend.

  - Run it locally

  ```bash
  npm run dev:emulators
  ```

> **_Note_**: When you deploy Firestore indexes rules, it might take a few minutes to complete. So before the indexes are enabled, you will get an error when you fetch the data from Firestore.<br><br>You can check the status of your Firestore indexes with the link below, replace `your-project-id` with your project ID: https://console.firebase.google.com/u/0/project/your-project-id/firestore/indexes

If you want to make the user stats synced with the deleted tweets, you need to enable the Cloud Functions for Firebase. Then deploy the Cloud Functions.
