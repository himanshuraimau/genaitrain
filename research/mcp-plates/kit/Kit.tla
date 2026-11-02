---- MODULE Kit ----
VARIABLES plugin, connected

vars == <<plugin, connected>>

Init ==
  /\ plugin = "none"
  /\ connected = FALSE

YouConnectConnector ==
  /\ ~connected
  /\ connected' = TRUE
  /\ UNCHANGED plugin

YouAddPlugin ==
  /\ plugin = "none"
  /\ plugin' = "added"
  /\ UNCHANGED connected

SignInRunsOut ==
  /\ connected
  /\ connected' = FALSE
  /\ UNCHANGED plugin

YouRemovePlugin ==
  /\ plugin = "added"
  /\ plugin' = "none"
  /\ UNCHANGED connected

Next == YouConnectConnector \/ YouAddPlugin \/ SignInRunsOut \/ YouRemovePlugin

Spec == Init /\ [][Next]_vars

TypeOK ==
  /\ plugin \in {"none", "added"}
  /\ connected \in BOOLEAN

\* Adding a plugin never signs you in to anything, and removing it never signs you out.
PluginNeverChangesSignIn == [][(plugin' # plugin) => (connected' = connected)]_vars
====
