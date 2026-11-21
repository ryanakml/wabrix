import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./Video";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Production Demo (1920x1080 @ 60fps | 45s) */}
      <Composition
        id="WabrixDemo16x9"
        component={MainVideo}
        durationInFrames={2700}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* 9:16 Mobile Socials Cut (1080x1920 @ 60fps | 45s) */}
      <Composition
        id="WabrixDemoVertical"
        component={MainVideo}
        durationInFrames={2700}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
