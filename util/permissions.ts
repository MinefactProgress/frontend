export const Permissions = {
  default: 0,
  event: 1,
  builder: 2,
  moderator: 3,
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
    case "Professional":
      return "#55FF55";
    case "Advanced":
      return "#55FF55";
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
