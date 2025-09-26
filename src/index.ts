import axios from "axios";
import type { AxiosRequestConfig } from "axios";

interface YoutubeTranscriptOptions extends AxiosRequestConfig {
  transcriptLanguage?: string;
  outputFormat?: "json" | "xml" | "text";
}

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
}

class YoutubeTranscript {
  private static _extractVideoId(url: string) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  static async fetch(url: string, options?: YoutubeTranscriptOptions): Promise<string | object | string[]> {
    const videoId = this._extractVideoId(url);

    if (!videoId) {
      throw new Error(
        `Invalid YouTube URL: ${url}\n` +
          `Accepted formats:\n` +
          `- https://www.youtube.com/watch?v=VIDEO_ID\n` +
          `- https://youtu.be/VIDEO_ID\n` +
          `- https://youtube.com/watch?v=VIDEO_ID\n`,
      );
    }

    const { transcriptLanguage = "en", outputFormat = "json", ...axiosOptions } = options || {};

    const response = await axios.get(url, axiosOptions);

    const regex = /"INNERTUBE_API_KEY":"(.*?)"/;
    const apiKey = response.data.match(regex) ? response.data.match(regex)[1] : null;

    if (!apiKey) {
      throw new Error("Could not extract Youtube API key from the page");
    }

    const captionTracksList = await axios.post(
      "https://www.youtube.com/youtubei/v1/player",
      {
        context: { client: { clientName: "ANDROID", clientVersion: "20.10.38" } },
        videoId,
      },
      {
        params: {
          key: apiKey,
        },
        ...axiosOptions,
      },
    );

    if (captionTracksList.data.playabilityStatus?.reason?.includes("bot")) {
      throw new Error(`Request blocked by YouTube.\n` + `Please try again later or use a proxy server.\n`);
    }

    if (captionTracksList.status !== 200) {
      throw new Error(
        `Failed to fetch transcript: HTTP ${captionTracksList.status} - ${
          captionTracksList.statusText || "Unknown error"
        }`,
      );
    }

    const captionTrack = captionTracksList.data.captions.playerCaptionsTracklistRenderer.captionTracks;

    if (!captionTrack || captionTrack.length === 0) {
      throw new Error("No captions available for this video");
    }

    const matchedLanguage = captionTrack.filter(
      (l: CaptionTrack) => transcriptLanguage === l.languageCode,
    )[0];

    if (!matchedLanguage) {
      throw new Error(`Transcript not available for language code: ${transcriptLanguage}`);
    }

    const transcriptUrl = matchedLanguage.baseUrl;

    const transcript = await axios.get(transcriptUrl, axiosOptions);

    if (transcript.status !== 200) {
      throw new Error(
        `Failed to fetch transcript: HTTP ${transcript.status} - ${transcript.statusText || "Unknown error"}`,
      );
    }

    const transcriptJson = [...transcript.data.matchAll(/<p t="(\d+)" d="(\d+)">([\s\S]*?)<\/p>/g)].map(
      ([, t, d, text]) => ({
        start: parseInt(t),
        duration: parseInt(d),
        text: text.replace(/&#39;/g, "'").trim(),
      }),
    );

    const transcriptText = transcriptJson.map((t) => t.text).join(" ");

    switch (outputFormat) {
      case "json":
        return transcriptJson;
      case "text":
        return transcriptText;
      case "xml":
        return transcript.data;
      default:
        throw new Error(`Invalid output format: ${outputFormat}`);
    }
  }
}

export default YoutubeTranscript;
