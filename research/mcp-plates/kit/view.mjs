export const title = "kit and key";

export const state = (v) =>
  v.plugin === "none" && !v.connected ? "nothing set up"
  : v.plugin === "none" ? "connector connected, no plugin"
  : !v.connected ? "plugin added, connector not signed in"
  : "plugin and connector both ready";

export const step = (action, from, to) => {
  switch (action) {
    case "YouConnectConnector": return from.plugin === "added" ? "you sign in to its connector" : "you connect a connector";
    case "YouAddPlugin": return "you add the plugin";
    case "SignInRunsOut": return from.plugin === "none" ? null : "the sign-in runs out";
    case "YouRemovePlugin": return null;
  }
};
