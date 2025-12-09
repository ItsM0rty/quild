import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const Building = ({
  aModelPath,
  aWallsMaterial,
  aRoofMaterial,
  aFloorMaterial,
}) => {
  const { scene } = useGLTF(aModelPath);

  const clonedScene = useMemo(() => {
    if (!scene) return null;
    return scene.clone();
  }, [scene]);

  const materials = useMemo(() => {
    return {
      walls: new THREE.MeshStandardMaterial({
        color: aWallsMaterial.color,
        roughness: 0.7,
        metalness: 0.1,
      }),
      roof: new THREE.MeshStandardMaterial({
        color: aRoofMaterial.color,
        roughness: 0.8,
        metalness: 0.2,
      }),
      floor: new THREE.MeshStandardMaterial({
        color: aFloorMaterial.color,
        roughness: 0.85,
        metalness: 0.05,
      }),
    };
  }, [aWallsMaterial, aRoofMaterial, aFloorMaterial]);

  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((aChild) => {
      if (aChild.isMesh) {
        const aMeshName = aChild.name.toLowerCase();
        const aGeometryName = aChild.geometry?.name?.toLowerCase() || "";

        if (
          aMeshName.includes("wall") ||
          aMeshName.includes("exterior") ||
          aMeshName.includes("facade") ||
          aMeshName.includes("siding") ||
          aMeshName.includes("house") ||
          (aGeometryName.includes("wall") && !aMeshName.includes("roof"))
        ) {
          aChild.material = materials.walls;
          aChild.castShadow = true;
          aChild.receiveShadow = true;
        } else if (
          aMeshName.includes("roof") ||
          aMeshName.includes("rooftop") ||
          aGeometryName.includes("roof")
        ) {
          aChild.material = materials.roof;
          aChild.castShadow = true;
          aChild.receiveShadow = true;
        } else if (
          aMeshName.includes("floor") ||
          aMeshName.includes("ground") ||
          aMeshName.includes("foundation") ||
          aGeometryName.includes("floor")
        ) {
          aChild.material = materials.floor;
          aChild.castShadow = false;
          aChild.receiveShadow = true;
        } else {
          aChild.castShadow = true;
          aChild.receiveShadow = true;
        }
      }
    });
  }, [clonedScene, materials]);

  if (!clonedScene) return null;

  return <primitive object={clonedScene} />;
};

export default Building;

useGLTF.preload("/house.glb");
useGLTF.preload("/two_story_house.glb");

