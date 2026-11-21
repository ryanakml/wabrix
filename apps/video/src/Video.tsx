import React from "react";
import { Series } from "remotion";
import { Scene1Friction } from "./scenes/Scene1Friction";
import { Scene2KnowledgeBase } from "./scenes/Scene2KnowledgeBase";
import { Scene3LiveMessenger } from "./scenes/Scene3LiveMessenger";
import { Scene4HumanHandoff } from "./scenes/Scene4HumanHandoff";
import { Scene5Outro } from "./scenes/Scene5Outro";

export const MainVideo: React.FC = () => {
  return (
    <Series>
      {/* Act 1: The Chaos & Friction (8s | Frames 0-480) */}
      <Series.Sequence durationInFrames={480} name="Act 1: The Friction">
        <Scene1Friction />
      </Series.Sequence>

      {/* Act 2: Knowledge Ingestion & Grounding (10s | Frames 480-1080) */}
      <Series.Sequence
        durationInFrames={600}
        name="Act 2: Ingestion & Grounding"
      >
        <Scene2KnowledgeBase />
      </Series.Sequence>

      {/* Act 3: Live WhatsApp Ingress (12s | Frames 1080-1800) */}
      <Series.Sequence
        durationInFrames={720}
        name="Act 3: Live WhatsApp Ingress"
      >
        <Scene3LiveMessenger />
      </Series.Sequence>

      {/* Act 4: 1-Click Human Handoff (8s | Frames 1800-2280) */}
      <Series.Sequence
        durationInFrames={480}
        name="Act 4: Human-in-the-Loop Handoff"
      >
        <Scene4HumanHandoff />
      </Series.Sequence>

      {/* Act 5: Outro & Call to Action (7s | Frames 2280-2700) */}
      <Series.Sequence durationInFrames={420} name="Act 5: Platform & Outro">
        <Scene5Outro />
      </Series.Sequence>
    </Series>
  );
};
