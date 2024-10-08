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

// Function to handle both GET and POST requests
function doGet(e) {
  const path = e.parameter.path;
  return json(path)
}

function doPost(e) {
  const sheetName = e.parameter.path;
  const data = JSON.parse(e.postData.contents);
  return appendRowJSON(sheetName, data);
}


// Function to append row using JSON payload in POST request
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
