const timeUnits = [{
  singular: "minute",
  plural: "minutes",
  seconds: 60,
  one: "a"
}, {
  singular: "hour",
  plural: "hours",
  seconds: 60 * 60,
  one: "an"
}, {
  singular: "day",
  plural: "days",
  seconds: 60 * 60 * 24,
  one: "a"
}, {
  singular: "week",
  plural: "weeks",
  seconds: 60 * 60 * 24 * 7,
  one: "a"
}, {
  singular: "month",
  plural: "months",
  seconds: 60 * 60 * 24 * 7 * 4,
  one: "a"
}, {
  singular: "year",
  plural: "years",
  seconds: 60 * 60 * 24 * 7 * 4 * 12,
  one: "a"
}];

/**
 * Some utilities.
 * @author Johan Svensson
 */
export default {
  /**
   * @returns A readable string describing the delta time between the current date
   * and a specific date, e.g. "5 hours ago".
   */
  getDeltaTimeText(from: Date) {
    let msDelta = Date.now() - from.getTime();
    let delta: number | string = msDelta;
    let unit = timeUnits[0].plural;

    for (let _unit of timeUnits) {
      if (msDelta >= _unit.seconds * 1000) {

        delta = Math.round((msDelta / 1000) / _unit.seconds);

        if (delta == 1) {
          unit = _unit.singular;
        } else {
          unit = _unit.plural;
        }
      }
    }

    return `${delta} ${unit} ago`;
  },

  /**
   * Pads a number with zeros.
   * @param n Number to pad.
   * @param width 
   */
  pad(n: number, width: number = 2) {
    let nStr = n.toString();
    return nStr.length >= width ? n : new Array(width - nStr.length + 1).join("0") + nStr;
  },

  avg(a: number[]) {
    return (a.reduce((p, e) => p += e, 0) / a.length) || 0;
  },

  max(a: number[]) {
    return (a.reduce((p, e) => p = Math.max(p, e), 0)) || 0;
  },

  isOnSameDay(d1: Date, d2: Date) {
    console.log("Comparing", d1, d2);
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }
}