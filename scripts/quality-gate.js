#!/usr/bin/env node
// ============================================================================
// Quality Gate — Pre-publish Content Validator
// ============================================================================
// Mirrors Sabrina Ramonov's quality gate hook pattern from her Claude Code
// tutorial. Intercepts posts BEFORE they are logged/published and validates
// them against a set of brand and platform rules.
//
// If any check fails, the hook blocks the action and Claude must fix the
// issue before retrying.
//
// Usage (piped from Claude Code hook):
//   echo '{"tool_input":{"content":"...","platform":"twitter"}}' | node quality-gate.js
//
// Usage (standalone):
//   node quality-gate.js --content "post text here" --platform twitter
//
// Returns JSON:
//   { "decision": "allow" }
//   { "decision": "block", "reason": "..." }
// ============================================================================

const fs = require("fs");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PLATFORM_LIMITS = {
  twitter: 280,
  x: 280,
  linkedin: 3000,
  instagram: 2200,
  facebook: 5000,
};

const BANNED_WORDS = [
  "guaranteed",
  "no money down",
  "get rich",
  "act now",
  "limited time",
  "once in a lifetime",
  "you won't believe",
  "click here",
  "buy now",
  "dm me",
  "urgent",
  "free money",
  "crypto",
  "nft",
  "side hustle",
];

const PLACEHOLDERS = [
  "todo",
  "fixme",
  "insert",
  "placeholder",
  "your_",
  "replace_this",
  "[tbd]",
  "lorem ipsum",
];

// ---------------------------------------------------------------------------
// Validation checks
// ---------------------------------------------------------------------------

function validate(content, platform) {
  const errors = [];

  // CHECK 1: Em dash replacement (Sabrina's exact example)
  if (content.includes("\u2014")) {
    errors.push(
      "Contains em dashes (\u2014). Replace with '...' or regular dashes '-'."
    );
  }

  // CHECK 2: Platform character limits
  const limit = PLATFORM_LIMITS[platform?.toLowerCase()];
  if (limit && content.length > limit) {
    errors.push(
      `${platform} post exceeds ${limit} characters (currently ${content.length}). Shorten the post.`
    );
  }

  // CHECK 3: Banned words/phrases
  const lower = content.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      errors.push(`Contains banned word/phrase: '${word}'. Remove or rephrase.`);
    }
  }

  // CHECK 4: Must include at least 1 hashtag
  if (!content.includes("#")) {
    errors.push("Post is missing hashtags. Add at least 1 relevant hashtag.");
  }

  // CHECK 5: No placeholder text
  for (const ph of PLACEHOLDERS) {
    if (lower.includes(ph.toLowerCase())) {
      errors.push(
        `Contains placeholder text: '${ph}'. Replace with real content.`
      );
    }
  }

  // CHECK 6: Minimum content length
  if (content.length < 20) {
    errors.push(
      `Post is too short (${content.length} chars). Minimum 20 characters required.`
    );
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Input handling
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  let content = "";
  let platform = "unknown";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--content" && args[i + 1]) {
      content = args[++i];
    } else if (args[i] === "--platform" && args[i + 1]) {
      platform = args[++i];
    }
  }

  return { content, platform };
}

async function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve("");
      return;
    }
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

async function main() {
  let content = "";
  let platform = "unknown";

  // Try CLI args first
  const args = parseArgs();
  if (args.content) {
    content = args.content;
    platform = args.platform;
  } else {
    // Try stdin (Claude Code hook format)
    const stdin = await readStdin();
    if (stdin.trim()) {
      try {
        const input = JSON.parse(stdin);
        content =
          input.tool_input?.content || input.tool_input?.file_path || "";
        platform = input.tool_input?.platform || "unknown";

        // If we got a file path, try to read it
        if (content && fs.existsSync(content)) {
          content = fs.readFileSync(content, "utf8");
        }
      } catch {
        content = stdin.trim();
      }
    }
  }

  if (!content) {
    console.log(
      JSON.stringify({
        decision: "block",
        reason: "No content provided to validate.",
      })
    );
    process.exit(1);
  }

  const errors = validate(content, platform);

  if (errors.length === 0) {
    console.log(
      JSON.stringify({ decision: "allow", reason: "All quality checks passed." })
    );
  } else {
    console.log(
      JSON.stringify({
        decision: "block",
        reason: errors.join("\n"),
      })
    );
    process.exit(1);
  }
}

main();
