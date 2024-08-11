/* app/lib/sheet.ts */

import { GoogleSpreadsheet } from "google-spreadsheet";
import jwt from "./google";

interface AppendData {
  [key: string]: string | number | boolean; // adjust the type to match your data structure
}

// if (!process.env.NEXT_PUBLIC_SPREADSHEET_ID) {
//   throw new Error("Missing NEXT_PUBLIC_SPREADSHEET_ID environment variable");
// }

const doc = new GoogleSpreadsheet(
  process.env.NEXT_PUBLIC_SPREADSHEET_ID as string,
  jwt
);

export async function appendToSheet(data: AppendData): Promise<void> {
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0]; // assuming the first sheet is where you want to append data
  await sheet.addRow(data);
}
