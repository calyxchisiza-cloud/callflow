"use client";

import Link from "next/link";
import { useRef, useState, type DragEvent } from "react";
import { Icon } from "@/components/icon";
import { Panel } from "@/components/screens/ui";
import { LEAD_CSV_HEADERS, LEAD_CSV_TEMPLATE, parseLeadCsv, type CsvResult } from "@/lib/csv";
import { importLeads, useWorkspace, type ImportSummary } from "@/lib/workspace";
import { LocalNotice, RoleAlert, RoleEmpty, RoleHead } from "./role-ui";

const MAX_BYTES = 2 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function OwnerLeadImportView({ campaignId }: { campaignId?: string }) {
  const { workspace, ready } = useWorkspace();
  const campaign = campaignId
    ? workspace.campaigns.find((item) => item.id === campaignId)
    : undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [result, setResult] = useState<CsvResult | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState("");
  const [pasteMode, setPasteMode] = useState(false);
  const [paste, setPaste] = useState("");

  function reset() {
    setFileName("");
    setFileSize(0);
    setResult(null);
    setSummary(null);
    setError("");
    setPaste("");
    setPasteMode(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function accept(name: string, text: string, size: number) {
    if (size > MAX_BYTES) {
      setError("That file is over 2 MB. Split it into smaller imports.");
      return;
    }
    const parsed = parseLeadCsv(text);
    setFileName(name);
    setFileSize(size);
    setResult(parsed);
    setSummary(null);
    setError(
      parsed.rows.length === 0 && parsed.issues.length === 0
        ? "No rows found. Check that the first line contains headers."
        : "",
    );
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") {
      setError("Choose a .csv file. Excel exports can be saved as CSV.");
      return;
    }
    try {
      const text = await file.text();
      accept(file.name, text, file.size);
    } catch {
      setError("That file could not be read. Try exporting it again.");
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  function downloadTemplate() {
    const blob = new Blob([LEAD_CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "callflow-leads-template.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function runImport() {
    if (!result || result.rows.length === 0) return;
    const outcome = importLeads(
      result.rows.map((row) => ({ ...row.draft, campaignId: campaignId ?? null })),
    );
    setSummary(outcome);
  }

  const readyLabel =
    result && !summary
      ? `${result.rows.length} row${result.rows.length === 1 ? "" : "s"} ready${
          result.issues.length > 0
            ? ` · ${result.issues.length} ${result.issues.length === 1 ? "needs" : "need"} attention`
            : ""
        }`
      : "";

  return (
    <article className="screen">
      <RoleHead
        eyebrow="Customers · CRM — leads"
        title="Import leads from CSV"
        lede={
          campaign
            ? `Bring a contact list into ${campaign.name}. Rows are checked and previewed before anything lands.`
            : "Bring in a list from a spreadsheet or your old CRM. Rows are checked and previewed before anything lands in the inbox."
        }
        meta={
          <>
            {campaign && (
              <span className="screen-chip">
                <Icon name="megaphone" size={12} />
                {campaign.name}
              </span>
            )}
            <span className="screen-chip">
              <Icon name="target" size={12} />
              {workspace.leads.length} lead{workspace.leads.length === 1 ? "" : "s"} in the inbox
            </span>
            <span className="screen-chip">CSV · up to 2 MB</span>
          </>
        }
        actions={
          <>
            <Link
              className="btn btn-ghost"
              href={campaignId ? `/app/campaigns/${campaignId}` : "/app/crm/leads/all"}
            >
              {campaignId ? "Back to campaign" : "Back to inbox"}
            </Link>
            <button type="button" className="btn btn-primary" onClick={downloadTemplate}>
              <Icon name="arrow" size={15} />
              Download template
            </button>
          </>
        }
      />

      {summary ? (
        <Panel kicker="Import finished" title="Here is what landed">
          <div className="role-import-summary">
            <div className="role-import-figure is-good">
              <strong>{summary.added}</strong>
              <span>lead{summary.added === 1 ? "" : "s"} added</span>
            </div>
            <div className="role-import-figure">
              <strong>{summary.duplicates}</strong>
              <span>duplicate{summary.duplicates === 1 ? "" : "s"} skipped</span>
            </div>
            <div className="role-import-figure">
              <strong>{summary.skipped}</strong>
              <span>row{summary.skipped === 1 ? "" : "s"} without contact</span>
            </div>
          </div>
          <p className="role-panel-copy">
            {campaign
              ? `Added leads join ${campaign.name}. Agents on that campaign see them straight away; give an owner to any lead that needs personal follow-up.`
              : "Added leads are unassigned and sorted into the inbox. Assign owners so they appear on an agent's desk."}
          </p>
          <div className="role-inline-links">
            <button type="button" className="btn btn-ghost" onClick={reset}>
              Import another file
            </button>
            {campaign ? (
              <Link className="btn btn-primary" href={`/app/campaigns/${campaign.id}`}>
                Open {campaign.name}
                <Icon name="arrow" size={15} />
              </Link>
            ) : (
              <Link className="btn btn-primary" href="/app/crm/leads/all">
                Assign owners
                <Icon name="arrow" size={15} />
              </Link>
            )}
          </div>
        </Panel>
      ) : (
        <div className="role-split">
          <div className="role-stack">
            <Panel kicker="Step 1" title="Choose your file">
              <div
                className={`role-drop${dragging ? " is-dragging" : ""}${result ? " is-loaded" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <span className="role-drop-icon" aria-hidden="true">
                  <Icon name={result ? "check" : "plug"} size={22} />
                </span>
                {result ? (
                  <>
                    <strong>{fileName || "Pasted rows"}</strong>
                    <p>
                      {fileSize > 0 ? `${formatBytes(fileSize)} · ` : ""}
                      {readyLabel}
                    </p>
                  </>
                ) : (
                  <>
                    <strong>Drop a CSV here</strong>
                    <p>or choose a file from your computer. Headers are read automatically.</p>
                  </>
                )}
                <div className="role-drop-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => inputRef.current?.click()}
                  >
                    {result ? "Choose another file" : "Choose file"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      reset();
                      setPasteMode(true);
                    }}
                  >
                    Paste rows instead
                  </button>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="role-sr"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
              </div>

              {error && <RoleAlert>{error}</RoleAlert>}

              {pasteMode && !result && (
                <div className="role-paste">
                  <label htmlFor="csv-paste">
                    Paste CSV rows, including the header line.
                  </label>
                  <textarea
                    id="csv-paste"
                    rows={6}
                    value={paste}
                    onChange={(event) => setPaste(event.target.value)}
                    placeholder={"Name,Company,Email,Phone\nThandi Moyo,Zambezi Logistics,thandi@zambezi.co.zw,+263 77 123 4567"}
                  />
                  <div className="role-inline-links">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={paste.trim().length === 0}
                      onClick={() => accept("Pasted rows", paste, new Blob([paste]).size)}
                    >
                      Check rows
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setPasteMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </Panel>

            {result && result.rows.length > 0 && (
              <Panel
                kicker="Step 2"
                title="Preview"
                action={<span className="role-panel-count">{readyLabel}</span>}
              >
                <div className="screen-tablewrap">
                  <table className="screen-table role-table">
                    <thead>
                      <tr>
                        <th scope="col">Row</th>
                        <th scope="col">Name</th>
                        <th scope="col">Company</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.slice(0, 8).map((row) => (
                        <tr key={row.row}>
                          <td className="role-mono">{row.row + 1}</td>
                          <td>
                            <strong className="role-strong">{row.draft.name}</strong>
                          </td>
                          <td>{row.draft.company || <span className="role-muted">—</span>}</td>
                          <td>{row.draft.email || <span className="role-muted">—</span>}</td>
                          <td>{row.draft.phone || <span className="role-muted">—</span>}</td>
                          <td>{row.draft.source || <span className="role-muted">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {result.rows.length > 8 && (
                  <p className="role-table-note">
                    Showing 8 of {result.rows.length} valid rows.
                  </p>
                )}

                {result.issues.length > 0 && (
                  <div className="role-issues">
                    <strong>
                      {result.issues.length} row{result.issues.length === 1 ? "" : "s"} will be
                      skipped
                    </strong>
                    <ul>
                      {result.issues.slice(0, 6).map((issue) => (
                        <li key={`${issue.row}-${issue.message}`}>
                          <span>{issue.row === 0 ? "File" : `Row ${issue.row + 1}`}</span>
                          {issue.message}
                        </li>
                      ))}
                    </ul>
                    {result.issues.length > 6 && (
                      <p>And {result.issues.length - 6} more issues in the file.</p>
                    )}
                  </div>
                )}

                <div className="role-form-actions">
                  <button type="button" className="btn btn-primary" onClick={runImport}>
                    Import {result.rows.length} lead{result.rows.length === 1 ? "" : "s"}
                    <Icon name="arrow" size={15} />
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={reset}>
                    Start over
                  </button>
                </div>
              </Panel>
            )}

            {result && result.rows.length === 0 && result.issues.length > 0 && (
              <Panel kicker="Step 2" title="Nothing importable yet">
                <RoleEmpty
                  icon="lock"
                  title="No valid rows found"
                  body="Every row needs a name and at least an email or phone number. Fix the file and drop it again."
                  actions={
                    <Link className="btn btn-ghost" href="/app/crm/leads/all">
                      Add leads by hand instead
                    </Link>
                  }
                />
                <div className="role-issues">
                  <strong>What we found</strong>
                  <ul>
                    {result.issues.slice(0, 8).map((issue) => (
                      <li key={`${issue.row}-${issue.message}`}>
                        <span>{issue.row === 0 ? "File" : `Row ${issue.row + 1}`}</span>
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>
            )}
          </div>

          <div className="role-stack">
            <Panel kicker="Template" title="Column guide">
              <dl className="role-columns">
                {LEAD_CSV_HEADERS.map((header) => (
                  <div key={header}>
                    <dt>{header}</dt>
                    <dd>
                      {header === "Name"
                        ? "Required — first and last name."
                        : header === "Email"
                          ? "Needed unless a phone is present. Used to detect duplicates."
                          : header === "Phone"
                            ? "Needed unless an email is present."
                            : header === "Company"
                              ? "Optional account or business name."
                              : header === "Source"
                                ? "Optional origin, e.g. Referral."
                                : "Optional context for the agent."}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel kicker="Rules" title="How the import behaves">
              <ul className="role-perm">
                <li>
                  <Icon name="check" size={16} />
                  <div>
                    <strong>Headers in any order</strong>
                    <p>Commas, semicolons and tabs are detected. Quoted cells are handled.</p>
                  </div>
                </li>
                <li>
                  <Icon name="shield" size={16} />
                  <div>
                    <strong>Duplicates are skipped</strong>
                    <p>
                      Existing leads with the same email or phone are left untouched.
                    </p>
                  </div>
                </li>
                <li>
                  <Icon name="target" size={16} />
                  <div>
                    <strong>
                      {campaign ? "Imported leads join this campaign" : "Imported leads start unassigned"}
                    </strong>
                    <p>
                      {campaign
                        ? `Every imported lead lands in ${campaign.name}. Assign owners from the campaign or the inbox.`
                        : "Assign each one to an agent from the inbox afterwards."}
                    </p>
                  </div>
                </li>
              </ul>
            </Panel>
          </div>
        </div>
      )}

      {!ready ? (
        <p className="role-loading">Loading inbox…</p>
      ) : (
        <LocalNotice title="Imported locally.">
          {summary
            ? "This preview stores the imported leads in this browser. The API will own the real copy once it is deployed."
            : "Imports are stored in this browser until the Callflow API is connected. Nothing leaves this device."}
        </LocalNotice>
      )}
    </article>
  );
}
