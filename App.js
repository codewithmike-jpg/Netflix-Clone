import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Using MaterialCommunityIcons for example

// Import your screens
import GetStartedScreen from "./src/Screens/GetStartedScreen";
import LoginScreen from "./src/Screens/LoginScreen";
import OnboardingCarousel from "./src/Screens/OnboardingCarousel";
import SignupScreen from "./src/Screens/SignupScreen";
import ProfileScreen from "./src/Screens/ProfileScreen";
import Search from "./src/Screens/Search";
import MovieDetail from "./src/Screens/MovieDetail";
import MyList from "./src/Screens/MyList";
import HomeScreen from "./src/Screens/HomeScreen";
import ComingSoonScreen from "./src/Screens/ComingSoonScreen";
import MyNetflixScreen from "./src/Screens/MyNetflixScreen";
import MapScreen from "./src/Screens/MapScreen";

import { MyListProvider } from "./src/contexts/MyListContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#333', borderTopColor: '#444' },
        tabBarLabelStyle: { color: '#fff' },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Coming Soon") {
            iconName = "clock-outline";
          } else if (route.name === "My Netflix") {
            iconName = "account-circle-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Coming Soon" component={ComingSoonScreen} />
      <Tab.Screen name="My Netflix" component={MyNetflixScreen} />
      
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <MyListProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="GetStarted"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingCarousel} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="MovieDetail" component={MovieDetail} />
          <Stack.Screen name="MyList" component={MyList} />
          <Stack.Screen name="HomeTabs" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </MyListProvider>
  );
};

export default App;
