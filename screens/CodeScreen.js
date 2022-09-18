import * as React from "react";
import { View, StyleSheet } from "react-native";
import { deviceId } from "../constants/variables";
import SvgQRCode from "react-native-qrcode-svg";
// Simple usage, defaults for all but the value
function Simple() {
  return <SvgQRCode value={deviceId} />;
}

const CodeScreen = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <SvgQRCode size={300} value={deviceId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingTop: 20,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});

export default CodeScreen;
