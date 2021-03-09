import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IconHome from "../assets/image/home.svg";
import IconNotification from "../assets/image/icon_notification.svg";
import IconTrack from "../assets/image/search.svg";
import IconHistory from "../assets/image/history.svg";
import IconProfile from "../assets/image/user.svg";

import Login from "../view/login";
import Register from "../view/register";
import KodeReferal from "../view/register/KodeReferal";
import SplashScreen from "../view/splash_screen";
import IntroScreen from "../view/intro_screen";
// import Home from "../view/main_tabs/home";
import Home from "../view/main_tabs/home/Home";
import ListOrder from "../view/main_tabs/home/ListOrder";
import DetailOrder from "../view/main_tabs/home/DetailOrder";

import Rates from "../view/main_tabs/rates";
import History from "../view/main_tabs/history";
import Profile from "../view/main_tabs/profile";
import EditProfile from "../view/main_tabs/profile/EditProfile";
import DropOff from "../view/drop_off";
import PickUp from "../view/pick_up";
import ReturnAddress from "../view/pick_up/ReturnAddress";
import FormReturnAddress from "../view/pick_up/FormReturnAddress";
import ReceiverAddress from "../view/pick_up/ReceiverAddress";
import FormReceiverAddress from "../view/pick_up/FormReceiverAddress";
import EditFormSenderAddress from "../view/pick_up/EditFormSenderAddress";
import EditFormReceiverAddress from "../view/pick_up/EditFormReceiverAddress";
import EditFormCollectorAddress from "../view/pick_up/EditFormCollectorAddress";
import CollectorAddress from "../view/pick_up/CollectorAddress";
import PickupSuccess from "../view/pick_up/PickupSuccess";

import FormCollectorAddress from "../view/pick_up/FormCollectorAddress";
import { View, Image } from "react-native";
import { moderateScale, verticalScale } from "../util/ModerateScale";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="SplashScreen"
          component={SplashScreen}
        />

        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="IntroScreen"
          component={IntroScreen}
        />

        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="Register"
          component={Register}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="KodeReferal"
          component={KodeReferal}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="MainTabs"
          component={MainTabs}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="DropOff"
          component={DropOff}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="PickUp"
          component={PickUp}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="EditProfile"
          component={EditProfile}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="ReturnAddress"
          component={ReturnAddress}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="FormReturnAddress"
          component={FormReturnAddress}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="EditFormSenderAddress"
          component={EditFormSenderAddress}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="EditFormReceiverAddress"
          component={EditFormReceiverAddress}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="EditFormCollectorAddress"
          component={EditFormCollectorAddress}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="FormReceiverAddress"
          component={FormReceiverAddress}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="ReceiverAddress"
          component={ReceiverAddress}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="CollectorAddress"
          component={CollectorAddress}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="FormCollectorAddress"
          component={FormCollectorAddress}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="PickupSuccess"
          component={PickupSuccess}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="ListOrder"
          component={ListOrder}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
          name="DetailOrder"
          component={DetailOrder}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        showLabel: true,
        activeTintColor: "red",
        inactiveTintColor: "#A80002",
        activeBackgroundColor: "#F1F1F1",

        style: {
          paddingHorizontal: moderateScale(10),
          height: verticalScale(50),
          paddingBottom: 0,
          paddingTop: 0,
          elevation: 0, // for Android
          shadowOffset: {
            width: 0,
            height: 0, // for iOS
          },
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <>
              {color == "#1E1F20" ? (
                <IconHome
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "stretch",
                  }}
                ></IconHome>
              ) : (
                <IconHome
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "stretch",
                  }}
                ></IconHome>
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Rates"
        component={Rates}
        options={{
          tabBarLabel: "Notifikasi",
          tabBarIcon: ({ color, size }) => (
            <>
              {color == "#1E1F20" ? (
                <IconNotification
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "stretch",
                  }}
                ></IconNotification>
              ) : (
                <IconNotification
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "stretch",
                  }}
                ></IconNotification>
              )}
            </>
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <>
              {color == "#1E1F20" ? (
                <IconHistory
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "stretch",
                  }}
                ></IconHistory>
              ) : (
                <IconHistory
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "stretch",
                  }}
                ></IconHistory>
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarVisible: false,

          tabBarIcon: ({ color, size }) => (
            <>
              {color == "#1E1F20" ? (
                <IconProfile
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "stretch",
                  }}
                ></IconProfile>
              ) : (
                <IconProfile
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "stretch",
                  }}
                ></IconProfile>
              )}
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AppNavigation;
