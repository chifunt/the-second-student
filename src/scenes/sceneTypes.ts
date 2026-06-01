export type StudentMode = "reactive" | "deliberate" | "institutional" | "ambiguous";

export type SceneRenderContext = {
  nextScene?: Pick<SceneConfig, "id" | "title">;
};

export type SceneConfig = {
  id: string;
  title: string;
  mode: StudentMode;
  render: (container: HTMLElement, context?: SceneRenderContext) => void;
  animate?: (
    container: HTMLElement,
  ) => void | { restart: (includeDelay?: boolean, suppressEvents?: boolean) => unknown };
  destroy?: (container: HTMLElement) => void;
};
