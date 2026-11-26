import { EMAIL_PATTERN, type LeadDraft } from "@/lib/workspace";

export const LEAD_CSV_HEADERS = ["Name", "Company", "Email", "Phone", "Source", "Notes"];

export const LEAD_CSV_TEMPLATE = [
  LEAD_CSV_HEADERS.join(","),
  '"Thandi Moyo","Zambezi Logistics","thandi@zambezilogistics.co.zw","+263 77 123 4567","Referral","Interested in the Growth plan"',
  '"Kwame Osei","Accra Textiles","kwame@accratextiles.com","+233 24 555 0123","Website","Requested a callback on Friday"',
].join("\r\n");

export type ParsedLeadRow = {
  row: number;
  draft: LeadDraft;
};

export type CsvIssue = { row: number; message: string };

export type CsvResult = {
  rows: ParsedLeadRow[];
  issues: CsvIssue[];
  delimiter: string;
  headers: string[];
};

type Field =
  | "name"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "company"
  | "source"
  | "notes";

const ALIASES: Record<Field, string[]> = {
  name: ["name", "full name", "fullname", "contact", "contact name", "lead name", "customer", "lead"],
  firstName: ["first name", "firstname", "given name"],
  lastName: ["last name", "lastname", "surname", "family name"],
  email: ["email", "e-mail", "email address", "work email", "mail"],
  phone: ["phone", "phone number", "mobile", "mobile number", "telephone", "tel", "cell"],
  company: ["company", "company name", "organisation", "organization", "business", "account"],
  source: ["source", "lead source", "channel", "campaign", "origin"],
  notes: ["notes", "note", "comment", "comments", "message", "description"],
};

function looksLikeHeader(row: string[]): boolean {
  return row.some((cell) => {
    const value = cell.trim().toLowerCase();
    return Object.values(ALIASES).some((list) => list.includes(value));
  });
}

function detectDelimiter(text: string): string {
  const line = text.split(/\r?\n/).find((item) => item.trim().length > 0) ?? "";
  const counts: { delimiter: string; count: number }[] = [
    { delimiter: ",", count: 0 },
    { delimiter: ";", count: 0 },
    { delimiter: "\t", count: 0 },
  ];
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') inQuotes = !inQuotes;
    if (inQuotes) continue;
    const entry = counts.find((item) => item.delimiter === char);
    if (entry) entry.count += 1;
  }
  return counts.sort((a, b) => b.count - a.count)[0].delimiter;
}

/** Quote-aware CSV parser: handles quoted commas, escaped quotes and CRLF. */
export function parseCsv(text: string, delimiter = detectDelimiter(text)): string[][] {
  const source = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (quoted) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === delimiter) {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((line) => line.some((value) => value.trim().length > 0));
}

function buildColumnMap(headers: string[]): Map<Field, number> {
  const map = new Map<Field, number>();
  headers.forEach((header, index) => {
    const value = header.trim().toLowerCase();
    if (!value) return;
    (Object.keys(ALIASES) as Field[]).forEach((field) => {
      if (!map.has(field) && ALIASES[field].includes(value)) map.set(field, index);
    });
  });
  return map;
}

export function parseLeadCsv(text: string): CsvResult {
  const delimiter = detectDelimiter(text);
  const table = parseCsv(text, delimiter);
  const rows: ParsedLeadRow[] = [];
  const issues: CsvIssue[] = [];

  if (table.length === 0) {
    return { rows, issues: [{ row: 0, message: "The file is empty." }], delimiter, headers: [] };
  }

  const headers = looksLikeHeader(table[0]) ? table[0] : [];
  const columns = headers.length > 0 ? buildColumnMap(headers) : new Map<Field, number>();
  const hasEmail = columns.has("email");
  const hasPhone = columns.has("phone");
  const hasName = columns.has("name") || (columns.has("firstName") && columns.has("lastName"));

  if (headers.length > 0 && (!hasName || (!hasEmail && !hasPhone))) {
    return {
      rows,
      issues: [
        {
          row: 1,
          message:
            "Add a Name column plus an Email or Phone column. Rename headers to match the template.",
        },
      ],
      delimiter,
      headers,
    };
  }

  const dataRows = headers.length > 0 ? table.slice(1) : table;

  dataRows.forEach((cells, index) => {
    const rowNumber = index + 1;
    const read = (field: Field): string => {
      if (columns.size > 0) {
        const position = columns.get(field);
        return position === undefined ? "" : (cells[position] ?? "").trim();
      }
      // Headerless files follow the template order: name, company, email, phone, source, notes.
      const fallback: Record<Field, number> = {
        name: 0,
        firstName: -1,
        lastName: -1,
        company: 1,
        email: 2,
        phone: 3,
        source: 4,
        notes: 5,
      };
      const position = fallback[field];
      return position < 0 ? "" : (cells[position] ?? "").trim();
    };

    const firstName = read("firstName");
    const lastName = read("lastName");
    const name = read("name") || [firstName, lastName].filter(Boolean).join(" ").trim();
    const email = read("email");
    const phone = read("phone");

    if (!name) {
      issues.push({ row: rowNumber, message: "Missing a lead name." });
      return;
    }
    if (!email && !phone) {
      issues.push({ row: rowNumber, message: `${name} has no email or phone number.` });
      return;
    }
    if (email && !EMAIL_PATTERN.test(email)) {
      issues.push({ row: rowNumber, message: `${name} has an invalid email (${email}).` });
      return;
    }

    rows.push({
      row: rowNumber,
      draft: {
        name,
        company: read("company"),
        email,
        phone,
        source: read("source"),
        notes: read("notes"),
      },
    });
  });

  return { rows, issues, delimiter, headers };
}
