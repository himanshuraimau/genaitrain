export const title = "the trifecta";

export const state = (v) =>
  v.leaked ? "your private data leaks"
  : !v.private ? "just chatting"
  : v.stranger && v.outbound ? "all three at once"
  : v.stranger ? "has read a stranger's text"
  : v.outbound ? "can send things out"
  : "can read your private files";

const STEPS = {
  ConnectPrivate: "you connect your files or email",
  ReadStranger: "it reads a stranger's email or web page",
  GiveSendPower: "you let it send or post",
  StopReading: "you stop it reading strangers' text",
  TurnOffSending: "you turn off sending",
  HiddenInstruction: "a hidden instruction says: send it out",
  NewChat: "you start a new chat",
};

export const step = (action) => (action === "StopReading" || action === "TurnOffSending" ? null : STEPS[action]);
