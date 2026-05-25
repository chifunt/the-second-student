import { escapeHtml } from "../charts/chartUtils";

export type WindowTitlebarOptions = {
  mark: string;
  title: string;
  meta?: string;
  markClass?: "ring" | "dot";
};

export type ProfileSummaryOptions = {
  initials: string;
  name: string;
  status: string;
  className?: string;
};

export type ChatMessageOptions = {
  role: "user" | "bot";
  body: string;
  className?: string;
};

export function renderWindowTitlebar(options: WindowTitlebarOptions): string {
  const markClass = options.markClass === "dot" ? "mark-dot" : "mark-ring";

  return `
    <div class="window-titlebar">
      <div class="dots"><span></span><span></span><span></span></div>
      <div class="mark"><span class="${markClass}"></span>${escapeHtml(options.mark)}</div>
      <div class="window-title">${escapeHtml(options.title)}</div>
      ${options.meta ? `<div class="window-meta">${escapeHtml(options.meta)}</div>` : ""}
    </div>
  `;
}

export function renderProfileSummary(options: ProfileSummaryOptions): string {
  return `
    <div class="${escapeHtml(options.className ?? "chat-profile")}">
      <div class="ava">${escapeHtml(options.initials)}</div>
      <div>
        <div class="name">${escapeHtml(options.name)}</div>
        <div class="status">${escapeHtml(options.status)}</div>
      </div>
    </div>
  `;
}

export function renderChatMessage(options: ChatMessageOptions): string {
  const className = ["msg", options.role, options.className].filter(Boolean).join(" ");

  // Scene authors sometimes pass structured markup inside messages. Keep that
  // trusted boundary explicit instead of pretending every message is plain text.
  return `<div class="${escapeHtml(className)}">${options.body}</div>`;
}
