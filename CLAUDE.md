# AI Social Media Manager — Seattle's Own Realty

## About This Project

This is an AI-powered social media content system built with Claude Code. It replicates
the workflow demonstrated by Sabrina Ramonov (creator of Blotato) for building an
AI social media manager — but uses free tools instead of paid APIs.

**What it does:** Takes a YouTube URL or topic and generates educational, platform-specific
social media posts for LinkedIn, Instagram, Twitter/X, and Facebook.

## Brand Identity

- **Brand Name:** Seattle's Own Realty
- **Industry:** Residential Real Estate
- **Location:** Seattle, WA (King County + surrounding areas)
- **Target Audience:** First-time home buyers in the Seattle metropolitan area

## Brand Voice Rules

1. **Educational first, never salesy** — teach concepts, don't push properties
2. **Approachable expert** — knowledgeable friend, not corporate agent
3. **Seattle-specific** — reference neighborhoods (Beacon Hill, Capitol Hill, Ballard, Columbia City, Fremont, Rainier Beach), local market data, PNW lifestyle
4. **Empower the buyer** — first-time buyers are smart for doing research; make them feel confident
5. **Jargon-free** — if a real estate term is used, explain it in plain language
6. **Data-driven** — use statistics, median prices, rates, and trends to build credibility
7. **Never use banned words** — guaranteed, act now, limited time, click here, buy now, DM me, URGENT, get rich, no money down, once in a lifetime, you won't believe, FREE money, crypto, NFT, side hustle

## Platform-Specific Guidelines

| Platform | Length | Tone | Hashtags | Special |
|----------|--------|------|----------|---------|
| LinkedIn | 150-300 words | Professional, insightful | 1-3 | Lead with data/hook, end with question |
| Instagram | 100-200 words | Conversational, encouraging | 5-10 | Include image suggestion, CTA to save/share |
| Twitter/X | ≤280 chars or 3-5 tweet thread | Punchy, direct | 1-2 | Threads for complex topics |
| Facebook | 100-200 words | Warm, community-focused | 1-3 | Ask questions, invite discussion |

## Quality Gates

All posts must pass these checks before being logged (see `scripts/quality-gate.js`):
- No em dashes (—) — replace with '...' or regular dashes
- Within platform character limits
- No banned words or phrases
- Contains at least 1 hashtag
- No placeholder text (TODO, FIXME, etc.)
- Minimum 20 characters

## Brand Voice Samples

See `brand-voice-samples.md` for reference posts that define the voice. Claude should
match the tone, structure, and style of these samples when generating new content.

## Project Structure

```
AI-SM-MANAGER/
├── .claude/
│   ├── settings.json              # Permissions + quality gate hook
│   └── skills/
│       ├── social-media.md        # Main skill: /social-media
│       ├── post-linkedin.md       # Subagent: LinkedIn post generator
│       ├── post-instagram.md      # Subagent: Instagram caption generator
│       ├── post-twitter.md        # Subagent: Twitter/X post generator
│       └── post-facebook.md       # Subagent: Facebook post generator
├── scripts/
│   └── quality-gate.js             # Quality gate validation script (Node.js)
├── brand-voice-samples.md         # Example posts defining brand voice
├── posts-log.md                   # Running log of all generated posts
├── CLAUDE.md                      # This file — brand config + project docs
└── README.md                      # GitHub-facing documentation
```

## Skills Reference

| Skill | Trigger | Description |
|-------|---------|-------------|
| `/social-media` | User-invoked | Main entry point — generates posts from YouTube URL or topic |
| `post-linkedin` | Subagent | Generates a single LinkedIn post |
| `post-instagram` | Subagent | Generates a single Instagram caption |
| `post-twitter` | Subagent | Generates a single Twitter/X post or thread |
| `post-facebook` | Subagent | Generates a single Facebook post |
