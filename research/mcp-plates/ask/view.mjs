export const title = "asking first";

const STAGE = {
  idle: "you ask",
  picked: "Claude picks a tool",
  waiting: "waiting for your OK",
  running: "the tool runs",
  shown: "you review the result",
  stopped: "stopped, nothing happened",
};

export const state = (v) => STAGE[v.stage];

const STEPS = {
  YouAsk: "you ask for something",
  PickAlways: "it runs at once [tool set to Always allow]",
  PickAsk: "it asks first [tool set to Needs approval]",
  PickBlocked: "it stops [tool set to Blocked]",
  YouAllow: "you click Allow",
  YouAllowAlways: "you click Allow",
  YouDeny: "you say no",
  ToolFinishes: "it finishes",
  YouAskAgain: "you ask again",
};

export const step = (action) => STEPS[action];
