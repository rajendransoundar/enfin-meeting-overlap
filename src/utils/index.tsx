export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2,   
 '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;   

}

export function getAvailableSlots(participants, participantAvailability, schedules, input) {
  const { participant_ids, date_range } = input;
  console.log(participant_ids, date_range, "input");
  
  const result = {};
  
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  
  const minutesToTime = (minutes) => {
    const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    return `${hours}:${mins}`;
  };
  
  const generateSlots = (start, end) => {
    const slots = [];
    let startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    while (startMinutes + 30 <= endMinutes) {
      slots.push(`${minutesToTime(startMinutes)}-${minutesToTime(startMinutes + 30)}`);
      startMinutes += 30;
    }
    return slots;
  };
  
  // Generate all dates in the range
  const startDate = new Date(date_range.start);
  const endDate = new Date(date_range.end);
  const allDates = [];
  while (startDate <= endDate) {
    allDates.push(startDate.toISOString().split("T")[0]); // YYYY-MM-DD format
    startDate.setDate(startDate.getDate() + 1);
  }
console.log(allDates, "allDates");

  // Iterate through each date
  for (const date of allDates) {
    let commonSlots = null;

    // Check availability for each participant
    for (const id of participant_ids) {
      const availability = participantAvailability[id];
      const schedule = schedules[id]?.[date] || [];
      const dailyThreshold = participants[id]?.threshold || Infinity;

      // Combine availability into 30-minute slots
      const dateAvailability = availability?.[new Date(date).toLocaleDateString("en-US", { weekday: "long" })] || [];
      let availableSlots = [];
      for (const { start, end } of dateAvailability) {
        availableSlots.push(...generateSlots(start, end));
      }

      // Remove slots based on schedules
      for (const { start, end } of schedule) {
        const scheduledSlots = generateSlots(start, end);
        availableSlots = availableSlots.filter((slot) => !scheduledSlots.includes(slot));
      }

      // Respect daily threshold
      availableSlots = availableSlots.slice(0, dailyThreshold);

      // Intersect with common slots
      if (commonSlots === null) {
        commonSlots = availableSlots;
      } else {
        commonSlots = commonSlots.filter((slot) => availableSlots.includes(slot));
      }

      // Exit early if no common slots remain
      if (commonSlots.length === 0) break;
    }

    // Add to results if there are common slots
    if (commonSlots?.length > 0) {
      result[date] = commonSlots;
    }
  }

  return result;
}

// Example input
const participants = {
  1: { name: "Adam", threshold: 4 },
  2: { name: "Bosco", threshold: 4 },
  3: { name: "Catherine", threshold: 5 },
};

const participantAvailability = {
  1: {
    Monday: [
      { start: "09:00", end: "11:00" },
      { start: "14:00", end: "16:30" },
    ],
    Tuesday: [{ start: "09:00", end: "18:00" }],
  },
  2: {
    Monday: [{ start: "09:00", end: "18:00" }],
    Tuesday: [{ start: "09:00", end: "11:30" }],
  },
  3: {
    Monday: [{ start: "09:00", end: "18:00" }],
    Tuesday: [{ start: "09:00", end: "18:00" }],
  },
};

const schedules = {
  1: {
    "28/10/2024": [
      { start: "09:30", end: "10:30" },
      { start: "15:00", end: "16:30" },
    ],
  },
  2: {
    "28/10/2024": [{ start: "13:00", end: "13:30" }],
    "29/10/2024": [{ start: "09:00", end: "10:30" }],
  },
};

const input = {
  participant_ids: [1, 2, 3],
  date_range: {
    start: "2024-10-11",
    end: "2024-10-14",
  },
};

