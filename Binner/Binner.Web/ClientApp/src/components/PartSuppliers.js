import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Popup, Button, Input, Icon, Table, Header, Segment, Label } from "semantic-ui-react";
import { formatCurrency, formatNumber } from "../common/Utils";
import { fetchApi } from "../common/fetchApi";
import _ from "underscore";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

// { loadingPartMetadata, part, metadataParts }
export function PartSuppliers(props) {
  const { t } = useTranslation();
  const defaultPartSupplier = { name: "", supplierPartNumber: "", cost: "0", quantityAvailable: "0", minimumOrderQuantity: "0", productUrl: "", imageUrl: "" };

  const [loadingPartMetadata, setLoadingPartMetadata] = useState(props.loadingPartMetadata);
  const [part, setPart] = useState(props.part);
  const [partSupplier, setPartSupplier] = useState(defaultPartSupplier);
  const [metadataParts, setMetadataParts] = useState(props.metadataParts);
  const [showAddPartSupplier, setShowAddPartSupplier] = useState(false);

  const createPartSupplier = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingPartMetadata(true);
    const request = {
      partId: part.partId,
      name: partSupplier.name,
      supplierPartNumber: partSupplier.supplierPartNumber,
      cost: parseFloat(partSupplier.cost || "0") || 0,
      quantityAvailable: parseInt(partSupplier.quantityAvailable || "0") || 0,
      minimumOrderQuantity: parseInt(partSupplier.minimumOrderQuantity || "0") || 0,
      productUrl: partSupplier.productUrl && partSupplier.productUrl.length > 4 ? `https://${partSupplier.productUrl.replace("https://", "").replace("http://", "")}` : null,
      imageUrl: partSupplier.imageUrl && partSupplier.imageUrl.length > 4 ? `https://${partSupplier.imageUrl.replace("https://", "").replace("http://", "")}` : null
    };
    const response = await fetchApi("api/part/partSupplier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });
    if (response && response.responseObject.status === 200) {
      const data = response.data;
      // add part supplier to ui
      const newMetadataParts = [...metadataParts];
      newMetadataParts.push({
        additionalPartNumbers: [],
        basePartNumber: null,
        cost: data.cost,
        currency: "USD",
        datasheetUrls: [],
        description: null,
        factoryLeadTime: null,
        factoryStockAvailable: null,
        imageUrl: data.imageUrl,
        keywords: [],
        manufacturer: null,
        manufacturerPartNumber: part.manufacturerPartNumber,
        minimumOrderQuantity: data.minimumOrderQuantity,
        mountingTypeId: 0,
        packageType: null,
        partSupplierId: data.partSupplierId,
        partType: "",
        productUrl: data.productUrl,
        quantityAvailable: data.quantityAvailable,
        rank: 0,
        reference: null,
        status: null,
        supplier: data.name,
        supplierPartNumber: data.supplierPartNumber,
        swarmPartNumberManufacturerId: null
      });
      setPartSupplier(defaultPartSupplier);
      setMetadataParts(newMetadataParts);
      setShowAddPartSupplier(false);
    }
    setLoadingPartMetadata(false);
  };

  const deletePartSupplier = async (e, partSupplier) => {
    e.preventDefault();
    e.stopPropagation();
    if (!partSupplier.partSupplierId || partSupplier.partSupplierId <= 0) return; // ignore request to delete, not a valid partSupplier object
    setLoadingPartMetadata(true);
    const request = {
      partSupplierId: partSupplier.partSupplierId
    };
    const response = await fetchApi("api/part/partSupplier", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });
    if (response && response.responseObject.status === 200) {
      const isSuccess = response.data;
      // add part supplier to ui
      if (isSuccess) {
        const newMetadataParts = [...metadataParts.filter((x) => x.partSupplierId !== request.partSupplierId)];
        setMetadataParts(newMetadataParts);
      } else {
        toast.error(t("message.failedToDeleteSupplierPart", "Failed to delete supplier part!"));
      }
    }
    setLoadingPartMetadata(false);
  };

  const handleVisitLink = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank");
  };

  const handlePartSupplierChange = (e, control) => {
    e.preventDefault();
    e.stopPropagation();
    partSupplier[control.name] = control.value;
    setPartSupplier({ ...partSupplier });
  };

  const handleShowAddPartSupplier = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddPartSupplier(!showAddPartSupplier);
  };

  return (
    <Segment loading={loadingPartMetadata} color="violet">
      <Header dividing as="h3">
        {t("page.inventory.suppliers", "Suppliers")}
      </Header>
      <div style={{ height: "35px" }}>
        <div style={{ float: "right" }}>
          <Popup
            wide
            hoverable
            content={
              <p>
                {part.partId <= 0 ? (
                  <span>
                    <Icon name="warning sign" color="yellow" /> {t("page.inventory.popup.mustAddPart", "You must save the part before adding custom suppliers to it.")}
                  </span>
                ) : (
                  <span>{t("page.inventory.popup.addSupplier", "Add a manual supplier entry")}</span>
                )}
              </p>
            }
            trigger={
              <span>
                <Button primary onClick={handleShowAddPartSupplier} size="tiny" disabled={part.partId <= 0}>
                  <Icon name="plus" /> {t("button.add", "Add")}
                </Button>
              </span>
            }
          />
        </div>
      </div>

      {showAddPartSupplier && (
        <Segment raised>
          <Form.Input width={6} label={t("label.supplier", "Supplier")} required placeholder="DigiKey" focus value={partSupplier.name} onChange={handlePartSupplierChange} name="name" />
          <Form.Input
            width={6}
            label={t("label.supplierPartNumber", "Supplier Part Number")}
            required
            placeholder="296-1395-5-ND"
            value={partSupplier.supplierPartNumber}
            onChange={handlePartSupplierChange}
            name="supplierPartNumber"
          />
          <Form.Group>
            <Form.Input width={3} label={t("label.cost", "Cost")} placeholder="0.50" value={partSupplier.cost} onChange={handlePartSupplierChange} name="cost" />
            <Form.Input
              width={4}
              label={t("label.quantityAvailable", "Quantity Available")}
              placeholder="0"
              value={partSupplier.quantityAvailable}
              onChange={handlePartSupplierChange}
              name="quantityAvailable"
            />
            <Form.Input
              width={5}
              label={t("label.minimumOrderQuantity", "Minimum Order Quantity")}
              placeholder="0"
              value={partSupplier.minimumOrderQuantity}
              onChange={handlePartSupplierChange}
              name="minimumOrderQuantity"
            />
          </Form.Group>
          <Form.Field width={12}>
            <label>{t("label.productUrl", "Product Url")}</label>
            <Input
              action
              className="labeled"
              placeholder=""
              value={(partSupplier.productUrl || "").replace("http://", "").replace("https://", "")}
              onChange={handlePartSupplierChange}
              name="productUrl"
            >
              <Label>https://</Label>
              <input />
              <Button onClick={(e) => handleVisitLink(e, partSupplier.productUrl)} disabled={!partSupplier.productUrl || partSupplier.productUrl.length === 0}>
                {t("button.visit", "Visit")}
              </Button>
            </Input>
          </Form.Field>
          <Form.Field width={12}>
            <label>{t("label.imageUrl", "Image Url")}</label>
            <Input action className="labeled" placeholder="" value={(partSupplier.imageUrl || "").replace("http://", "").replace("https://", "")} onChange={handlePartSupplierChange} name="imageUrl">
              <Label>https://</Label>
              <input />
              <Button onClick={(e) => handleVisitLink(e, partSupplier.imageUrl)} disabled={!partSupplier.imageUrl || partSupplier.imageUrl.length === 0}>
                {t("button.visit", "Visit")}
              </Button>
            </Input>
          </Form.Field>
          <Button primary icon onClick={createPartSupplier} disabled={part.partId <= 0}>
            <Icon name="save" /> {t("button.save", "Save")}
          </Button>
        </Segment>
      )}

      <Table compact celled sortable selectable striped unstackable size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">{t("label.supplier", "Supplier")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{t("label.supplierPartNumber", "Supplier Part Number")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{t("label.cost", "Cost")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{t("label.quantityAvailable", "Quantity Available")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{t("label.minimumOrderQuantity", "Minimum Order Quantity")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{t("label.image", "Image")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{t("label.productUrl", "Product Url")}</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {part &&
            metadataParts &&
            _.filter(metadataParts, (p) => p.manufacturerPartNumber === part.manufacturerPartNumber).map((supplier, supplierKey) => (
              <Table.Row key={supplierKey}>
                <Table.Cell textAlign="center">{supplier.supplier}</Table.Cell>
                <Table.Cell textAlign="center">{supplier.supplierPartNumber}</Table.Cell>
                <Table.Cell textAlign="center">{formatCurrency(supplier.cost, supplier.currency)}</Table.Cell>
                <Table.Cell textAlign="center">{formatNumber(supplier.quantityAvailable)}</Table.Cell>
                <Table.Cell textAlign="center">{formatNumber(supplier.minimumOrderQuantity)}</Table.Cell>
                <Table.Cell textAlign="center">
                  {supplier.imageUrl && supplier.imageUrl.length > 10 && supplier.imageUrl.startsWith("http") && (
                    <img src={supplier.imageUrl} alt={supplier.supplierPartNumber} className="product productshot" />
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {supplier.productUrl && supplier.productUrl.length > 10 && supplier.productUrl.startsWith("http") && (
                    <a href={supplier.productUrl} target="_blank" rel="noreferrer">
                      {t("button.visit", "Visit")}
                    </a>
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {supplier.partSupplierId && supplier.partSupplierId > 0 && <Button icon="delete" size="tiny" onClick={(e) => deletePartSupplier(e, supplier)} title="Delete supplier part" />}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Segment>
  );
}

PartSuppliers.propTypes = {
  loadingPartMetadata: PropTypes.bool,
  part: PropTypes.object,
  metadataParts: PropTypes.array
};

PartSuppliers.defaultProps = {};