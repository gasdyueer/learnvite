import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const DOCS_DIR = join(import.meta.dirname, "..", "docs");
const README_PATH = join(import.meta.dirname, "..", "README.md");

const MARKER_START = "<!-- AUTO_CONTENT_START -->";
const MARKER_END = "<!-- AUTO_CONTENT_END -->";

// 显示顺序（不含 .md 后缀）
const ORDER = [
  "how-to-improve-self-control",
  "script-guide",
  "aviutl2-guide",
  "engineering-cybernetics",
  "short_video_hooks",
];

/** 解析 YAML frontmatter，返回 { data, body }。兼容 \r\n。 */
function parseFrontmatter(text) {
  // 统一换行符
  const normalized = text.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return { data: {}, body: normalized };
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) return { data: {}, body: normalized };
  const raw = normalized.slice(4, end);
  const data = {};
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: normalized.slice(end + 5) };
}

/** 从 body 提取第一个 # heading 作为后备标题 */
function extractHeading(body) {
  const m = body.match(/^# (.+)$/m);
  return m ? m[1].trim() : null;
}

/** 收集所有内容文档的元数据 */
function collectEntries() {
  const files = readdirSync(DOCS_DIR).filter(
    (f) =>
      f.endsWith(".md") &&
      f !== "index.md" &&
      f !== "markdown-examples.md" &&
      f !== "api-examples.md",
  );

  // 按 ORDER 排序，未列出的按文件名排在最后
  const slugs = files.map((f) => basename(f, ".md"));
  const ordered = ORDER.filter((s) => slugs.includes(s));
  const rest = slugs.filter((s) => !ORDER.includes(s)).sort();

  return [...ordered, ...rest].map((slug) => {
    const raw = readFileSync(join(DOCS_DIR, `${slug}.md`), "utf8");
    const { data, body } = parseFrontmatter(raw);
    const title = data.title || extractHeading(body) || slug;
    const description = data.description || "";
    return { slug, title, description };
  });
}

/** 生成内容列表 markdown */
function generateContent(entries) {
  const lines = [];
  for (const { slug, title, description } of entries) {
    lines.push(`- **[${title}](/docs/${slug}.md)**`);
    if (description) {
      lines.push(`  ${description}`);
    }
  }
  return lines.join("\n");
}

/** 主流程 */
function main() {
  const entries = collectEntries();
  if (entries.length === 0) {
    console.warn("No doc entries found.");
    return;
  }

  const content = generateContent(entries);
  const section = `${MARKER_START}\n${content}\n${MARKER_END}`;

  const readme = readFileSync(README_PATH, "utf8");
  const startIdx = readme.indexOf(MARKER_START);
  const endIdx = readme.indexOf(MARKER_END);

  if (startIdx === -1 || endIdx === -1) {
    console.error(
      `Markers not found in README. Add ${MARKER_START} and ${MARKER_END} to README.md.`,
    );
    process.exit(1);
  }

  const updated =
    readme.slice(0, startIdx) + section + readme.slice(endIdx + MARKER_END.length);

  if (updated === readme) {
    console.log("README is already up-to-date.");
    return;
  }

  writeFileSync(README_PATH, updated, "utf8");
  console.log("README updated.");
}

main();
