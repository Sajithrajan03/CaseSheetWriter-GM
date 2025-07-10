import React, { useState } from "react";

const RespiratoryCaseSheet: React.FC = () => {
  const [smoking, setSmoking] = useState("Never");
  const [smokingDuration, setSmokingDuration] = useState(0);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(0);
  const smokingIndex = cigarettesPerDay * smokingDuration;
  const packYears = Math.round(((cigarettesPerDay / 20) * smokingDuration) * 10) / 10;

  const [habits, setHabits] = useState<string[]>(["None"]);

  const handleHabitChange = (value: string) => {
    if (value === "None") {
      setHabits(["None"]);
    } else {
      const updated = habits.includes(value)
        ? habits.filter((h) => h !== value)
        : [...habits.filter((h) => h !== "None"), value];
      setHabits(updated.length ? updated : ["None"]);
    }
  };

  return (
    <div className="h-screen w-full">
      <iframe
        src="/respiratory.html"
        title="Respiratory Page"
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default RespiratoryCaseSheet;
