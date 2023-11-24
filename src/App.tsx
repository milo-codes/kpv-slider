import "./styles.css";
import { Info } from "./Info";
import { Slider } from "./Slider";
import React, { useState } from "react";

export default function App() {
  const [percentageSliderValue, setPercentageSliderValue] = useState(67);
  const [proportionalSliderValue, setProportionalSliderValue] = useState(0.33);
  return (
    <div className="App">
      <h1>Custom Control Slider Challenge</h1>
      <Info />
      <hr />
      <Slider
        label="Percentage Label"
        max={150}
        min={50}
        step={1}
        value={percentageSliderValue}
        unit="%"
        onChange={setPercentageSliderValue}
      />
      <Slider
        label="Proportional Label"
        max={3}
        min={2}
        step={0.1}
        value={proportionalSliderValue}
        unit="proportional"
        onChange={setProportionalSliderValue}
      />
    </div>
  );
}
