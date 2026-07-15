import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { uploadDocument } from "../api/client";

const DOCUMENT_TYPES = [
  { value: "bill_of_lading", label: "Bill of Lading" },
  { value: "customs_declaration", label: "Customs Declaration" },
  { value: "commercial_invoice", label: "Commercial Invoice" },
  { value: "certificate_of_origin", label: "Certificate of Origin" },
  { value: "packing_list", label: "Packing List" },
  { value: "insurance_certificate", label: "Insurance Certificate" },
  { value: "other", label: "Other" },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("bill_of_lading");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadDocument(file, documentType);
      navigate(`/documents/${result.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">Upload Document</h1>
        <p className="mt-1 text-sm text-navy-500">
          Upload a logistics document for AI extraction and validation
        </p>
      </div>

      <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm">
        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-200 ${
            dragging
              ? "border-ship-500 bg-ship-50/50"
              : file
                ? "border-emerald-300 bg-emerald-50/30"
                : "border-navy-200 bg-navy-50/30 hover:border-navy-300 hover:bg-navy-50/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,.csv,.json,.xml,.png,.jpg,.jpeg,.tiff"
            className="hidden"
            onChange={handleFileChange}
          />

          {file ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="mt-4 text-base font-semibold text-navy-900">{file.name}</p>
              <p className="mt-1 text-sm text-navy-500">{formatSize(file.size)}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-100">
                <svg className="h-8 w-8 text-navy-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="mt-4 text-base font-semibold text-navy-900">
                Drop your document here
              </p>
              <p className="mt-1 text-sm text-navy-500">
                or click to browse &mdash; PDF, TXT, CSV, JSON, XML, PNG, JPG, TIFF
              </p>
              <p className="mt-1 text-xs text-navy-400">Max file size: 50 MB</p>
            </div>
          )}
        </div>

        {/* Document type selector */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-navy-700">
            Document Type
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 shadow-sm focus:border-ship-500 focus:outline-none focus:ring-2 focus:ring-ship-500/20"
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!file || uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-ship-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-ship-700 hover:shadow-md active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Upload &amp; Process
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}