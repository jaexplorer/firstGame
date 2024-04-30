import {
  NavigationState,
  DrawerActions,
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";
import { StackParamList } from "./NavigationConstants";

export const navigationRef = createNavigationContainerRef<StackParamList>();

/* Gets the current screen from navigation state */
export const getActiveRouteName = (
  state: NavigationState | undefined
): string => {
  if (!state) {
    return "";
  }
  const route = state.routes[state.index];
  if (!route.state) {
    return route.name;
  } // Exit Condition
  // Dive into nested navigators recursively
  return getActiveRouteName(route.state as NavigationState) || route.name; // Fallback
};

export function navigate(name: any, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function navigateBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function resetNavigation(name: any, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

export function openDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.openDrawer());
  }
}

export function closeDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.closeDrawer());
  }
}
