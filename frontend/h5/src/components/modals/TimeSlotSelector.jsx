import { useState, useEffect, useMemo } from 'react';
import './TimeSlotSelector.css';

const TimeSlotSelector = ({ selectedDate, onTimeSelect, bookedSlots = [], value }) => {
  const [selectedSlot, setSelectedSlot] = useState(value || '');

  // ⏳ 기본 시간 슬롯 생성 함수
  const generateTimeSlots = (date) => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      const startTime = `${String(hour).padStart(2, '0')}:00`;
      const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
      const timeSlot = `${startTime} ~ ${endTime}`;

      const isBooked = bookedSlots.some(slot => slot.date === date && slot.time === startTime);

      if (!isBooked) {
        slots.push({ value: timeSlot, label: timeSlot });
      }
    }
    return slots;
  };

  // 🔹 `useMemo`를 사용하여 상태 업데이트 방지
  const availableSlots = useMemo(() => {
    return generateTimeSlots(selectedDate || "default");
  }, [selectedDate, bookedSlots]);

  useEffect(() => {
    setSelectedSlot(value || '');
  }, [value]);

  const handleTimeSelect = (e) => {
    const selectedTime = e.target.value;
    setSelectedSlot(selectedTime);
    onTimeSelect(selectedTime);
  };

  return (
    <div className="time-slot-select-container">
      <select 
        className="time-slot-select"
        value={selectedSlot}
        onChange={handleTimeSelect}
      >
        <option value="">상담시간을 선택해주세요</option>
        {availableSlots.map((slot) => (
          <option key={slot.value} value={slot.value}>
            {slot.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSlotSelector;
