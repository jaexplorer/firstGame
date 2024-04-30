import React, { FC, useEffect, useRef, useState } from "react";
import {
  DevSettings,
  NativeModules,
  Platform,
  SafeAreaView,
  StatusBar as STB,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { loadAssetsAsync } from "./assets/utils/AssetHelper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StackParamList } from "./src/navigation/NavigationConstants";
import {
  getActiveRouteName,
  navigationRef,
} from "./src/navigation/NavigationUtils";
import store from "./src/redux/store";
import Splash from "./src/screens/splash/Splash";
import { Provider as ReduxProvider } from "react-redux";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import RootNavigation from "./src/navigation/Navigation";

interface AppProps {}

const App: FC<AppProps> = ({}) => {
  const [loading, setLoading] = useState(true);
  const routeNameRef = useRef<string>();

  useEffect(() => {
    loadAssetsAsync()
      .then(() => {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      })
      .catch((err) => console.log(err));
    const state = navigationRef?.current?.getRootState();
    routeNameRef.current = getActiveRouteName(state);
  }, []);

  if (__DEV__) {
    const { default: tron } = require("./src/util/reactotron");
    console.tron = tron;
  }

  if (loading) return <Splash />;

  return (
    <ReduxProvider store={store}>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={(state): void => {
          const currentRouteName = getActiveRouteName(state);
          routeNameRef.current = currentRouteName;
        }}
      >
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar />
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor: "#000",
                paddingTop: STB.currentHeight,
              }}
            >
              <RootNavigation />
            </SafeAreaView>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </NavigationContainer>
    </ReduxProvider>
  );
};

export default App;
