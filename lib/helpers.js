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