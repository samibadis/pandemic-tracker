import React, { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { getDocs, query } from "firebase/firestore";
import { View } from "../components/Themed";
import { getDistance } from "geolib";
import * as Location from "expo-location";

import { deviceId, locationRef, hospitalsRef } from "../constants/variables";

export default function MapScreen() {
  const [getCoords, setgetCoords] = useState([]);
  const [getHos, setgetHos] = useState([]);

  const getHospitals = async () => {
    let location = await Location.getCurrentPositionAsync({});
    let arr = [];
    const q = query(hospitalsRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (loc) => {
      arr.push(
        getDistance(
          {
            latitude: location["coords"]["latitude"],
            longitude: location["coords"]["longitude"],
          },
          { latitude: loc.data()["lat"], longitude: loc.data()["lng"] }
        )
      );
    });
    setgetHos(arr);
  };
  // Getting user location history from the cloud

  const getCoordinates = async () => {
    let arr = [];
    const q = query(locationRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (loc) => {
      arr.push([
        loc.data()["id"],
        loc.data()["pos"]["coordinates"],
        loc.data()["pos"]["timestamp"],
        loc.data()["status"],
      ]);
    });
    setgetCoords(arr);
  };

  // const showHospitals = async () => {
  //   let location = await Location.getCurrentPositionAsync({});
  //   let radius = 4 * 1000;
  //   let places = [];

  //   const url =
  //     "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
  //     location["coords"]["latitude"] +
  //     "," +
  //     location["coords"]["longitude"] +
  //     "&radius=" +
  //     radius +
  //     "&type=" +
  //     placeType +
  //     "&key=" +
  //     googleAPIKey;
  //   fetch(url)
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((res) => {
  //       for (let googlePlace of res.results) {
  //         let place = {};
  //         let myLat = googlePlace.geometry.location.lat;
  //         let myLong = googlePlace.geometry.location.lng;
  //         let coordinate = {
  //           latitude: myLat,
  //           longitude: myLong,
  //         };
  //         place["placeTypes"] = googlePlace.types;

  //         place["coordinate"] = coordinate;
  //         place["placeId"] = googlePlace.place_id;
  //         place["placeName"] = googlePlace.name;
  //         places.push(place);
  //       }
  //     });
  //   console.log(url);
  // };
  // showHospitals();

  useEffect(() => {
    getCoordinates();
  }, []);

  useEffect(() => {
    // Uploading the location to the cloud within the specified time
    const interval = setInterval(() => {
      getCoordinates();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={{
          width: "100%",
          height: "100%",
        }}
        provider={PROVIDER_GOOGLE}
        showsIndoors={true}
        showsMyLocationButton={true}
        zoomControlEnabled={true}
        zoomEnabled={true}
        zoomTapEnabled={true}
        showsScale={true}
        showsBuildings={true}
        showsUserLocation={true}
        showsCompass={true}
        initialRegion={{
          latitude: 35.44829456472271,
          longitude: 7.157346123889585,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Show location history markers */}
        {getCoords.map((item, index) =>
          item[0] === deviceId ? (
            <Marker key={index} title="Your History" coordinate={item[1]} />
          ) : item[3] === "Healthy" ? (
            <Marker
              key={index}
              title="A Healthy Location"
              pinColor={"green"}
              coordinate={item[1]}
            />
          ) : item[3] === "Suspected" ? (
            <Marker
              key={index}
              title="A Suspected Location"
              pinColor={"wheat"}
              coordinate={item[1]}
            />
          ) : (
            <Marker
              key={index}
              title="An Infected Location"
              pinColor={"purple"}
              coordinate={item[1]}
            />
          )
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
