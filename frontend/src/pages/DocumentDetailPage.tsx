import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getDocument,
  getExtractions,
  listValidations,
  processDocument,
  verifyExtraction,
  resolveValidation,
  type Document,
  type Extraction,
  type ValidationResult,
} from "../api/client";

function ConfidenceBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 90 ? "bg-emerald-500" : pct >= 70 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="min-w-[3ch] text-xs font-medium text-navy-500">{pct}%</span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`status-badge ${map[severity] || "bg-gray-100 text-gray-800"}`}>
      {severity}
    </span>
  );
}

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<Document | null>(null);
  const [extractions, setExtractions] = useState<Extraction[]>([]);
  const [validations, setValidations] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadData = () => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      getDocument(id),
      getExtractions(id).catch(() => ({ data: [] })),
      listValidations(id).catch(() => ({ data: [] })),
    ])
      .then(([doc, ext, val]) => {
        setDoc(doc);
        setExtractions(ext.data);
        setValidations(val.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleProcess = async () => {
    if (!id) return;
    setProcessing(true);
    try {
      await processDocument(id);
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleVerify = async (extractionId: string) => {
    try {
      await verifyExtraction(extractionId);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResolve = async (validationId: string) => {
    try {
      await resolveValidation(validationId);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-200 border-t-ship-600" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-navy-700">Document not found</p>
        <Link to="/documents" className="mt-2 text-sm text-ship-600 hover:text-ship-700">
          Back to documents
        </Link>
      </div>
    );
  }

  const isProcessing = doc.status === "processing" || doc.status === "pending";
  const isCompleted = doc.status === "completed";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-navy-500">
        <Link to="/" className="hover:text-navy-700">Dashboard</Link>
        <span>/</span>
        <Link to="/documents" className="hover:text-navy-700">Documents</Link>
        <span>/</span>
        <span className="truncate text-navy-900 max-w-[200px]">{doc.filename}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{doc.filename}</h1>
          <p className="mt-1 text-sm text-navy-500 capitalize">
            {doc.documentType.replace(/_/g, " ")} &middot;{" "}
            {new Date(doc.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isCompleted && !isProcessing && (
            <button
              onClick={handleProcess}
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-xl bg-ship-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-ship-700 active:scale-[0.97] disabled:opacity-50"
            >
              {processing ? "Processing..." : "Process Document"}
            </button>
          )}
        </div>
      </div>

      {/* Status banner */}
      <div
        className={`rounded-xl border px-5 py-4 ${
          doc.status === "completed"
            ? "border-emerald-200 bg-emerald-50"
            : doc.status === "flagged"
              ? "border-red-200 bg-red-50"
              : doc.status === "processing"
                ? "border-blue-200 bg-blue-50"
                : "border-yellow-200 bg-yellow-50"
        }`}
      >
        <div className="flex items-center gap-2">
          <strong className="text-sm capitalize">{doc.status}</strong>
          {doc.errorMessage && (
            <span className="ml-2 text-sm text-navy-600">&mdash; {doc.errorMessage}</span>
          )}
        </div>
      </div>

      {/* Extractions */}
      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-navy-900">
          Extracted Data
          <span className="ml-2 text-sm font-normal text-navy-400">
            ({extractions.length} fields)
          </span>
        </h2>

        {extractions.length === 0 ? (
          <p className="mt-4 text-sm text-navy-400">
            {isProcessing
              ? "Document is being processed. Extractions will appear here."
              : "No extractions yet. Process the document to extract data."}
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-navy-100">
            <table className="w-full">
              <thead>
                <tr className="bg-navy-50/50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-navy-500">
                    Field
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-navy-500">
                    Value
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-navy-500">
                    Confidence
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase text-navy-500">
                    Verified
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {extractions.map((ext) => (
                  <tr key={ext.id} className="transition-colors hover:bg-navy-50/30">
                    <td className="px-4 py-3 text-sm font-medium text-navy-700 capitalize">
                      {ext.fieldName.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-sm text-navy-900">{ext.fieldValue}</td>
                    <td className="px-4 py-3">
                      <ConfidenceBar score={ext.confidence} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ext.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerify(ext.id)}
                          className="rounded-lg border border-navy-200 px-3 py-1 text-xs font-medium text-navy-600 transition-colors hover:bg-navy-50"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Validations */}
      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-navy-900">
          Validation Issues
          <span className="ml-2 text-sm font-normal text-navy-400">
            ({validations.length} issues)
          </span>
        </h2>

        {validations.length === 0 ? (
          <p className="mt-4 text-sm text-navy-400">
            {isProcessing
              ? "Validating document..."
              : "No validation issues found."}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {validations.map((val) => (
              <div
                key={val.id}
                className={`rounded-xl border px-4 py-3 ${
                  val.isResolved
                    ? "border-emerald-100 bg-emerald-50/50"
                    : "border-navy-100 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={val.severity} />
                      <span className="text-sm font-medium text-navy-900 capitalize">
                        {val.ruleName.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-navy-600">{val.message}</p>
                    {(val.expectedValue || val.actualValue) && (
                      <div className="mt-2 flex gap-4 text-xs text-navy-500">
                        {val.expectedValue && (
                          <span>Expected: <strong className="text-navy-700">{val.expectedValue}</strong></span>
                        )}
                        {val.actualValue && (
                          <span>Actual: <strong className="text-navy-700">{val.actualValue}</strong></span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    {val.isResolved ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolve(val.id)}
                        className="rounded-lg border border-navy-200 px-3 py-1 text-xs font-medium text-navy-600 transition-colors hover:bg-navy-50"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}