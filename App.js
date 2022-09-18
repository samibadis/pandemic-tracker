import React, { useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";

import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { useLoadedAssets } from "./hooks/useLoadedAssets";
import Navigation from "./navigation";
import { deviceId, locationRef, docRefUser } from "./constants/variables";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Getting the GPS access permission from the device
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  async function getLocation() {
    // Uploading the user's current location to the cloud
    let v;
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    getDoc(docRefUser).then((docSnap) => {
      v = docSnap.data()["healthStatus"];
    });
    getDoc(docRefUser).then(() => {
      setDoc(doc(locationRef), {
        id: deviceId,
        pos: {
          coordinates: {
            latitude: location["coords"]["latitude"],
            longitude: location["coords"]["longitude"],
          },
          timestamp: serverTimestamp(),
        },
        status: v,
      });
    });
  }

  useEffect(() => {
    // Uploading the location to the cloud within the specified time
    const interval = setInterval(() => {
      getLocation();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const isLoadingComplete = useLoadedAssets();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
