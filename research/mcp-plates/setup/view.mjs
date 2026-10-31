export const title = "from address to working";

export const state = (v) =>
  !v.added ? ["not set up"]
  : v.expired ? ["sign-in expired"]
  : !v.signed ? ["address added"]
  : v.onChat ? ["signed in", "on in this chat"]
  : ["signed in", "off in this chat"];

export const step = (action, from, to) => {
  switch (action) {
    case "AddAddress": return "you paste the address";
    case "SignIn": return from.expired ? (to.onChat ? "you sign in again [if it was on]" : "you sign in again") : "you sign in";
    case "SwitchOn": return "you switch it on in the chat";
    case "SwitchOff": return "you switch it off";
    case "SignInRunsOut": return "your sign-in runs out";
    case "Remove": return from.expired ? "you remove it and start again" : null;
  }
};
