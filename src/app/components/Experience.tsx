import { Joystick } from "../Controls/Joystick";
import { Scene } from "./Scene";

export const Experience = () => {
  return (
    <div className="w-full h-full relative">
      <Scene />
      <Joystick />
    </div>
  );
};
