import { createContext, useContext, useMemo, useState } from "react";

const buildingOptions = [
  {
    id: "residential",
    name: "Residential Home",
    description: "Single-story family home",
    basePrice: 4500,
    modelPath: "/house.glb",
    footprint: { width: 7, height: 3, depth: 9, roofHeight: 1.4 },
  },
  {
    id: "residentialTwoStory",
    name: "Two-Story House",
    description: "2-story family layout with a pitched roof",
    basePrice: 5200,
    modelPath: "/two_story_house.glb",
    footprint: { width: 7, height: 5, depth: 9, roofHeight: 1.4 },
  },
  {
    id: "commercial",
    name: "Commercial Office",
    description: "Glass-heavy facade with a flat roofline",
    basePrice: 6200,
    modelPath: null,
    footprint: { width: 8.5, height: 3.4, depth: 10, roofHeight: 0.8 },
  },
  {
    id: "industrial",
    name: "Industrial Warehouse",
    description: "Wide-span shell with metal roofing",
    basePrice: 5300,
    modelPath: null,
    footprint: { width: 10.5, height: 3.2, depth: 11.5, roofHeight: 1.1 },
  },
];

const wallMaterials = [
  {
    id: "brick",
    name: "Brick",
    color: "#b45a3c",
    price: 5000,
  },
  {
    id: "concrete",
    name: "Concrete",
    color: "#8a8f9a",
    price: 4200,
  },
  {
    id: "metalPanel",
    name: "Metal Panels",
    color: "#4f5d73",
    price: 4600,
  },
  {
    id: "woodSiding",
    name: "Wood Siding",
    color: "#a36b3f",
    price: 4800,
  },
];

const roofMaterials = [
  {
    id: "metal",
    name: "Metal Roofing",
    color: "#3c4859",
    price: 2500,
  },
  {
    id: "tile",
    name: "Clay Tiles",
    color: "#9c3e2f",
    price: 2800,
  },
  {
    id: "shingle",
    name: "Architectural Shingles",
    color: "#4a4a4a",
    price: 2300,
  },
];

const floorMaterials = [
  {
    id: "hardwood",
    name: "Hardwood Flooring",
    color: "#b28964",
    price: 3000,
  },
  {
    id: "polishedConcrete",
    name: "Polished Concrete",
    color: "#9f9f9f",
    price: 2400,
  },
  {
    id: "stoneTile",
    name: "Stone Tile",
    color: "#c2b59b",
    price: 2700,
  },
  {
    id: "ceramicTile",
    name: "Ceramic Tile",
    color: "#d4c5b0",
    price: 2600,
  },
];

const windowMaterials = [
  {
    id: "clear",
    name: "Clear Glass",
    color: "#e8f4f8",
    price: 1800,
  },
  {
    id: "tinted",
    name: "Tinted Glass",
    color: "#4a5568",
    price: 2200,
  },
  {
    id: "frosted",
    name: "Frosted Glass",
    color: "#d1d5db",
    price: 2000,
  },
];

const doorMaterials = [
  {
    id: "wood",
    name: "Wood Door",
    color: "#8b6f47",
    price: 1200,
  },
  {
    id: "metal",
    name: "Metal Door",
    color: "#4a5568",
    price: 1500,
  },
  {
    id: "glass",
    name: "Glass Door",
    color: "#cbd5e0",
    price: 1800,
  },
];

const QuildConfigurationContext = createContext({});

const getMaterialById = (aCollection, aId) =>
  aCollection.find((aOption) => aOption.id === aId) ?? aCollection[0];

export const QuildConfigurationProvider = (props) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState(
    buildingOptions[0].id
  );
  const [selectedWallsMaterialId, setSelectedWallsMaterialId] = useState(
    wallMaterials[0].id
  );
  const [selectedRoofMaterialId, setSelectedRoofMaterialId] = useState(
    roofMaterials[0].id
  );
  const [selectedFloorMaterialId, setSelectedFloorMaterialId] = useState(
    floorMaterials[0].id
  );

  const aSelectedBuilding = useMemo(
    () =>
      buildingOptions.find(
        (aBuildingOption) => aBuildingOption.id === selectedBuildingId
      ) ?? buildingOptions[0],
    [selectedBuildingId]
  );

  const aSelectedWallsMaterial = useMemo(
    () => getMaterialById(wallMaterials, selectedWallsMaterialId),
    [selectedWallsMaterialId]
  );

  const aSelectedRoofMaterial = useMemo(
    () => getMaterialById(roofMaterials, selectedRoofMaterialId),
    [selectedRoofMaterialId]
  );

  const aSelectedFloorMaterial = useMemo(
    () => getMaterialById(floorMaterials, selectedFloorMaterialId),
    [selectedFloorMaterialId]
  );

  const priceBreakdown = useMemo(() => {
    const lineItems = [
      {
        label: `${aSelectedBuilding.name} Base`,
        amount: aSelectedBuilding.basePrice,
      },
      {
        label: `Walls (${aSelectedWallsMaterial.name})`,
        amount: aSelectedWallsMaterial.price,
      },
      {
        label: `Roof (${aSelectedRoofMaterial.name})`,
        amount: aSelectedRoofMaterial.price,
      },
      {
        label: `Floor (${aSelectedFloorMaterial.name})`,
        amount: aSelectedFloorMaterial.price,
      },
    ];

    const totalAmount = lineItems.reduce(
      (anAmount, aLineItem) => anAmount + aLineItem.amount,
      0
    );

    return { lineItems, totalAmount };
  }, [
    aSelectedBuilding,
    aSelectedFloorMaterial,
    aSelectedRoofMaterial,
    aSelectedWallsMaterial,
  ]);

  return (
    <QuildConfigurationContext.Provider
      value={{
        buildingOptions,
        selectedBuildingId,
        setSelectedBuildingId,
        wallMaterials,
        selectedWallsMaterialId,
        setSelectedWallsMaterialId,
        roofMaterials,
        selectedRoofMaterialId,
        setSelectedRoofMaterialId,
        floorMaterials,
        selectedFloorMaterialId,
        setSelectedFloorMaterialId,
        aSelectedBuilding,
        aSelectedWallsMaterial,
        aSelectedRoofMaterial,
        aSelectedFloorMaterial,
        priceBreakdown,
      }}
    >
      {props.children}
    </QuildConfigurationContext.Provider>
  );
};

export const useQuildConfiguration = () => {
  const aContext = useContext(QuildConfigurationContext);
  return aContext;
};
