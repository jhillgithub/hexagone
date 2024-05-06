import { useCallback, useEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

export type ControlsInput = {
  left: boolean;
  right: boolean;
  forward: boolean;
  backward: boolean;
  jump: boolean;
};

const initialState = {
  left: false,
  right: false,
  forward: false,
  backward: false,
  jump: false,
};

export const useControlsInput = () => {
  const controls = useRef<ControlsInput>(initialState);
  const [subscribedKeys, getKeys] = useKeyboardControls();

  useEffect(() => {
    const handleKeys = () => {
      const keys = getKeys();
      controls.current = {
        left: keys.left,
        right: keys.right,
        forward: keys.forward,
        backward: keys.backward,
        jump: keys.jump,
      };
    };

    const unsubscribe = subscribedKeys(handleKeys);

    return () => {
      unsubscribe();
    };
  }, [subscribedKeys, getKeys]);

  const handleJoystickStop = (event: IJoystickUpdateEvent) => {
    controls.current = { ...initialState };
  };

  const handleJoystickMove = (event: IJoystickUpdateEvent) => {
    const { x, y } = event;
    const threshold = 0.5;

    if (x) {
      controls.current = {
        ...controls.current,
        left: x < -threshold,
        right: x > threshold,
      };
    }

    if (y) {
      controls.current = {
        ...controls.current,
        forward: y > threshold,
        backward: y < -threshold,
      };
    }
  };

  const handleJumpButtonDown = useCallback(() => {
    controls.current = {
      ...controls.current,
      jump: true,
    };
  }, []);

  const handleJumpButtonUp = useCallback(() => {
    controls.current = {
      ...controls.current,
      jump: true,
    };
  }, []);

  const getControls = () => controls.current;

  return {
    getControls,
    handleJoystickMove,
    handleJoystickStop,
    handleJumpButtonDown,
    handleJumpButtonUp,
  };
};
