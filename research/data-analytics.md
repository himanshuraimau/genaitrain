# Day 4: Data analytics with AI (connect, clean, combine, query, dashboard)

Researched 5 Nov 2026 for a non-technical audience. **Scope set by the user:** demos run in the **Claude app (claude.ai web / Claude Desktop)** and **ChatGPT**. Not Claude Code, not Codex.

Labels:
- **[official]** = read on the vendor's own page during this research.
- **[secondary]** = blog, news or a search summary of an official page. Treat as a lead.
- **[unverified]** = not confirmed. Do not teach it as fact.

OpenAI's help pages (help.openai.com) returned **HTTP 403** to every fetch in this session, so **all ChatGPT facts below are [secondary]** (search summaries of those pages) unless stated. Re-read them in a browser before class.

---

## 1. How AI analyzes data (the "magic" is code)

**Plain words:** when you upload a spreadsheet and ask "which channel grew most?", the AI usually does not "read" the numbers in its head. It **writes a small program** (Python), **runs it in a private sandbox**, and shows you the result (a table, a chart, a file). That is why it can handle thousands of rows, and why you can ask to **see the code**.

| | Claude app | ChatGPT |
|---|---|---|
| Name of the feature | "Create and edit files" (older label: "Code execution and file creation") [official] | Data analysis (formerly Advanced Data Analysis / Code Interpreter) [secondary] |
| Where to switch it on | Settings > Capabilities. On by default for Free, Pro, Max, Ultra; Team/Enterprise owners can disable [official] | On by default in current ChatGPT [secondary] |
| Plans | "all Claude users (Free, Pro, Max, Ultra, Team, and Enterprise) on the web, Claude Desktop, and Claude Mobile" [official] | Spreadsheet/data analysis on paid and (limited) free plans [secondary, uncertain] |
| What it runs | Python in a sandbox; can install packages from approved sources (network on by default for Free/Pro/Max/Ultra; Team/Enterprise default is off or package-manager-only) [official] | Python in a stateful Jupyter-style notebook. "The Python environment cannot make external web requests or API calls" [secondary] |
| Outputs | Excel (.xlsx) with working formulas, Word, PowerPoint, PDF, charts as PNG images [official] | Tables and charts in chat; interactive bar, line, pie, scatter charts; other chart types come out as static images; files you can download [secondary] |
| Usage | "Creating files will use more of your limit" [official] | Counts against plan limits [secondary] |

**Takeaway for the chapter:** same idea in both apps: *ask in plain English, the AI writes and runs code, you check the work.* The habit to teach: **"Show me the code you ran / list your steps."**

Verified quotes (Claude): "You can also upload CSV, TSV, and other files for data analysis and visualization." "You can create financial models in Excel with working formulas, perform advanced analyses on uploaded data, produce reports with charts and visualizations." Official note: "You may need to review and refine Claude's outputs to meet your exact requirements."

**Caveat on Claude's sandbox:** the network is limited to approved sources for installing packages. Do **not** promise that Claude's code can download any URL. [official wording: "install packages from approved sources"]

---

## 2. Connecting to data: three routes

The user's brief lists file upload and connectors, then "dashboards with live data". The chapter treats the **three routes** as:

1. **Upload a file** (snapshot)
2. **Connect an app** (connector / app; live or synced)
3. **Link a live source** (a sheet or address that updates on its own; real public data)

### Route 1: File upload (CSV / XLSX) = a snapshot
- **Claude** [official: "Upload files to Claude", updated 23 Jul 2026]:
  - Types include CSV, JSON, TXT, PDF, DOCX, XLSX. Note: "You must enable code execution and file creation in your account to upload XLSX files."
  - Chat uploads: "500MB per file", "Up to 20 files per chat". Project files: "30MB per file".
  - **Conflict:** the file-creation article says "The maximum file size is 30MB per file for both uploads and downloads." The two official pages disagree. Teach "keep files small (under ~30 MB) and test", and re-check before class.
  - Non-PDF files: "Claude extracts text only." (images in a spreadsheet are lost)
- **ChatGPT** [secondary]:
  - Accepts .csv, .xls, .xlsx and more. Use "descriptive column headers in the first row and one row per record, and avoid empty rows or columns".
  - Reported: 512 MB per file hard limit; the 2M-token cap on text files "does not apply to spreadsheets"; upload-rate caps vary (free users about 3 files a day; paid about 80 per 3 hours). Numbers conflict between versions of the help page. "Failed upload attempts can sometimes count toward the upload-rate cap."
  - "Image-based tables are unreliable. When exact values matter, upload a spreadsheet." Large files can upload yet still be "too large, complex, or poorly structured for complete analysis"; split them.
- **Pros:** works everywhere, no setup, nothing touches live systems. **Cons:** stale the moment you export; you must re-upload.
- Tidy-data tips for learners: one header row, one row per record, no merged cells, no totals row inside the data, dates in one format.

### Route 2: Connectors / apps = the AI asks the app
- **Claude** [official: "Use connectors to extend Claude's capabilities", updated this week]:
  - "Web connectors are available for all users on Claude, Cowork, Claude Desktop, and Claude Mobile." Find them at **Customize > Connectors**. In a chat: **+** menu > Connectors, toggle on per conversation.
  - "Claude inherits each person's permissions from the connected service."
  - Team/Enterprise: an Owner enables a connector first; people authenticate individually. Owners can set tool permissions: "Always allow, Needs approval, or Blocked."
  - **Custom connectors (remote MCP)** on all plans, "Free users are limited to one custom connector". "Your server must be reachable over the public internet." (Chapter 16 covered building one.)
  - Directory (claude.com/connectors, 1,074 listed): HubSpot, Shopify, QuickBooks Labs (beta), Moneytree, Google Drive, Gmail, Slack, Notion, Box, Supabase and more were seen. **Stripe, PayPal, Google Analytics, Snowflake, BigQuery, Amplitude, Hex, Tableau and Google Sheets were not seen in the part of the page we could read** (the page was truncated). Do not claim they exist or don't. [unverified]
  - **Google Drive connector and Sheets** [secondary quoting Anthropic's connector page]: Claude can pull "data from Google Sheets (exported as CSV)". Consequences: values only, **formulas are lost**, treated as a **snapshot**, read-only, one file at a time. Check on your account.
  - Whether connector data is fetched live per question or synced: **not stated** on the page. [unverified]
- **ChatGPT** [secondary]: OpenAI renamed connectors to **apps** (Settings > Plugins / Apps). **Synced** apps such as Google Drive index your files ahead of time (so can be slightly stale); **live** access apps query the source each time. Reported native apps: HubSpot (Business/Enterprise/Edu), Stripe, Xero, Shopify. A native Google Analytics app was **not** confirmed. Data from apps on Business/Enterprise/Edu is reportedly not used for training by default; not guaranteed on Free/Plus/Go. All of this needs re-checking.
- **Pros:** the data is yours, current, no exporting. **Cons:** setup and permissions, admin switches on work plans, and the AI can only see what you connect (and it may see too much: connect the least you need, Chapter 16).

### Route 3: Link a live source
Two real, no-code, **demo-friendly** options:
- **A spreadsheet that pulls from a web address.** In Google Sheets, `=IMPORTDATA("https://example.com/data.csv")` fills the sheet from a CSV address and refreshes on its own. Google's own page says it "updates IMPORTDATA data automatically at up to 1 hour intervals" [official Google Tables page, via search]; other sources say 15 minutes to 2 hours. **Not guaranteed. Teach as "roughly hourly".** The address must return CSV or TSV, not a web page or JSON. Then analyze the *sheet*:
  - with the **Claude add-on for Google Sheets** [official, beta], or the **ChatGPT add-in for Sheets** [secondary], which read the open sheet (so formulas and live values stay);
  - or with the Drive connector / upload (snapshot).
- **Real public data.** Free, no sign-up, tested from this machine on 5 Nov 2026 (HTTP 200):
  - USGS earthquakes, past day/week/month, GeoJSON: `earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson` (U.S. government data).
  - OpenF1 (Formula 1 sessions, drivers and race results, history is free): `api.openf1.org/v1/sessions?year=2025&session_name=Race` (24 races for 2025).
  - Open-Meteo weather forecast (no key): `api.open-meteo.com/v1/forecast?...`.
  - CoinGecko simple price, World Bank indicators, Hacker News: all returned 200.
  - TheSportsDB: the old free test key "3" is **permanently disabled** (returns 403 and says to use "123" or a paid key). Not used.
  - **Caveat:** the AI app cannot be assumed able to fetch these itself (see section 1). Safer pattern: **our script downloads them to files** (Route 1), or you paste the address and let the app's web browsing read it and **tell it which one you used**. Test before class.

---

## 3. Dashboards

- **Claude Dashboards (beta)** [official: "Get started with Claude Dashboards"]:
  - "Claude Dashboards is available in beta on Pro, Max, Ultra, Team, and Enterprise plans." Enterprise: off until an owner turns it on (Organization settings > Artifacts).
  - How: ask in any chat ("Build a dashboard of this quarter's revenue by region"), or **Output > Dashboards** in the message box, or Artifacts tab > Dashboards template.
  - Sources: "A data warehouse" (Amazon Redshift, BigQuery, ClickHouse, Databricks, Snowflake) or "Other apps you've connected to Claude" (example: Salesforce opportunities). **Google Sheets is not listed** as a source; whether it works is unconfirmed.
  - "Claude writes a SQL query for each chart ... Each chart shows its query ... along with when its data was last refreshed." No refresh schedule or manual refresh control is documented. [unverified]
  - "Dashboards are made for quick, exploratory questions." Starts private; counts toward usage.
- **Claude artifacts connected to apps** [official: "What are artifacts"]: "Artifacts can connect to the apps you've connected to Claude." Pro and above, web and desktop. "An artifact that pulls from connected apps uses the viewer's connections, not yours." Storage: "20 MB limit per artifact ... text only".
- **Claude artifact from an uploaded file** (no connector): Claude builds an interactive page from the data you gave it. It is a **snapshot**: it shows the numbers as of upload. [our reading of the docs; test it]. Requires "Create and edit files" switched on. Share with anyone who has the link is available on every plan; org sharing needs a paid plan.
- **Older "live artifacts" in Cowork**: artifacts made before 19 Aug 2026 "keep working, but you can't edit them in place". Not for this chapter.
- **ChatGPT** [secondary]: interactive charts (bar, line, pie, scatter) with hover and colour changes, download; **no confirmed built-in "live dashboard"**. An Aug 2026 article says data analysis gives "static charts and Python scripts ... suits one-off analysis but not a live, multi-user dashboard" and that the Run button was removed from Canvas in late 2025. Scheduled refresh in ChatGPT (Tasks) is **not confirmed** for dashboards.
- **The honest "live dashboard" for non-coders = a spreadsheet** with formulas (and `IMPORTDATA`) plus charts/pivot tables, built by the AI (see section 6). It stays live and you can check its logic.

Teaching message: "Dashboard" means different things: (a) a **picture of one moment** (artifact/chart from an upload), (b) a **page that re-asks a connected app** (Claude Dashboards beta), (c) a **sheet with formulas** that recalculates. Pick by how fresh it must be.

---

## 4. Querying the data: observations vs insights

The user's definition: *"Signups fell 20%" is an observation. An insight adds why it happened and what to do about it.*

**A ladder of questions (teach this):**
1. **What happened?** (observation) "How did weekly signups change over the last 12 weeks?"
2. **Where?** (break it down) "Split by channel, country, product."
3. **Why?** (cause) "What changed around the date it started? Compare with ad spend and orders."
4. **So what?** (impact) "How many signups/₹ did we lose? What would recovery look like?"
5. **Now what?** (action) "Give 3 actions, each with what to check first and what could go wrong."
6. **How sure?** (honesty) "What else could explain it? What data would confirm it?"

Rules: ask for **evidence** (numbers + which rows/columns), **assumptions**, and **alternatives**. Correlation is not proof.

---

## 5. Risks and limits (what to say out loud)

| Risk | What happens | What to do |
|---|---|---|
| **Too much data** | Big files may upload but only part is used; the AI may **sample** or run out of memory/time. Claude: sandbox time is limited, exact limit not published [official]. ChatGPT: "A file may upload successfully but still be too large ... for complete analysis" [secondary] | Ask "how many rows did you read?" Compare to the true count. Split or pre-summarize in a sheet. |
| **Made-up numbers (hallucination)** | Numbers typed from "memory" instead of computed; wrong counts; plausible but invented explanations. Anecdotes and studies report wrong counts and inconsistent answers [secondary] | Require **code-computed** answers, "show the code", spot-check 3 numbers by hand, ask for row counts and totals that reconcile. |
| **Silent cleaning** | The AI drops "bad" rows or guesses a date format without telling you | "List every change you made and how many rows each touched." |
| **Wrong join** | Two tables combined on the wrong key, duplicating rows | Ask for row counts before and after; check totals match the sources. |
| **Causal overreach** | "X caused Y" from a pattern | Ask for alternative explanations and what would disprove it. |
| **Privacy** | Customer emails, salaries, health data pasted into an AI | Remove or mask personal columns; check your plan's data settings; connectors inherit your permissions. Claude in Excel: "Only use Claude for Excel with trusted spreadsheets." [official] |
| **Stale data** | A snapshot is old | Show the "as of" date on every chart (Dashboards show last-refreshed per chart [official]). |
| **Connected-app overreach** | A connector can read more than the question needs | Connect the least; read-only first (Chapter 16). |

---

## 6. Optional: AI inside Excel and Sheets

**Principle (from the user):** ask the AI to **write formulas, not paste numbers**, so the sheet stays live and you can check its logic.

- **Claude for Excel** [official: claude.com/docs/office-agents/excel]: "generally available to Pro, Max, Team, and Enterprise plans" (not Free). "Ask questions about open workbooks, adjust assumptions while preserving formula relationships, debug errors, and build or populate models." Install from Microsoft AppSource ("Claude for Microsoft 365"), sign in. Excel on the web, Windows build 16.0.13127.20296+, Mac 16.46+; not iPad/Android. Not supported: Data tables, Macros/VBA. "Not recommended for: Final client deliverables without human review." Add-in data connectors named: S&P Global, LSEG, Daloopa.
- **Claude for Google Docs, Sheets and Slides** [official, updated this week]: "available in beta for Pro, Max, Ultra, Team, and Enterprise plans". Install from the Google Workspace Marketplace; Extensions > Claude > Open Claude. "A single long operation can run for up to six minutes before Google stops it." "Connected Sheets tabs (live BigQuery data) cannot be read or edited." In Slides, charts are inserted "as images ... so they do not update". "Keep the sidebar open while Claude is working."
- **ChatGPT for Excel and Google Sheets** [secondary: OpenAI help article 20001063 via search, plus news]: launched out of beta in May 2026; "available globally to Free, Go, Plus, Pro, Business, Enterprise, ChatGPT Edu, and K-12 users"; Free and Go have limited use; Plus/Pro "subject to your plan's agentic usage limit". Reported limits: separate chat history, no memory, incomplete macro/VBA support. Install: Microsoft Marketplace / Add-ins menu for Excel; Google Workspace Marketplace > Extensions for Sheets.
- **Microsoft Copilot and Gemini in Sheets**: the user's outline names them as built-in options. **Not researched here and not part of the demos**; mention by name only, no claims.

Formula-first prompt pattern: "Add a column that does X using a formula (not a typed number). Explain the formula in one line. Don't change my original data."

---

## 7. The demo data (made for teaching)

The user asked for **real data sources if possible**, or **a data source made by a script**, so the demo works properly. Plan:

### A. "Kite & Co" shop data (made by a script, free to share)
A fictional online stationery shop in India. **Three systems that don't talk to each other**, 90 days (7 Aug to 4 Nov 2026), seeded so everyone gets the same files:

| File | Comes from | Columns | Planted mess (for the cleaning step) |
|---|---|---|---|
| `orders.csv` | the shop system | order_id, order_date, customer_id, customer_email, country, channel, product, category, quantity, unit_price_inr, discount_code, status | 3 date formats; country spelled many ways ("India", "IN", "india "); channel spelled many ways ("Instagram", "insta", "IG"); a few duplicate order rows; a test order; a negative quantity; one price with extra zeros; blanks in category; status in mixed case |
| `signups.csv` | website analytics | date, channel, visits, signups | clean |
| `ad_spend.csv` | marketing team | date, channel, spend_inr, clicks | clean |

**The hidden story (answer key, for the teacher):**
- Instagram ads were **paused on 6 Oct 2026** and resumed on **12 Nov 2026**. Google, newsletter, referral and direct are steady.
- **Observation:** total weekly signups fell about 20% in the last four weeks.
- **Insight:** the whole drop is Instagram (signups from it fall to almost nothing). Other channels are flat. Orders dip about a week later because new signups feed orders with a lag. **Action:** restart Instagram spend (or move budget), watch recovery.
- Secondary: discount code SAVE20 lifts order count but lowers average order value; mixed channel names hide Instagram's true share until cleaned.
- The live endpoint keeps going past 4 Nov: after 12 Nov, Instagram returns, so a "live" dashboard shows **recovery**.

### B. Live endpoint (so "periodically updated" is real)
`/api/shop?table=orders|signups|ad_spend` on the notebook's own site returns CSV for the last 90 days up to **today** (UTC). The data is generated from the date, so each new day adds rows with no redeploy. Works with Google Sheets `=IMPORTDATA(...)`. The generator is shared with the static-files script so the two always agree.
Honest limit: it is made-up data, so it demonstrates the mechanics, not a real business.

### C. Real public data (script downloads to files)
- **Earthquakes (USGS):** past 30 days, M2.5+, as CSV (time, place, magnitude, depth, latitude, longitude). U.S. government work.
- **Formula 1 2025 (OpenF1):** race results joined with driver and team names (a real two-table join). Used here as the "live sports data" example the user mentioned. OpenF1 is a community API; **we do not republish its data on the site**; the script writes to a local folder for the teacher. Real-time F1 data on OpenF1 is a paid tier [unverified here]; history is free.

---

## 8. Activity (what learners do)
1. **Connect:** upload the three Kite & Co files (and optionally open them via Google Sheets + Drive connector).
2. **Clean:** have the AI list the problems, fix them, and report every change.
3. **Combine:** join orders, signups and ad spend by date and channel.
4. **Query:** climb the question ladder from observation to insight.
5. **Dashboard:** one page (Claude: artifact / Dashboards; ChatGPT: interactive charts); then make a live version with a Sheet.
6. **Check:** verify three numbers by hand; list assumptions.

Same prompts work in both apps; where the apps differ, the chapter says so.

---

## Verify before class
- Claude upload limit: 500 MB (upload article) vs 30 MB (file-creation article).
- Whether Claude's Google Drive connector reads Sheets in your plan, and whether it is live or a snapshot.
- Whether **Dashboards** (beta) can use your Google Sheet or only warehouses and apps like Salesforce; refresh behaviour.
- All ChatGPT facts (data analysis limits, apps list, add-in plans, whether interactive charts need a paid plan): OpenAI help pages were blocked here.
- `IMPORTDATA` refresh time on your account, and that the Vercel endpoint returns CSV Sheets accepts.
- That Claude / ChatGPT can or cannot fetch a public URL on your plan (earthquake demo).
- Claude for Excel / Google Workspace add-on availability for your Google/Microsoft admin policy.

## Sources
Official:
- Anthropic: [Create and edit files with Claude](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude), [Upload files to Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude), [What are artifacts](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them), [Share artifacts](https://support.claude.com/en/articles/9547008-share-artifacts), [Get started with Claude Dashboards](https://support.claude.com/en/articles/17454700-get-started-with-claude-dashboards), [Use connectors](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities), [Claude connectors directory](https://claude.com/connectors), [Claude for Excel](https://claude.com/docs/office-agents/excel), [Claude in Google Docs, Sheets and Slides](https://support.claude.com/en/articles/16951679-use-claude-in-google-docs-sheets-and-slides)
- Public data: [USGS earthquake feeds](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php), [OpenF1](https://openf1.org)
- Google, [IMPORTDATA via Tables help](https://support.google.com/area120-tables/answer/9904107)

Secondary (leads only):
- OpenAI help articles [Data analysis in ChatGPT](https://help.openai.com/en/articles/8437071-data-analysis-in-chatgpt), [File uploads FAQ](https://help.openai.com/en/articles/8555545-file-uploads-faq), [ChatGPT for Excel and Google Sheets](https://help.openai.com/en/articles/20001063-chatgpt-for-excel-and-google-sheets) (all blocked when fetched; read as search summaries)
- ChatGPT dashboards: Emergent "Can ChatGPT build a dashboard?" (Aug 2026); Windows Report on interactive charts
- Claude Drive connector reads Sheets as CSV: Anthropic's connector page via search summary (claude.com/connectors/google-drive)
- AI number accuracy anecdotes: freshvanroot.com; ActuIA on CAC 40 figures; Digital Journal
- Connectors in ChatGPT: Coupler.io, eesel, Zapier blog
