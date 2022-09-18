// Learn more about createBottomTabNavigator:
// https://reactnavigation.org/docs/bottom-tab-navigator
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme } from "react-native";

import Colors from "../constants/Colors";
import ProfileScreen from "../screens/ProfileScreen";
import MapScreen from "../screens/MapScreen";
import HistoryScreen from "../screens/HistoryScreen";
import CodeScreen from "../screens/CodeScreen";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Profile"
      screenOptions={{ tabBarActiveTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-person" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Map"
        component={MapNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-map" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="QR Code"
        component={CodeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-barcode" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ProfileStack = createStackNavigator();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerTitle: "View Your Profile" }}
      />
    </ProfileStack.Navigator>
  );
}

const MapStack = createStackNavigator();

function MapNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerTitle: "Your Location History" }}
      />
    </MapStack.Navigator>
  );
}

const CodeStack = createStackNavigator();

function CodeNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name="CodeScreen"
        component={CodeScreen}
        options={{ headerTitle: "Your QR Code" }}
      />
    </MapStack.Navigator>
  );
}
