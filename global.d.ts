import Reactotron from "@/util/reactotron";

declare global {
  interface Console {
    tron?: typeof Reactotron;
  }
}

declare module "chaikin-smooth" {
  import * as Smooth from "chaikin-smooth";
  export default Smooth;
}
