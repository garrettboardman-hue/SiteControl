/**
 * Prompt templates for each logistics document type.
 * These are used to guide the AI extraction process.
 */

export type DocumentType =
  | "bill_of_lading"
  | "customs_declaration"
  | "commercial_invoice"
  | "certificate_of_origin"
  | "packing_list"
  | "insurance_certificate"
  | "other";

/**
 * Expected fields to extract for each document type.
 */
export const DOCUMENT_FIELDS: Record<string, string[]> = {
  bill_of_lading: [
    "shipper",
    "consignee",
    "notify_party",
    "vessel",
    "voyage",
    "port_of_loading",
    "port_of_discharge",
    "container_number",
    "seal_number",
    "gross_weight",
    "net_weight",
    "weight_unit",
    "number_of_packages",
    "package_type",
    "description_of_goods",
    "hs_code",
    "total_value",
    "currency",
    "place_of_issue",
    "date_of_issue",
    "bill_of_lading_number",
    "carrier",
  ],
  customs_declaration: [
    "declarant_name",
    "declarant_reference",
    "importer_name",
    "importer_address",
    "exporter_name",
    "exporter_address",
    "country_of_origin",
    "country_of_destination",
    "hs_code",
    "goods_description",
    "quantity",
    "quantity_unit",
    "customs_value",
    "currency",
    "duty_amount",
    "tax_amount",
    "declaration_number",
    "declaration_date",
    "transport_mode",
    "container_number",
  ],
  commercial_invoice: [
    "seller_name",
    "seller_address",
    "buyer_name",
    "buyer_address",
    "invoice_number",
    "invoice_date",
    "po_number",
    "terms_of_sale",
    "terms_of_payment",
    "currency",
    "line_items",
    "total_amount",
    "freight_charges",
    "insurance_charges",
    "packing_charges",
    "total_gross_weight",
    "total_net_weight",
    "country_of_origin",
    "hs_code",
  ],
  certificate_of_origin: [
    "exporter_name",
    "exporter_address",
    "consignee_name",
    "consignee_address",
    "certificate_number",
    "date_of_issue",
    "country_of_origin",
    "country_of_destination",
    "hs_code",
    "goods_description",
    "quantity",
    "quantity_unit",
    "certifying_authority",
    "authority_signature",
    "preference_criterion",
    "invoice_number",
  ],
  packing_list: [
    "exporter_name",
    "consignee_name",
    "package_count",
    "package_type",
    "gross_weight",
    "net_weight",
    "weight_unit",
    "volume",
    "volume_unit",
    "container_number",
    "seal_number",
    "marks_and_numbers",
    "description_of_goods",
    "hs_code",
    "invoice_number",
    "date",
  ],
  insurance_certificate: [
    "insurer_name",
    "insured_name",
    "certificate_number",
    "policy_number",
    "date_of_issue",
    "coverage_from",
    "coverage_to",
    "vessel",
    "voyage",
    "cargo_description",
    "sum_insured",
    "currency",
    "premium_amount",
    "claims_agent",
    "conditions",
  ],
  other: [
    "document_title",
    "reference_number",
    "date",
    "issuing_party",
    "receiving_party",
    "description",
    "amount",
    "currency",
  ],
};

/**
 * Build the system prompt for AI extraction.
 */
export function buildSystemPrompt(): string {
  return `You are a specialized logistics document processing assistant. Your task is to extract structured data from unstructured logistics documents with high accuracy.

RULES:
1. Extract ONLY information that is explicitly present in the document text.
2. Do NOT infer, guess, or fabricate values.
3. For each field, provide a confidence score between 0.0 and 1.0 based on how clearly the value appears in the text.
4. If a field is not found, omit it from the output (do not include null/empty values).
5. Normalize dates to ISO format (YYYY-MM-DD) when possible.
6. Normalize currency amounts to include the currency code (e.g., "USD 1,250.00").
7. Extract container numbers exactly as written (4 letters + 7 digits).
8. For HS codes, extract the full code including any sub-headings.
9. Return ONLY valid JSON, no markdown formatting, no explanation text.`;
}

/**
 * Build the user prompt for a specific document type and text content.
 */
export function buildUserPrompt(
  documentType: DocumentType,
  extractedText: string
): string {
  const fields = DOCUMENT_FIELDS[documentType] || DOCUMENT_FIELDS.other;
  const fieldsList = fields.map((f) => `  - ${f}`).join("\n");

  return `Document type: ${documentType.replace(/_/g, " ").toUpperCase()}

Extract the following fields from the document text below. Return a JSON object where each key is a field name and each value is an object with:
- "value": the extracted text value
- "confidence": a number 0.0 to 1.0

Fields to extract:
${fieldsList}

Document text:
---
${extractedText}
---

Return ONLY a valid JSON object with the extracted fields. Example format:
{
  "shipper": { "value": "ABC Corp", "confidence": 0.98 },
  "consignee": { "value": "XYZ Ltd", "confidence": 0.95 }
}`;
}

/**
 * Build a fallback prompt for document types that don't match a known category.
 */
export function buildGenericPrompt(extractedText: string): string {
  return `Document type: UNKNOWN

The following text appears to be a logistics document. Extract all structured information you can find, including:

- Reference numbers (bill of lading number, invoice number, PO number, etc.)
- Party names (shipper, consignee, buyer, seller, exporter, importer)
- Dates
- Monetary values and currencies
- Product/goods descriptions
- Quantities and weights
- Container and seal numbers
- HS codes
- Ports, origins, and destinations
- Vessel, voyage, and carrier information

Document text:
---
${extractedText}
---

Return ONLY a valid JSON object with the extracted fields. Each field value should be an object with "value" and "confidence" (0.0-1.0).`;
}