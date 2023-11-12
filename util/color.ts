export function getRecommendedTextColor(hexBackgroundColor: string): string {
  function getRelativeLuminance(color: number[]): number {
    const gammaCorrectedRGB = color.map((channel) => {
      const sRGB = channel / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4;
    });
    return (
      0.2126 * gammaCorrectedRGB[0] +
      0.7152 * gammaCorrectedRGB[1] +
      0.0722 * gammaCorrectedRGB[2]
    );
  }

  function hexToRgb(hex: string): number[] | null {
    const hexValue = hex.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => r + r + g + g + b + b
    );
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  }

  const backgroundColor = hexToRgb(hexBackgroundColor);
  if (!backgroundColor) {
    return "white";
  }

  const backgroundLuminance = getRelativeLuminance(backgroundColor);

  const threshold = 0.5;

  return backgroundLuminance > threshold ? "black" : "white";
}
