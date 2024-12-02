export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
};

export function getAvailableSlots(
  participants,
  participantAvailability,
  schedules,
  input
) {
  const { participant_ids, date_range } = input;
  const result = {};
  const generateSlots = (start, end) => {
    const slots = [];
    let startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    while (startMinutes + 30 <= endMinutes) {
      slots.push(
        `${minutesToTime(startMinutes)}-${minutesToTime(startMinutes + 30)}`
      );
      startMinutes += 30;
    }
    return slots;
  };

  // get all dates in the range
  const startDate = new Date(date_range.start);
  const endDate = new Date(date_range.end);
  const allDates = [];
  while (startDate <= endDate) {
    allDates.push(startDate.toISOString().split("T")[0]);
    startDate.setDate(startDate.getDate() + 1);
  }

  // get availability and schedules
  const precomputedAvailability = new Map();
  for (const id of participant_ids) {
    precomputedAvailability.set(id, {});
    for (const date of allDates) {
      const dayName = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const availability = participantAvailability[id]?.[dayName] || [];
      const availableSlots = [];
      for (const { start, end } of availability) {
        availableSlots.push(...generateSlots(start, end));
      }
      precomputedAvailability.get(id)[date] = new Set(availableSlots);
    }
  }

  // Iterate through each date
  for (const date of allDates) {
    let commonSlots = null;

    for (const id of participant_ids) {
      const availability = precomputedAvailability.get(id)[date];
      const schedule = schedules[id]?.[date] || [];
      const dailyThreshold = participants[id]?.threshold || Infinity;

      // Remove scheduled slots
      const unavailableSlots = new Set();
      for (const { start, end } of schedule) {
        for (const slot of generateSlots(start, end)) {
          unavailableSlots.add(slot);
        }
      }
      const availableSlots = Array.from(availability)
        .filter((slot) => !unavailableSlots.has(slot))
        .slice(0, dailyThreshold);

      // Intersect with common slots
      if (commonSlots === null) {
        commonSlots = new Set(availableSlots);
      } else {
        commonSlots = new Set(
          [...commonSlots].filter((slot) => availableSlots.includes(slot))
        );
      }

      if (commonSlots.size === 0) break;
    }

    if (commonSlots && commonSlots.size > 0) {
      result[date] = Array.from(commonSlots);
    }
  }

  return result;
}
