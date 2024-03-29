function setUpDT(text, cur) {
    filters = {"left":[], "right":[]};
    currRt = cur;
    if (! newText ) {
      newText = text;
      //document.getElementById("toUse").value = currRt;
    }
    textInfo = new textmodel.TextHash( newText, caseSensitive, fieldNames, fieldDelim, distinguishingFieldsArray, baseField );
    uniqItems = textInfo.getUniqItemsWithCounts();
    
    if (! textInfo.containsItem(currRt)) {
      //var which = Math.round( uniqItems.length/2 );
      //currRt = uniqItems[ which ].replace(/\t.+$/,"");
      //document.getElementById("toUse").value = currRt;
      alert("word not found")
      return;
    }
    
    var arrays = textInfo.getItem(currRt, context, null, false, null, null, punc);
    dt = new doubletree.DoubleTree();
    dt.init("#doubletree").visWidth(w).handlers(handlers).showTokenExtra(showTokenExtras).sortFun(sortFun).filters(filters); //.basicStyles({"branch":{"stroke":"pink"}});
    dt.setupFromArrays(arrays[0], arrays[1], arrays[2], caseSensitive, fieldNames, fieldDelim, distinguishingFieldsArray);	  
}

function drawDT(text, cur, row) {
    filters = {"left":[], "right":[]};
    currRt = cur;
    if (! newText || ! dt) {
        newText = text.replaceAll('\\n', '\n');
        textInfo = new textmodel.TextHash( newText, caseSensitive, fieldNames, fieldDelim, distinguishingFieldsArray, baseField );
        uniqItems = textInfo.getUniqItemsWithCounts();
    }
    w = 600 
    if (! textInfo.containsItem(currRt)) {
      alert("word not found")
      return;
    }
    
    var arrays = textInfo.getItem(currRt, context, null, false, null, null, punc);
    dt = new doubletree.DoubleTree();
    // CR (2024) had to edit the following line to get this to function nicely
    dt.init(`#doubletree${row}`).visWidth(w).handlers(handlers).showTokenExtra(showTokenExtras).sortFun(sortFun).filters(filters); //.basicStyles({"branch":{"stroke":"pink"}});
    dt.setupFromArrays(arrays[0], arrays[1], arrays[2], caseSensitive, fieldNames, fieldDelim, distinguishingFieldsArray);    
}

//sets doubletree to having data with root newRt
function resetData(newRt, isIndex) {
    var prevDT = dt;
    
    var arraiys;
    /*
    if (isIndex) {
      arraiys = textInfo.getItem(newRt, context);
    } else {
      newRt = textInfo.itemToIndex(newRt);
      arraiys = textInfo.getItem(newRt, context);
    }
    */
    if (! isIndex) {
        newRt = textInfo.itemToIndex(newRt);
    }
    arraiys = textInfo.getItem(newRt, context, null, false, null, null, punc);
    
    dt.setupFromArrays(arraiys[0], arraiys[1], arraiys[2]);
    
    if (dt.succeeded()) {
        currRt = newRt;
        document.getElementById("toUse").value = currRt;    
    } else {
        alert("No results found for the filters.");
        dt = prevDT;
        dt.redraw();
    }
}

function resetDataByRegex(regex) {
    var prevDT = dt;
    
    //var arraiys = textInfo.getItems(regex, context);
    var arraiys = textInfo.getItems(regex, context, null, null, null, punc);


    dt.setupFromArrays(arraiys[0], arraiys[1], arraiys[2]);
    
    if (dt.succeeded()) {
        currRt = regex;
        document.getElementById("toUse").value = currRt;    
    } else {
        alert("No results found for the filters.");
        dt = prevDT;
        dt.redraw();
    }
}
