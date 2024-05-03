import { useRef } from "react";
import { CatmullRomCurve3, Group, Vector3 } from "three";
import {
  TILE_BASE_RADIUS,
  TILE_GAP_SIZE,
} from "../constants/gameArenaContants";
import { FloorTile } from "./FloorTile";

export const RaceTrack = () => {
  const curveRef = useRef<Group>(null);

  const curvePoints = [
    new Vector3(-5, 0, 0),
    new Vector3(-8, 0, 3),
    new Vector3(2.5, 0, 3),
    new Vector3(5, 0, 0),
    new Vector3(2.5, 0, -3),
    new Vector3(-2.5, 0, -3),
    new Vector3(-5, 0, 0),
  ];
  const curve = new CatmullRomCurve3(curvePoints);
  const hexagonSize = TILE_BASE_RADIUS;
  const gapSize = TILE_GAP_SIZE;
  const numHexagons = 128;
  const curveLength = curve.getLength();
  const totalLength = hexagonSize * numHexagons + gapSize * (numHexagons - 1);
  const scaleFactor = totalLength / curveLength;

  const getOverlapScale = (position: Vector3, hexagonPositions: Vector3[]) => {
    let minDistance = Infinity;
    for (let i = 0; i < hexagonPositions.length; i++) {
      const distance = position.distanceTo(hexagonPositions[i]);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
    return minDistance / hexagonSize;
  };

  const getHexagonPositions = (
    scaledPoint: Vector3,
    angle: number,
    hexagonPositions: Vector3[]
  ) => {
    const positions = [scaledPoint];
    const scales = [1];
    const numOffsets = 10; // number of hexagons to use for track width
    const hexagonOffset = hexagonSize + gapSize;
    let prevPosition = scaledPoint;

    for (let i = 0; i < numOffsets; i++) {
      const offsetVector = new Vector3(
        -hexagonOffset * 0.8,
        0,
        hexagonOffset / 2
      );
      const hexagonPosition = prevPosition
        .clone()
        .add(offsetVector.applyAxisAngle(new Vector3(0, 1, 0), angle));
      const overlapScale = getOverlapScale(hexagonPosition, hexagonPositions);
      positions.push(hexagonPosition);
      scales.push(overlapScale);
      prevPosition = hexagonPosition;
    }

    return { positions, scales };
  };

  const hexagonPositions: Vector3[] = [];

  return (
    <group ref={curveRef}>
      {Array.from({ length: numHexagons }, (_, i) => {
        const t = (i * (hexagonSize + gapSize)) / totalLength;
        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t).normalize();
        const angle = Math.atan2(tangent.x, tangent.z);
        const scaledPoint = point.multiplyScalar(scaleFactor);
        const { positions, scales } = getHexagonPositions(
          scaledPoint,
          angle,
          hexagonPositions
        );
        hexagonPositions.push(...positions);

        return positions.map((position, index) => (
          <FloorTile
            key={`${i}-${index}`}
            name={`tile-${i}-${index}`}
            color={"teal"}
            hexagonSize={hexagonSize}
            position={position}
            rotation={[0, angle + Math.PI / 2, 0]}
            scale={[scales[index], scales[index], 1]}
          />
        ));
      })}
    </group>
  );
};
