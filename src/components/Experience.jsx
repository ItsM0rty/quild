import { PresentationControls, Stage } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useQuildConfiguration } from "../contexts/QuildConfiguration";
import Building from "./Building";
import * as THREE from "three";

const CameraController = ({ aSelectedBuilding }) => {
  const { camera } = useThree();
  const aInitialDistance = aSelectedBuilding?.modelPath === "/two_story_house.glb" ? 28 : 20;
  const aDistanceRef = useRef(aInitialDistance);
  const aTargetDistance = useRef(aInitialDistance);

  useEffect(() => {
    const aNewInitialDistance = aSelectedBuilding?.modelPath === "/two_story_house.glb" ? 28 : 20;
    aTargetDistance.current = aNewInitialDistance;
    
    const aCurrentDistance = camera.position.length();
    const aDirection = new THREE.Vector3()
      .copy(camera.position)
      .normalize();
    camera.position.copy(aDirection.multiplyScalar(aNewInitialDistance));
  }, [aSelectedBuilding?.modelPath, camera]);

  useEffect(() => {
    const handleWheel = (anEvent) => {
      anEvent.preventDefault();
      const aDelta = anEvent.deltaY * 0.009;
      aTargetDistance.current = Math.max(
        3,
        Math.min(40, aTargetDistance.current + aDelta)
      );
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useFrame(() => {
    const aCurrentDistance = camera.position.length();
    const aDifference = aTargetDistance.current - aCurrentDistance;

    if (Math.abs(aDifference) > 0.01) {
      const aDirection = new THREE.Vector3()
        .copy(camera.position)
        .normalize();
      const aNewDistance = aCurrentDistance + aDifference * 0.1;
      camera.position.copy(
        aDirection.multiplyScalar(Math.max(3, Math.min(40, aNewDistance)))
      );
    }
  });

  return null;
};

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

  const hasModel = aSelectedBuilding.modelPath !== null;

  return (
    <>
      <CameraController aSelectedBuilding={aSelectedBuilding} />
      <PresentationControls
        speed={1.35}
        global
        polar={[0, Math.PI / 3]}
        rotation={[0, Math.PI / 4, 0]}
        config={{ mass: 2, tension: 50 }}
      >
      <Stage
        environment="city"
        intensity={0.7}
        castShadow={false}
        adjustCamera={false}
        shadows={false}
      >
        {hasModel ? (
          <Building
            key={aSelectedBuilding.modelPath}
            aModelPath={aSelectedBuilding.modelPath}
            aWallsMaterial={aSelectedWallsMaterial}
            aRoofMaterial={aSelectedRoofMaterial}
            aFloorMaterial={aSelectedFloorMaterial}
          />
        ) : (
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
        )}
      </Stage>

      {!hasModel && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position-y={-0.01}>
          <planeGeometry args={[22, 22]} />
          <meshStandardMaterial
            color={aSelectedFloorMaterial.color}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
      )}
      </PresentationControls>
    </>
  );
};

export default Experience;
