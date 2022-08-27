export const Ranks = [
  "Owner",
  "Administrator",
  "Moderator",
  "Developer",
  "Supporter",
  "Architect",
  "Player",
];

export function rankToColor(rank: string) {
  switch (rank) {
    case "Owner":
      return "#AA0000";
    case "Administrator":
      return "#FF5555";
    case "Moderator":
      return "#00AAAA";
    case "Developer":
      return "#55FFFF";
    case "Supporter":
      return "#5555FF";
    case "Architect":
      return "#0000AA";
    case "Player":
      return "#55FF55";
    default:
      return "#555555";
  }
}
