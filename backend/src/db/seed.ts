import { db } from "./connection";
import { v4 as uuid } from "uuid";
import * as schema from "./schema";
import fs from "fs";
import path from "path";

console.log("Seeding database...");

// Create a demo organization
const orgId = "949e7128-941d-4c91-af22-6d797c38af21";
const existingOrg = db.select().from(schema.organizations).where(eq(schema.organizations.id, orgId)).get();

// Only seed if no data exists yet
if (existingOrg) {
  console.log("Database already seeded. Skipping.");
  process.exit(0);
}

// Need eq import
import { eq } from "drizzle-orm";

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

// Create a test document file
const uploadsDir = path.resolve(import.meta.dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const testDocContent = `BILL OF LADING

Shipper: ABC Manufacturing Co., Ltd
Shanghai Free Trade Zone, 1000 Huaihai Road
Shanghai, China 200000

Consignee: European Logistics BV
Rotterdamse Haven 250
3011 AA Rotterdam, Netherlands

Vessel: Emma Maersk
Voyage: 2407W

Port of Loading: Shanghai, China
Port of Discharge: Rotterdam, Netherlands

Container Number: MAEU1234567
Seal Number: SEAL889900

Description of Goods: Electronic Components
HS Code: 8471.30
Gross Weight: 22500 kg
Net Weight: 21500 kg
Number of Packages: 120 PALLETS

Total Value: USD 125,000.00

Date of Issue: 2024-06-15
Bill of Lading Number: BL-2024-8471

Carrier: Maersk Line
`;

const testFilename = "demo-bill-of-lading.txt";
const testFilePath = path.join(uploadsDir, testFilename);
fs.writeFileSync(testFilePath, testDocContent, "utf-8");

// Create a demo document
const docId = uuid();
db.insert(schema.documents).values({
  id: docId,
  organizationId: orgId,
  shipmentId: shipmentId,
  documentType: "bill_of_lading",
  filename: testFilename,
  originalPath: testFilePath,
  fileSize: Buffer.byteLength(testDocContent, "utf-8"),
  mimeType: "text/plain",
  status: "pending",
}).run();

// Create a demo API key
const apiKey = "df_8f6a353bfb9ca7099445803b22dced21a4e9614df6ac62c64b4a76d42df43844";
const existingKey = db.select().from(schema.apiKeys).where(eq(schema.apiKeys.key, apiKey)).get();
if (!existingKey) {
  db.insert(schema.apiKeys).values({
    id: uuid(),
    organizationId: orgId,
    name: "Demo API Key",
    key: apiKey,
    prefix: apiKey.substring(0, 8),
    isActive: true,
  }).run();
}

console.log("Seed complete.");
console.log(`  Organization: ${orgId}`);
console.log(`  User: ${userId} (admin@demoff.com)`);
console.log(`  Shipment: ${shipmentId}`);
console.log(`  Document: ${docId} (${testFilename})`);
console.log(`  Test file: ${testFilePath}`);
console.log("");
console.log("To test the pipeline, run:");
console.log(`  curl -X POST -H "X-API-Key: ${apiKey}" http://localhost:4000/api/documents/${docId}/process`);