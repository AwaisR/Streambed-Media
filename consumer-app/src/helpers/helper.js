export function hexToRGB(hex: string): ?Array<number> {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const properHex = hex.replace(
    shorthandRegex,
    (m, r, g, b) => r + r + g + g + b + b
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(properHex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

export function formatNumberWithCommas(num) {
  num = String(num);
  let result = "";
  let c = 0;
  for (let i = num.length - 1; i >= 0; i--) {
    result = num[i] + result;
    c++;
    if (c % 3 === 0 && i !== 0) {
      result = "," + result;
    }
  }
  return result;
}

/**
 * Formats the time in hh:mm:ss or mm:ss or ss, depending on the
 * amount of time
 * @param {number} time the watch time in seconds
 */
 export function formatAbsoluteTime(time) {
  const hours = Math.floor(time / (60 * 60));
  time = time - hours * 60 * 60;
  const minutes = Math.floor(time / 60);
  time = time - minutes * 60;
  const seconds = time;
  let result = [];
  if (hours === 0 && minutes === 0) result = [seconds];
  else if (hours === 0) result = [minutes, seconds];
  else result = [hours, minutes, seconds];
  return result.map((num) => String(num).padStart(2, "0")).join(":");
}