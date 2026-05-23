export type StudentMode = "reactive" | "deliberate" | "institutional" | "ambiguous";

export type SceneConfig = {
  id: string;
  title: string;
  mode: StudentMode;
  render: (container: HTMLElement) => void;
  animate?: (container: HTMLElement) => void;
  destroy?: (container: HTMLElement) => void;
};
