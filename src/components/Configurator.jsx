import { useQuildConfiguration } from "../contexts/QuildConfiguration";

const Configurator = () => {
  const {
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
    priceBreakdown,
  } = useQuildConfiguration();

  const formatPrice = (anAmount) => `$${anAmount.toLocaleString()}`;

  const renderSelectRow = (aLabel, aOptions, aSelectedId, aOnSelect) => {
    const aSelectedOption =
      aOptions.find((anOption) => anOption.id === aSelectedId) ?? aOptions[0];

    return (
      <div className="configRow" key={aLabel}>
        <div className="configRow__text">
          <div className="configRow__label">{aLabel}</div>
          <div className="configRow__value">{aSelectedOption?.name}</div>
          <div className="configRow__price">
            {aSelectedOption?.price
              ? formatPrice(aSelectedOption.price)
              : null}
          </div>
        </div>
        <select
          className="configRow__select"
          value={aSelectedId}
          onChange={(anEvent) => aOnSelect(anEvent.target.value)}
        >
          {aOptions.map((anOption) => (
            <option key={anOption.id} value={anOption.id}>
              {`${anOption.name} ${anOption.price ? `— ${formatPrice(anOption.price)}` : ""}`}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="configurator">
      <div className="configurator__body">
        <div className="configurator__section">
          <div className="configurator__section__title">Building</div>
          {renderSelectRow(
            "Building model",
            buildingOptions,
            selectedBuildingId,
            setSelectedBuildingId
          )}
        </div>

        <div className="configurator__section">
          <div className="configurator__section__title">Materials</div>
          {renderSelectRow(
            "Wall material",
            wallMaterials,
            selectedWallsMaterialId,
            setSelectedWallsMaterialId
          )}
          {renderSelectRow(
            "Roof material",
            roofMaterials,
            selectedRoofMaterialId,
            setSelectedRoofMaterialId
          )}
          {renderSelectRow(
            "Floor material",
            floorMaterials,
            selectedFloorMaterialId,
            setSelectedFloorMaterialId
          )}
        </div>

        <div className="configurator__section configurator__section--summary">
          <div className="configurator__section__title">Quotation</div>
          <div className="quote__lines">
            {priceBreakdown.lineItems.map((aLineItem) => (
              <div className="quote__line" key={aLineItem.label}>
                <span>{aLineItem.label}</span>
                <span>{formatPrice(aLineItem.amount)}</span>
              </div>
            ))}
          </div>
          <div className="quote__total">
            <span>Total Estimate</span>
            <span>{formatPrice(priceBreakdown.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
