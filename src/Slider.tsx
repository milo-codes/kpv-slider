import React, { ReactElement } from 'react';
import './slider.css';

interface Props {
  label: string;
  max: number;
  min: number;
  step: number;
  value: number;
  unit?: string;
  onChange(value: number): void;
}

export function Slider({
  label,
  max,
  min,
  step,
  value,
  unit,
  onChange,
}: Props): ReactElement {
  return <div className="slider"></div>;
}
