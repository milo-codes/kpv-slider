import React, {
  ReactElement,
  useRef,
  useState,
  MouseEvent,
  useEffect,
} from "react";
import "./slider.css";
import {
  getDisplayValueFromProportion,
  getInitialDisplayValueFromProps,
  getControlLeftDetailsFromXPosition,
  getProportionFromProps,
  getLeftControlXByUnit,
} from "./sliderHelper";

export type SliderUnit = "%" | "proportional";

interface Props {
  label: string;
  max: number;
  min: number;
  step: number;
  value: number;
  unit?: SliderUnit;
  onChange(value: number): void;
}
// Unfinished:
// - implement 'step' prop
// - implement 'onChange' prop

// TODO:
// - UI Design: ~/public/sliders.png
// - without using the HTML input element
// - basic state management to store the control values
// - pay attention to user experience
// - think about additional features

// Ideas
// - think about accessibility (eg tap target size, aria labels, keyboard input that slider responds to)
// - add tests: component & logic
// - add error handling/ error states

export function Slider({
  label,
  max,
  min,
  step,
  value,
  unit = "%", // default if prop not set
  onChange,
}: Props): ReactElement {
  const sliderRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const mouseDiff = useRef<number>();

  const [displayValue, setDisplayValue] = useState(
    getInitialDisplayValueFromProps(unit, value, min, max)
  );
  const [userHasMovedSlider, setUserHasMovedSlider] = useState(false);

  useEffect(() => {
    if (!userHasMovedSlider && sliderRef.current && controlRef.current) {
      // once elements render, set control to correct initial position based on value prop

      const initialProportion = getProportionFromProps(value, min, max);
      const initialLeftControlX = getLeftControlXByUnit(
        unit,
        initialProportion,
        sliderRef.current.offsetWidth,
        controlRef.current.offsetWidth
      );

      controlRef.current.style.left = initialLeftControlX;
    }
  }, [userHasMovedSlider]);

  const handleMouseMove = (event: any) => {
    setUserHasMovedSlider(true);

    event.preventDefault(); // prevent text highlight on drag

    if (controlRef.current && mouseDiff.current && sliderRef.current) {
      let leftX: number;
      let leftStyle: string;
      leftX =
        event.clientX -
        mouseDiff.current -
        sliderRef.current.getBoundingClientRect().left;

      ({ leftStyle, leftX } = getControlLeftDetailsFromXPosition(
        leftX,
        controlRef.current.offsetWidth,
        sliderRef.current.offsetWidth
      ));

      // apply new style attribute to update control element position
      controlRef.current.style.left = leftStyle;

      const { proportion } = getControlLeftDetailsFromXPosition(
        leftX,
        controlRef.current.offsetWidth,
        sliderRef.current.offsetWidth
      );

      setDisplayValue(
        getDisplayValueFromProportion(unit, proportion, min, max)
      );
    }

    // TODO: sort out MouseEvent types issue & remove 'any' type
  };
  const handleMouseUp = () => {
    // triggered on mouse button release
    // removes listeners so control doesn't move unless mouse moves with button press
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
  };
  const handleMouseDown = (event: MouseEvent) => {
    // triggered on mouse button press

    if (controlRef.current) {
      // diff between control position and mouse click on x-axis
      mouseDiff.current =
        event.clientX - controlRef.current.getBoundingClientRect().left;
    }
    // adds listeners for mouse movement and button release
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
  };

  return (
    <div className="wrapper">
      <h2 className="label">{label}</h2>
      <div className="slider" ref={sliderRef}>
        <div className="control" ref={controlRef} onMouseDown={handleMouseDown}>
          <span className="value">
            {unit == "%" ? `${displayValue}%` : displayValue}
          </span>
        </div>
      </div>
    </div>
  );
}
