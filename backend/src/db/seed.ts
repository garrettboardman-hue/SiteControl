import { db } from "./connection";
import { v4 as uuid } from "uuid";
import * as schema from "./schema";

console.log("Seeding database...");

// Create a demo organization
const orgId = uuid();
db.insert(schema.organizations).values({
  id: orgId,
  name: "Demo Freight Forwarders Inc.",
  slug: "demo-ff",
}).run();

// Create admin user
const userId = uuid();
db.insert(schema.users).values({
  id: userId,
  organizationId: orgId,
  email: "admin@demoff.com",
  name: "Jane Operator",
  role: "admin",
}).run();

// Create a demo shipment
const shipmentId = uuid();
db.insert(schema.shipments).values({
  id: shipmentId,
  organizationId: orgId,
  reference: "SHP-2024-001",
  origin: "Shanghai, China",
  destination: "Rotterdam, Netherlands",
  carrier: "Maersk",
  vessel: "Emma Maersk",
  voyage: "2407W",
  containerNumber: "MAEU1234567",
  sealNumber: "SEAL889900",
  weight: 22500,
  weightUnit: "kg",
  volume: 45,
  volumeUnit: "cbm",
}).run();

// Create a demo document (bill of lading)
const docId = uuid();
db.insert(schema.documents).values({
  id: docId,
  organizationId: orgId,
  shipmentId: shipmentId,
  documentType: "bill_of_lading",
  filename: "BL-MAEU1234567.pdf",
  originalPath: "/data/uploads/BL-MAEU1234567.pdf",
  fileSize: 245000,
  mimeType: "application/pdf",
  status: "completed",
  processedAt: new Date().toISOString(),
}).run();

// Create extraction results
const extractionFields = [
  { field: "shipper", value: "ABC Manufacturing Co., Shanghai" },
  { field: "consignee", value: "European Logistics BV, Rotterdam" },
  { field: "vessel", value: "Emma Maersk" },
  { field: "voyage", value: "2407W" },
  { field: "port_of_loading", value: "Shanghai" },
  { field: "port_of_discharge", value: "Rotterdam" },
  { field: "container_number", value: "MAEU1234567" },
  { field: "seal_number", value: "SEAL889900" },
  { field: "gross_weight", value: "22500 kg" },
  { field: "hs_code", value: "8471.30" },
  { field: "total_value", value: "USD 125,000.00" },
  { field: "number_of_packages", value: "120" },
  { field: "package_type", value: "PALLET" },
  { field: "description_of_goods", value: "Electronic Components" },
];

for (const ef of extractionFields) {
  db.insert(schema.extractions).values({
    id: uuid(),
    documentId: docId,
    fieldName: ef.field,
    fieldValue: ef.value,
    confidence: 0.95 + Math.random() * 0.04,
    isVerified: false,
  }).run();
}

console.log("Seed complete.");
console.log(`  Organization: ${orgId}`);
console.log(`  User: ${userId} (admin@demoff.com)`);
console.log(`  Shipment: ${shipmentId}`);
console.log(`  Document: ${docId}`);