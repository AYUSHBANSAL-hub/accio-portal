import { google } from "googleapis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId"); // Get the userId from query string

  if (!userId) {
    return new Response("userId query parameter is required", { status: 400 });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID as string;

    // Get the list of all sheet tabs (spreadsheet tabs)
    const sheetMetadata = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    // Get the tab names from the metadata
    const sheetTabs = sheetMetadata.data.sheets?.map(sheet => sheet.properties?.title);

    if (!sheetTabs || sheetTabs.length === 0) {
      return new Response("No tabs found in the sheet", { status: 404 });
    }

    // Now check each tab for data corresponding to the userId
    const availableReports: string[] = [];

    for (const tab of sheetTabs) {
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${tab}!A:A`,  // Check the first column for the userId
      });

      const rows = result.data.values;

      if (rows && rows.some(row => row[0] === userId)) {
        availableReports.push(tab);  // Add the tab name if userId is found in that tab
      }
    }

    if (availableReports.length > 0) {
      return new Response(JSON.stringify({ availableReports }), { status: 200 });
    } else {
      return new Response("No reports found for this user", { status: 404 });
    }
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}