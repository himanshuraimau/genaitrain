---- MODULE Parcel ----
VARIABLES source, where, ran

vars == <<source, where, ran>>

Init ==
  /\ source = "none"
  /\ where = "chat"
  /\ ran = FALSE

AddFromDirectory ==
  /\ source = "none"
  /\ source' = "directory"
  /\ UNCHANGED <<where, ran>>

AddFromLink ==
  /\ source = "none"
  /\ source' = "link"
  /\ UNCHANGED <<where, ran>>

UseInCoworkOrCode ==
  /\ source # "none"
  /\ where = "chat"
  /\ where' = "cowork"
  /\ UNCHANGED <<source, ran>>

HookRuns ==
  /\ where = "cowork"
  /\ ~ran
  /\ ran' = TRUE
  /\ UNCHANGED <<source, where>>

StartOver ==
  /\ ran
  /\ source' = "none"
  /\ where' = "chat"
  /\ ran' = FALSE

Next == AddFromDirectory \/ AddFromLink \/ UseInCoworkOrCode \/ HookRuns \/ StartOver

Spec == Init /\ [][Next]_vars

TypeOK ==
  /\ source \in {"none", "directory", "link"}
  /\ where \in {"chat", "cowork"}
  /\ ran \in BOOLEAN

NothingUnreviewedRunsOnYourComputer == ran => source = "directory"
====
