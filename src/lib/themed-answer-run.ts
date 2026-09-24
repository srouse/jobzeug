import { mastra } from "@/mastra";
import type { ChatJobPostingPayload } from "@/lib/job-posting";
import {
  type AnswerSection,
  themeOutlineSchema,
  themeWriterSchema,
  unionCitations,
  sectionsToAnswerMarkdown,
  type ThemeOutline,
} from "@/lib/themed-answer";
import { citeEvidenceSchema, emptyCitations } from "@/lib/evidence-citations";
import { ensureEvidenceWorkspace } from "@/mastra/workspace";

function parseStructured<T>(
  result: unknown,
  schema: { parse: (value: unknown) => T },
): T {
  const object =
    (result as { object?: unknown }).object ??
    (result as { structuredOutput?: unknown }).structuredOutput;
  return schema.parse(object);
}

function jobLineSnippets(
  jobPosting: ChatJobPostingPayload | null | undefined,
  jobLineIds: string[],
): string[] {
  if (!jobPosting || !jobLineIds.length) return [];
  const byId = new Map(jobPosting.lines.map((line) => [line.entryId, line]));
  return jobLineIds
    .map((id) => {
      const line = byId.get(id);
      if (!line) return null;
      return `[${line.section}/${line.theme}] ${line.text}`;
    })
    .filter((value): value is string => Boolean(value));
}

type UsageTotals = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

function emptyUsage(): UsageTotals {
  return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
}

function addUsage(into: UsageTotals, result: unknown): void {
  const record = result as {
    usage?: UsageTotals;
    totalUsage?: UsageTotals;
  };
  const usage = record.totalUsage ?? record.usage;
  if (!usage) return;
  if (typeof usage.inputTokens === "number") into.inputTokens += usage.inputTokens;
  if (typeof usage.outputTokens === "number")
    into.outputTokens += usage.outputTokens;
  if (typeof usage.totalTokens === "number") into.totalTokens += usage.totalTokens;
  else into.totalTokens = into.inputTokens + into.outputTokens;
}

async function writeThemeParagraph(input: {
  question: string;
  themeId: string;
  title: string;
  facts: string[];
  needLines: string[];
}): Promise<{ markdown: string; usage: UsageTotals }> {
  const agent = mastra.getAgentById("jobzeug-theme-writer");
  const needBlock =
    input.needLines.length > 0
      ? `\nNeed lines (context only — not Scott's experience):\n${input.needLines.map((line) => `- ${line}`).join("\n")}`
      : "";
  const prompt = `User question: ${input.question}

Section id: ${input.themeId}
Section title: ${input.title}

Facts you may use (only these):
${input.facts.map((fact) => `- ${fact}`).join("\n")}
${needBlock}

Write the section paragraph. Echo themeId "${input.themeId}".`;

  const runOnce = async () => {
    const result = await agent.generate(prompt, {
      structuredOutput: { schema: themeWriterSchema },
    });
    const written = parseStructured(result, themeWriterSchema);
    const usage = emptyUsage();
    addUsage(usage, result);
    return { markdown: written.markdown.trim(), usage };
  };

  try {
    return await runOnce();
  } catch (firstError) {
    try {
      return await runOnce();
    } catch {
      throw firstError instanceof Error
        ? firstError
        : new Error("Theme writer failed");
    }
  }
}

export async function runThemeOutline(input: {
  question: string;
  system?: string | null;
}): Promise<{ outline: ThemeOutline; usage: UsageTotals }> {
  await ensureEvidenceWorkspace();
  const agent = mastra.getAgentById("jobzeug-theme-outline");
  const prompt = `User question:\n${input.question}\n\nPlan exactly 3 themes that answer this (fewer only if unavoidable). Return structured themes only.`;

  const runOnce = async () => {
    const result = await agent.generate(prompt, {
      ...(input.system ? { system: input.system } : {}),
      structuredOutput: { schema: themeOutlineSchema },
    });
    const outline = parseStructured(result, themeOutlineSchema);
    const usage = emptyUsage();
    addUsage(usage, result);
    return { outline, usage };
  };

  try {
    return await runOnce();
  } catch (firstError) {
    try {
      return await runOnce();
    } catch {
      throw firstError instanceof Error
        ? firstError
        : new Error("Theme outline failed");
    }
  }
}

export type ThemedRunProgress = {
  onThemes: (sections: AnswerSection[]) => void;
  onSection: (section: AnswerSection) => void;
};

/** Outline → parallel writers. Calls progress hooks for early UI paint. */
export async function runThemedAnswer(input: {
  question: string;
  system?: string | null;
  jobPosting?: ChatJobPostingPayload | null;
  progress?: ThemedRunProgress;
}): Promise<{
  sections: AnswerSection[];
  citations: ReturnType<typeof unionCitations>;
  answerMarkdown: string;
  usage: UsageTotals;
}> {
  const { outline, usage: outlineUsage } = await runThemeOutline({
    question: input.question,
    system: input.system,
  });
  const usage = { ...outlineUsage };

  const shells: AnswerSection[] = outline.themes.map((theme) => ({
    id: theme.id,
    title: theme.title,
    markdown: "",
    citations: citeEvidenceSchema.parse(theme.citations ?? emptyCitations),
  }));
  input.progress?.onThemes(shells);

  const written = await Promise.all(
    outline.themes.map(async (theme) => {
      const citations = citeEvidenceSchema.parse(
        theme.citations ?? emptyCitations,
      );
      const { markdown, usage: writerUsage } = await writeThemeParagraph({
        question: input.question,
        themeId: theme.id,
        title: theme.title,
        facts: theme.facts,
        needLines: jobLineSnippets(input.jobPosting, citations.jobLines),
      });
      const section: AnswerSection = {
        id: theme.id,
        title: theme.title,
        markdown,
        citations,
      };
      input.progress?.onSection(section);
      return { section, writerUsage };
    }),
  );

  for (const item of written) {
    addUsage(usage, { usage: item.writerUsage });
  }

  const sections = written.map((item) => item.section);

  return {
    sections,
    citations: unionCitations(sections.map((section) => section.citations)),
    answerMarkdown: sectionsToAnswerMarkdown(sections),
    usage,
  };
}
