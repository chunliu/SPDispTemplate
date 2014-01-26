var exportSearchResult = function (ctx) {
	//debugger;
	var a = document.getElementById("idExportSearchResults");

	if (ctx.ListData.ResultTables.length <= 0 || ctx.ListData.ResultTables[0].ResultRows.length <= 0) {
        // Hide the link if there is no result.
	    a.style.display = "none";
	    return;
	}

	var propArray = ["Author", "Created", "ExternalMediaURL", "LastModifiedTime", "Path"];
	var exportedResult = new Array();
    // Get only the required the managed properties. 
	ctx.ListData.ResultTables[0].ResultRows.forEach(function (row) {
	    var obj = new Object;
	    for (var i = 0; i < propArray.length; i++) {
	        obj[propArray[i]] = row[propArray[i]] ? row[propArray[i]] : "";
	    }

	    exportedResult.push(obj)
	});

	var showSave;
    // Only works with IE10 or later. 
	if (window.Blob && navigator.msSaveBlob) {
	    showSave = function (data, name, mimeType) {
	        resultBlob = new Blob([data], { type: mimeType });
	        navigator.msSaveBlob(resultBlob, name);
	    }
	}

	a.onclick = function(){saveExportedResult(); return false;};	
	var saveExportedResult = function(){
		if(!showSave){
			alert("Your browser does not support saving JavaScript generated data to files.");
			return;
		}	
		
		if(!exportedResult || exportedResult.length <= 0) {
			alert("Nothing to export as nothing matches your search.");
			return;
		}
		
		// Export the result in JSON format.
		showSave(ConvertToCSV(JSON.stringify(exportedResult), propArray), "ExportedSearchResult.csv", "text/plain; charset=UTF-8");
	}
	
	function ConvertToCSV(objArray, headerArray) {
		var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		var str = '';

		// Create header row. 
		var headerLine = '';
		for(var i = 0; i < headerArray.length; i++){
		    if (headerLine != "") {
		        headerLine += ',';
		    }
			headerLine += headerArray[i];
		}
		str += headerLine + '\r\n';
		// Create CSV body.
		for (var i = 0; i < array.length; i++) {
			var line = '';
			for (var index in array[i]) {
			    if (line != '') {
			        line += ',';
			    }
				line += array[i][index];
			}
			str += line + '\r\n';
		}
		return str;
	}		
}