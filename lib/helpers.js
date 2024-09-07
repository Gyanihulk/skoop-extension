export function timeStringToDate(timeString) {
  const [hours, minutes] = timeString.split(':')
  const time = new Date()
  time.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
  return time
}

// Compare function to check if start time is before end time
export function isStartTimeBeforeEndTime(startTime, endTime) {
  const start = timeStringToDate(startTime)
  const end = timeStringToDate(endTime)
  return start < end
}

export function convertTo12HrTime(timeinNumber) {
  let date = new Date(0)
  date.setSeconds(timeinNumber)

  let hours = date.getHours()
  let minutes = date.getMinutes()

  let meridiem = hours < 12 ? 'AM' : 'PM'

  hours = hours % 12 || 12

  hours = String(hours).padStart(2, '0')
  minutes = String(minutes).padStart(2, '0')

  return `${hours}:${minutes} ${meridiem}`
}

export function convertToMinutes(timeString) {
  const [time, meridiem] = timeString.split(' ')
  const [hours, minutes] = time.split(':')

  let hours24 = parseInt(hours, 10)
  if (meridiem === 'PM' && hours24 !== 12) {
    hours24 += 12
  } else if (meridiem === 'AM' && hours24 === 12) {
    hours24 = 0
  }

  const totalMinutes = hours24 * 60 + parseInt(minutes, 10)

  return totalMinutes
}

export function capitalizeWords(str) {
  return str.replace(/\b(\w)/g, (s) => s.toUpperCase())
}

export function removeNestedParentheses(name) {
  let result = '';
  let openParenthesesCount = 0;
  let lastOpenParenthesisIndex = -1; // Keep track of the last open parenthesis index

  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    if (char === '(') {
      if (openParenthesesCount === 0) {
        lastOpenParenthesisIndex = i; // Update the index when the first '(' of a nested set is found
      }
      openParenthesesCount++;
    } else if (char === ')') {
      openParenthesesCount--;
      if (openParenthesesCount === 0 && i === name.length - 1) {
        // If this is the last character in the string, keep the parentheses
        result += name.substring(lastOpenParenthesisIndex, i + 1);
      }
    } else if (openParenthesesCount === 0) {
      result += char;
    }
  }

  // Replace multiple spaces with a single space and trim
  return result.replace(/\s+/g, ' ').trim();
}


export const removeUnsupportedCharacters = (text) => {
  // Allow only basic Latin letters (both cases), numbers, basic punctuation, and space
  return text.replace(/[^\u0000-\u007F]/g, '')
}
export function removeMiddleBrackets(name) {
  // Split the name by spaces and process each part
  const parts = name.split(' ');

  const processedParts = parts.map((part, index) => {
    // If the part is not the last one and it is bracketed, return an empty string
    if (index < parts.length - 1 && /^\(.*\)$/.test(part)) {
      return '';
    }
    // Otherwise, return the part unchanged
    return part;
  });

  // Join the parts back together and trim any extra spaces
  return processedParts.join(' ').trim();
}