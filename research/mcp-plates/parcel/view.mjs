export const title = "the unreviewed parcel";

export const state = (v) => {
  if (v.source === "none") return "you look for a plugin";
  const kind = v.source === "directory" ? "from the directory" : "from a link or file";
  if (v.ran) return `its code runs on your computer (${kind})`;
  if (v.where === "cowork") return `used in Cowork or Claude Code (${kind})`;
  return `added ${kind}`;
};

const STEPS = {
  AddFromDirectory: "you add it from the directory",
  AddFromLink: "you add it from a link or file",
  UseInCoworkOrCode: "you use it in Cowork or Claude Code",
  HookRuns: "its hook or agent starts",
  StartOver: "you remove it and start over",
};

export const step = (action) => STEPS[action];
