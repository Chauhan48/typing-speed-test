'use client';

import { useTimeStore } from "@/stores/timeStore";
import { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const { selectedTime } = useTimeStore();
  const [time, setTime] = useState<number>(selectedTime || 30);

  useEffect(() => {
    setTime(selectedTime || 30);
  }, [selectedTime]);

  useEffect(() => {
    if (time <= 0) return;

    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  return (
    <div className="text-4xl font-mono font-bold text-white bg-red-500 px-8 py-4 rounded-2xl shadow-2xl">
      {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
    </div>
  );
};

export default Timer;
