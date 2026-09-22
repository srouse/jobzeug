import { NextResponse } from "next/server";
import { loadResumeViewModel } from "@/lib/contentful/resume-model";

export async function GET() {
  try {
    const resume = await loadResumeViewModel();
    return NextResponse.json(resume);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load resume";
    const status = message.includes("Missing Contentful delivery env") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
