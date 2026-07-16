---
title: "DSCSA Tooling for Small Distributors"
description: "Introducing Serialized Inventory Management & EPCIS Shipment Generator."
date: 2026-07-16
category: "Product Updates"
author: "Daniel Kraciun"
readTime: "4 min read"
image: "/assets/img/blog/serialized-inventory-generator-hero.jpg"
imageAlt: "Serialized Inventory Management dashboard"
---

# Introducing Serialized Inventory Management & EPCIS Shipment Generator

If you're a small distributor or virtual distributor, you probably don't need a full warehouse management system just to stay compliant with DSCSA.

Sometimes you simply need to receive EPCIS from your suppliers, keep track of serialized inventory, generate outbound EPCIS when you ship product, and move on.

That's exactly why we built the Inventory tool.

It isn't intended to replace an ERP or WMS. It's a lightweight tool designed for organizations that handle smaller volumes of serialized pharmaceutical products but still need to exchange EPCIS data with trading partners.

Best of all, it's included at no additional cost for Trust.med customers.

## Import Serialized Inventory

The process begins by loading EPCIS received from your supplier.

Simply upload the inbound EPCIS file and Trust.med imports the serialized products into your inventory, preserving the product hierarchy and serialization information.

> <figure class="tm-feature-image">
  <img
    src="/assets/img/blog/epcis-upload.png"
    alt="EPCIS data upload"
  >
  <figcaption>
    Upload the DSCSA data you received from your supplier when you recieved the shipment.
  </figcaption>
</figure>

**What's happening:** Inbound EPCIS is processed and every serialized product is added to inventory, ready to be selected for a future shipment.

## Build Your Shipment

Select the serialized products that are leaving your inventory.

> <figure class="tm-feature-image">
  <img
    src="/assets/img/blog/selecting-inventory.png"
    alt="Inventory selection for new shipment"
  >
  <figcaption>
    Select the inventory that is going out for shipment.
  </figcaption>
</figure>

**What's happening:** The selected serialized products become the contents of a new outbound shipment while remaining in inventory until the shipment is finalized.

## Complete Shipment Details

Complete the sender, receiver, shipment details, DSCSA transaction statement, and optional ASN and purchase order fields.

> <figure class="tm-feature-image">
  <img
    src="/assets/img/blog/creating-shipment.png"
    alt="Inventory selection for new shipment"
  >
  <figcaption>
    Create the new shipment.
  </figcaption>
</figure>

**What's happening:** These details become part of the EPCIS document that will be shared with your trading partner.

## Generate Outbound EPCIS

Generate the outbound EPCIS document with a single click.

> <figure class="tm-feature-image">
  <img
    src="/assets/img/blog/download-outbound-epcis.png"
    alt="Inventory selection for new shipment"
  >
  <figcaption>
    Generate and download the DSCSA data for your new shipment.
  </figcaption>
</figure>

**What's happening:** An outbound EPCIS document is created and downloaded.

## Deliver the EPCIS File

Upload the generated EPCIS into Trust.med Data Exchange where it is automatically routed to the intended trading partner.

> <figure class="tm-feature-image">
  <img
    src="/assets/img/blog/epcis-file-upload.png"
    alt="Inventory selection for new shipment"
  >
  <figcaption>
    Upload your newly created DSCSA data to the data exchange. It is then sent to your customer.
  </figcaption>
</figure>

## Mark the Shipment Complete

Once the shipment has been sent, mark it as shipped.

**What's happening:** The serialized products included in the shipment are automatically removed from inventory.

## A Practical Tool for Smaller Operations

This tool was built for organizations that don't need a complete warehouse management platform but still need to comply with DSCSA serialization requirements.

- Import inbound EPCIS
- Maintain serialized inventory
- Build outbound shipments
- Generate compliant EPCIS
- Keep inventory synchronized

Included at no additional cost for Trust.med customers.
