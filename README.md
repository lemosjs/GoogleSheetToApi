# Google Sheets JSON API Script

This Google Apps Script creates a lightweight API for interacting with a Google Sheet. It allows you to:
- Retrieve data from a sheet in JSON format.
- Append new rows to the sheet via a GET request (with query parameters) or a POST request (with JSON payload).

## Features
- **GET request** to retrieve sheet data as JSON.
- **POST request** to append a new row using JSON data.

## Setup Instructions

1. **Open Google Sheets**:
   - Create a new Google Sheet or use an existing one.

2. **Access Script Editor**:
   - In your Google Sheet, click on `Extensions` > `Apps Script`.
   
3. **Add the Script**:
   - Replace any existing code with the provided script below or add it as a new function:
   
   ```javascript
   function json(sheetName) {
     const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
     const sheet = spreadsheet.getSheetByName(sheetName);
     const data = sheet.getDataRange().getValues();
     const jsonData = convertToJson(data);
     return ContentService
           .createTextOutput(JSON.stringify(jsonData))
           .setMimeType(ContentService.MimeType.JSON);
   }

   function convertToJson(data) {
     const headers = data[0];
     const raw_data = data.slice(1,);
     let json = [];
     raw_data.forEach(d => {
         let object = {};
         for (let i = 0; i < headers.length; i++) {
           object[headers[i]] = d[i];
         }
         json.push(object);
     });
     return json;
   }

   function doGet(e) {
      const path = e.parameter.path;
      return json(path);
   }

   function doPost(e) {
     const sheetName = e.parameter.path;
     const data = JSON.parse(e.postData.contents);
     return appendRowJSON(sheetName, data);
   }



   function appendRowJSON(sheetName, data) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

     const headers = sheet.getDataRange().getValues()[0]; // Get headers
     let newRow = [];

     headers.forEach(header => {
       newRow.push(data[header] || ''); // Use empty string if field is missing
     });

     sheet.appendRow(newRow);

     return ContentService.createTextOutput("Row added successfully via POST request");
   }
   ```

4. **Deploy the Script**:
   - Click on `Deploy` > `Test deployments`.
   - Follow the prompts to deploy the app and copy the Web App URL.

## API Usage

### 1. **Retrieve Data as JSON**
You can retrieve the entire sheet’s data as JSON by making a `GET` request.

**URL:**
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?path=Sheet1
```

Replace `YOUR_SCRIPT_ID` with your Google Apps Script deployment ID, and `Sheet1` with your sheet's name.

### 2. **Append a Row via GET Request (Query Parameters)**
You can append a new row by making a `GET` request with the field values passed as query parameters.

**Example URL:**
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?path=Sheet1&Name=John&Age=30&addRow=true
```

- Replace `YOUR_SCRIPT_ID` with your deployment ID.
- Replace `Sheet1` with the name of your sheet.
- Add query parameters for the column headers in your sheet (`Name`, `Age`, etc.).

### 3. **Append a Row via POST Request (JSON Payload)**
You can append a new row by making a `POST` request with a JSON payload.

**POST URL:**
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?path=Sheet1
```

**JSON Payload Example:**
```json
{
  "Name": "Jane",
  "Age": 25
}
```

- Replace `YOUR_SCRIPT_ID` with your deployment ID.
- Ensure that the keys in the JSON payload match the column headers in your sheet.

### 4. **Response**
POST requests for appending rows will return the following message upon success:
```
Row added successfully via GET request (or POST request)
```

## Example API Calls

### GET Request (Retrieve Data)
```bash
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?path=Sheet1"
```


### POST Request (Append Row)
```bash
curl -X POST "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?path=Sheet1" \
-H "Content-Type: application/json" \
-d '{"Name": "Jane", "Age": 25}'
```

## Troubleshooting

- Make sure your Google Sheet has the correct column headers in the first row.
- Ensure the sheet name passed in the `path` parameter is spelled exactly as it appears in your Google Sheet.
- If you encounter any issues with permissions, ensure the app is deployed with the appropriate permissions (`Anyone` or `Anyone, even anonymous`).

