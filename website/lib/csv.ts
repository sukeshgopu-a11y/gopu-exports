/** RFC 4180 quoting plus spreadsheet formula neutralization. */
export function csvEscape(value: unknown): string {
  let text = String(value ?? "");
  if (/^[\s\u0000-\u001f]*[=+@-]/u.test(text)) text = "'" + text;
  return `"${text.replaceAll('"', '""')}"`;
}
export function encodeCsv(rows: unknown[][]): string {
  return rows.map(row => row.map(csvEscape).join(",")).join("\r\n");
}
