export const title = "a morning run";

export const state = (v) =>
  v.stage === "asleep" ? "asleep"
  : v.stage === "fetching" && v.failed ? "fetching, one source failed"
  : v.stage === "fetching" ? "fetching sources"
  : v.stage === "sorting" ? "dropping seen items"
  : v.stage === "scoring" ? "scoring new items"
  : v.stage === "writing" ? "writing the digest"
  : "draft in your inbox";

export const step = (action, from, to) => {
  switch (action) {
    case "StartRun": return "7:00, or Run now";
    case "ASourceFails": return "a source fails";
    case "SourcesRead": return from.failed ? "rest finish, noted" : "all read";
    case "DropSeen": return "new kept";
    case "NothingNew": return "nothing new";
    case "ScoreThem": return "scored";
    case "SaveDraft": return "saved as draft";
    case "YouReadIt": return "you read it";
  }
};
