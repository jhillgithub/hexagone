import { KeyboardControls } from "@react-three/drei";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { ControlsInput, useControlsInput } from "./useControlsInput";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

type ControlsContextType = {
  getControls: () => ControlsInput;
  handleJoystickMove: (e: IJoystickUpdateEvent) => void;
  handleJoystickStop: (e: IJoystickUpdateEvent) => void;
};

const ControlsContext = createContext<ControlsContextType | undefined>(
  undefined
);

export const useControlsContext = () => {
  const context = useContext(ControlsContext);
  if (context === undefined) {
    throw new Error(
      "useControlsContext must be used inside of a ControlsContextProvider"
    );
  }
  return context;
};

const ControlsContextProvider = ({ children }: { children: ReactNode }) => {
  const { getControls, handleJoystickMove, handleJoystickStop } =
    useControlsInput();
  return (
    <ControlsContext.Provider
      value={{ getControls, handleJoystickMove, handleJoystickStop }}
    >
      {children}
    </ControlsContext.Provider>
  );
};

export const Controls = ({ children }: { children: ReactNode }) => {
  const map = useMemo(
    () => [
      { name: "forward", keys: ["ArrowUp", "KeyW"] },
      { name: "backward", keys: ["ArrowDown", "KeyS"] },
      { name: "left", keys: ["ArrowLeft", "KeyA"] },
      { name: "right", keys: ["ArrowRight", "KeyD"] },
      { name: "jump", keys: ["Space"] },
    ],
    []
  );
  return (
    <KeyboardControls map={map}>
      <ControlsContextProvider>{children}</ControlsContextProvider>
    </KeyboardControls>
  );
};
