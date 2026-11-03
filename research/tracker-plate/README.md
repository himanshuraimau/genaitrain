# Tracker plate (statechart art)

Plate VII, "A morning run", for Chapter 18. Same method as `../mcp-plates/`: a small TLA+ model checked by TLC, laid out and drawn by a node script.

- `run/Run.tla`, `run/Run.cfg`, `run/view.mjs`: the model and its reader-friendly words.
- `run/chart/`: the checked chart (`chart.mmd`) and `report.md`.
- `layout.mmd`: `chart.mmd` plus spacing config, used for drawing.
- `art-run.js`: the drawing script. Reuses `../mcp-plates/art/mail.js` and `shop.js` props.

TLC: 11 states, 14 steps. Holds: TypeOK, NoRepeatsInTheDigest (nothing is scored or written before seen items are dropped), FailureOnlyInARun, NoDeadlock. The chart draws 7 states and 9 arrows.
The model is our design for the tracker in Chapter 18, not a test of any product. It models at most one failed source per run.

## Redraw
```sh
export TLA2TOOLS=/path/to/tla2tools.jar JAVA=$(which java)   # tla2tools.jar v1.8.0, github.com/tlaplus/tlaplus/releases
SC=$(ls ~/.claude/plugins/cache/cursor-plugins/pstack/*/skills/statechart/scripts/statechart | head -1)
(cd run && $SC Run.tla --config Run.cfg --view view.mjs --out chart)
# work folder: tools/ (symlink to ~/.claude/skills/statechart-art/tools), art/ (mail.js, shop.js, art-run.js as run.js), mcp/run/layout.mmd, out/
(cd work/art && node run.js)   # add --fast for a half-size look
```
Output `out/run-x.jpg` is the site's `site/assets/plates/a-morning-run.jpg`.
