import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "LensForum-Bot/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: response.status });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text();

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");

    const image =
      $('meta[property="og:image"]').attr("content") || $('meta[name="twitter:image"]').attr("content");

    const siteName = $('meta[property="og:site_name"]').attr("content");

    return NextResponse.json({
      title,
      description,
      image,
      siteName,
      url,
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
