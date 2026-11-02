# MCP plates (statechart art)

Four hand-drawn "plates" for Chapters 14 to 16, made with the `statechart-art` skill. Each chart is a small TLA+ model explored by TLC, then laid out and drawn by a node script.

| Plate | Model | Form | Used in |
|---|---|---|---|
| I Asking first | `ask/Ask.tla` | flat | Ch 14, after "Claude: you stay in control" |
| II Address to working | `setup/Setup.tla` | parent state ("signed in") | Ch 15, before the troubleshooting table |
| III Three keys | `keys/Keys.tla` | parallel regions | Ch 15, between the two troubleshooting pages |
| IV The trifecta | `trifecta/Trifecta.tla` | bug path | Ch 16, after "The lethal trifecta" |
| V Kit and key | `kit/Kit.tla` | flat | Ch 17, after "Add a plugin in Claude" |
| VI The loose parcel | `parcel/Parcel.tla` | bug path | Ch 17, after the plugin safety page |

These models describe the flows as the vendor docs describe them. They are **not** tests of any product's code.

## What was checked (TLC)
- Ask: 15 states, 17 steps. Holds: TypeOK, NeverRunABlockedTool, NeverRunWithoutAnOK, NoDeadlock.
- Setup: 6 states, 14 steps. Holds: TypeOK, NeverSwitchedOnWithoutSignIn, SignInNeedsAnAddress, NoDeadlock. View hides 3 steps (`Remove` from every state except "sign-in expired"); 1 step stays inside one chart state (switching off while expired).
- Keys: 8 states, 24 steps. Holds: TypeOK, NoDeadlock. No other rule is modeled; "all three keys needed" comes from Claude Help, not the model.
- Trifecta: 6 states, 11 steps. `NeverLeakPrivateData` breaks in 4 steps (connect files, give it a way to send, it reads a stranger's text, hidden instruction). The view hides 4 steps (the two "turn it off again" arrows). The model fixes the order: files are connected first.

- Kit: 4 states, 8 steps. Holds: TypeOK, NoDeadlock, PluginNeverChangesSignIn (a rule over steps: adding or removing a plugin never changes the sign-in). The view hides 3 steps (`YouRemovePlugin` entirely, and `SignInRunsOut` when there is no plugin) to keep the chart a clean diamond. Removing the plugin leaving the connector connected is from ChatGPT's docs; Claude's docs do not say.
- Parcel: 7 states, 8 steps. `NothingUnreviewedRunsOnYourComputer` breaks in 3 steps (add from a link or file, use it in Cowork or Claude Code, its hook or agent starts). Premises are from Claude's plugin docs: directory plugins are scanned and reviewed, link or upload plugins are not, and hooks and agents run only in Cowork and Claude Code, not in chat. The rule is a design rule of ours; "reviewed" does not mean guaranteed safe.

## Redraw
```sh
# one-time
(cd ~/.claude/skills/statechart-art/tools && npm install)
# TLC: needs mise, or set the jar and java yourself
export TLA2TOOLS=/path/to/tla2tools.jar JAVA=/usr/bin/java   # we used tla2tools.jar v1.8.0 from github.com/tlaplus/tlaplus/releases
SC=~/.claude/plugins/cache/cursor-plugins/pstack/*/skills/statechart/scripts/statechart
(cd ask && $SC Ask.tla --config Ask.cfg --view view.mjs --out chart)   # same for setup, keys, trifecta, kit, parcel
# draw: needs a work folder with tools/ (symlink), art/ (this folder's art/*.js) and mcp/<name>/layout.mmd
mkdir -p work/out work/mcp && ln -s ~/.claude/skills/statechart-art/tools work/tools
cp -r art work/art && for n in ask setup keys trifecta kit parcel; do mkdir -p work/mcp/$n && cp $n/layout.mmd work/mcp/$n/; done
(cd work/art && for n in ask setup keys trifecta kit parcel; do node $n.js; done)      # add --fast for a quick half-size look
```
Outputs land in `work/out/<name>-x.jpg` (2048 px). The site uses them as `site/assets/plates/*.jpg`.
`layout.mmd` is the checked `chart/chart.mmd` plus a `config: state: rankSpacing / nodeSpacing` block.
`art/mail.js` holds the mail-desk props; `art/shop.js` is the skill's bundled helper file with one path changed.
