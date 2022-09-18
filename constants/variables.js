import constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, doc } from "firebase/firestore";

export const deviceId = constants.installationId;

export const firebaseConfig = {
  //YOUR_FIREBASECONFIG
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const locationRef = collection(db, "location");
export const userStatusRef = collection(db, "userStatus");
export const hospitalsRef = collection(db, "hospitals");

export const docRefUser = doc(db, "userStatus", deviceId);

export const medRefUser = doc(db, "medicalNotes", deviceId);

export const status = ["Healthy", "Suspected", "Infected"];

export const placeType = "hospital";

export const googleAPIKey = "AIzaSyCh6SDtbKSz5694qJah58PdkJGUXtvjM9A";

export let currentStatus;
