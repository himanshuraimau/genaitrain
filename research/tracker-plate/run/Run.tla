---- MODULE Run ----
VARIABLES stage, failed, sorted

vars == <<stage, failed, sorted>>

Init ==
  /\ stage = "asleep"
  /\ failed = FALSE
  /\ sorted = FALSE

StartRun ==
  /\ stage = "asleep"
  /\ stage' = "fetching"
  /\ UNCHANGED <<failed, sorted>>

ASourceFails ==
  /\ stage = "fetching"
  /\ ~failed
  /\ failed' = TRUE
  /\ UNCHANGED <<stage, sorted>>

SourcesRead ==
  /\ stage = "fetching"
  /\ stage' = "sorting"
  /\ UNCHANGED <<failed, sorted>>

DropSeen ==
  /\ stage = "sorting"
  /\ stage' = "scoring"
  /\ sorted' = TRUE
  /\ UNCHANGED failed

NothingNew ==
  /\ stage = "sorting"
  /\ stage' = "writing"
  /\ sorted' = TRUE
  /\ UNCHANGED failed

ScoreThem ==
  /\ stage = "scoring"
  /\ stage' = "writing"
  /\ UNCHANGED <<failed, sorted>>

SaveDraft ==
  /\ stage = "writing"
  /\ stage' = "waiting"
  /\ UNCHANGED <<failed, sorted>>

YouReadIt ==
  /\ stage = "waiting"
  /\ stage' = "asleep"
  /\ failed' = FALSE
  /\ sorted' = FALSE

Next == StartRun \/ ASourceFails \/ SourcesRead \/ DropSeen \/ NothingNew \/ ScoreThem \/ SaveDraft \/ YouReadIt

Spec == Init /\ [][Next]_vars

TypeOK ==
  /\ stage \in {"asleep", "fetching", "sorting", "scoring", "writing", "waiting"}
  /\ failed \in BOOLEAN
  /\ sorted \in BOOLEAN

\* Nothing is scored or written before the seen items are dropped.
NoRepeatsInTheDigest == stage \in {"scoring", "writing", "waiting"} => sorted
\* A failed source can only be flagged while fetching or later in the same run.
FailureOnlyInARun == failed => stage # "asleep"
====
