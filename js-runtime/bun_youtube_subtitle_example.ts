#!/usr/bin/env bun
/**
 * Bun example: fetch YouTube subtitles and optionally post them to an external endpoint.
 *
 * Usage:
 *   bun run bun_youtube_subtitle_example.ts <youtube-url-or-id> [--webhook=<URL>]
 *
 * Environment:
 *   TRANSCRIPT_LANG (optional): subtitle language code, defaults to "en".
 */
import { YoutubeTranscript } from "youtube-transcript";

type Args = {
  videoId: string;
  webhook?: string;
  lang: string;
};

function parseArgs(argv: string[]): Args {
  if (!argv[2]) {
    console.error("Usage: bun run bun_youtube_subtitle_example.ts <youtube-url-or-id> [--webhook=<URL>]");
    process.exit(1);
  }

  const webhookFlag = argv.find((arg) => arg.startsWith("--webhook="));
  const webhook = webhookFlag?.slice("--webhook=".length);
  const lang = process.env.TRANSCRIPT_LANG || "en";
  const raw = argv[2];

  let videoId = raw;
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
      if (url.searchParams.get("v")) {
        videoId = url.searchParams.get("v") as string;
      } else if (url.pathname.length > 1) {
        videoId = url.pathname.replace("/", "");
      }
    }
  } catch {
    // not a URL; treat as ID
  }

  if (!videoId) {
    console.error("Cannot parse YouTube video ID from input.");
    process.exit(1);
  }

  return { videoId, webhook, lang };
}

async function main() {
  const { videoId, webhook, lang } = parseArgs(process.argv);

  console.log(`Fetching transcript for video "${videoId}" (lang=${lang})...`);
  const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang });

  const text = transcript.map((item) => item.text).join(" ");
  const payload = {
    videoId,
    lang,
    lineCount: transcript.length,
    transcript: text,
  };

  console.log(`Lines: ${payload.lineCount}`);
  console.log("Transcript preview:");
  console.log(text.slice(0, 500) + (text.length > 500 ? "..." : ""));

  if (webhook) {
    console.log(`Posting transcript to webhook: ${webhook}`);
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }

    console.log("Webhook delivery succeeded.");
  }
}

main().catch((err) => {
  console.error("Failed to fetch or deliver transcript:", err);
  process.exit(1);
});
