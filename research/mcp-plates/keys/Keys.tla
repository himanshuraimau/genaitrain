---- MODULE Keys ----
VARIABLES owner, me, chat

vars == <<owner, me, chat>>

Init ==
  /\ owner = "off"
  /\ me = "out"
  /\ chat = "off"

OwnerSwitchesOn ==
  /\ owner = "off"
  /\ owner' = "on"
  /\ UNCHANGED <<me, chat>>

OwnerSwitchesOff ==
  /\ owner = "on"
  /\ owner' = "off"
  /\ UNCHANGED <<me, chat>>

YouSignIn ==
  /\ me = "out"
  /\ me' = "in"
  /\ UNCHANGED <<owner, chat>>

SignInRunsOut ==
  /\ me = "in"
  /\ me' = "out"
  /\ UNCHANGED <<owner, chat>>

YouTickIt ==
  /\ chat = "off"
  /\ chat' = "on"
  /\ UNCHANGED <<owner, me>>

YouUntickIt ==
  /\ chat = "on"
  /\ chat' = "off"
  /\ UNCHANGED <<owner, me>>

Next ==
  OwnerSwitchesOn \/ OwnerSwitchesOff \/ YouSignIn \/ SignInRunsOut \/ YouTickIt \/ YouUntickIt

Spec == Init /\ [][Next]_vars

TypeOK ==
  /\ owner \in {"off", "on"}
  /\ me \in {"out", "in"}
  /\ chat \in {"off", "on"}
====
