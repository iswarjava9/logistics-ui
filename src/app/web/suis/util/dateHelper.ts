import {format} from 'date-fns';
export class DateHelper {
  public static convertDateStringsToDates(input) {
    const regExpr = /^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{1,2})$/;
    // Ignore things that aren't objects.
   if (typeof input !== 'object') {
     return input;
   }

    for (const key in input) {
      if ( !input.hasOwnProperty(key)) {
        continue;
      }
      const value = input[key];
      let match: string[];
      // Check for string values looking like dates.
      if (typeof value === 'string' && (match = value.match(regExpr))) {
          input[key] = new Date(match[0].replace(' ', 'T'));
       } else if (typeof value === 'object') {
        // Recurse into object
        DateHelper.convertDateStringsToDates(value);
      }
    }
  }

  public static removeTimeAndTimeZone(input) {
    const regExprTime = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{1,2}):(\d{1,2}).(\d{1,3})Z$/;
      // Ignore things that aren't objects.
    if (typeof input !== 'object') {
      return input;
    }

    for (const key in input) {
      if ( !input.hasOwnProperty(key)) {
        continue;
      }
      const value = input[key];
      let match: string[];
      // Check for string values looking like dates.
      if (typeof value === 'string' ) {
       match = value.match(regExprTime);
        if (match) {
          const tempDate = match[0].substring(0, 10).concat(' ', match[0].substring(11, 16));
          input[key] = tempDate;
        }
      } else if (typeof value === 'object') {
        // Recurse into object
        DateHelper.removeTimeAndTimeZone(value);
      }
    }
  }

  public static convertDateStrings(input) {
    const regExpr = /^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{1,2})$/;
    // Ignore things that aren't objects.
   if (typeof input !== 'object') {
     return input;
   }

    for (const key in input) {
      if ( !input.hasOwnProperty(key)) {
        continue;
      }
      const value = input[key];
      let match: string[];
      // Check for string values looking like dates.
      if (typeof value === 'string' && (match = value.match(regExpr))) {
          input[key] = format(new Date(match[0].replace(' ', 'T') ),'MMM/DD/YYYY');
      } else if (typeof value === 'object') {
        // Recurse into object
        DateHelper.convertDateStrings(value);
      }
    }
  }
}
