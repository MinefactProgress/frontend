export function colorFromStatus(status:number) {
    switch(status) {
        case 0: return "#F03E3E";
        case 1: return "#1098AD";
        case 2: return "#F59F00";
        case 3: return "#F76707";
        case 4: return "#37B24D";
        default: return "#F03E3E";
    }
}