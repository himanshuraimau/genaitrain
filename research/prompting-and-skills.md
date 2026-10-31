# Prompting & Skills: Research Notes for Teaching Non-Technical Learners

Researched 29 Oct 2026. Sources are official docs where possible; anything that comes only from third-party articles is marked **(unverified)**. Vendor features change fast, so re-check the "Verify before class" list at the bottom.

---

## Chapter 1: Prompting (the five-part framework)

### Why it matters
An AI assistant is like a brilliant new colleague who knows nothing about your company, your audience, or your taste. Anthropic's own docs use this exact picture: *"Think of Claude as a brilliant but new employee who lacks context on your norms and workflows. The more precisely you explain what you want, the better the result."*

**The colleague test** (Anthropic): show your prompt to a person with no background on the task. If they'd be confused, the AI will be too.

### The framework: Context, Task, Examples, Constraints, Output format

| Part | Question it answers | Weak | Strong |
|---|---|---|---|
| **Context** | Who is this for, and why? | "Write an email." | "I manage a 6-person sales team. Our biggest client is unhappy about a late delivery." |
| **Task** | What exactly should be done? | "Help with my report." | "Rewrite the summary below so a busy CEO can read it in 30 seconds." |
| **Examples** | What does good look like? | (nothing) | "Here is an email of mine I like. Match this tone." |
| **Constraints** | What are the limits? | (nothing) | "Under 120 words. No jargon. Don't promise a refund." |
| **Output format** | What shape should the answer take? | (nothing) | "Give me 3 subject lines, then the email body." |

Cross-vendor check: Google's own Workspace guide uses a 4-part version, **Persona, Task, Context, Format**, and says you don't need all four every time. Anthropic's best-practice list covers context, specificity, examples, and format. OpenAI's help center says the same in plainer words: be clear and specific, give enough context, iterate. So the five parts above are a teaching bundle of what all three vendors agree on, not a vendor-specific trick.

### Ten practical habits (from Anthropic's prompt-engineering guidance)
1. **Say exactly what you want.** "Plan a 3-day trip to Lisbon for two people on a moderate budget, mixing food and museums" beats "Plan a trip."
2. **Explain why.** "Keep the tone casual because this is the Friday team newsletter" teaches the AI more than "Be casual." Anthropic's docs: the model *generalizes from the explanation*.
3. **Be specific about length, format, audience, limits.**
4. **Show an example.** Paste a short sample and say "write the next one in this style." Anthropic suggests 3 to 5 examples for best results; start with one.
5. **Say what to do, not what to avoid.** "Write in flowing paragraphs" works better than "Don't use bullets."
6. **Allow "I don't know."** "If the data doesn't support a conclusion, say so instead of guessing." This reduces made-up answers.
7. **Ask for action when you want action.** "Rewrite this paragraph shorter" gets a result; "Could you maybe suggest changes?" often gets only advice.
8. **Split big jobs into steps.** Draft, then critique, then revise.
9. **Iterate.** The first answer is a draft. Reply with what's missing.
10. **Keep it simple.** Add structure only when a simple request fails.

### Optional power moves (still non-technical)
- **Give a role:** "Act as a careful HR manager." One sentence changes tone and focus.
- **Separate your material from your instructions.** Use clear labels like `Instructions:` / `Document:` (Anthropic recommends XML-style tags such as `<document>`; labels or headings do the same job for beginners).
- **Ask it to ask you.** "Before you start, ask me up to 5 questions you need answered."
- **Put long documents first, the question last.** (Anthropic long-context tip.)
- **Check the work.** Google: review output for clarity, relevance, and accuracy before using it.

### A reusable template for slides
```
Context:  I'm a [role] at [type of company]. This is for [audience] because [reason].
Task:     [One clear action: write / summarize / compare / plan / rewrite]
Examples: [Paste a sample you like, or say "none"]
Constraints: [Length, tone, things to avoid, must-include points]
Output:   [Table / 3 bullet points / email with subject line / etc.]
```

### Before/after examples (mixed roles + students)
- **Office:** "Summarize this meeting" becomes "I'm sharing notes from a 45-minute project meeting. Summarize for my manager, who wasn't there. Give: 3 decisions made, open questions, and action items with owners. Max 150 words."
- **Marketing:** "Write a caption" becomes "Write 3 Instagram captions for our new cold coffee launch. Audience: college students. Tone: playful, not salesy. Under 25 words each, one emoji max."
- **Student:** "Explain photosynthesis" becomes "I'm a first-year biology student with an exam on Friday. Explain photosynthesis in simple words using a kitchen analogy, then quiz me with 5 questions."

### Sources
- Anthropic, [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) and [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- Anthropic, [Best practices for prompt engineering (blog)](https://claude.com/blog/best-practices-for-prompt-engineering)
- OpenAI Help Center, [Prompt engineering best practices for ChatGPT](https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt) and [Write clear, specific prompts](https://help.openai.com/en/articles/4936848)
- Google Workspace, [Writing effective prompts](https://workspace.google.com/intl/en_ph/resources/ai/writing-effective-prompts) (Prompting guide 101: persona, task, context, format; 9to5Google reports "most successful prompts average around 21 words")
- Anthropic, [Interactive prompting tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial) (written for older models, still good for fundamentals)

---

## Chapter 2: Skills (what they are and why they matter)

### Plain-English definition
A **skill** is a saved "how we do this" guide that the AI reads **only when a task needs it**. It is a folder with one required file called `SKILL.md`: a name, a description of when to use it, and step-by-step instructions. It can also carry templates, example files, or small scripts.

Analogy for the class: *a skill is the laminated procedure card in a new hire's drawer.* You don't recite it in every conversation; the AI pulls it out when the situation matches.

### How it works (three levels, "progressive disclosure")
From Anthropic's docs and the open Agent Skills standard:

1. **Discovery.** The AI always sees every skill's name and one-line description (about 100 tokens each).
2. **Activation.** When your request matches a description, it opens the full `SKILL.md` instructions.
3. **Execution.** If the instructions point to extra files or scripts, it opens those only if needed.

Why it matters: you can install many skills without clogging the AI's memory, because only the matching one is loaded.

**The description is everything.** The AI decides whether to use a skill from its name and description alone. A good description says **what** it does and **when** to use it. Anthropic's skill-creator even advises being a little "pushy" because AI tends to under-use skills.

### Anatomy of a skill folder
```
client-update/
├── SKILL.md        required: name + description + instructions
├── references/     optional: long guides, policy docs
├── scripts/        optional: code for exact, repeatable steps
└── assets/         optional: templates, logos
```

Minimal example:
```markdown
---
name: client-update
description: Writes the weekly client status email. Use when the user asks for a client update, weekly status, or progress email.
---
# Client update
1. Ask for the client name and this week's notes if missing.
2. Write three sections: Work done, Next steps, What we need from you.
3. Warm, professional tone. Under 250 words.
```

### Rules on names and descriptions (Anthropic docs)
- `name`: max 64 characters, lowercase letters, numbers, hyphens only; can't contain "anthropic" or "claude".
- `description`: required, max 1,024 characters in the API docs. **Note:** Claude's Help Center article on creating skills says 200 characters for the description in the claude.ai upload flow. Teach "keep it under 200 characters" and you are safe on both.

### Practical use cases for a mixed audience
| Role | Skill idea |
|---|---|
| Any office worker | Meeting notes into decisions + action items in your team's format |
| Manager | Weekly status update; performance-review draft in company template |
| Marketing | Brand-voice checker; social post series from one blog post |
| Sales | Follow-up email after a call; account research brief |
| Finance / ops | Monthly report in a fixed layout; invoice organizer |
| HR | Job-description writer using company language |
| Student | Study-notes into flashcards; essay feedback in a rubric |
| Anyone | Branded slide deck, Word doc, Excel sheet, or PDF (the built-in document skills) |

Anthropic's own examples: branded documents, standard emails, meeting notes, task creation in Jira/Asana/Linear, data analysis with your team's methods, and partner skills from Notion, Figma and Atlassian.

### Skills are a shared, open format
Anthropic created the format and released it as an **open standard** (agentskills.io). OpenAI, Google and Microsoft now use the same `SKILL.md` idea (see Chapter 8). A skill you write once can often be reused elsewhere.

### Safety (important for non-technical learners)
- A skill can carry instructions **and code**, so a bad one can misuse tools or leak data. Anthropic: *treat skills like installing software.* Use skills from sources you trust, and read them before enabling.
- ChatGPT scans uploaded skills and marks them Ready / Needs Review / Blocked.
- Never put passwords or API keys inside a skill.

### Sources
- Anthropic, [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- Claude Help Center, [What are Skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [agentskills.io](https://agentskills.io): the open standard
- Anthropic engineering blog, [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

---

## Chapter 3: Prompts vs Skills vs Projects (and friends)

### One-line versions
- **Prompt:** what you type *now*. One-off. Gone when the chat ends.
- **Project:** a *workspace* with files and instructions, always on inside that workspace.
- **Skill:** a *method* the AI loads only when the task matches, across all your chats.
- **Custom instructions / preferences:** always-on rules about *you* in every chat.
- **Connector (MCP):** *access* to outside apps and data (Gmail, Drive, Notion).

### Comparison (adapted from Claude's Help Center)
| | Prompt | Skill | Project | Custom instructions | Connector |
|---|---|---|---|---|---|
| Main job | Ask for one thing | Teach a repeatable method | Hold background for one topic | General preferences | Link to outside tools/data |
| When active | Only this message | Only when task matches | Always, inside that project | Always, everywhere | When the AI needs the service |
| Works across all chats? | No | Yes | No, project only | Yes | Yes once connected |
| Example | "Summarize this PDF" | "Weekly client update format" | All files for Client X | "Be concise" | Read my team's task board |

**Best combo:** connector gives access, skill gives method, project gives context, prompt gives today's request.

### Decision guide
- Doing it once? **Prompt.**
- Same background files across many chats on one topic (a client, a course)? **Project.**
- Same *procedure* again and again (format, steps, tone)? **Skill.**
- Same *preference* everywhere ("keep answers short")? **Custom instructions.**
- Need the AI to *reach into* Gmail/Drive/Slack? **Connector.**

### Cross-vendor naming map (third-party source, last checked June 2026 by the author; names shift often)
| What it does | ChatGPT | Claude | Gemini |
|---|---|---|---|
| Workspace for a client/initiative | Projects | Projects | Notebook/Gems (changing, see Ch. 8) |
| Reusable method | Skills | Skills | Skills (replacing Gems) |
| Standing preferences | Custom Instructions | Preferences + Styles | Saved Info |
| Side-pane editor | Canvas | Artifacts | Canvas |
| Cited research agent | Deep Research | Research | Deep Research |
| Third-party integrations | Connectors / Apps | Connectors (MCP) | Apps / Workspace |
| Coding agent | Codex | Claude Code | Gemini CLI + Jules |

### Claude Projects facts (official)
Self-contained workspace with its own chat history, knowledge base (uploaded files) and instructions. Free users can create up to 5. Team and Enterprise can share projects. Paid plans get RAG mode, which extends knowledge capacity up to 10x.

### Source
[Claude Help Center: What are Skills? (comparison table)](https://support.claude.com/en/articles/12512176-what-are-skills), [What are Projects?](https://support.claude.com/en/articles/9517075-what-are-projects), [Bootstrap Creative terminology map](https://bootstrapcreative.com/chatgpt-vs-claude-vs-gemini-terminology/)

---

## Chapter 4: Hands-on A, use a built-in skill

### What's built in
**Claude (claude.ai):** four document skills run automatically when you ask for these files: **PowerPoint (pptx), Excel (xlsx), Word (docx), PDF (pdf)**. No setup. Requires code execution / file creation turned on in Settings.

**Anthropic's example library on GitHub** ([anthropics/skills](https://github.com/anthropics/skills), ~185k stars): includes brand-guidelines, canvas-design, doc-coauthoring, frontend-design, internal-comms, mcp-builder, skill-creator, slack-gif-creator, theme-factory, web-artifacts-builder, webapp-testing, plus the four document skills.

**ChatGPT:** eligible accounts get a built-in **skill-creator** skill (OpenAI Help Center).

**Gemini:** skills run with `/` + name; Gemini can also create one from your chats.

### Classroom activity (15 minutes, works for all roles)
Pick one:
1. **Deck in 5 minutes.** "Create a 6-slide PowerPoint explaining [your job/subject] to a new joiner. One idea per slide, speaker notes included."
2. **Messy to clean sheet.** Give a small messy list (expenses, attendance, tasks) → "Create an Excel sheet with totals and a chart."
3. **One-page PDF brief.** "Turn these notes into a one-page PDF summary with headings."

Then debrief: what did you ask for, what came back, what would you tweak? (Reinforces the Chapter 1 framework.)

### Where is it (Claude): Settings, Customize → Skills. Built-in document skills just activate; others can be toggled on.

---

## Chapter 5: Hands-on B, write your own skill

### Three routes, easiest first

**Route 1: Ask the AI to make it (best for beginners).**
- ChatGPT: type `@skill-creator` (ChatGPT Work) or just say "create a skill that…". Three ways: create with chat, the Skills page "Create" button, or upload a file.
- Claude: ask Claude to use the **skill-creator** skill, which interviews you about what the skill does, when it should trigger, and the output format, then drafts it.
- Gemini: build one directly or let Gemini create one from your chats.

**Route 2: Record yourself doing it (Claude Cowork, Mac, Pro/Max/Team).**
Customize → Skills → Add → "Record your screen". Do the task while narrating; Claude drafts a skill. Narrating helps because the AI can't see *why* you made each choice. Close private files first. Also a ChatGPT "Record & Replay" option exists per OpenAI docs.

**Route 3: Write it by hand (any plan).**
1. Make a folder named for the skill (lowercase, hyphens).
2. Inside, create `SKILL.md` with `name` and `description` frontmatter.
3. Write the steps in plain language, with an example.
4. Zip the folder (**the folder itself must be at the top level of the zip**).
5. claude.ai: Customize → Skills → upload zip → toggle on.

### Anthropic's skill-creator method (the loop to teach)
Capture intent → interview about edge cases → draft SKILL.md → test with 2 to 3 realistic prompts → review → improve → repeat. Optional: tune the description with about 20 "should trigger / should not trigger" prompts.

Tips from Anthropic's skill-creator:
- Keep `SKILL.md` under about 500 lines; move big material to separate files.
- Explain **why** a step matters rather than shouting ALWAYS/NEVER.
- Descriptions: say what AND when; include the trigger words people actually use.
- Test with realistic, messy requests, plus near-misses that should *not* trigger.

### Good beginner skill ideas
1. Meeting notes into decisions + action items
2. Weekly status email
3. "Explain like I'm new" study-notes generator
4. Brand-voice rewriter
5. Job-description writer

### Student worksheet (fill-in)
```
Skill name: ______________  (lowercase-with-hyphens)
It should activate when I say: ______________
Steps (3 to 6): 1. ______ 2. ______ 3. ______
Tone/length rules: ______________
One good example output: ______________
Things it must never do: ______________
```

### Test checklist
- [ ] Try 3 prompts that SHOULD trigger it. Did it?
- [ ] Try 1 prompt that should NOT. Did it stay quiet?
- [ ] Output matches my format every time?
- [ ] No secrets inside the folder?
- [ ] If it doesn't trigger: rewrite the description with more trigger words.

### Sources
[Claude Help: Creating custom skills](https://support.claude.com/en/articles/12512198-creating-custom-skills), [anthropics/skills skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md), [OpenAI: build skills](https://learn.chatgpt.com/docs/build-skills), [Google Workspace Updates: skills](https://workspaceupdates.googleblog.com/2026/09/skills-gemini-app-workspace.html)

---

## Chapter 6: How real people and companies use skills

**Source note.** I used blogs, official case studies and company posts that could be opened and read. I could not read tweets/X posts with my tooling, so none are quoted; the authors below are all reachable via the linked posts. Several are about *Claude Code*, a coding tool that people use for non-coding work. The workflows still show the skills idea. Quotes are exact; figures are as stated by the source.

### A. Practitioners (first-person blogs)

**Simon Willison, independent developer and writer (blog, 16 Oct 2025)**
- His framing: a skill is *a folder with a Markdown file telling the model how to do something*, optionally with reference docs and scripts. Quote: *"Skills are conceptually extremely simple."*
- Why he likes them: light on the AI's memory (only a short description is read at start), no new protocol to learn, and portable (he reports other coding assistants can use a skill when pointed at its `SKILL.md`).
- He predicts a **"Cambrian explosion"** of skills, and notes Anthropic's own PDF/Word/Excel/PowerPoint abilities are built this way.
- Source: [Claude Skills are awesome, maybe a bigger deal than MCP](https://simonwillison.net/2025/Oct/16/claude-skills/)

**Sachin Rekhi, product manager, runs Notejoy, teaches the AI Productivity course on Reforge**
Skills he built for his own PM work:
- **Strategy critique:** reviews his strategy drafts against frameworks he saved as files ("showing it what great looks like"); it flagged an overly broad target audience.
- **Competitor pricing brief:** visits competitor pricing pages live and writes an executive summary. He hand-verifies, and chose this over research tools that returned outdated pricing.
- **Customer-interview synthesis:** transcribes recordings, summarizes each with a fixed template, then lists patterns ranked by how often they appear, with quotes.
- **"Answer data curiosity":** plain-English question to a database query to an HTML report. He no longer waits on the data team for these.
- **Release notes:** reads a code change and writes user-facing notes, using his last 20 release notes as style examples.
- Source: [Claude Code for Product Managers](https://www.sachinrekhi.com/p/claude-code-for-product-managers)

**Marcus Moretti, general manager of Spiral (Every's AI writing product)**
- Wrote the product roadmap himself (six drafts); Claude produced about 100 detailed tickets from it. Quote: *"the only product document I've written is the roadmap."*
- A daily `/pulse` command writes an analyst-style briefing on usage and quality. He says it is *"just a Markdown file,"* adjusted about 50 times. That is the iteration habit worth teaching: a skill is never "done."
- He still reviews each ticket: Claude's first pass is right "in broad strokes", he fixes the details.
- Source: [Claude Code for Product Managers, Every](https://every.to/source-code/claude-code-for-product-managers)

**Smaller first-person write-ups (found in search, titles only checked, not fully verified)**
- An accountant building fixed-asset skills with reference documents: [Building Claude Skills as an Accountant](https://medium.com/@lovely.mcinerney/building-claude-skills-as-an-accountant-a-professional-skeptics-guide-5231b424a7f5)
- A job seeker who chained three small skills (resume + job request in, tailored package out): [I Replaced My Entire Job Search With One Claude Skill](https://abhijayvuyyuru.substack.com/p/i-replaced-my-entire-job-search-with)
- Recruiters recording their screen to create a skill: [Klikwork guide](https://klikwork.com/blog/claude-skills-for-recruiters)

### B. Companies (official launch quotes and case study)

From Anthropic's launch post ([claude.com/blog/skills](https://claude.com/blog/skills)):
| Company | Who said it | What they use skills for |
|---|---|---|
| **Rakuten** | Yusuke Kaji, General Manager AI | Management accounting and finance. Claude processes multiple spreadsheets, flags anomalies, writes reports following Rakuten's procedures. Stated result: a day of work cut to about an hour. Quote: *"Skills streamline our management accounting and finance workflows."* |
| **Box** | Yashodha Bhavnani, Head of AI | Turning stored files into PowerPoint, Excel and Word documents that follow an organization's standards. Quote: *"Skills teaches Claude how to work with Box content."* |
| **Notion** | MJ Felix, Product Manager | Connecting Claude to Notion so users go from questions to action, with more predictable results on complex tasks. |
| **Canva** | Anwar Haneef, GM & Head of Ecosystem | Customizing agents and extending what they can do. |

**Box in detail** ([official case study](https://claude.com/customers/box)): Box added document creation to its AI agent using Anthropic's pre-built skills instead of building it in-house. Stated results: a **contract redline in about two minutes instead of an afternoon** (e.g., changing the governing jurisdiction from New York to California and updating the related clauses), months of development time saved, concept to customer-facing in about a month. Darryl Sladden, Staff Product Manager for AI at Box: *"We just waited two minutes, and it output the entire document."* Note: the contract/redline example comes from Box's own case study, so treat the numbers as vendor-reported.

### C. Non-engineers inside Anthropic (Claude Code, official post)
From [How Anthropic teams use Claude Code](https://claude.com/blog/how-anthropic-teams-use-claude-code):
- **Legal:** built prototype "phone tree" systems to connect colleagues with the right lawyer.
- **Growth marketing:** an agent workflow that generates ad variations from a CSV, "hundreds of new ads in minutes instead of hours"; a Figma plugin that makes up to 100 variations by swapping headlines and descriptions.
- **Data science:** built visualization apps without knowing the programming language; used it to understand how data flows through systems.
- **Product design:** fed design files in so the code was written from them; mapped error states and edge cases during design.

### D. Anthropic's own description of why this works
*"Building a skill for an agent is like putting together an onboarding guide for a new hire."* ([Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)). Their advice: find where the AI struggles first, then write a skill for that gap; have the AI help capture what worked and what went wrong into the skill.

### Patterns across all of these (the teaching point)
1. **Start with a task you repeat weekly**, not a grand system (release notes, weekly pulse, interview summaries).
2. **Feed it examples of "great"**: Rekhi's last 20 release notes; his saved strategy frameworks.
3. **A skill is a living document**: Moretti edited his about 50 times.
4. **Human stays in the loop**: Rekhi hand-verifies pricing; Moretti reviews tickets.
5. **Output in a fixed shape** (template, report, document) so the result is predictable.
6. **Skills + access** (connectors, browser, database) is where the big wins appear.

### Caveats to say out loud
- Many "how I use Claude" posts are tutorials or marketing; time-saved numbers from blogs without method are not reliable. Company figures above are as stated by the companies.
- Some examples use Claude Code (a coding tool). The non-technical takeaway is the *workflow shape*, not the tool.

---

## Chapter 7: Where to find good skills

### Official sources (safest)
| Source | What you get | Note |
|---|---|---|
| [anthropics/skills](https://github.com/anthropics/skills) | Anthropic's example + document skills, template, spec | ~185k stars. For demo/education; test before relying on them. Install in Claude Code: `/plugin marketplace add anthropics/skills`. |
| [agentskills.io](https://agentskills.io) | The open standard, spec, quickstart, client showcase | Started by Anthropic, open to everyone. |
| ChatGPT Plugin Directory → Skills tab | OpenAI's directory (plugins bundle skills + connectors) | Plan availability differs, see Ch. 8. |
| [openai/skills](https://github.com/openai/skills) | OpenAI's Codex skills catalog (system / curated / experimental) | **Marked deprecated**; points to OpenAI's plugins repo. |
| Partner skills | Notion, Figma, Atlassian ship skills for their connected tools | Per Claude Help Center. |

### Community directories and GitHub collections
| Source | What it is | Stars (snapshot) |
|---|---|---|
| [github/awesome-copilot](https://github.com/github/awesome-copilot) | Community agents, instructions, **skills**, plugins for GitHub Copilot; browse at awesome-copilot.github.com | ~40.5k |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Big curated list: docs, marketing, writing, productivity, plus ~78 SaaS app automations | ~78k |
| [skillcreatorai/Awesome-Agent-Skills](https://github.com/skillcreatorai/Awesome-Agent-Skills) | Categorized list; install with `npx ai-agent-skills install <name>` | ~165 |
| [skills.sh](https://skills.sh) + `npx skills add owner/repo` (Vercel, launched 20 Jan 2026) | A leaderboard/directory of skill packages and an installer for many agents | Counts vary by source **(unverified)** |
| obra/superpowers | A popular developer-workflow skill set (brainstorm → plan → test → review) | Hundreds of thousands per aggregators **(unverified)**; mostly for coders |

Non-technical filter: the sections you actually want are **Document Processing, Business & Marketing, Communication & Writing, Productivity** in the ComposioHQ list, and the document/brand/internal-comms skills in anthropics/skills. Much of GitHub is developer-oriented, so tell learners it's fine to ignore most of it.

### How to judge a skill before installing (a 5-point checklist)
1. **Who made it?** Official or well-known author beats anonymous.
2. **Open the folder.** Is `SKILL.md` readable? Any scripts? Do they match what the skill claims?
3. **Look for red flags:** network calls to unknown sites, requests for passwords/keys, odd file access.
4. **Check the license** (some Anthropic document skills are source-available, not open source).
5. **Test it on dummy data first.** Never first-run on confidential files.

Anthropic's warning: *"Treat Skills like installing software."*

### Easy way to get started without GitHub
Ask your AI: "Find a skill for X" or use the skill-creator to make your own. The find-skills tool from Vercel's ecosystem exists for coding agents.

---

## Chapter 8: Skills across ChatGPT, Claude and Gemini (and Microsoft Copilot)

### The big picture
All major assistants have converged on the **same idea** (a folder with `SKILL.md`, loaded on demand), though each wraps it differently.

| | **Claude** | **ChatGPT** | **Gemini** | **Microsoft 365 Copilot** |
|---|---|---|---|---|
| Name | Skills (launched 16 Oct 2025 per a third-party source; Anthropic is the format's originator) | Skills (+ Plugins that bundle skills and apps) | Skills (replacing Gems) | Skills in Copilot Chat + declarative agents |
| Uses open `SKILL.md`? | Yes | Yes (builds on agentskills.io) | Yes (Google: "so you can copy skills from other platforms") | Yes, folder with SKILL.md |
| How to create | Chat with skill-creator; record screen (Cowork, Mac); upload ZIP | Chat with skill-creator, Skills page, or upload a file | In app, from your chats, or Docs skill builder | Chat in natural language, upload, edit in Copilot Chat |
| How to call | Automatic when relevant; mention it by name | Type `@` and pick it, or automatic | Type `/` + name, or automatic | Automatic (users can turn off auto-invoke) |
| Where | claude.ai, Claude Code, API (**separate library on each**) | ChatGPT (varies by plan), Codex | Gemini app, Google Workspace (**doesn't sync between them**) | Copilot Chat, Agent Builder, OneDrive/SharePoint |
| Sharing | claude.ai: individual only; API: workspace-wide | Share menu / workspace library (admin controlled) | Sharing and Drive files "coming" | Admin publishes/installs in admin center |

### Claude (official)
- Plans: Skills on Free, Pro, Max, Team, Enterprise; **code execution must be on**. Recording a skill: Pro/Max/Team, Mac only.
- **Skills do not sync across surfaces:** claude.ai ≠ API ≠ Claude Code. Upload separately.
- claude.ai skills are per-user (not org-wide, no admin management).

### ChatGPT (official help center plus secondary)
- OpenAI's Help Center names **Business, Enterprise, Healthcare and Edu** as eligible. A third-party analysis reports Skills (beta) listed on Free/Go/Plus/Pro pricing on 16 Oct 2026 **(unverified)**. Tell learners: *if you can't see the Skills tab, it's plan/admin settings, not you.*
- Built-in `skill-creator`. Uploaded skills are scanned (Ready / Needs Review / Blocked).
- Admin controls (Enterprise/Edu): enable skills, uploads, sharing, workspace publishing, install for others.
- Codex (coding): loads skills from `.agents/skills` folders.

### Gemini (Google's official blog + Workspace Updates)
- **Google is replacing Gems with Skills.** Skills are reusable instructions; run with `/`; Gemini can run them automatically; several can be stacked in one task; they can include reference files (text, PDFs, images).
- **Dates:** Gems support ends November 2026 (personal accounts), March 2027 (Workspace business/enterprise), June 2027 (education). Auto-conversion of personal Gems starts 17 Nov 2026 (per press, TechRepublic). Gems move into the Settings panel on 17 Nov per Google's Workspace Updates post.
- Gemini app rollout began 13 Oct 2026; Workspace rollout still in progress; Workspace Studio/app launch delayed as of Google's 13 Oct update.
- Skills differ from Gems: they run **inline** in the same chat, not as separate assistants.
- Gems/Skills in the Gemini app and in Workspace are separate libraries.

### Microsoft 365 Copilot (Message Center + third-party **(partly unverified)**)
- Skills for declarative agents: worldwide GA end of Sept 2026.
- Skills in Copilot Chat: rollout Oct to mid-Nov 2026; users can create, upload, edit; admins can publish, install, block.

### Why this matters for the class
**Learn the idea once.** The vocabulary changes (Skill / Gem / Custom GPT / Project), but "save the method, load it when needed" is the same everywhere. And because `SKILL.md` is a shared format, a skill from one tool can often be copied into another.

### Other tools worth a one-line mention (not deeply researched, verify before class)
- **NotebookLM** (Google): source-grounded notebooks.
- **Perplexity**: cited web research.
- **Cursor, VS Code/Copilot, Claude Code, Codex**: coding-oriented tools that also load skills (for the curious, not the target audience). Awesome-Agent-Skills lists Claude Code, VS Code/Copilot, Cursor, Amp, Goose, OpenCode as install targets.
- `skills` CLI README claims "OpenCode, Claude Code, Codex, Cursor and 72 more agents" **(third-party snapshot)**.

### Sources
- Google, [Let skills in Gemini tackle your most repetitive tasks](https://blog.google/products-and-platforms/products/gemini/automate-tasks-with-skills/); [Workspace Updates, Sept 2026](https://workspaceupdates.googleblog.com/2026/09/skills-gemini-app-workspace.html); [TechRepublic](https://www.techrepublic.com/article/news-gemini-gems-skills-migration/)
- OpenAI, [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) (could not be fetched directly; details from search summary and [Lilach Bullock's explainer](https://www.lilachbullock.com/how-to-use-skills-in-chatgpt/)); [Build skills](https://learn.chatgpt.com/docs/build-skills)
- Anthropic, [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview), [Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- Microsoft Message Center items MC1476977 and MC1493223 (via [mc.merill.net](https://mc.merill.net/message/MC1493223))
- Vercel, [Introducing skills](https://vercel.com/blog/introducing-skills)

---

## Verify before class (things that move fast)
1. **ChatGPT Skills plan availability**: official page says Business/Enterprise/Healthcare/Edu; one secondary source says consumer plans too. Check your own account.
2. **Gemini Gems to Skills dates** (Nov 17 2026, Mar 2027, Jun 2027) and the rollout in your country/account.
3. **Description length limit**: 200 chars (claude.ai help) vs 1,024 (API docs). Stay under 200.
4. **GitHub star counts** are snapshots; they change daily.
5. **Microsoft Copilot** rollout status for your tenant.
6. **openai/skills** repo is marked deprecated; follow its pointer to the plugins repo.

## Gaps in this research
- OpenAI's skills help page and Vercel pages could not be opened directly in my tooling, so some ChatGPT details come from search summaries and a third-party explainer.
- I did not open individual community skills to audit them; the "5-point checklist" is generic advice consistent with Anthropic's security guidance.
- Non-coding tools beyond the big three (NotebookLM, Perplexity, etc.) are mentioned but not researched in depth.

---

## Chapter 9: Skill builders to follow

Read from GitHub on 29 Oct 2026. Star counts are snapshots. All four collections are built for **AI coding assistants**; the value for a non-technical audience is the *design ideas* and a handful of general-purpose skills.

| Builder | Collection | What it is | Stars | License |
|---|---|---|---|---|
| **poteto** (GitHub display name "lauren poteto"; bio: React Compiler core team, xAI; pstack page says they have worked at Meta, Netflix, Cursor) | **pstack** ([cursor/plugins](https://github.com/cursor/plugins/blob/main/pstack/README.md), [mirror](https://github.com/backnotprop/pstack)) | An entry skill `/poteto-mode` routes to 23 playbooks plus about 24 short principles. Philosophy: "if you want to go fast, go deep first"; less code of higher quality; the best spec is the work itself. | 3.1k (mirror) | MIT |
| **Matt Pocock** | [mattpocock/skills](https://github.com/mattpocock/skills) ("Skills for Real Engineers", "straight from my .agents directory") | About 28 small composable skills, designed against four failure modes: misalignment, verbosity, broken code, ball of mud. | ~306k | MIT |
| **Jesse Vincent** (Prime Radiant; blog.fsck.com) | [obra/superpowers](https://github.com/obra/superpowers) | A complete method as skills: brainstorming, git worktrees, writing plans, subagent execution, TDD, code review, finishing. Includes a `writing-skills` meta skill. | ~308k | MIT |
| **Addy Osmani** (with collaborators) | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 25 skills by project phase (Define, Plan, Build, Verify, Review, Ship), 9 slash commands, 4 reviewer personas, 7 checklists; each skill has verification gates. | ~112k | MIT |

**Identity note:** you described the first author as "potato, P skills". The match I found is GitHub user `poteto` and **pstack**. The pstack pages credit "Poteto" and link an X profile; one third-party derivative repo (DipsySu/poteto-skills) calls them Lauren Tan. I could not confirm the surname from a primary page, so the site says "poteto." If you meant someone else, tell me the handle.

**General-purpose skills worth showing non-coders**
- Matt Pocock: `grill-me` (interviews you about a plan until decisions are resolved), `teach`, `research` (saves cited findings as Markdown), `handoff`, `wait-what` (re-explains a message that didn't land).
- pstack: `/unslop` (removes AI-style writing tells), `/how`, `/why`, `/teach`, `/interrogate`, `/reflect`.
- Superpowers: `brainstorming`, `writing-plans`, `verification-before-completion`, `writing-skills`.
- Addy Osmani: `interview-me`, `idea-refine`, `documentation-and-adrs`.

**Design habits they share:** small and focused; interview before acting; verification before "done"; a shared glossary; composable skills.

**Caveat on Pocock's repo:** third-party listings give different skill names/counts than the README (e.g. 21 vs 28). The repo changes often. I read the README directly; its `skills/` folder is organized into `engineering/`, `productivity/`, `misc/`, `in-progress/`, `deprecated/` (I could not open the subfolders, so I did not quote any SKILL.md verbatim).

---

## Chapter 10: Copy-and-paste demo (two original skills + teaching steps)

Both skills below are **original text written for this course** (not copied from the repos). Ideas credited: interview-first from Matt Pocock's `grill-me` and Jesse Vincent's `brainstorming`; plain-rewrite from pstack's `/unslop`. Descriptions are under 200 characters to be safe on claude.ai's upload limit.

### Skill 1: plan-grill
```markdown
---
name: plan-grill
description: Interviews you one question at a time to sharpen a plan before any work starts. Use when asked to grill me, poke holes, or stress-test a plan.
---
# Plan grill

Goal: reach a shared understanding of the plan before writing or doing anything.

1. Restate the plan in two sentences and ask if that is right.
2. Ask ONE question at a time. Wait for the answer before asking the next.
3. With every question, give your own recommended answer and a one-line reason, so I can reply "yes" or correct it.
4. Go in this order: goal, audience, constraints (time, money, people), risks, and what "done" looks like. If one answer changes another, settle that one first.
5. If the answer is in files or notes I shared, look it up instead of asking me.
6. When no open questions remain, write a one-page summary: goal, decisions made, open risks, next three steps.
7. Do not start the actual work until I say the summary is right.
```

### Skill 2: plain-english-edit
```markdown
---
name: plain-english-edit
description: Rewrites text in plain, human-sounding English: short, concrete, no filler. Use when asked to simplify, tighten, remove jargon, or make text sound less like AI.
---
# Plain English edit

Rewrite the text I give you. Keep my meaning and facts. Change only the wording.

1. Use short sentences and everyday words. Prefer "use" over "utilize".
2. Cut filler openers ("In today's fast-paced world", "It is important to note") and empty closers.
3. Replace vague claims with the specific detail I gave. If a detail is missing, keep the claim plain instead of inventing one.
4. Remove stacked adjectives, hype words, and repeated points.
5. Keep my voice: if I wrote casually, stay casual.
6. Return the rewrite first, then a short list of what you changed and why (max 5 bullets).
7. Never add facts, numbers or quotes that were not in my text.
```

### Step-by-step for learners
**Route A (any tool, no files):** copy the text, open a new chat, type "Create a skill from the text below and save it", paste, approve. Needs skills support on your plan (see Chapter 8).
**Route B (Claude, upload):** make a folder named `plan-grill`; save the text in plain-text mode as `SKILL.md` (not `.txt`); zip the *folder*; Customize, Skills, upload zip, switch on (code execution must be enabled).
**Test:** one prompt that should trigger ("I'm planning a 2-day offsite for 20 people. Grill me on the plan.") and one that shouldn't ("What's the capital of Australia?"). Check: one question at a time, a recommended answer each time, a one-page summary at the end, and no work started before approval.
**Customize:** change step 4's order (plan-grill) or step 5's tone (plain-english-edit), then re-test.
**Fallback (any plan):** paste the text at the start of a chat, or into a Project's instructions. Same behavior, not a true skill.

### 20-minute class script
2 min hook ("what do you re-explain to an AI every week?"), 3 min live demo (route A), 5 min everyone installs, 5 min everyone tests on their own plan, 5 min edit one line, re-test and share.

### Not yet tested
I have not installed these two skills in a live Claude/ChatGPT/Gemini account from here. The format follows the documented rules (name, description, steps), but run both once yourself before class.

---

## Chapter 11: Using AI wisely (the 4 Ds)

Source: Anthropic's free course [AI Fluency: Framework & Foundations](https://anthropic.skilljar.com/ai-fluency-framework-foundations), based on the framework by Rick Dakan and Joseph Feller with Anthropic. The framework PDF is **CC BY-NC-SA 4.0** (non-commercial, share-alike): I paraphrased, and if the course is paid, check the license before reusing their exact wording or diagrams.

- **Delegation:** choosing goals and deciding whether, when and how AI is involved. Three interaction modes: automation, augmentation, agency.
- **Description:** stating aims clearly enough to get useful output (links to Chapter 1).
- **Discernment:** judging how good the output and behavior really are. The course has a "Description-Discernment loop" lesson.
- **Diligence:** owning what you do with AI and how you do it.
- Course outline (page): intro and 4D framework, what is generative AI (capabilities and limitations), Delegation, Description, effective prompting techniques, Discernment, the Description-Discernment loop, Diligence, certificate.
- The 60-second checklist, delegation sort and diligence list on the slides are **my own teaching material** in the spirit of the framework, not quotes from the course. The "check findings against the originals" idea also appears in Google's Prompting Essentials page.
- Fact used from Anthropic's docs: Agent Skills are not covered by zero-data-retention arrangements; skill definitions and execution data follow standard retention policy.

## Chapter 12: Courses to keep learning

Read 29 Oct 2026. Titles and summaries only; no course content copied.

| Course | Provider | Length / cost | What it covers | Notes |
|---|---|---|---|---|
| [AI Fluency: Framework & Foundations](https://anthropic.skilljar.com/ai-fluency-framework-foundations) | Anthropic | Free; length not listed; certificate after final assessment | 4D framework, gen AI basics, prompting, loops | For everyone |
| [Introduction to Agent Skills](https://anthropic.skilljar.com/introduction-to-agent-skills) | Anthropic | Free | What are skills; first skill; multi-file; skills vs other features; sharing; troubleshooting | Claude Code-focused |
| [Agent Skills with Anthropic](https://www.deeplearning.ai/short-courses/agent-skills-with-anthropic/) | DeepLearning.AI; instructor Elie Schoppik (Anthropic) | Beginner, 2h19m, 10 video lessons; graded quiz/certificate via DeepLearning.AI PRO | Why skills; skills vs tools/MCP/subagents; pre-built and custom skills; API, Claude Code, Agent SDK | Builder-oriented |
| [Google AI Essentials](https://grow.google/ai-essentials/) | Google via Coursera | Under 5 hours; $49/month US/Canada after 7-day trial | 5 modules incl. prompting and responsible use | Beginner |
| [Google Prompting Essentials](https://grow.google/prompting-essentials/) | Google | Page lists 8 courses of about 1 hour each; $49/month US/Canada | Fundamentals; brainstorming; research; writing; content; data; app building/deployment | Older articles say 4 modules, so verify; the "5-step framework" is mentioned in third-party sources but the page does not name the steps |
| OpenAI Academy: AI Foundations, Applied AI Foundations | OpenAI | Free with a ChatGPT account; about 60 to 75 min (AI Foundations) | Prompting, context, checking output, responsible use; Applied: repeatable workflows | **Read via search summary only**; OpenAI's help page returned 403 |

**Not verified / skipped:** DeepLearning.AI "AI for Everyone", DataCamp, Vanderbilt and Learn Prompting appear only in vendor-ranked listings in my searches, so I did not include them.

**Gaps in our notebook the courses revealed:** verifying output and privacy (now Chapter 11); sharing skills across a team and troubleshooting (troubleshooting is in Chapter 10; team sharing is not yet covered); skills vs MCP/connectors in depth (touched in Chapter 3).

---

## Part 2: Everyday skills (Chapter 13)

One chapter, six reusable skills. The earlier prompt-based use-case chapters were removed. The pattern taught: **save the skill once (fill in your own style), then each day type a few key points and the skill name.** Skills stack: for slides the built-in PowerPoint skill builds the file and the custom skill sets the look (Anthropic: skills work together; Google describes stacking skills in one prompt).

| # | Skill | Fill in once | Daily prompt (example) |
|---|---|---|---|
| 1 | `my-deck-style` | colors, fonts, footer, slide count, tone | "Make a deck for my manager about last quarter's sales... Use my-deck-style." |
| 2 | `meeting-actions` | nothing | "Notes for my manager: [paste]. Use meeting-actions." |
| 3 | `email-reply-my-voice` | the "My style" lines | "Reply to this email: [paste]. Say X, not Y. Use email-reply-my-voice." |
| 4 | `weekly-update` | section names, word limit | "Weekly update, week of 3 Nov. Done: ... Use weekly-update." |
| 5 | `tidy-sheet` | optional category names | "Use tidy-sheet on these March expenses. Dates are DD/MM. [paste]" |
| 6 | `brand-voice-posts` | brand, voice words, formats | "New cold coffee launches 1 Nov. Instagram posts. Use brand-voice-posts." |

Also in the chapter: how to save and call a skill (paste-and-ask, or zip upload; Claude by name, ChatGPT with `@`, Gemini with `/`); a **shortcut** prompt that asks the AI to build a skill from the user's own best work (follows Anthropic's advice to have the AI capture what worked); a "keep improving" slide (Moretti's roughly 50 edits); a table of more skill ideas; and a 15-minute activity.

All skill text and examples are **original, written for this course**. Example outputs are illustrative, not real AI transcripts. Every skill description is under 200 characters (checked by the build script). **Not yet tested in a live account**: run each once before teaching.

---

## Part 3: MCP (Model Context Protocol) research

Researched 31 Oct 2026. Official docs wherever possible. **(3P)** = third-party source only, treat as unverified. **(blocked)** = the official page returned 403/404, so I used a search summary.

### A. What MCP is (reused from earlier notes, re-confirmed)
- modelcontextprotocol.io: open standard for connecting AI apps to external systems; "like a USB-C port for AI applications".
- Roles: **host** (the AI app) creates one **client** per **server**. Servers offer **tools** (actions), **resources** (file-like data), **prompts** (templates). **Local** servers use stdio; **remote** servers use Streamable HTTP, OAuth recommended. Spec version in docs: 2026-07-28.
- Claude's own docs (claude.com/docs/extend/overview): "MCP connectors give Claude access to a tool or data source, and skills teach it how to do a task the way you or your team does it. Plugins package skills, MCP connectors, commands, and agents into one unit."
- **Correction to earlier notes:** the line "The connector provides the access, the skill provides the method" was NOT found word for word on the Claude Help pages I fetched (skills page, connectors page, extend overview). The idea is official (quote above). Use the official wording above, or mark the short line as a paraphrase.

### B. Claude (official: support.claude.com custom connectors + connectors articles, claude.com/docs/extend, code.claude.com/docs/en/mcp)
- **Name:** "Connectors". Custom ones are "custom connectors" using remote MCP. Browse the **Connectors Directory**.
- **Where to click:** `Customize > Connectors` in claude.ai or Claude Desktop; in a chat, the `+` button then `Connectors` toggles them per conversation. "Search and tools" menu turns individual tools off.
- **Plans:** web connectors on all users (Claude, Cowork, Desktop, mobile). Custom remote connectors on Free (limit: one), Pro, Max, Ultra, Team, Enterprise.
- **Who can add:** Pro/Max: any account holder. Team: Owners and Primary Owners only. Enterprise: Owners, Primary Owners, and custom roles with "Manage access to Libraries". Each person then connects and signs in individually. A shared API-key connector gives everyone that key's access.
- **Owner steps (Team/Enterprise):** Organization settings > Connectors > Add > Custom > Web > name + remote MCP URL > review auth > choose "Sign in now / when needed / no sign in" > Add. Members: Customize > Connectors > Connect. To change details you must remove and re-add.
- **Permissions:** admins can set a tool or category to Always allow / Needs approval / Blocked (org-wide, users cannot override). Users see approval prompts; "Allow always" only for trusted servers. Claude only narrows access, it never grants more than the source app allows.
- **Local vs remote:** custom connectors connect **from Anthropic's cloud**, not your device, so the server must be reachable on the public internet (VPN/private-network servers fail unless Anthropic IP ranges are allowlisted). Local servers via `claude_desktop_config.json` work on your machine but not in Cowork or claude.ai, and not in advanced research. **Desktop extensions** are the one-click local option on Claude Desktop (article gives no detail).
- **Research mode:** tools run automatically without approval. Disable write tools first.
- **Claude Code:** `claude mcp add --transport http <name> <url>` (example in docs: `notion https://mcp.notion.com/mcp`); local: `claude mcp add ... -- <command>`; scopes local/project/user; `/mcp` to sign in; `claude mcp list/remove`; `claude mcp login/logout`. Docs warn: servers that fetch external content can expose you to prompt injection. Things added from the command line stay on that machine; things added in claude.ai sync to Claude Code with the same account.
- **Safety text from Claude Help:** Anthropic hasn't verified custom connectors; connectors can read, create, modify, delete data; servers can change tool behavior without notice; report malicious servers via HackerOne (MCP asset).
- Troubleshooting: the Help article has no troubleshooting section; the only stated cause is the server not being reachable from Anthropic's IP ranges.

### C. ChatGPT (official page **blocked**; mixed sources)
- help.openai.com article "Developer mode and MCP apps in ChatGPT" (via search snippet, **not read in full**): full MCP support including **write/modify** actions is in **beta** for **Business, Enterprise and Edu** on web; admins enable it first at Workspace Settings > Permissions & Roles > "Developer mode / Create custom MCP connectors"; each admin/owner enables it for themselves; on Business only admins can use it, on Enterprise/Edu admins can grant it to chosen people via roles; apps are published from workspace settings and appear as "custom" in the approved list; Pro users must enable developer mode to use custom apps.
- **Conflict:** several third-party guides say Plus and Pro also get developer mode **(3P)**. Free plan: not available (all sources agree). **Re-check in a live account before teaching.**
- developers.openai.com Apps SDK page (read): add via `chatgpt.com/plugins` > `+` > "Add custom MCP server" > name, description > connection URL (must end in `/mcp`) > authentication > risk warning "I understand and want to continue" > "Create as a plugin" > review the discovered tools. Needs a public HTTPS endpoint with Streamable HTTP; a "Secure MCP Tunnel" is an option for non-public servers. "Account and workspace policies apply." Tip from the page: test with MCP Inspector if ChatGPT cannot connect. (Note: this page calls them "plugins"; the help center calls them "apps/connectors". The naming is changing, so say so in the chapter.)

### D. Gemini (mixed; parts official)
- **Gemini app (consumer), official Gemini Apps Help (read):** "Connected Apps" > "Custom apps" > "Add a custom app" > paste the **MCP server URL** (web app only, gemini.google.com; then also usable on mobile; type `@` to pick the app). Limits stated by Google: age 18+, **US only**, **personal Google Account only (no work/school)**, Keep Activity on, **English only**. "Gemini requires manual confirmation for any write actions." "Google does not control, monitor, or secure third-party MCP servers." The help page does not mention plans; third-party pages say it sits in "Gemini Spark" (beta, Ultra first, Pro in US) **(3P)**.
- **Gemini Enterprise, Business edition, official (read, updated 15 Sep 2026):** a team **administrator** adds it: Settings & help > team > Manage team > Connected apps > Add MCP Server > URL + name > auth (none or OAuth 2.0) > Add; disabled by default until enabled. Streamable HTTP only (legacy SSE not supported), public HTTPS endpoint, **pre-GA**. (A vendor guide claimed Business doesn't support custom MCP, contradicting Google. Trust Google's page.)
- **Google-hosted MCP servers for Workspace, official (read, google developers pages updated 29 Oct 2026):** Gmail, Drive, **Docs, Sheets, Slides**, Calendar, Chat, People, Classroom. **Developer Preview Program** membership required. Needs a Google Cloud project, enabling the product's MCP API (e.g. `drivemcp.googleapis.com`; endpoint `https://drivemcp.googleapis.com/mcp/v1`), an OAuth client marked "for an AI-powered agent", gcloud CLI. Supported clients: Google Antigravity, **Claude (claude.ai and Desktop) as a custom connector on Pro/Max/Team/Enterprise**, any remote-MCP client with OAuth. Inherits the user's permissions. Page warns of prompt injection. **Developer-level setup, not a click-through for a non-technical person.** Drive MCP has 8 tools (search, read, download, create, copy, metadata, permissions, recent files).
- **Gemini CLI, official (read):** `gemini mcp add --transport http <name> <url>` or `mcpServers` in settings.json; asks to confirm tool calls; `trust: true` skips confirmations (page says only for servers you fully control). **Notice on the page: Gemini CLI was replaced by Antigravity CLI on 18 Jun 2026 for unpaid tier and Google One users.** Developer tool.
- **Gemini API** (Interactions API remote MCP) = developer-only **(3P, not verified)**.
- **Not available (plainly):** in the *consumer* Gemini app there is no Workspace-MCP click-through; Docs/Slides/Drive MCP is Developer Preview. Gemini's own Gmail/Drive/Calendar "apps" already work in Gemini without MCP (separate from this topic).

### E. Microsoft 365 Copilot / Copilot Studio
- **Copilot Studio, official (read, updated 17 Oct 2026):** an agent can connect to an existing MCP server through an onboarding wizard, and you can also create one; Copilot Studio supports MCP **tools and resources** (not prompts); needs **generative orchestration** on; tool changes on the server are reflected dynamically; "you're responsible for the tools and resources you access" from non-Microsoft servers. Maker/admin task, not an end-user toggle.
- **Microsoft 365 Copilot (non-Studio):** only secondary sources (Message Center post MC1169071 mirrors, dated Nov 2025) say MCP-based agents can appear in the Copilot Agent Store and are managed in the Microsoft 365 admin center **(3P, unverified for 2026)**. Say "admin-managed; check with your IT team".

### F. Tableau (official repo github.com/tableau/tableau-mcp, "Tableau Supported" badge)
- Tableau's official MCP server. Examples: query a data source (top states by sales), find most-viewed workbook, get a named view.
- **Hosted option for Tableau Cloud:** managed service at `https://mcp.tableau.com`, OAuth 2.1, signs in as you, "all existing per-user permissions are enforced". **Self-hosted** (`@tableau/mcp-server`, Node 22.7.5+; Docker): Personal Access Token settings (SERVER, SITE_NAME, PAT_NAME, PAT_VALUE). Works with any client that accepts MCP config; the repo page links a "popular client integrations" guide for Claude, Slack and ChatGPT. Package is web only (no Tableau Desktop data).
- Not verified: exact tool names, whether claude.ai's custom-connector flow works unchanged with the hosted URL (check live).

### G. Notion and Slack (official)
- **Notion MCP:** remote server hosted by Notion, OAuth, search/read/create/update pages and databases, sees only what you can access. Admin: workspace owners manage client access under Settings > Notion MCP > Manage workspace clients; limiting which clients members may connect needs Enterprise. Claude Code example URL `https://mcp.notion.com/mcp` (from Claude Code docs).
- **Slack MCP (docs.slack.dev):** `https://mcp.slack.com/mcp` Streamable HTTP; search, send messages, canvases, files, lists; **workspace admins approve and manage** MCP client integrations; audit logs; partner clients listed: Claude.ai, Claude Code, Perplexity, Cursor (ChatGPT not mentioned on that page). Only directory-published or internal apps may use MCP. No plan info on the page.

### H. Build your own
- **Official quickstart** (modelcontextprotocol.io/docs/develop/build-server, Python tab read): needs Python 3.10+ and **Python MCP SDK 2.0.0 or higher**; `uv init weather`, `uv add "mcp[cli]"`; code uses `from mcp.server import MCPServer`, `mcp = MCPServer("weather")`, `@mcp.tool()` decorators, `mcp.run(transport="stdio")`; run with `uv run weather.py`; connect to Claude Desktop by editing `claude_desktop_config.json` (`mcpServers` > `command: uv`, `args: --directory <absolute path> run weather.py`), then restart. **STDIO warning:** never `print()` to stdout, use `logging` (stderr). TypeScript tab exists (not read).
  - Not verified by me: that the quickstart code runs on my machine. Run it once before putting it in the chapter. Also the quickstart imports `httpx2` (the SDK's dependency) in the new SDK.
- **MCP Inspector (official GitHub repo, read):** `npx @modelcontextprotocol/inspector` opens a web UI; also `--cli` and `--tui`. Stores secrets in OS keychain if available, otherwise unencrypted `~/.mcp-inspector/secrets.json`. The README did not explain connect steps; the build-server page shows `npx @modelcontextprotocol/inspector --cli node build/index.js --protocol-era modern --method tools/list`. Need Node.
- **No-code: Zapier MCP (official docs, read):** an MCP server holding the apps/actions you pick, 9,000+ apps and 40,000+ actions; "agentic" vs "managed" modes; Streamable HTTP only (no SSE); sign in via OAuth; **each successful tool call uses two tasks** from your plan; sharing a server needs Team/Enterprise; SOC 2 Type II claimed by Zapier. Pricing figures not on the page.
- **Low-code: n8n MCP Server Trigger node (official docs, read):** makes n8n tools/workflows available to clients; SSE and streamable HTTP (no stdio); test and production URLs; auth None/Bearer/Header; Claude Desktop connects through `mcp-remote` gateway per the docs; claude.ai asks to sign in to n8n even with auth None (docs quirk); queue-mode and reverse-proxy caveats for self-hosting. Authentication is optional, so always set it.
- Connecting a custom server: **Claude** = Customize > Connectors > Add custom connector (needs a public HTTPS URL); **ChatGPT** = developer mode / "Add custom MCP server" (public URL ending `/mcp`); **Gemini** = consumer Connected Apps > Custom apps (US, personal account, English) or Gemini Enterprise > Manage team > Connected apps. All three need the server to be **reachable on the public internet**, so a local-only server needs a tunnel or hosting. (Tunnel tools such as ngrok/Cloudflare Tunnel not researched.)

### I. Safety (official: modelcontextprotocol.io security best practices + vendor docs)
- The MCP security page is aimed at **developers**. Topics: confused deputy (proxy servers + OAuth consent), token passthrough (forbidden), SSRF, state-handle hijacking (2026-07-28 spec replaced "session hijacking"), local MCP server compromise (malicious startup commands; clients must show the exact command and ask for consent), OAuth URL validation, mix-up attacks, localhost redirect impersonation, **scope minimization** (start with low-risk read scopes, step up later).
- Plain-words takeaways for learners (my paraphrase, not quotes): (1) a local server runs code on your computer with your privileges; (2) ask for the smallest permission; (3) a connector can act as you.
- **Prompt injection** is not the focus of that page. Source for it: Simon Willison, "The lethal trifecta" (simonwillison.net, 16 Jun 2025): private data + untrusted content + a way to send data out = risk; "avoid that lethal trifecta combination entirely"; real example: the GitHub MCP exploit (a malicious public issue made the agent leak private repo data). Claude Help, Claude Code docs, Google Drive MCP docs and Gemini Apps Help all carry prompt-injection or untrusted-server warnings.
- Vendor controls that exist: Claude per-tool Always allow / Needs approval / Blocked (admins), "Allow always" only for trusted; Gemini manual confirmation for write actions; Slack admin approval + audit logs; Notion owners can restrict clients (Enterprise).

### J. Named practitioner stories (primary sources) — STILL THIN
- Done: Willison's lethal trifecta (above), Willison on skills vs MCP (earlier notes). Official company use of connectors: Slack/Notion/Tableau docs above.
- **Not yet found:** a first-person, non-developer story of using a Tableau/Slides/Docs MCP day to day. Use case slides must therefore be labeled **illustrative** unless I find a primary source. Offer to do one more targeted search if you want named stories.

### K. Verify before class (MCP)
1. ChatGPT: which plans see developer mode / custom MCP today (OpenAI page was blocked).
2. Gemini consumer "custom apps": plan tier (Pro vs Ultra) and whether the US-only limit is lifted.
3. Whether the Google-hosted Docs/Slides servers have left Developer Preview.
4. Tableau hosted MCP URL working as a claude.ai custom connector (try with your own Tableau Cloud account).
5. Run the Python quickstart and the Inspector command once on a real machine.
6. Gemini CLI vs Antigravity CLI naming.

### L. Added after the clarifying questions (31 Oct 2026)
- **Claude's built-in Google connectors (official, support.claude.com "Use Google Workspace connectors", read):** Gmail, Google Calendar, Google Drive for all users on Claude and Claude Desktop; **Docs, Sheets, Slides are separate connectors for live editing.** Steps: `+` in chat > Connectors > toggle on > sign in with Google. Team/Enterprise: an Owner/Primary Owner enables them first. Claude can read Gmail (not attachment content), view Calendar, search/read Drive; can draft/send/reply/forward Gmail, create/update/delete Calendar events, create Docs/Sheets/Slides and edit them live in a side pane (Chrome on web, or Desktop with built-in browser on). **Limits: "Claude can't add charts to Google Slides"; Slides edits may not appear live in the pane.** Asks approval before sending, replying, forwarding, sharing, moving, trashing by default; owners of Team/Enterprise decide whether members can skip that approval. Only reaches files your Google account can access.
  - **This changes the Google story:** for a non-technical learner on Claude, use the **built-in** Google connectors. The Google-hosted MCP servers (Drive, Docs, Slides etc.) are the **Developer Preview** route (Google Cloud project + OAuth client + gcloud CLI), shown only as "what exists for developers".
- **Google Slides MCP (official, read):** Developer Preview, endpoint `https://slidesmcp.googleapis.com/mcp/v1`, tools `read_presentation`, `read_slide_page`, `read_slide_page_thumbnail`, `update_presentation` (change layouts, slides, elements). Page warns about indirect prompt injection and says to avoid processing presentations from unverified sources and to review the AI's actions.
- **Named practitioner stories: second search found none.** Results were setup guides and vendor blogs. Tableau's own blog "AI Can Draw the Chart. Tableau Defines the Truth." (tableau.com/blog/ai-charts-tableau-mcp-claude) is a vendor post (**page returned 403, seen via search summary only**): its point is that Claude with Tableau MCP inherits your definitions and security rules. **Decision: all day-to-day use-case workflows are labeled "illustrative, not a real transcript"; no invented names or quotes.**
- Tableau note from search (3P, unverified): a DataToolsPro tutorial says the Claude local extension works less well than a configured MCP connection; InterWorks says Tableau MCP can return view images. Neither is used as fact in the chapter.
- **User decisions:** main tool = Claude (full step-by-step); other tools shorter. Build-your-own = no-code first (Zapier MCP, n8n), code as optional "for the curious". Apps: Notion, Slack, Google Docs/Slides/Drive, Tableau, Gmail + Calendar. Three chapters: 14 (what MCP is + each assistant), 15 (connect, use cases, MCP + Skills), 16 (build your own, safety, comparison, activity).

### M. Built and tested (31 Oct 2026)
- **Chapters:** 14 `mcp-basics` (21 pages: what MCP is, words, each assistant, comparison, honest limits), 15 `connect-and-use` (17 pages: 6 walkthroughs, test ladder, 2 troubleshooting pages, 5 labeled-illustrative use cases), 16 `skills-build-safety` (21 pages: 4 connector skills, Zapier, n8n, Python server, Inspector, connecting custom servers, safety x3, comparison, activity). Index has a new "Part 3" section; Chapter 13's `data-next` now points to Chapter 14.
- **Tested here:** `mcp[cli]` installs (SDK 2.3.0); the page's bill-splitter server runs; `npx @modelcontextprotocol/inspector --cli ... --method tools/list` and `tools/call` work and return "Total with tip: 92.95. Each person pays: 30.98."; the Inspector web UI starts on `http://127.0.0.1:6274` with an auth token. **Not tested:** clicking through the Inspector web UI, connecting the server to Claude Desktop, hosting it publicly.
- **Skill descriptions** (weekly-report 182, meeting-followup 177, project-catchup 182, notes-to-tasks 181 characters) are under 200. The four skills are original, **not tested in a live Claude account**. Run each on practice data first.
- **Anthropic Agent Skills overview (read):** skills on the API: sandboxed, no network access, no runtime package install; Claude Code: full network access; claude.ai: network varies by settings. Custom skills in claude.ai: Pro/Max/Ultra/Team/Enterprise with code execution on, individual per user. This confirms the earlier note. Skills docs warn to use skills only from trusted sources.
- **Not verified / not tested, flagged on the pages:** Tableau hosted connection click path; Notion and Slack appearing in each user's directory; Zapier per-client (Claude/ChatGPT) pages (not read); n8n workflow (docs only); ChatGPT plan list; Gemini plan tier; hosting/tunnel tools; M365 Copilot (non-Studio) in 2026.
- **Not deployed.** Local files only, awaiting the user's go-ahead.

### N. Picture plates for Chapters 14 to 16 (31 Oct 2026)
Four hand-drawn statechart plates, made with the `statechart-art` skill (TLA+ model, TLC check, scripted layout and drawing). One per form the skill supports, all in a "mail desk" scene. Sources and redraw steps are in `research/mcp-plates/` (see its README). Images: `site/assets/plates/*.jpg`.
- **I Asking first** (flat) in Ch 14 after the Claude permissions page. 15 states, 17 steps. Rules that hold: a Blocked tool never runs; a tool never runs without an OK unless set to Always allow; no dead end.
- **II Address to working** (parent state "signed in") in Ch 15 before the troubleshooting table. 6 states, 14 steps. Rules that hold: cannot switch on in a chat before signing in; sign-in needs an address; no dead end. Hides `Remove` except from "sign-in expired".
- **III Three keys** (parallel regions) in Ch 15 between the troubleshooting pages. 8 combinations, 24 steps, no dead ends. The "all three keys needed" rule is from Claude Help, not from the model.
- **IV The trifecta** (bug path) in Ch 16 after the lethal-trifecta page. `NeverLeakPrivateData` breaks in 4 steps. The model fixes the order (files first) and hides the two "turn it off again" arrows.
- **Honesty:** these model the flows as the docs describe them. They are not tests of any product's code, and each plate slide says so in a collapsible "how it was checked" note.
- **Setup notes:** `mise` was not installed, so TLC ran from the official `tla2tools.jar` v1.8.0 (downloaded from the TLA+ GitHub release) via the `TLA2TOOLS`/`JAVA` environment variables. `npm install` was run once in `~/.claude/skills/statechart-art/tools`. Chapter page counts are now 22, 19 and 22.
