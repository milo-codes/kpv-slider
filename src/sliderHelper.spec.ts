import {
  getControlLeftDetailsFromXPosition,
  getControlLeftStyleFromProportion,
} from "./sliderHelper";

describe("Slider helper functions", () => {
  describe("getControlLeftDetailsFromXPosition", () => {
    it("returns expected details when xPosition within available path", () => {
      const expected = {
        leftX: 15,
        leftStyle: "15px",
        proportion: 15 / 60,
      };
      const actual = getControlLeftDetailsFromXPosition(15, 40, 100);
      expect(actual).toEqual(expected);
    });
    it("handles negative x values - positions to the left of the available path", () => {
      const expected = {
        leftX: 0,
        leftStyle: "0px",
        proportion: 0 / 60,
      };
      const actual = getControlLeftDetailsFromXPosition(-5, 40, 100);
      expect(actual).toEqual(expected);
    });
    it("handles positions to the right of the available path", () => {
      const expected = {
        leftX: 60,
        leftStyle: "60px",
        proportion: 1,
      };
      const actual = getControlLeftDetailsFromXPosition(90, 40, 100);
      expect(actual).toEqual(expected);
    });
  });
  describe("getControlLeftStyleFromProportion", () => {
    it("returns expected style for proportion values between 0 and 1", () => {
      const expected = "33px";
      const actual = getControlLeftStyleFromProportion(0.33, 120, 20);
      expect(actual).toEqual(expected);
    });
    it("handles invalid values for proportion - <0 and >1", () => {
      // <0
      const expected1 = "0";
      const actual1 = getControlLeftStyleFromProportion(-0.2, 120, 20);
      expect(actual1).toEqual(expected1);
      // >1
      const expected2 = "100px";
      const actual2 = getControlLeftStyleFromProportion(1.2, 120, 20);
      expect(actual2).toEqual(expected2);
    });
  });
  describe("getProportionFromProps", () => {
    // TODO
  });
  describe("getInitialDisplayValueFromProps", () => {
    // TODO
  });
  describe("getDisplayValueFromProportion", () => {
    // TODO
  });
});
