export function timeStringToDate(timeString) {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return time;
  }
  
  // Compare function to check if start time is before end time
 export function isStartTimeBeforeEndTime(startTime, endTime) {
    const start = timeStringToDate(startTime);
    const end = timeStringToDate(endTime);
    return start < end; 
  }

  export function convertTo12HrTime(timeinNumber) {
    let date = new Date(0);
    date.setSeconds(timeinNumber);

    let hours = date.getHours();
    let minutes = date.getMinutes();

    let meridiem = hours < 12 ? "AM" : "PM";

    hours = hours % 12 || 12;

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");

    return `${hours}:${minutes} ${meridiem}`;
}

export function convertToMinutes(timeString) {

  const [time, meridiem] = timeString.split(" ");
  const [hours, minutes] = time.split(":");

  let hours24 = parseInt(hours, 10);
  if (meridiem === "PM" && hours24 !== 12) {
      hours24 += 12;
  } else if (meridiem === "AM" && hours24 === 12) {
      hours24 = 0;
  }

  const totalMinutes = hours24 * 60 + parseInt(minutes, 10);

  return totalMinutes;
}
