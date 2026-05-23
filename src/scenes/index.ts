import { boundaryScene } from "./boundaryScene";
import { companionScene } from "./companionScene";
import { deliberateWorkflowScene } from "./deliberateWorkflowScene";
import { dependencyScene } from "./dependencyScene";
import { emailScene } from "./emailScene";
import { finalPaywallScene } from "./finalPaywallScene";
import { panicButtonScene } from "./panicButtonScene";
import { panicChatScene } from "./panicChatScene";
import type { SceneConfig } from "./sceneTypes";
import { skillGapScene } from "./skillGapScene";
import { titleScene } from "./titleScene";

export const scenes: readonly SceneConfig[] = [
  titleScene,
  emailScene,
  panicButtonScene,
  panicChatScene,
  deliberateWorkflowScene,
  boundaryScene,
  skillGapScene,
  dependencyScene,
  companionScene,
  finalPaywallScene,
];
