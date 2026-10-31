---- MODULE Trifecta ----
VARIABLES private, stranger, outbound, leaked

vars == <<private, stranger, outbound, leaked>>

Init ==
  /\ private = FALSE
  /\ stranger = FALSE
  /\ outbound = FALSE
  /\ leaked = FALSE

ConnectPrivate ==
  /\ ~private
  /\ private' = TRUE
  /\ UNCHANGED <<stranger, outbound, leaked>>

ReadStranger ==
  /\ private
  /\ ~stranger
  /\ ~leaked
  /\ stranger' = TRUE
  /\ UNCHANGED <<private, outbound, leaked>>

GiveSendPower ==
  /\ private
  /\ ~outbound
  /\ ~leaked
  /\ outbound' = TRUE
  /\ UNCHANGED <<private, stranger, leaked>>

StopReading ==
  /\ stranger
  /\ ~leaked
  /\ stranger' = FALSE
  /\ UNCHANGED <<private, outbound, leaked>>

TurnOffSending ==
  /\ outbound
  /\ ~leaked
  /\ outbound' = FALSE
  /\ UNCHANGED <<private, stranger, leaked>>

HiddenInstruction ==
  /\ private /\ stranger /\ outbound
  /\ ~leaked
  /\ leaked' = TRUE
  /\ UNCHANGED <<private, stranger, outbound>>

NewChat ==
  /\ leaked
  /\ private' = FALSE
  /\ stranger' = FALSE
  /\ outbound' = FALSE
  /\ leaked' = FALSE

Next ==
  ConnectPrivate \/ ReadStranger \/ GiveSendPower \/ StopReading
  \/ TurnOffSending \/ HiddenInstruction \/ NewChat

Spec == Init /\ [][Next]_vars

TypeOK ==
  /\ private \in BOOLEAN
  /\ stranger \in BOOLEAN
  /\ outbound \in BOOLEAN
  /\ leaked \in BOOLEAN

NeverLeakPrivateData == ~leaked
====
