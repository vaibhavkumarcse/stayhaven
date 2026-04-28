import { DateRange } from "react-date-range";
import { useState } from "react";

// ✅ IMPORTANT CSS imports
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DatePicker = () => {
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <DateRange
        editableDateInputs={true}
        onChange={(item) => setDate([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={date}
      />
    </div>
  );
};

export default DatePicker;