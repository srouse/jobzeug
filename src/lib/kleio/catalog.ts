/**
 * Which KLEIO folders belong on the local image index.
 * Paths are relative to the KLEIO root. The archive itself is never written.
 *
 * `match` is tested against the path relative to `dir`.
 * Top-level folders in `skippedKleioFolders` are ignored by the check skill.
 */

export type KleioSource = {
  dir: string;
  match?: RegExp;
  /** Defaults to the KLEIO archive. `work` is Synology workProjects. */
  archive?: "kleio" | "work";
};

export type KleioProject = {
  id: string;
  title: string;
  sources: KleioSource[];
};

/** Image folders left out on purpose: personal work, copies, or an earlier cut. */
export const skippedKleioFolders = [
  "2017-05-17-AHA-SocialMedia",
  "2019-00-00-tracking",
  "2019-04-08-AHA-designs",
  "2024-05-10-StudioStories",
  "2024-05-28-TaxonomyGraphic",
  "2024-09-24 Partner Tour",
  "2024-09-28-visuals-examples",
  "2024-12-01 Tattoo",
  "2024-12-28 Tattoo",
  "2025-01-30-SE-OrgTree",
  "2025-03-02 Tattoo",
  "2025-05-15 - Tokens Video",
  "2025-07-31 Tattoo",
  "2025-08-16-pen-still-life",
  "2025-08-19-self-portrait",
  "2025-08-23-cover-print",
  "2025-09-05 Keys",
  "2025-09-06 CITIES TATTOO",
  "2025-11-17 - ExO v1 & 2",
  "2025-11-22 BlueCeramic",
  "2026-01-24 PillBoardSplash",
  "2026-01-26 Tattoo Berlin",
  "2026-01-31 Art",
  "2026-02-21-art-notes",
  "2026-04-26-deutsch",
  "2026-05-29-german-sheets",
  "2026-06-16-lozenge",
  "2026-06-24 DE-Cheatsheet",
  "2026-07-04-lozenge",
  "2026-07-17 Deutsch Quicksheet",
  "2026-08-15 German Studysheets",
  "2026-09-07-lozenge-bisque",
  "_COVERS",
  "_STICKS",
] as const;

export const kleioProjects: KleioProject[] = [
  {
    id: "S001",
    title: "Blueprints",
    sources: [{ dir: "2026-04-14-blueprints-docs" }],
  },
  {
    id: "S002",
    title: "Bulk Editor",
    sources: [
      { dir: "2025-06-22 - CTF AI Editor Designs" },
      { dir: "2025-10-06 Entry Flattener" },
      { dir: "2025-11-22 EA Flattener Vertical" },
      { dir: "2026-01-26 - Entry Flattener Horizontal" },
    ],
  },
  {
    id: "S003",
    title: "DemAI",
    sources: [
      { dir: "2025-03-03 AI Demos" },
      { dir: "2025-03-09-DemAI" },
      { dir: "2025-03-21-DemAI" },
      { dir: "2025-04-22-DemAI" },
      { dir: "2025-06-25 DemAI timeline" },
      { dir: "2025-07-17-DemAI-Timeline" },
      { dir: "2025-09-02-AIMScraper" },
      { dir: "2025-09-19 - DemAI Launch" },
      {
        dir: "2025-11-03 DemAI Job Worksheet",
        match: /v7\.png$/,
      },
    ],
  },
  {
    id: "S005",
    title: "State Farm tokens",
    sources: [
      { dir: "2023-10-28-Affirm/v4/source" },
      { dir: "2023-10-02-SF-StakeholderWorksheet" },
    ],
  },
  {
    id: "S006",
    title: "State Farm Figma design system",
    sources: [
      { dir: "2023-10-04-SFFigmaOrg" },
      { dir: "2023-11-08-SFDesignTokensPlugin" },
      { dir: "2023-10-01-FigmaTokensVisualization" },
    ],
  },
  {
    id: "S007",
    title: "State Farm Lit engineering bridge",
    sources: [{ dir: "2023-08-17-SF-Containment" }],
  },
  {
    id: "S008",
    title: "Contentful for Figma widget",
    sources: [
      { dir: "2024-05-21-FigmaCTFStudioTokensPlugin" },
      { dir: "2024-05-21-FigmaToStudio" },
      { dir: "2024-06-06-CTFFigmaTransformations" },
      { dir: "2026-01-22 CTF Figma Widget" },
      { dir: "2026-04-23-Figful-Nodes" },
      { dir: "2026-05-18-FigCtfWidget-Planning" },
      { dir: "2026-06-19 CTF Figma Widget - Binding Editor" },
      { dir: "2026-07-17 CFW Intro" },
      { dir: "2026-07-18 CFW Deck" },
      { dir: "2026-09-04-CfFExport" },
    ],
  },
  {
    id: "S009",
    title: "AI binding research",
    sources: [
      { dir: "2024-04-10-ContentBinding" },
      { dir: "2025-10-29 Hackathon Upslope" },
      { dir: "2025-10-30 - hackathon upslope" },
      { dir: "2026-07-21 Design Intent" },
    ],
  },
  { id: "S010", title: "Berlin prototype exploration", sources: [] },
  { id: "S011", title: "Figma Design System widget", sources: [] },
  { id: "S012", title: "Presentation Deck widget", sources: [] },
  {
    id: "S013",
    title: "Contentful Content Type widget",
    sources: [{ dir: "2022-08-08-Figma-Contentful-Content-Modeler" }],
  },
  {
    id: "S014",
    title: "Design tokens explained (article)",
    sources: [
      { dir: "2024-05-06-DesignTokenArticle" },
      { dir: "2024-05-15-ArticlePoster" },
      { dir: "2025-06-13 Design Tokens Video" },
      { dir: "2024-06-08-Keyboards", match: /^Design System/ },
    ],
  },
  { id: "S015", title: "Understanding AI by its building blocks (article)", sources: [] },
  { id: "S016", title: "Hidden cost of technical debt (article)", sources: [] },
  { id: "S017", title: "JSOnline ad system installation", sources: [] },
  { id: "S018", title: "Journal Interactive advertiser studio", sources: [] },
  {
    id: "S019",
    title: "Summit application design system",
    sources: [
      { dir: "2019-03-00-SCU-UUX/v00-01" },
      { dir: "2019-08-28-SCU-CarTransferExperience" },
      { dir: "Summit/_exports/DesignSystem", archive: "work" },
    ],
  },
  {
    id: "S020",
    title: "Summit marketing website rebuild",
    sources: [
      { dir: "2022-06-20-scu-content-platform" },
      { dir: "TODO/SCUWebsite_export/2022-06-20-presentation" },
    ],
  },
  {
    id: "S021",
    title: "Rates Central",
    sources: [
      { dir: "TODO/RatesCentral_export/2022-11-09-RCDesigns" },
      { dir: "TODO/RatesCentral_export/2022-11-07-adminDesign" },
    ],
  },
  {
    id: "S022",
    title: "2024 Partnership Tour - AI design systems",
    sources: [
      { dir: "2024-10-09 - 2024PartnerTour/v2" },
      {
        dir: "2024-10-09 - 2024PartnerTour/v3",
        match: /Cheatsheet/,
      },
    ],
  },
  { id: "S023", title: "AmFam R&D ListenAssist prototypes", sources: [] },
  {
    id: "S024",
    title: "Loan Visualizer (LOUI)",
    sources: [
      { dir: "2019-03-26-SCU-LOUI" },
      { dir: "Summit/_design/LOUI/_export/v04_05", archive: "work" },
      { dir: "Summit/_design/LOUI/_export/v05_01", archive: "work" },
      { dir: "Summit/_design/LOUI/LOUI-Compare/_export/v00_02", archive: "work" },
      {
        dir: "AppliedDataCorp/ADC-Examples",
        archive: "work",
        match: /Summit-LOUI/,
      },
    ],
  },
  {
    id: "S025",
    title: "Experience Orchestration (ExO)",
    sources: [
      // Contentful View Creator is the pre-ExO name. Narrate these as the early experiment, not as ExO.
      { dir: "2023-09-16-CTFL-WEBC-UI/_final", match: /View Creator/ },
      { dir: "2025-11-18 - ExO v3" },
      { dir: "2026-02-26 - ExO Surface" },
      { dir: "2026-04-03-ExO-Comps-4-Questions" },
      { dir: "2026-08-13 ExO Design Props" },
      { dir: "2026-08-26 DesktopExO" },
    ],
  },
  {
    id: "unassigned",
    title: "Unassigned",
    sources: [
      { dir: "2020-01-00-MonthlyNotesSummaries" },
      { dir: "2022-07-06-figma-contentful-idea-board" },
      { dir: "2023-08-15-ContentfulDesignSystem/v2" },
      { dir: "2023-09-16-CTFL-WEBC-UI/_final", match: /^(?!.*View Creator)/ },
      { dir: "2023-09-24-CTFL-WebCompsContentVariations/_source" },
      { dir: "2024-01-21-CTFL-JSON-Schema/2024-01-24/_source" },
      { dir: "2024-02-23-DemoBuildProcesses" },
      { dir: "2024-03-04-ArchMap" },
      { dir: "2024-03-06-CDef-FigmaPlugin" },
      { dir: "2024-04-02-ColorfulMonorepo" },
      { dir: "2024-04-04-TokensAndStudio" },
      { dir: "2024-04-08-ComponentTokens" },
      { dir: "2024-04-09-ContainersAndColumns" },
      { dir: "2024-04-10-Presentation" },
      { dir: "2024-04-17-ProvisioningV2" },
      { dir: "2024-04-25-DemoDesignSystemMilestones" },
      { dir: "2024-04-26-TechSavvy" },
      { dir: "2024-04-30-StudioWorkflowsV1" },
      { dir: "2024-05-02-StudioWorkflows" },
      { dir: "2024-05-03-StudioDayOne", match: /^(?!DayOne\/)/ },
      { dir: "2024-05-21-AI" },
      { dir: "2024-05-22-GenAIModel" },
      { dir: "2024-06-07-ColorfulTimeline" },
      { dir: "2024-06-12-StudioWorkflows" },
      { dir: "2024-06-19-DemoDSYSTimeline" },
      { dir: "2024-06-21-TaxonomyGraphics" },
      { dir: "2024-07-18-Forrester" },
      { dir: "2024-08-07-UXRefreshTimeline" },
      { dir: "2024-08-08-DemoShow&Tell" },
      { dir: "2024-10-14-DemoRebuild-2024-Q2-Q3" },
      { dir: "2024-10-16 - Slack Convos" },
      { dir: "2024-10-23 Demo 2.0" },
      { dir: "2024-10-24 Demo Timeline" },
      { dir: "2024-10-25 Demo Proposal" },
      { dir: "2024-11-04 Layout API Network" },
      { dir: "2024-11-08 Decoupled CMS Article" },
      { dir: "2024-11-18 Innovation Projects" },
      { dir: "2024-11-25 Forrester Gameplan" },
      { dir: "2025-02-05 OrgTree" },
      { dir: "2025-03-27-CMStoDXP" },
      { dir: "2025-04-09-Whoop" },
      { dir: "2025-04-24-Viewful" },
      { dir: "2025-06-17 - App AI Framework" },
      { dir: "2025-08-04 CCC Logo" },
      { dir: "2025-09-24 Quiz - DOM Scraper" },
      { dir: "2025-10-02 - Job Checklist" },
      { dir: "2025-10-06 - Slug Navigator" },
      { dir: "2025-10-06 - app icons" },
      { dir: "2025-10-06 SEO Walkthrough" },
      { dir: "2025-11-01 Q3 Whiteboard" },
      { dir: "2025-11-21 - Rogers Prompting" },
      { dir: "2025-12-16 Folder Tags" },
      { dir: "2026-02-22-DSysMaturityModel" },
      { dir: "2026-03-27 - Design Assessment" },
      { dir: "2026-04-20-markdown-viewer" },
    ],
  },
];

/** workProjects employer folders left out. Code trees are never walked. */
export const skippedWorkFolders = [
  "72craft",
  "AWS",
  "ActiveLifeSolutions_shared",
  "AmFam",
  "Asthmapolis",
  "Asthmapolis_v1",
  "Certeverus",
  "ChocolateShoppe",
  "Cortado",
  "DM blog",
  "DateCheckPro",
  "Deneb",
  "Deneb_client",
  "DrillQ",
  "EagleEye_local",
  "Earthling",
  "Fetch",
  "Flow",
  "Flow_dropbox",
  "Fonts",
  "FundRX",
  "GTD",
  "Healthography",
  "InVitalShare",
  "JSS",
  "LUM",
  "LeanStartup",
  "LivingLifeSolutions_local",
  "MathSense_local",
  "Max",
  "Max_share",
  "Propeller_local",
  "Quietyme",
  "Redox_local",
  "STEALTHbits",
  "STUDYBLUE",
  "Taskle",
  "Trimble",
  "highly.co",
] as const;
export function kleioTopLevel(dir: string): string {
  return dir.split("/")[0] ?? dir;
}
