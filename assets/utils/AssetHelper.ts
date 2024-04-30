import Images from "../images";
import { Asset } from "expo-asset";

const cacheImages = () => {
  return Images.map((image) => Asset.fromModule(image).downloadAsync());
};

export const loadAssetsAsync = async () => {
  // const fontAssets = cacheFonts();
  const imageAssets = cacheImages();

  return await Promise.all([...imageAssets]);
};
