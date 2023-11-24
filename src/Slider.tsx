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
  getControlLeftStyleFromProportion,
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
// Unfinished in the time:
// - implement 'step' prop
// - implement 'onChange' prop

// IDEAS FOR ENHANCEMENTS

// - a slider that relies on click and drag is not very accessible, so I'd look at MDN and WCAG guidance on using semantic or aria roles and make control button interactible via keyboard (Starting point: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role)

// - add tests: component & logic
// I've added some unit tests on some logic here.
// Given more time I would expand on those and also add component tests with React Testing Library and/or cypress

// - Error handling/ error states

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
      const initialLeftControlStyle = getControlLeftStyleFromProportion(
        initialProportion,
        sliderRef.current.offsetWidth,
        controlRef.current.offsetWidth
      );
      controlRef.current.style.left = initialLeftControlStyle;
    }
  }, [userHasMovedSlider]);

  const handleMouseMove = (event: MouseEvent) => {
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
  };
  const handleMouseUp = () => {
    // triggered on mouse button release
    // removes listeners so control doesn't move unless mouse moves with button press
    document.removeEventListener("mouseup", handleMouseUp);
    // @ts-expect-error: known ts limitation on event listeners (https://github.com/microsoft/TypeScript/issues/28357)
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
    // @ts-expect-error: known ts limitation on event listeners (https://github.com/microsoft/TypeScript/issues/28357)
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
