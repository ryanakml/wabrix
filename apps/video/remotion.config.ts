import fs from "node:fs";
import { enableTailwind } from "@remotion/tailwind";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);

const bravePath =
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
if (fs.existsSync(bravePath)) {
  Config.setBrowserExecutable(bravePath);
}

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});
