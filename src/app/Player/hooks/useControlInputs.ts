// import { useCallback, useRef } from "react";
// import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

// export const useControlInputs = () => {
//   console.log("useControlInputs");
//   const controls = useRef({
//     cleft: false,
//     cright: false,
//     cforward: false,
//     cbackward: false,
//     cjump: false,
//   });

//   // Simulating only the joystick event handler
//   const handleJoystickMove = useCallback((event: IJoystickUpdateEvent) => {
//     const { x, y } = event;
//     const threshold = 0.5;

//     // Adjust directional controls based on joystick movements
//     // controls.current.right = true;
//     //   if (x) {
//     //     controls.current.left = x < -threshold;
//     //     controls.current.right = x > threshold;
//     //   }
//     // if (y) {
//     //   controls.current.forward = y > threshold;
//     //   controls.current.backward = y < -threshold;
//     // }

//     // Log the results to see if the correct values are being updated
//     // console.log("Updated controls from joystick:", controls.current);
//   }, []);

//   const updateControls = useCallback(() => {
//     // console.log("clicked, ", controls.current);
//     controls.current = { ...controls.current, right: true };
//     // console.log("clicked, ", controls.current);
//   }, []);

//   // Function to return the current control state
//   const getControls = useCallback(() => {
//     // Log current control state for debugging purposes
//     // console.log("Returning current controls:", controls.current);
//     return controls.current;
//   }, []);

//   return { updateControls, getControls, handleJoystickMove };
// };
