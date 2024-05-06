import { Button } from "@/components/ui/button";
import { Joystick as ReactJoystick } from "react-joystick-component/build/lib/Joystick";
import { useControlsContext } from "./Controls";

export const Joystick = () => {
  const {
    handleJoystickMove,
    handleJoystickStop,
    handleJumpButtonDown,
    handleJumpButtonUp,
  } = useControlsContext();

  return (
    <div className="absolute inset-x-0 bottom-20">
      <div className="container flex justify-between items-center gap-x-24">
        <ReactJoystick
          throttle={200}
          move={handleJoystickMove}
          stop={handleJoystickStop}
        />
        <Button
          className="bg-[#3d59ab] p-8 rounded-full rotate-45"
          onMouseDown={handleJumpButtonDown}
          onMouseUp={handleJumpButtonUp}
          variant={"destructive"}
          size="icon"
        >
          Jump
        </Button>
      </div>
    </div>
  );
};
