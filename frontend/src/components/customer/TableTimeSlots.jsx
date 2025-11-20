import React, { useEffect, useState } from "react";
import axios from "axios";
import { TIME_SLOTS } from "../../timeSlots";
import "./TimeSlots.css";

export default function TableTimeSlots({ tableId, onClose }) {
  const [reservedTimes, setReservedTimes] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/bookings/table/${tableId}`)
      .then((res) => {
        const times = res.data.map((b) => b.time);
        setReservedTimes(times);
      });
  }, [tableId]);

  return (
    <div className="timeslot-dialog">
      <div className="timeslot-box">
        <h2 className="timeslot-title">Table {tableId} Schedule</h2>

        <div className="timeslot-list">
          {TIME_SLOTS.map((slot) => {
            const reserved = reservedTimes.includes(slot);
            return (
              <div className="timeslot-row" key={slot}>
                <span>{slot}</span>
                <span className={`status-badge ${reserved ? "reserved" : "available"}`}>
                  {reserved ? "Reserved" : "Available"}
                </span>
              </div>
            );
          })}
        </div>

        <button className="timeslot-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
