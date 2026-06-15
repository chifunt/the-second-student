import { schedule, trackLoop } from "./runtimeEffects";

const STREAM_SELECTOR =
  ".chat-stream, .studio-stream, .dep-stream, .phone-stream, .reflect-body";
const MESSAGE_SELECTOR = ".msg, .phone-bubble";
const MESSAGE_GAP_MS = 180;
const BOT_THINK_MS = 520;

type TextEntry = {
  node: Text;
  text: string;
};

type ProgressiveChatOptions = {
  completeClass?: string;
};

type TimelineLike = {
  add: (callback: () => void, position?: number | string) => TimelineLike;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getMessages(stream: Element): HTMLElement[] {
  return Array.from(stream.querySelectorAll<HTMLElement>(MESSAGE_SELECTOR));
}

function getOriginalHtml(message: HTMLElement): string {
  if (!message.dataset.chatOriginal) {
    message.dataset.chatOriginal = message.innerHTML;
  }

  return message.dataset.chatOriginal;
}

function getMessageLength(message: HTMLElement): number {
  const template = document.createElement("template");
  template.innerHTML = getOriginalHtml(message);
  return (template.content.textContent ?? "").trim().length;
}

function getMessageDuration(message: HTMLElement): number {
  const textLength = getMessageLength(message);
  const isBot = message.classList.contains("bot");
  const perCharacter = isBot ? 7 : 11;
  const minimum = isBot ? 760 : 420;
  const maximum = isBot ? 2400 : 1500;

  return clamp(textLength * perCharacter, minimum, maximum);
}

function collectTextEntries(root: ParentNode): TextEntry[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const entries: TextEntry[] = [];
  let current = walker.nextNode();

  while (current) {
    const node = current as Text;
    const text = node.textContent ?? "";

    node.textContent = "";
    if (text.trim().length > 0) {
      entries.push({ node, text });
    }

    current = walker.nextNode();
  }

  return entries;
}

function setTypedLength(entries: TextEntry[], typedLength: number): void {
  let remaining = typedLength;

  entries.forEach((entry) => {
    const nextLength = Math.max(0, Math.min(entry.text.length, remaining));
    entry.node.textContent = entry.text.slice(0, nextLength);
    remaining -= nextLength;
  });
}

function typeMessage(message: HTMLElement, duration: number): void {
  const originalHtml = getOriginalHtml(message);

  message.innerHTML = originalHtml;
  const entries = collectTextEntries(message);
  const totalLength = entries.reduce((sum, entry) => sum + entry.text.length, 0);
  const start = performance.now();
  let frame = 0;
  let cancelled = false;
  let previousTypedLength = -1;

  message.hidden = false;
  message.classList.add("is-typing");

  const finish = () => {
    message.innerHTML = originalHtml;
    message.classList.remove("is-typing");
  };

  const tick = (now: number) => {
    if (cancelled) {
      return;
    }

    const progress = Math.min(1, (now - start) / duration);
    const typedLength = Math.ceil(totalLength * progress);

    if (typedLength !== previousTypedLength) {
      setTypedLength(entries, typedLength);
      previousTypedLength = typedLength;
    }

    if (progress < 1) {
      frame = window.requestAnimationFrame(tick);
      return;
    }

    finish();
  };

  if (totalLength === 0) {
    finish();
    return;
  }

  frame = window.requestAnimationFrame(tick);
  trackLoop({
    cancel() {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    },
  });
}

function createTypingBubble(reference: HTMLElement): HTMLElement {
  const isPhone = reference.classList.contains("phone-bubble");
  const bubble = document.createElement("div");

  bubble.className = isPhone
    ? "phone-bubble bot chat-typing-bubble"
    : "msg bot chat-typing-bubble";
  bubble.innerHTML = `<span class="typing-ellipsis">...</span>`;
  return bubble;
}

function playTypingIndicator(message: HTMLElement, startMs: number): void {
  let indicator: HTMLElement | undefined;

  schedule(() => {
    indicator = createTypingBubble(message);
    message.before(indicator);
  }, startMs);
  schedule(() => {
    indicator?.remove();
  }, startMs + BOT_THINK_MS);
}

export function setupProgressiveChats(reduceMotion: boolean): void {
  document.querySelectorAll<HTMLElement>(STREAM_SELECTOR).forEach((stream) => {
    stream.classList.add("progressive-chat");

    getMessages(stream).forEach((message) => {
      message.dataset.chatMessage = "true";
      message.innerHTML = getOriginalHtml(message);
      message.classList.remove("is-typing");
      message.hidden = !reduceMotion;
    });
  });
}

export function addProgressiveChat(
  timeline: TimelineLike,
  container: HTMLElement,
  streamSelector: string,
  position: number,
  options: ProgressiveChatOptions = {},
): number {
  const stream = container.querySelector<HTMLElement>(streamSelector);

  if (!stream) {
    return 0;
  }

  const messages = getMessages(stream);
  let elapsed = 0;

  messages.forEach((message) => {
    const isBot = message.classList.contains("bot");
    const thinkTime = isBot ? BOT_THINK_MS : 0;
    const duration = getMessageDuration(message);
    const messageStart = elapsed + thinkTime;

    if (isBot) {
      timeline.add(() => playTypingIndicator(message, 0), position + elapsed / 1000);
    }

    timeline.add(() => typeMessage(message, duration), position + messageStart / 1000);
    elapsed = messageStart + duration + MESSAGE_GAP_MS;
  });

  if (options.completeClass) {
    timeline.add(
      () => container.classList.add(options.completeClass ?? ""),
      position + elapsed / 1000,
    );
  } else {
    timeline.add(() => undefined, position + elapsed / 1000);
  }

  return elapsed / 1000;
}
