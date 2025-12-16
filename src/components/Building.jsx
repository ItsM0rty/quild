import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Building = ({
  aModelPath,
  aWallsMaterial,
  aRoofMaterial,
  aFloorMaterial,
}) => {
  const { scene } = useGLTF(aModelPath);
  const aMaterialsRef = useRef(null);
  const aInitializedRef = useRef(false);
  const aLastModelPathRef = useRef(null);

  const clonedScene = useMemo(() => {
    if (!scene) return null;
    const aClonedScene = scene.clone();

    if (aModelPath === "/two_story_house.glb") {
      const aBox = new THREE.Box3().setFromObject(aClonedScene);
      const aCenter = aBox.getCenter(new THREE.Vector3());
      const aSize = aBox.getSize(new THREE.Vector3());
      aClonedScene.position.x -= aCenter.x;
      aClonedScene.position.y -= aBox.min.y + aSize.y * 0.1;
      aClonedScene.position.z -= aCenter.z;
    }

    return aClonedScene;
  }, [scene, aModelPath]);

  useEffect(() => {
    if (!clonedScene) return;

    if (aLastModelPathRef.current !== aModelPath) {
      aInitializedRef.current = false;
      aLastModelPathRef.current = aModelPath;
    }

    if (!aInitializedRef.current) {
      if (aModelPath === "/house.glb") {
        aMaterialsRef.current = {
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

        const aMeshGroups = {
          walls: [],
          roof: [],
          exteriorFloor: [],
          ground: [],
          windows: [],
          doors: [],
          pillars: [],
          other: [],
        };

        const aAllMeshes = [];
        clonedScene.traverse((aChild) => {
          if (aChild.isMesh) {
            aAllMeshes.push(aChild);
          }
        });

        const aBoundingBox = new THREE.Box3().setFromObject(clonedScene);
        const aCenter = aBoundingBox.getCenter(new THREE.Vector3());
        const aSize = aBoundingBox.getSize(new THREE.Vector3());
        const aMaxY = aBoundingBox.max.y;
        const aMinY = aBoundingBox.min.y;

        const aWallMeshes = [];
        aAllMeshes.forEach((aMesh) => {
          const aMeshName = aMesh.name.toLowerCase();
          const aGeometryName = aMesh.geometry?.name?.toLowerCase() || "";
          const aMeshBoundingBox = new THREE.Box3().setFromObject(aMesh);
          const aMeshCenter = aMeshBoundingBox.getCenter(new THREE.Vector3());
          const aMeshSize = aMeshBoundingBox.getSize(new THREE.Vector3());

          const aIsRoofCandidate =
            aMeshName.includes("roof") ||
            aMeshName.includes("rooftop") ||
            aMeshName.includes("ceiling") ||
            aGeometryName.includes("roof") ||
            (aMeshCenter.y > aCenter.y + aSize.y * 0.25 && aMeshSize.y < aSize.y * 0.25);

          const aIsGroundCandidate =
            aMeshName.includes("ground") ||
            aMeshName.includes("foundation") ||
            aMeshName.includes("base") ||
            aMeshName.includes("terrain") ||
            aMeshName.includes("earth") ||
            aGeometryName.includes("ground") ||
            aGeometryName.includes("foundation") ||
            (aMeshCenter.y < aMinY + aSize.y * 0.1 && aMeshSize.y < aSize.y * 0.15);

          const aIsWindowCandidate =
            aMeshName.includes("window") ||
            aMeshName.includes("glass") ||
            aMeshName.includes("pane") ||
            aMeshName.includes("glazing") ||
            (aMeshName.includes("frame") && aMeshName.includes("window")) ||
            aGeometryName.includes("window") ||
            aGeometryName.includes("glass");

          const aIsDoorCandidate =
            aMeshName.includes("door") ||
            aMeshName.includes("entrance") ||
            aMeshName.includes("entry") ||
            aMeshName.includes("gate") ||
            aGeometryName.includes("door") ||
            (aMeshSize.x < aSize.x * 0.2 &&
              aMeshSize.z < aSize.z * 0.1 &&
              aMeshCenter.y > aMinY + aSize.y * 0.2 &&
              aMeshCenter.y < aMinY + aSize.y * 0.5);

          const aIsPillarCandidate =
            aMeshName.includes("pillar") ||
            aMeshName.includes("column") ||
            aMeshName.includes("post") ||
            aMeshName.includes("support") ||
            aGeometryName.includes("pillar") ||
            aGeometryName.includes("column") ||
            (aMeshSize.x < aSize.x * 0.1 &&
              aMeshSize.z < aSize.z * 0.1 &&
              aMeshSize.y > aSize.y * 0.3 &&
              aMeshCenter.y > aMinY + aSize.y * 0.2);

          const aIsWallCandidate =
            !aIsRoofCandidate &&
            !aIsGroundCandidate &&
            !aIsWindowCandidate &&
            !aIsDoorCandidate &&
            !aIsPillarCandidate &&
            (aMeshName.includes("wall") ||
              aMeshName.includes("exterior") ||
              aMeshName.includes("facade") ||
              aMeshName.includes("siding") ||
              (aMeshCenter.y > aMinY + aSize.y * 0.15 &&
                aMeshCenter.y < aMaxY - aSize.y * 0.25 &&
                Math.abs(aMeshSize.y) > aSize.y * 0.15));

          if (aIsWallCandidate) {
            aWallMeshes.push(aMesh);
          }
        });

        let aBuildingMinX = Infinity;
        let aBuildingMaxX = -Infinity;
        let aBuildingMinZ = Infinity;
        let aBuildingMaxZ = -Infinity;

        aWallMeshes.forEach((aWallMesh) => {
          const aWallBox = new THREE.Box3().setFromObject(aWallMesh);
          aBuildingMinX = Math.min(aBuildingMinX, aWallBox.min.x);
          aBuildingMaxX = Math.max(aBuildingMaxX, aWallBox.max.x);
          aBuildingMinZ = Math.min(aBuildingMinZ, aWallBox.min.z);
          aBuildingMaxZ = Math.max(aBuildingMaxZ, aWallBox.max.z);
        });

        if (aWallMeshes.length === 0) {
          aBuildingMinX = aCenter.x - aSize.x * 0.4;
          aBuildingMaxX = aCenter.x + aSize.x * 0.4;
          aBuildingMinZ = aCenter.z - aSize.z * 0.4;
          aBuildingMaxZ = aCenter.z + aSize.z * 0.4;
        }

        const aFootprintMarginX = Math.max((aBuildingMaxX - aBuildingMinX) * 0.05, aSize.x * 0.02);
        const aFootprintMarginZ = Math.max((aBuildingMaxZ - aBuildingMinZ) * 0.05, aSize.z * 0.02);
        aBuildingMinX -= aFootprintMarginX;
        aBuildingMaxX += aFootprintMarginX;
        aBuildingMinZ -= aFootprintMarginZ;
        aBuildingMaxZ += aFootprintMarginZ;

        aAllMeshes.forEach((aMesh) => {
          const aMeshName = aMesh.name.toLowerCase();
          const aGeometryName = aMesh.geometry?.name?.toLowerCase() || "";
          const aMeshBoundingBox = new THREE.Box3().setFromObject(aMesh);
          const aMeshCenter = aMeshBoundingBox.getCenter(new THREE.Vector3());
          const aMeshSize = aMeshBoundingBox.getSize(new THREE.Vector3());

          const aIsWithinFootprint =
            aMeshCenter.x >= aBuildingMinX &&
            aMeshCenter.x <= aBuildingMaxX &&
            aMeshCenter.z >= aBuildingMinZ &&
            aMeshCenter.z <= aBuildingMaxZ;

          const aMeshExtendsOutside =
            aMeshBoundingBox.min.x < aBuildingMinX - aSize.x * 0.1 ||
            aMeshBoundingBox.max.x > aBuildingMaxX + aSize.x * 0.1 ||
            aMeshBoundingBox.min.z < aBuildingMinZ - aSize.z * 0.1 ||
            aMeshBoundingBox.max.z > aBuildingMaxZ + aSize.z * 0.1;

          const aOriginalMaterial = aMesh.material;
          const aIsTransparent =
            aOriginalMaterial?.transparent === true ||
            aOriginalMaterial?.opacity < 1.0 ||
            aOriginalMaterial?.type === "MeshPhysicalMaterial";

          const aIsRoof =
            aMeshName.includes("roof") ||
            aMeshName.includes("rooftop") ||
            aMeshName.includes("ceiling") ||
            aGeometryName.includes("roof") ||
            (aMeshCenter.y > aCenter.y + aSize.y * 0.25 && aMeshSize.y < aSize.y * 0.25);

          const aIsGround =
            aMeshName.includes("ground") ||
            aMeshName.includes("foundation") ||
            aMeshName.includes("base") ||
            aMeshName.includes("terrain") ||
            aMeshName.includes("earth") ||
            aGeometryName.includes("ground") ||
            aGeometryName.includes("foundation") ||
            (aMeshCenter.y < aMinY + aSize.y * 0.1 && aMeshSize.y < aSize.y * 0.15) ||
            (!aIsWithinFootprint &&
              aMeshCenter.y < aMinY + aSize.y * 0.2 &&
              aMeshSize.y < aSize.y * 0.2);

          const aIsDoor =
            aMeshName.includes("door") ||
            aMeshName.includes("entrance") ||
            aMeshName.includes("entry") ||
            aMeshName.includes("gate") ||
            aGeometryName.includes("door") ||
            (aMeshSize.x < aSize.x * 0.2 &&
              aMeshSize.z < aSize.z * 0.1 &&
              aMeshCenter.y > aMinY + aSize.y * 0.2 &&
              aMeshCenter.y < aMinY + aSize.y * 0.5);

          const aIsExteriorFloor =
            !aIsGround &&
            !aIsDoor &&
            aIsWithinFootprint &&
            !aMeshExtendsOutside &&
            (aMeshName.includes("floor") ||
              aMeshName.includes("stairs") ||
              aMeshName.includes("stair") ||
              aMeshName.includes("step") ||
              aMeshName.includes("platform") ||
              aMeshName.includes("patio") ||
              aMeshName.includes("porch") ||
              aMeshName.includes("deck") ||
              aMeshName.includes("slab") ||
              aGeometryName.includes("floor") ||
              aGeometryName.includes("stairs") ||
              (aMeshCenter.y > aMinY + aSize.y * 0.1 &&
                aMeshCenter.y < aMinY + aSize.y * 0.3 &&
                aMeshSize.y < aSize.y * 0.2));

          const aIsWindow =
            aMeshName.includes("window") ||
            aMeshName.includes("glass") ||
            aMeshName.includes("pane") ||
            aMeshName.includes("glazing") ||
            (aMeshName.includes("frame") && aMeshName.includes("window")) ||
            aGeometryName.includes("window") ||
            aGeometryName.includes("glass") ||
            aIsTransparent ||
            (aMeshSize.x < aSize.x * 0.15 &&
              aMeshSize.z < aSize.z * 0.15 &&
              aMeshCenter.y > aMinY + aSize.y * 0.3 &&
              aMeshCenter.y < aMaxY - aSize.y * 0.2);

          const aIsPillar =
            aMeshName.includes("pillar") ||
            aMeshName.includes("column") ||
            aMeshName.includes("post") ||
            aMeshName.includes("support") ||
            aGeometryName.includes("pillar") ||
            aGeometryName.includes("column") ||
            (aMeshSize.x < aSize.x * 0.1 &&
              aMeshSize.z < aSize.z * 0.1 &&
              aMeshSize.y > aSize.y * 0.3 &&
              aMeshCenter.y > aMinY + aSize.y * 0.2);

          const aIsWall =
            !aIsRoof &&
            !aIsExteriorFloor &&
            !aIsGround &&
            !aIsWindow &&
            !aIsDoor &&
            !aIsPillar &&
            (aMeshName.includes("wall") ||
              aMeshName.includes("exterior") ||
              aMeshName.includes("facade") ||
              aMeshName.includes("siding") ||
              (aMeshCenter.y > aMinY + aSize.y * 0.15 &&
                aMeshCenter.y < aMaxY - aSize.y * 0.25 &&
                Math.abs(aMeshSize.y) > aSize.y * 0.15 &&
                !aIsPillar &&
                !aIsWindow &&
                !aIsDoor));

          if (aIsRoof) {
            aMeshGroups.roof.push(aMesh);
          } else if (aIsExteriorFloor) {
            aMeshGroups.exteriorFloor.push(aMesh);
          } else if (aIsGround) {
            aMeshGroups.ground.push(aMesh);
          } else if (aIsWindow) {
            aMeshGroups.windows.push(aMesh);
          } else if (aIsDoor) {
            aMeshGroups.doors.push(aMesh);
          } else if (aIsPillar) {
            aMeshGroups.pillars.push(aMesh);
          } else if (aIsWall) {
            aMeshGroups.walls.push(aMesh);
          } else {
            aMeshGroups.other.push(aMesh);
          }
        });

        console.log("Mesh Analysis for house.glb:", {
          total: aAllMeshes.length,
          walls: aMeshGroups.walls.length,
          roof: aMeshGroups.roof.length,
          exteriorFloor: aMeshGroups.exteriorFloor.length,
          ground: aMeshGroups.ground.length,
          windows: aMeshGroups.windows.length,
          doors: aMeshGroups.doors.length,
          pillars: aMeshGroups.pillars.length,
          other: aMeshGroups.other.length,
          allMeshNames: aAllMeshes.map((m) => m.name),
          wallMeshes: aMeshGroups.walls.map((m) => m.name),
          roofMeshes: aMeshGroups.roof.map((m) => m.name),
          exteriorFloorMeshes: aMeshGroups.exteriorFloor.map((m) => m.name),
          groundMeshes: aMeshGroups.ground.map((m) => m.name),
          windowMeshes: aMeshGroups.windows.map((m) => m.name),
          doorMeshes: aMeshGroups.doors.map((m) => m.name),
        });

        aMeshGroups.walls.forEach((aMesh) => {
          aMesh.material = aMaterialsRef.current.walls;
          aMesh.castShadow = true;
          aMesh.receiveShadow = true;
        });

        aMeshGroups.roof.forEach((aMesh) => {
          aMesh.material = aMaterialsRef.current.roof;
          aMesh.castShadow = true;
          aMesh.receiveShadow = true;
        });

        aMeshGroups.exteriorFloor.forEach((aMesh) => {
          aMesh.material = aMaterialsRef.current.floor;
          aMesh.castShadow = false;
          aMesh.receiveShadow = true;
        });

        aMeshGroups.ground.forEach((aMesh) => {
          aMesh.castShadow = false;
          aMesh.receiveShadow = true;
        });

        aMeshGroups.windows.forEach((aMesh) => {
          aMesh.castShadow = true;
          aMesh.receiveShadow = true;
        });

        aMeshGroups.doors.forEach((aMesh) => {
          aMesh.castShadow = true;
          aMesh.receiveShadow = true;
        });

        aMeshGroups.pillars.forEach((aMesh) => {
          aMesh.castShadow = true;
          aMesh.receiveShadow = true;
        });

        aMeshGroups.other.forEach((aMesh) => {
          aMesh.castShadow = true;
          aMesh.receiveShadow = true;
        });

        aMaterialsRef.current.wallMeshes = aMeshGroups.walls;
        aMaterialsRef.current.roofMeshes = aMeshGroups.roof;
        aMaterialsRef.current.floorMeshes = aMeshGroups.exteriorFloor;
      }

      aInitializedRef.current = true;
    }
  }, [clonedScene, aModelPath]);

  useFrame(() => {
    if (!aMaterialsRef.current || aModelPath !== "/house.glb") return;

    const aWallsColor = new THREE.Color(aWallsMaterial.color);
    const aRoofColor = new THREE.Color(aRoofMaterial.color);
    const aFloorColor = new THREE.Color(aFloorMaterial.color);

    if (!aMaterialsRef.current.walls.color.equals(aWallsColor)) {
      aMaterialsRef.current.walls.color.copy(aWallsColor);
      aMaterialsRef.current.walls.needsUpdate = true;
    }

    if (!aMaterialsRef.current.roof.color.equals(aRoofColor)) {
      aMaterialsRef.current.roof.color.copy(aRoofColor);
      aMaterialsRef.current.roof.needsUpdate = true;
      if (aMaterialsRef.current.roofMeshes?.length > 0) {
        console.log("Roof material updated:", {
          color: aRoofColor.getHexString(),
          meshCount: aMaterialsRef.current.roofMeshes.length,
        });
      }
    }

    if (!aMaterialsRef.current.floor.color.equals(aFloorColor)) {
      aMaterialsRef.current.floor.color.copy(aFloorColor);
      aMaterialsRef.current.floor.needsUpdate = true;
      if (aMaterialsRef.current.floorMeshes?.length > 0) {
        console.log("Exterior floor material updated:", {
          color: aFloorColor.getHexString(),
          meshCount: aMaterialsRef.current.floorMeshes.length,
          meshNames: aMaterialsRef.current.floorMeshes.map((m) => m.name),
        });
      } else {
        console.warn("No exterior floor meshes found to update!");
      }
    }
  });

  if (!clonedScene) return null;

  return <primitive object={clonedScene} />;
};

useGLTF.preload("/house.glb");

export default Building;

