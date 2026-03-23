# AI Social Media Manager

An AI-powered social media content pipeline built with [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Generates educational, platform-specific posts for LinkedIn, Instagram, Twitter/X, and Facebook from a YouTube video or any topic.

Built for **Seattle's Own Realty** — targeting first-time home buyers in the Seattle area.

## Inspiration

This project replicates the AI social media manager workflow demonstrated by [Sabrina Ramonov](https://www.sabrina.dev/p/build-your-ai-personal-assistant-social-media-marketing) (creator of [Blotato](https://www.blotato.com/)). Her tutorial uses Blotato's paid API for auto-publishing and visual generation. This project implements the same architecture and patterns using only free, open tools — making it accessible to anyone with Claude Code.

### What This Project Demonstrates

| Sabrina's Concept | This Implementation |
|--------------------|---------------------|
| Claude Code Skills | `/social-media` — user-invocable skill that orchestrates the full pipeline |
| Subagents (parallel generation) | 4 platform-specific subagent skills that run simultaneously |
| Brand Voice | `brand-voice-samples.md` with real post examples + rules in `CLAUDE.md` |
| Quality Gate Hooks | `scripts/quality-gate.js` — pre-publish validation (banned words, char limits, formatting) |
| Blotato API (publishing) | Manual copy-paste workflow with structured post logging |
| Blotato API (visuals) | Image suggestions included in Instagram posts for manual creation |
| YouTube transcript extraction | WebFetch-based content extraction from YouTube URLs |
| Post tracking log | `posts-log.md` — timestamped record of all generated content |

## Architecture

```
AI-SM-MANAGER/
├── .claude/
│   ├── settings.json              # Permissions + quality gate hook config
│   └── skills/
│       ├── social-media.md        # Main orchestrator skill (/social-media)
│       ├── post-linkedin.md       # Subagent: LinkedIn post generator
│       ├── post-instagram.md      # Subagent: Instagram caption generator
│       ├── post-twitter.md        # Subagent: Twitter/X post generator
│       └── post-facebook.md       # Subagent: Facebook post generator
├── scripts/
│   └── quality-gate.js             # Quality gate validation script (Node.js)
├── brand-voice-samples.md         # Example posts that define brand voice
├── posts-log.md                   # Running log of all generated posts
├── CLAUDE.md                      # Brand configuration + project docs
└── README.md
```

### How It Works

```
User Input (YouTube URL or topic)
        │
        ▼
┌─────────────────────┐
│   /social-media      │  ◄── Main skill (orchestrator)
│   skill              │
└────────┬────────────┘
         │
         ├── WebFetch (if YouTube URL)
         │   └── Extract video content & key points
         │
         ├── Load brand voice (brand-voice-samples.md + CLAUDE.md)
         │
         ▼
┌────────────────────────────────────────────┐
│         Subagent Parallel Generation        │
│                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  │ LinkedIn  │ │Instagram │ │ Twitter  │ │ Facebook │
│  │ subagent  │ │ subagent │ │ subagent │ │ subagent │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
│       │             │            │             │
└───────┼─────────────┼────────────┼─────────────┼──┘
        │             │            │             │
        ▼             ▼            ▼             ▼
┌─────────────────────────────────────────────────┐
│              Quality Gate Validation             │
│                                                  │
│  ✓ No em dashes      ✓ Character limits          │
│  ✓ No banned words   ✓ Has hashtags              │
│  ✓ No placeholders   ✓ Minimum length            │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
              ┌─────────────────┐
              │  User Review &  │
              │  Approval       │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Log to         │
              │  posts-log.md   │
              └─────────────────┘
```

## Getting Started

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI or VS Code extension
- An Anthropic API key or Claude Pro/Max subscription

### Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/namitg-cell/AI-SM-MANAGER.git
   cd AI-SM-MANAGER
   ```

2. **Open in Claude Code** (CLI or VS Code)

3. **Run the skill**
   ```
   /social-media https://www.youtube.com/watch?v=VIDEO_ID
   ```
   or
   ```
   /social-media what are closing costs for first-time buyers
   ```

4. **Review** the generated posts, request edits if needed

5. **Approve** — posts are logged to `posts-log.md`

### Customizing for Your Brand

1. **Edit `CLAUDE.md`** — update brand name, location, target audience, and voice rules
2. **Edit `brand-voice-samples.md`** — replace sample posts with your own real content (3-5 per platform recommended)
3. **Edit `scripts/quality-gate.js`** — add/remove banned words, adjust character limits, add custom checks

## Key Concepts

### Skills
Saved instruction sets that automate complex workflows. Triggered with `/skill-name`. The main `/social-media` skill orchestrates the entire pipeline — from content extraction to quality validation to logging.

### Subagents
Claude can spawn multiple parallel instances (subagents), each handling a different platform simultaneously. Instead of generating posts one at a time, 4 subagents run at once — one for LinkedIn, Instagram, Twitter/X, and Facebook.

### Quality Gates
Automated validation that runs before posts are logged. Checks for formatting issues, banned content, character limits, and brand compliance. If a check fails, the post must be fixed before it can proceed. Implemented as both a shell script (`scripts/quality-gate.js`) and a Claude Code hook in `settings.json`.

### Brand Voice
Defined through two mechanisms:
- **Rules** in `CLAUDE.md` — explicit guidelines (tone, banned words, platform specs)
- **Examples** in `brand-voice-samples.md` — real posts that Claude pattern-matches against

## License

MIT
