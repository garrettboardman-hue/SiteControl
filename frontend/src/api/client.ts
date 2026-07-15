/// <reference types="vite/client" />

export interface Document {
  id: string;
  organizationId: string;
  shipmentId: string | null;
  documentType: string;
  filename: string;
  originalPath: string;
  fileSize: number;
  mimeType: string;
  status: "pending" | "processing" | "completed" | "failed" | "flagged";
  errorMessage: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  organizationId: string;
  reference: string | null;
  origin: string | null;
  destination: string | null;
  carrier: string | null;
  vessel: string | null;
  voyage: string | null;
  containerNumber: string | null;
  sealNumber: string | null;
  weight: number | null;
  weightUnit: string | null;
  volume: number | null;
  volumeUnit: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  documents?: Document[];
}

export interface Extraction {
  id: string;
  documentId: string;
  fieldName: string;
  fieldValue: string;
  confidence: number;
  isVerified: boolean;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
}

export interface ValidationResult {
  id: string;
  documentId: string;
  fieldName: string;
  severity: "error" | "warning" | "info";
  ruleName: string;
  message: string;
  expectedValue: string | null;
  actualValue: string | null;
  isResolved: boolean;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface DocumentStatus {
  id: string;
  filename: string;
  documentType: string;
  status: string;
  processedAt: string | null;
  errorMessage: string | null;
  stats: {
    extractionCount: number;
    validationCount: number;
    unresolvedIssues: number;
  };
}

const API_BASE = "";

const API_KEY =
  import.meta.env.VITE_API_KEY ||
  "df_8f6a353bfb9ca7099445803b22dced21a4e9614df6ac62c64b4a76d42df43844";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options?.headers,
      "X-API-Key": API_KEY,
      ...(options?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ─── Documents ────────────────────────────────────────────────────────────

export async function listDocuments(page = 1, limit = 20) {
  return request<PaginatedResponse<Document>>(
    `/api/documents?page=${page}&limit=${limit}`
  );
}

export async function getDocument(id: string) {
  return request<Document>(`/api/documents/${id}`);
}

export async function getDocumentStatus(id: string) {
  return request<DocumentStatus>(`/api/documents/${id}/status`);
}

export async function uploadDocument(
  file: File,
  documentType: string,
  shipmentId?: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);
  if (shipmentId) formData.append("shipmentId", shipmentId);

  return request<{ id: string; status: string; message: string }>(
    "/api/documents/upload",
    {
      method: "POST",
      body: formData,
    }
  );
}

export async function processDocument(id: string) {
  return request<{ id: string; status: string; message: string }>(
    `/api/documents/${id}/process`,
    { method: "POST" }
  );
}

// ─── Extractions ──────────────────────────────────────────────────────────

export async function getExtractions(documentId: string) {
  return request<{ data: Extraction[] }>(
    `/api/documents/${documentId}/extractions`
  );
}

export async function verifyExtraction(id: string) {
  return request<{ id: string; status: string }>(
    `/api/extractions/${id}/verify`,
    { method: "PATCH", body: JSON.stringify({ verifiedBy: null }) }
  );
}

// ─── Shipments ────────────────────────────────────────────────────────────

export async function listShipments(page = 1, limit = 20) {
  return request<PaginatedResponse<Shipment>>(
    `/api/shipments?page=${page}&limit=${limit}`
  );
}

export async function getShipment(id: string) {
  return request<Shipment & { documents: Document[] }>(`/api/shipments/${id}`);
}

// ─── Validations ──────────────────────────────────────────────────────────

export async function listValidations(documentId?: string) {
  const query = documentId ? `?documentId=${documentId}` : "";
  return request<{ data: ValidationResult[] }>(`/api/validations${query}`);
}

export async function resolveValidation(id: string) {
  return request<{ id: string; status: string }>(
    `/api/validations/${id}/resolve`,
    { method: "PATCH", body: JSON.stringify({}) }
  );
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────

export interface DashboardStats {
  totalShipments: number;
  totalDocuments: number;
  flaggedDocuments: number;
  pendingDocuments: number;
  recentDocuments: Document[];
  recentShipments: Shipment[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [docsRes, shipsRes, flaggedRes, pendingRes] = await Promise.all([
    listDocuments(1, 100),
    listShipments(1, 100),
    listDocuments(1, 100),
    listDocuments(1, 100),
  ]);

  const allDocs = docsRes.data;
  const allShips = shipsRes.data;

  return {
    totalShipments: shipsRes.pagination.total,
    totalDocuments: docsRes.pagination.total,
    flaggedDocuments: allDocs.filter((d) => d.status === "flagged").length,
    pendingDocuments: allDocs.filter((d) => d.status === "pending").length,
    recentDocuments: allDocs.slice(0, 5),
    recentShipments: allShips.slice(0, 5),
  };
}