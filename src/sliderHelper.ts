import { SliderUnit } from "./Slider";

export const getControlLeftDetailsFromXPosition = (
  newPosition: number,
  controlWidth: number,
  sliderWidth: number
) => {
  const sliderStartX = 0;
  const availablePath = sliderWidth - controlWidth;

  if (newPosition < sliderStartX) newPosition = sliderStartX;
  if (newPosition > availablePath) newPosition = availablePath;
  console.log("newPosition for style attr: ", newPosition);

  const leftX = newPosition; // reassignment so existing variable can be updated on consumer side
  const leftStyle = `${newPosition}px`;
  const proportion = newPosition / availablePath;
  return { leftStyle, proportion, leftX };
};

const getLeftControlXFromPercentage = (
  percentage: number,
  sliderWidth: number,
  controlWidth: number
) => {
  const availableWidth = sliderWidth - controlWidth;
  if (percentage >= 100) return `${availableWidth}px`;
  if (percentage <= 0) return `0`;
  return `${(availableWidth * percentage) / 100}px`;
};

const getLeftControlXFromProportion = (
  proportion: number,
  sliderWidth: number,
  controlWidth: number
) => {
  const availableWidth = sliderWidth - controlWidth;
  if (proportion >= 1) return `${availableWidth}px`;
  if (proportion <= 0) return `0`;
  return `${availableWidth * proportion}px`;
};

export const getLeftControlXByUnit = (
  // TODO: can these similar funcs be refactored/refined?
  unit: SliderUnit,
  value: number,
  sliderWidth: number,
  controlWidth: number
) => {
  switch (unit) {
    case "%":
      return getLeftControlXFromPercentage(value, sliderWidth, controlWidth);
    case "proportional":
      return getLeftControlXFromProportion(value, sliderWidth, controlWidth);
  }
};

export const getProportionFromProps = (
  value: number,
  min: number,
  max: number
) => {
  if (value < min) value = min;
  if (value > max) value = max;

  const proportion = (value - min) / (max - min);
  return proportion;
};

export const getInitialDisplayValueFromProps = (
  unit: SliderUnit,
  value: number,
  min: number,
  max: number
) => {
  const proportion = getProportionFromProps(value, min, max);
  return getDisplayValueFromProportion(unit, proportion, min, max);
};

export const getDisplayValueFromProportion = (
  unit: SliderUnit,
  proportion: number,
  min: number,
  max: number
) => {
  let newDisplayValue: number;
  switch (unit) {
    case "%":
      newDisplayValue = Number((proportion * 100).toFixed());
      return newDisplayValue;
    case "proportional":
      const adjustedProportion = (max - min) * proportion + min;
      newDisplayValue = Number(adjustedProportion.toFixed(2));
      return newDisplayValue;
  }
};
