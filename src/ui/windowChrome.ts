import { escapeHtml } from "../charts/chartUtils";

export type AppId = "mail" | "assist" | "study" | "write" | "reflect" | "companion";

export type WindowTitlebarOptions = {
  mark: string;
  title: string;
  app?: AppId;
  meta?: string;
  markClass?: "ring" | "dot";
};

export type ProfileSummaryOptions = {
  initials: string;
  avatarSrc?: string;
  avatarAlt?: string;
  name: string;
  status: string;
  className?: string;
};

export type ChatMessageOptions = {
  role: "user" | "bot";
  body: string;
  className?: string;
};

type AppLogoOptions = {
  className?: string;
  label?: string;
  hidden?: boolean;
};

const appLogoPaths: Record<AppId, string> = {
  mail: `
    <rect class="app-logo__bg" x="2.5" y="3" width="19" height="18" rx="4" />
    <path class="app-logo__mark" d="M6.5 8.2h11v7.6h-11z" />
    <path class="app-logo__line" d="m6.7 8.7 5.8 4.4 5.8-4.4" />
    <path class="app-logo__shadow" d="M4.3 6.3h7.5v11.2H4.3z" />
    <path class="app-logo__letter" d="M6.3 9.4h3.1M6.3 11.5h2.4" />
  `,
  assist: `
    <circle class="app-logo__bg" cx="12" cy="12" r="10" />
    <path class="app-logo__mark" d="M12 4.8c1.7 0 3 1.3 3 3v1.1l1-.6a3 3 0 0 1 4.1 1.1 3 3 0 0 1-1.1 4.1l-1 .6 1 .6a3 3 0 0 1 1.1 4.1 3 3 0 0 1-4.1 1.1l-1-.6v1.1a3 3 0 0 1-6 0v-1.1l-1 .6A3 3 0 0 1 3.9 18.8a3 3 0 0 1 1.1-4.1l1-.6-1-.6a3 3 0 0 1-1.1-4.1A3 3 0 0 1 8 8.3l1 .6V7.8c0-1.7 1.3-3 3-3Z" />
    <circle class="app-logo__core" cx="12" cy="12" r="3.1" />
  `,
  companion: `
    <circle class="app-logo__bg" cx="12" cy="12" r="10" />
    <path class="app-logo__mark" d="M8 8.2a4.7 4.7 0 0 1 8 3.3c0 3.5-4 5.3-4 5.3s-4-1.8-4-5.3c0-1.3.5-2.4 1.3-3.3" />
    <path class="app-logo__line" d="M8.7 15.9c1.1.7 2.3 1 3.3 1s2.2-.3 3.3-1" />
    <circle class="app-logo__core" cx="12" cy="11.5" r="2.5" />
  `,
  study: `
    <rect class="app-logo__bg" x="3.2" y="3" width="17.6" height="18" rx="4.2" />
    <path class="app-logo__mark" d="M8 7.2h6.2l2.8 2.8v6.8H8z" />
    <path class="app-logo__line" d="M14.2 7.4v2.8h2.8M10 12h5M10 14.4h4" />
    <path class="app-logo__spark" d="M6.2 5.7 7 4.1l.8 1.6 1.6.8-1.6.8L7 8.9l-.8-1.6-1.6-.8Z" />
  `,
  write: `
    <circle class="app-logo__bg" cx="12" cy="12" r="10" />
    <path class="app-logo__mark" d="M7.2 12.3 10.4 15l6.4-7" />
    <path class="app-logo__line" d="M8 17.4c1.3.8 3 .9 4.6.4 3.3-1 5.2-4.5 4.2-7.8S12.3 4.8 9 5.8 3.8 10.3 4.8 13.6c.3 1 .8 1.8 1.5 2.4" />
  `,
  reflect: `
    <circle class="app-logo__bg" cx="12" cy="12" r="10" />
    <path class="app-logo__mark" d="M12 4.3c1 3.2 2.5 5 5.7 5.7-3.2 1-5 2.5-5.7 5.7-1-3.2-2.5-5-5.7-5.7 3.2-1 5-2.5 5.7-5.7Z" />
    <path class="app-logo__line" d="M17.6 14.2c.5 1.6 1.3 2.5 2.9 3-1.6.4-2.5 1.2-3 2.8-.4-1.6-1.2-2.5-2.8-3 1.6-.4 2.5-1.2 2.9-2.8ZM5.9 13.7c.3 1 .8 1.5 1.8 1.8-1 .3-1.5.8-1.8 1.8-.3-1-.8-1.5-1.8-1.8 1-.3 1.5-.8 1.8-1.8Z" />
  `,
};

export function renderAppLogo(app: AppId, options: AppLogoOptions = {}): string {
  const className = ["app-logo", `app-logo--${app}`, options.className]
    .filter(Boolean)
    .join(" ");
  const accessibility = options.hidden
    ? `aria-hidden="true" focusable="false"`
    : `role="img" aria-label="${escapeHtml(options.label ?? app)}"`;

  return `
    <span class="${escapeHtml(className)}">
      <svg viewBox="0 0 24 24" ${accessibility}>
        ${appLogoPaths[app]}
      </svg>
    </span>
  `;
}

export function renderWindowTitlebar(options: WindowTitlebarOptions): string {
  const markClass = options.markClass === "dot" ? "mark-dot" : "mark-ring";
  const mark = options.app
    ? `${renderAppLogo(options.app, {
        className: "app-logo--titlebar",
        hidden: true,
      })}${escapeHtml(options.mark)}`
    : `<span class="${markClass}"></span>${escapeHtml(options.mark)}`;

  return `
    <div class="window-titlebar">
      <div class="dots"><span></span><span></span><span></span></div>
      <div class="mark mark--app-${escapeHtml(options.app ?? "generic")}">${mark}</div>
      <div class="window-title">${escapeHtml(options.title)}</div>
      ${options.meta ? `<div class="window-meta">${escapeHtml(options.meta)}</div>` : ""}
    </div>
  `;
}

export function renderProfileSummary(options: ProfileSummaryOptions): string {
  const avatar = options.avatarSrc
    ? `<img class="ava ava--image" src="${escapeHtml(options.avatarSrc)}" alt="${escapeHtml(
        options.avatarAlt ?? options.name,
      )}" />`
    : `<div class="ava">${escapeHtml(options.initials)}</div>`;

  return `
    <div class="${escapeHtml(options.className ?? "chat-profile")}">
      ${avatar}
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
