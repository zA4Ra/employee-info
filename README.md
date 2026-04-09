# Employee Info — Assignment 4

## Backend

**Firebase** (Authentication + Firestore)

---

## Setup

### 1. Install dependencies

```bash
npm install
npx expo install firebase @react-native-async-storage/async-storage
```

### 2. Create a Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication → Email/Password**
4. Create a **Firestore** database (start in production mode)
5. Add an **iOS + Android** app and copy the config values

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your Firebase values:

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Set Firestore Security Rules

In Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{doc} {
      allow read, update, delete: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Run the app

```bash
npx expo start
```

---

## Test Accounts

| Email | Password |
|-------|----------|
| test@example.com | Test1234 |

*(Create via Sign Up screen)*

---

## Features Implemented

### Core (Mandatory)
- [x] Sign Up (Firebase Auth — createUserWithEmailAndPassword)
- [x] Sign In (Firebase Auth — signInWithEmailAndPassword)
- [x] Sign Out (with confirmation dialog)
- [x] Protected navigation (auth guard in root _layout)
- [x] Session persistence (AsyncStorage)
- [x] Loading screen on app launch
- [x] Employee Info form → Firestore (Create)
- [x] Submissions list screen (Read — real-time listener)
- [x] Records scoped to authenticated user (userId field)
- [x] Error handling: network errors, auth errors, empty states
- [x] Loading indicators on all async operations
- [x] Formik + Yup client-side validation preserved from Assignment 3

### Bonus
- [x] Edit/Update saved records (department & salary)
- [x] Delete with confirmation modal
- [x] Forgot Password (sendPasswordResetEmail)
- [x] Profile screen showing logged-in user's email and account info
