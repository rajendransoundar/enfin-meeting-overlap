"use client";

import React, { useCallback, useState } from "react";
import { formatDate, getAvailableSlots } from "../utils";

const participantsData = {
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
export default function ParticipantsForm() {
  const [participants, setParticipants] = useState<number[]>([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleParticipantChange = useCallback((event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option: any) => option.value
    );
    setParticipants(selectedOptions);
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const inputData = {
      participant_ids: participants,
      date_range: {
        start: startDate,
        end: endDate,
      },
    };
    console.log(inputData);
    console.log(
      getAvailableSlots(
        participants,
        participantAvailability,
        schedules,
        input
      ), "result"
    );
  };
  return (
    <>
      <div className="main-container">
        <form onSubmit={handleSubmit} className="main-form">
          <label htmlFor="participants">Participants:</label>
          <select id="participants" multiple onChange={handleParticipantChange}>
            {Object.entries(participantsData).map(([id, participant]) => (
              <option key={id} value={id}>
                {participant.name}
              </option>
            ))}
          </select>

          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            onChange={(event) => setStartDate(formatDate(event.target.value))}
          ></input>

          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            onChange={(event) => setEndDate(formatDate(event.target.value))}
          ></input>

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
