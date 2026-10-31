---- MODULE Ask ----
VARIABLES stage, policy, approved

vars == <<stage, policy, approved>>

Policies == {"always", "ask", "blocked"}

Init ==
  /\ stage = "idle"
  /\ policy \in Policies
  /\ approved = FALSE

YouAsk ==
  /\ stage = "idle"
  /\ stage' = "picked"
  /\ UNCHANGED <<policy, approved>>

PickAlways ==
  /\ stage = "picked"
  /\ policy = "always"
  /\ stage' = "running"
  /\ UNCHANGED <<policy, approved>>

PickAsk ==
  /\ stage = "picked"
  /\ policy = "ask"
  /\ stage' = "waiting"
  /\ UNCHANGED <<policy, approved>>

PickBlocked ==
  /\ stage = "picked"
  /\ policy = "blocked"
  /\ stage' = "stopped"
  /\ UNCHANGED <<policy, approved>>

YouAllow ==
  /\ stage = "waiting"
  /\ stage' = "running"
  /\ approved' = TRUE
  /\ UNCHANGED policy

YouAllowAlways ==
  /\ stage = "waiting"
  /\ stage' = "running"
  /\ approved' = TRUE
  /\ policy' = "always"

YouDeny ==
  /\ stage = "waiting"
  /\ stage' = "stopped"
  /\ UNCHANGED <<policy, approved>>

ToolFinishes ==
  /\ stage = "running"
  /\ stage' = "shown"
  /\ UNCHANGED <<policy, approved>>

YouAskAgain ==
  /\ stage \in {"shown", "stopped"}
  /\ stage' = "idle"
  /\ approved' = FALSE
  /\ UNCHANGED policy

Next ==
  YouAsk \/ PickAlways \/ PickAsk \/ PickBlocked \/ YouAllow \/ YouAllowAlways
  \/ YouDeny \/ ToolFinishes \/ YouAskAgain

Spec == Init /\ [][Next]_vars

TypeOK ==
  /\ stage \in {"idle", "picked", "waiting", "running", "shown", "stopped"}
  /\ policy \in Policies
  /\ approved \in BOOLEAN

NeverRunABlockedTool == stage = "running" => policy # "blocked"
NeverRunWithoutAnOK == stage = "running" => (policy = "always" \/ approved)
====
