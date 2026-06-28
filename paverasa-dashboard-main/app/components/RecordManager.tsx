"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { formatCurrency } from "../lib/client-format";
import { Download, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

type Field = {
  name: string;
  label: string;
  type?: string;
  options?: string[];
  required?: boolean;
};

type Column = {
  key: string;
  label: string;
  isCurrency?: boolean;
};

type RecordData = {
  id?: number;
  [key: string]: string | number | undefined;
};

type RecordManagerProps = {
  title: string;
  apiBase: string;
  fields: Field[];
  columns: Column[];
  emptyRecord: RecordData;
  searchPlaceholder: string;
  statusFilter?: boolean;
  showDatabaseStatus?: boolean;
};

export default function RecordManager({
  title,
  apiBase,
  fields,
  columns,
  emptyRecord,
  searchPlaceholder,
  statusFilter = false,
  showDatabaseStatus = false,
}: RecordManagerProps) {
  const [records, setRecords] = useState<RecordData[]>([]);
  const [formData, setFormData] = useState<RecordData>(emptyRecord);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [databaseConnected, setDatabaseConnected] = useState<boolean | null>(null);
  const [databaseStatusMessage, setDatabaseStatusMessage] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
      sortBy,
      sortDir,
    });

    if (search) {
      params.set("search", search);
    }

    if (date) {
      params.set("date", date);
    }

    if (status) {
      params.set("status", status);
    }

    return params.toString();
  }, [date, page, search, sortBy, sortDir, status]);

  function applyDatabaseStatus(result: {
    databaseConnected?: boolean;
    databaseOffline?: boolean;
    warning?: string;
    databaseError?: string | null;
  }) {
    if (!showDatabaseStatus) {
      return;
    }

    if (result.databaseConnected) {
      setDatabaseConnected(true);
      setDatabaseStatusMessage("");
      return;
    }

    if (result.databaseOffline) {
      setDatabaseConnected(false);
      const details = result.databaseError ? ` ${result.databaseError}` : "";
      setDatabaseStatusMessage(`${result.warning || ""}${details}`.trim());
    }
  }

  const loadRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(`${apiBase}?${queryString}`, {
        cache: "no-store",
      });
      const result = await response.json();

      applyDatabaseStatus(result);

      if (!response.ok) {
        throw new Error(result.error || "Unable to load records.");
      }

      setRecords(result.data);
      setTotalPages(result.pagination.totalPages);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load records.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [apiBase, queryString, showDatabaseStatus]);

  useEffect(() => {
    void Promise.resolve().then(loadRecords);
  }, [loadRecords]);

  function updateField(name: string, value: string) {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setEditingId(null);
    setFormData(emptyRecord);
  }

  function validateForm() {
    for (const field of fields) {
      if (field.required && !String(formData[field.name] || "").trim()) {
        return `${field.label} is required.`;
      }
    }

    if (Number(formData.amount || 0) <= 0) {
      return "Amount must be greater than 0.";
    }

    return "";
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");

      const response = await fetch(editingId ? `${apiBase}/${editingId}` : apiBase, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      applyDatabaseStatus(result);

      if (!response.ok) {
        const firstError = result.errors
          ? Object.values(result.errors)[0]
          : result.error;
        throw new Error(String(firstError || "Unable to save record."));
      }

      setMessage(result.message || "Record saved.");
      resetForm();
      await loadRecords();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to save record.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(record: RecordData) {
    setEditingId(Number(record.id));
    setFormData({ ...record });
    setMessage("");
    setError("");
  }

  async function deleteRecord(record: RecordData) {
    const confirmed = window.confirm("Delete this record?");

    if (!confirmed || !record.id) {
      return;
    }

    try {
      setError("");
      setMessage("");
      const response = await fetch(`${apiBase}/${record.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      applyDatabaseStatus(result);

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete record.");
      }

      setMessage(result.message || "Record deleted.");
      await loadRecords();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete record.",
      );
    }
  }

  const exportToCSV = useCallback(() => {
    const headers = columns.map(col => col.label).join(',');
    const rows = records.map(record => 
      columns.map(col => 
        col.isCurrency 
          ? Number(record[col.key] || 0).toFixed(2)
          : String(record[col.key] || '')
      ).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [records, columns, title]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">Manage records with live database updates</p>
      </div>

      {showDatabaseStatus && databaseConnected ? (
        <div className="bg-white border border-emerald-200 rounded-lg p-4 mb-6 text-emerald-600">
          Database Connected
        </div>
      ) : null}

      {showDatabaseStatus && databaseConnected === false && databaseStatusMessage ? (
        <div className="bg-white border border-red-200 rounded-lg p-4 mb-6 text-red-600">
          {databaseStatusMessage}
        </div>
      ) : null}

      {message ? (
        <div className="bg-white border border-emerald-200 rounded-lg p-4 mb-6 text-emerald-600">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="bg-white border border-red-200 rounded-lg p-4 mb-6 text-red-600">
          {error}
        </div>
      ) : null}

      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          {editingId ? "Edit Record" : "Add Record"}
        </h2>
        <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fields.map((field) => (
            <label key={field.name} className="text-sm font-medium text-slate-700">
              <span className="block mb-2">{field.label}</span>
              {field.options ? (
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={String(formData[field.name] || "")}
                  onChange={(event) => updateField(field.name, event.target.value)}
                >
                  <option value="">Select</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  type={field.type || "text"}
                  value={String(formData[field.name] || "")}
                  onChange={(event) => updateField(field.name, event.target.value)}
                />
              )}
            </label>
          ))}

          <div className="flex items-end gap-3">
            <button
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            {editingId ? (
              <button
                className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-200 transition-colors"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              type="date"
              value={date}
              onChange={(event) => {
                setPage(1);
                setDate(event.target.value);
              }}
            />
          </div>

          {/* Status Filter */}
          {statusFilter ? (
            <select
              className="border border-slate-200 rounded-lg px-4 py-2 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              value={status}
              onChange={(event) => {
                setPage(1);
                setStatus(event.target.value);
              }}
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          ) : null}

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              className="border border-slate-200 rounded-lg pl-9 pr-4 py-2 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              value={`${sortBy}:${sortDir}`}
              onChange={(event) => {
                const [nextSortBy, nextSortDir] = event.target.value.split(":");
                setSortBy(nextSortBy);
                setSortDir(nextSortDir);
              }}
            >
              <option value="date:desc">Date Newest</option>
              <option value="date:asc">Date Oldest</option>
              <option value="amount:desc">Amount High</option>
              <option value="amount:asc">Amount Low</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
            type="button"
            onClick={exportToCSV}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-emerald-600"></div>
            <span className="ml-3 text-sm text-slate-600">Loading records...</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="text-slate-700">
                  {columns.map((column) => (
                    <th key={column.key} className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
                      {column.label}
                    </th>
                  ))}
                  <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    {columns.map((column) => (
                      <td key={column.key} className="py-3 px-4 text-slate-900">
                        {column.isCurrency
                          ? formatCurrency(Number(record[column.key] || 0))
                          : String(record[column.key] || "")}
                      </td>
                    ))}
                    <td className="py-3 px-4">
                      <div className="flex gap-3">
                        <button
                          className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors text-sm"
                          type="button"
                          onClick={() => startEdit(record)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 font-medium hover:text-red-700 transition-colors text-sm"
                          type="button"
                          onClick={() => deleteRecord(record)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {records.length === 0 ? (
                  <tr>
                    <td className="py-12 text-slate-500 text-center" colSpan={columns.length + 1}>
                      No records found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={page <= 1}
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={page >= totalPages}
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
