import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";
import {
  deviceId,
  locationRef,
  userStatusRef,
  docRefUser,
  status,
} from "../constants/variables";

const ProfileScreen = () => {
  const [getValue, setGetValue] = useState("");

  // Checking if the device is registerd and inserting it in the database in case it doesn't exist
  getDoc(docRefUser).then((docSnap) => {
    let currentdate = new Date();
    let datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    let data = { [datetime]: "Healthy" };
    if (docSnap.exists()) {
      return;
    } else {
      setDoc(doc(userStatusRef, deviceId), {
        healthStatus: "Healthy",
        history: arrayUnion(data),
      });
    }
  });

  const getValueFunction = () => {
    // Getting the user status from the cloud
    getDoc(docRefUser).then((docSnap) => {
      if (docSnap.exists()) {
        setGetValue(docSnap.data()["healthStatus"]);
      }
    });
  };
  getValueFunction();

  const saveValueFunction = async (selectedItem) => {
    let currentdate = new Date();
    let datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    let data = { [datetime]: selectedItem };
    //function to update the user status in Firestore
    if (selectedItem) {
      updateDoc(doc(userStatusRef, deviceId), {
        healthStatus: selectedItem,
        history: arrayUnion(data),
      });
      const q = query(locationRef, where("id", "==", deviceId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((loc) => {
        updateDoc(doc(locationRef, loc.id), {
          status: selectedItem,
        });
      });
      alert("Status Update");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Your Unique ID: {deviceId}</Text>
        <SelectDropdown
          buttonStyle={styles.choice}
          data={status}
          defaultValue={getValue}
          onSelect={(selectedItem) => {
            saveValueFunction(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem) => {
            return selectedItem;
          }}
          rowTextForSelection={(item) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        />

        <TouchableOpacity
          onPress={() => Linking.openURL("https://maps.google.com?q=hospital")}
        >
          <Text style={styles.titleText}>Find near-by hospitals</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "black",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
    color: "white",
  },

  choice: {
    backgroundColor: "white",
    width: "94%",
    height: 60,
    margin: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
