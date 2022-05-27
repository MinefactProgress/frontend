export function colorFromStatus(status: number,short?:boolean) {
  if(!short) {
    switch (status) {
      case 0:
        return "#F03E3E";
      case 1:
        return "#1098AD";
      case 2:
        return "#F59F00";
      case 3:
        return "#F76707";
      case 4:
        return "#37B24D";
      default:
        return "#F03E3E";
    }
  }else {
    switch (status) {
      case 0:
        return "#F03E3E";
      case 1:
        return "#F03E3E";
      case 2:
        return "#F59F00";
      case 3:
        return "#F59F00";
      case 4:
        return "#37B24D";
      default:
        return "#F03E3E";
    }
  }
}
export function statusToName(status: number) {
  switch (status) {
    case 0:
      return "Not Started";
    case 1:
      return "Reserved";
    case 2:
      return "Building";
    case 3:
      return "Detailing";
    case 4:
      return "Done";
    default:
      return "Unknown";
  }
}
export function statusToColorName(status: number) {
  switch (status) {
    case 0:
      return "red";
    case 1:
      return "cyan";
    case 2:
      return "orange";
    case 3:
      return "yellow";
    case 4:
      return "green";
    default:
      return "gray";
  }
}
export function progressToColorName(progress: number) {
  if (progress >= 100) return "green";
  else if (progress >= 80) return "yellow";
  else if (progress >= 30) return "orange";
  else return "red";
}
