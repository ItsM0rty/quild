import { PresentationControls, Stage } from "@react-three/drei";
import { useMemo } from "react";
import { useQuildConfiguration } from "../contexts/QuildConfiguration";

const Experience = () => {
  const {
    aSelectedBuilding,
    aSelectedWallsMaterial,
    aSelectedRoofMaterial,
    aSelectedFloorMaterial,
  } = useQuildConfiguration();

  const buildingMeshes = useMemo(() => {
    const baseHeight = aSelectedBuilding.footprint.height;
    const roofHeight = aSelectedBuilding.footprint.roofHeight;
    const baseWidth = aSelectedBuilding.footprint.width;
    const baseDepth = aSelectedBuilding.footprint.depth;

    return {
      baseDimensions: [baseWidth, baseHeight, baseDepth],
      roofDimensions: [baseWidth, roofHeight, baseDepth],
      basePosition: [0, baseHeight / 2, 0],
      roofPosition: [0, baseHeight + roofHeight / 2, 0],
    };
  }, [aSelectedBuilding]);

  return (
    <PresentationControls
      speed={1.35}
      global
      polar={[-0.1, Math.PI / 4]}
      rotation={[Math.PI / 8, Math.PI / 6, 0]}
    >
      <Stage
        environment="city"
        intensity={0.7}
        castShadow={false}
        adjustCamera
      >
        <group>
          <mesh position={buildingMeshes.basePosition} castShadow receiveShadow>
            <boxGeometry args={buildingMeshes.baseDimensions} />
            <meshStandardMaterial color={aSelectedWallsMaterial.color} />
          </mesh>

          <mesh position={buildingMeshes.roofPosition} castShadow receiveShadow>
            <boxGeometry args={buildingMeshes.roofDimensions} />
            <meshStandardMaterial color={aSelectedRoofMaterial.color} />
          </mesh>
        </group>
      </Stage>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position-y={0}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial
          color={aSelectedFloorMaterial.color}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
    </PresentationControls>
  );
};

export default Experience;
