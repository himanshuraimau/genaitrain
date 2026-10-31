---- MODULE Setup ----
VARIABLES added, signed, expired, onChat

vars == <<added, signed, expired, onChat>>

Init ==
  /\ added = FALSE
  /\ signed = FALSE
  /\ expired = FALSE
  /\ onChat = FALSE

AddAddress ==
  /\ ~added
  /\ added' = TRUE
  /\ UNCHANGED <<signed, expired, onChat>>

SignIn ==
  /\ added
  /\ ~signed
  /\ signed' = TRUE
  /\ expired' = FALSE
  /\ UNCHANGED <<added, onChat>>

SwitchOn ==
  /\ signed
  /\ ~onChat
  /\ onChat' = TRUE
  /\ UNCHANGED <<added, signed, expired>>

SwitchOff ==
  /\ onChat
  /\ onChat' = FALSE
  /\ UNCHANGED <<added, signed, expired>>

SignInRunsOut ==
  /\ signed
  /\ signed' = FALSE
  /\ expired' = TRUE
  /\ UNCHANGED <<added, onChat>>

Remove ==
  /\ added
  /\ added' = FALSE
  /\ signed' = FALSE
  /\ expired' = FALSE
  /\ onChat' = FALSE

Next == AddAddress \/ SignIn \/ SwitchOn \/ SwitchOff \/ SignInRunsOut \/ Remove

Spec == Init /\ [][Next]_vars

TypeOK ==
  /\ added \in BOOLEAN
  /\ signed \in BOOLEAN
  /\ expired \in BOOLEAN
  /\ onChat \in BOOLEAN

NeverSwitchedOnWithoutSignIn == onChat => (signed \/ expired)
SignInNeedsAnAddress == (signed \/ expired) => added
====
