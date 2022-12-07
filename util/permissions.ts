export const Permissions = {
  default: 0,
  builder: 1,
  moderator: 2,
  admin: 4,
};

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

export function getStaffJoin(rankHistory: any): Date | null {
  if (rankHistory.length > 0) {
    return new Date(rankHistory[0].from);
  }
  return null;
}
