import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  RouteProp,
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";

/* Root 
------------------------------------------------------------------- */
export type StackParamList = {
  Home: undefined;
  Level: undefined;
};

/* Params
------------------------------------------------------------------- */
// type HomeParams = {
//   appVersionDetails: string;
// };

/* Interfaces
------------------------------------------------------------------- */
export interface HomeRouteParams {
  route: RouteProp<StackParamList, "Home">;
}
