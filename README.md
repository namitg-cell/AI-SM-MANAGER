# AI Social Media Manager — Seattle's Own Realty

An AI-powered social media content generator built as a Claude Code skill. Generates educational, platform-specific posts for LinkedIn, Instagram, Twitter/X, and Facebook — tailored for first-time home buyers in Seattle.

## How It Works

1. Open this project in Claude Code
2. Run `/social-media` and provide either:
   - A **YouTube URL** — Claude will extract the content and generate posts
   - A **topic** — e.g., "closing costs explained" or "best neighborhoods for first-time buyers in Seattle"
3. Claude generates tailored posts for all 4 platforms
4. Review and request edits if needed
5. Approved posts are logged to `posts-log.md`

## Project Structure

```
AI-SM-MANAGER/
├── .claude/
│   ├── settings.json          # Claude Code permissions
│   └── skills/
│       └── social-media.md    # The social media generator skill
├── CLAUDE.md                  # Brand voice & platform guidelines
├── posts-log.md               # Running log of all generated posts
└── README.md
```

## Brand Voice

- **Educational** — teach first, sell never
- **Seattle-focused** — local market data, neighborhoods, PNW lifestyle
- **First-time buyer friendly** — no jargon, empowering, approachable

## Requirements

- [Claude Code](https://claude.ai/claude-code) CLI installed
- An Anthropic API key or Claude Pro/Max subscription
