export const title = "three keys";

export const state = (v) => ({
  "Owner's switch": v.owner === "on" ? "on" : "off",
  "Your sign-in": v.me === "in" ? "signed in" : "signed out",
  "This chat": v.chat === "on" ? "ticked" : "not ticked",
});

const STEPS = {
  OwnerSwitchesOn: "switch on",
  OwnerSwitchesOff: "switch off",
  YouSignIn: "sign in",
  SignInRunsOut: "it expires",
  YouTickIt: "tick",
  YouUntickIt: "untick",
};

export const step = (action) => STEPS[action];
