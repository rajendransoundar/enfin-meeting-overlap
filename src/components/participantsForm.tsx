"use client";

import React, { useCallback, useState } from "react";
import { formatDate, getAvailableSlots } from "../utils";

export default function ParticipantsForm({ data }) {
  const { participantsData, participantAvailability, schedules } = data;
  const [participants, setParticipants] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [result, setResult] = useState(null);
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
    setResult(
      getAvailableSlots(
        participants,
        participantAvailability,
        schedules,
        inputData
      )
    );
    console.log(inputData);
    console.log(
      getAvailableSlots(
        participants,
        participantAvailability,
        schedules,
        inputData
      ),
      "result"
    );
  };
  return (
    <>
      <div className="main-container">
        <form onSubmit={handleSubmit} className="main-form">
          <label htmlFor="participants">Participants:</label>
          <select
            id="participants"
            multiple
            onChange={handleParticipantChange}
            title="click ctrl+ select to add participants"
          >
            {Object.entries(participantsData).map(([id, participant]: any) => (
              <option key={id} value={id}>
                {participant.name}
              </option>
            ))}
          </select>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="start"
            name="start"
            onChange={(event) => setStartDate(event.target.value)}
            placeholder="Start Date"
          ></input>

          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="end"
            name="end"
            onChange={(event) => setEndDate(event.target.value)}
          ></input>
          <button className="submit-btn" type="submit">
            Submit
          </button>
        </form>

        {result && (
          <div className="availability-list">
            {Object.entries(result).map(([date, slots]: any) => (
              <div className="slot-card" key={date}>
                <div className="slot-date">{formatDate(date)}:</div>
                <ul>
                  {slots.map((slot: any) => (
                    <li className="slot-list-row" key={`${date}-${slot}`}>
                      <ClockIcon />
                      <span>{slot}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const ClockIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g id="SVGRepo_iconCarrier">
          <path
            d="M3 5.5L5 3.5M21 5.5L19 3.5M12 8.5V12.5L14 14.5M20 12.5C20 16.9183 16.4183 20.5 12 20.5C7.58172 20.5 4 16.9183 4 12.5C4 8.08172 7.58172 4.5 12 4.5C16.4183 4.5 20 8.08172 20 12.5Z"
            stroke="#ffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </>
  );
};
