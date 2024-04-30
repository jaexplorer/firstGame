/* eslint-disable react/no-unstable-nested-components */
import React, { FC, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackParamList } from "./NavigationConstants";
import Home from "../screens/home/Home";
import { loadingSelector } from "../redux/selectors/LoadingSelector";
import { errorMessageSelector } from "../redux/selectors/ErrorSelector";
import { ApplicationState } from "../redux/state/ApplicationState";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Level from "../screens/level/Level";

const Stack = createNativeStackNavigator<StackParamList>();

interface RootNavigationProps {
  error: string;
  loading: boolean;
}

const RootNavigation: FC<RootNavigationProps> = ({ error, loading }) => {
  const stackOptions = {
    headerShown: false,
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Level" component={Level} />
    </Stack.Navigator>
  );
};

const loading = loadingSelector([]);
const error = errorMessageSelector([]);

const mapStateToProps = (state: ApplicationState) => ({
  loading: loading(state),
  error: error(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RootNavigation);
