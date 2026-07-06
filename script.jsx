#target photoshop

var dbFile = new File(Folder.temp + "/smart_album_db.json");
var lastFolderFile = new File(Folder.temp + "/smart_album_last_folder.txt");
var lastPSDFolderFile = new File(Folder.temp + "/smart_album_last_psd_folder.txt");
var lastSaveFolderFile = new File(Folder.temp + "/smart_album_last_save_folder.txt");

function loadMasterMemory() {
    var photos = [];
    if (dbFile.exists) {
        dbFile.open("r");
        var content = dbFile.read();
        dbFile.close();
        if (content !== "") {
            try {
                photos = eval(content);
            } catch (e) {
                photos = [];
            }
        }
    }
    return photos;
}

function saveMasterMemory(photos) {
    dbFile.open("w");
    dbFile.write(photos.toSource());
    dbFile.close();
}

function getLastFolder() {
    if (lastFolderFile.exists) {
        lastFolderFile.open("r");
        var path = lastFolderFile.read();
        lastFolderFile.close();
        var f = new Folder(path);
        if (f.exists) return f;
    }
    return Folder.myDocuments;
}

function saveLastFolder(path) {
    lastFolderFile.open("w");
    lastFolderFile.write(path);
    lastFolderFile.close();
}

var masterQueuePhotos = loadMasterMemory();

function launchProQueuePanel() {
    var win = new Window("dialog", "MS ALBUM - MY STUDIO EXT", undefined, { closeButton: true });

    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 12;
    win.margins = 20;

    var panelSetup = win.add("panel", undefined, "STEP1: LOAD PHOTOS");
    var rowPhoto = panelSetup.add("group");
    var btnScanPhotos = rowPhoto.add("button", undefined, "LOAD PHOTOS");
    var lblRemaining = rowPhoto.add("statictext", undefined, "Balance Photos: 0");
    var lblUsedCount = rowPhoto.add("statictext", undefined, "Used Photos: 0");
    var lblPhotoCount = rowPhoto.add("statictext", undefined, "Total Loaded: " + masterQueuePhotos.length);

    var savePanel = win.add("panel", undefined, "STEP2: ALBUM CREATION");
    savePanel.orientation = "row";


    var btnProcess = savePanel.add("button", undefined, "START ALBUM CREATION");
    btnProcess.size = [250, 40];
    btnProcess.graphics.foregroundColor = btnProcess.graphics.newPen(btnProcess.graphics.PenType.SOLID_COLOR, [0.6, 1, 1, 1], 1);

    var textGroup = savePanel.add("group");
    textGroup.orientation = "column";
    textGroup.alignChildren = ["left", "top"];
    textGroup.spacing = 0;

    var txt = textGroup.add("statictext", undefined, "MS ALBUM");
    txt.graphics.font = ScriptUI.newFont("MS Sans Serif", "BOLD", 32);
    txt.graphics.foregroundColor = txt.graphics.newPen(
        txt.graphics.PenType.SOLID_COLOR,
        [1 / 255, 247 / 255, 1 / 255, 1],
        1
    );

    var caption = textGroup.add("statictext", undefined, "For My-STUDIO PC");
    caption.graphics.font = ScriptUI.newFont("MS Sans Serif", "REGULAR", 20);
    caption.graphics.foregroundColor = caption.graphics.newPen(
        caption.graphics.PenType.SOLID_COLOR,
        [1, 1, 1, 1],
        1
    );

    var panelStroke = win.add("panel", undefined, "STEP3: STROKE (Optional)");

    panelStroke.orientation = "column";

    panelStroke.alignChildren = ["fill", "top"];

    var rowStrokeSize = panelStroke.add("group");
    rowStrokeSize.add("statictext", undefined, "Select Stroke Width:");

    var strokeDropdown = rowStrokeSize.add("dropdownlist", undefined, ["No Stroke", "3 px", "5 px", "6 px", "8 px", "10 px", "12 px", "15 px", "18 px", "20 px"]);
    strokeDropdown.selection = 7;

    var rowStrokeColor = panelStroke.add("group");

    rowStrokeColor.add("statictext", undefined, "Select Stroke Color:");
    var colorDropdown = rowStrokeColor.add("dropdownlist", undefined, ["White", "Black", "Red", "Yellow", "Blue"]);
    colorDropdown.selection = 0;

    var btnStrokeOnly = rowStrokeColor.add("button", undefined, "APPLY");
    btnStrokeOnly.size = [110, 30];

    function updateQueueUI() {
        var unusedL = 0, unusedP = 0, used = 0;
        for (var i = 0; i < masterQueuePhotos.length; i++) {
            if (masterQueuePhotos[i].used) { used++; }
            else { if (masterQueuePhotos[i].orientation === "L") unusedL++; else unusedP++; }
        }
        lblPhotoCount.text = "Total: " + masterQueuePhotos.length;
        lblRemaining.text = "Unused: " + " " + (unusedL + unusedP) + " (" + unusedL + " Horizontal, " + unusedP + " Vertical)";
        lblUsedCount.text = "Used: " + used;
        win.update();
    }
    updateQueueUI();

    var btnResetQueue = win.add("button", undefined, "Clear Loaded Photos");

    var statusText = win.add("statictext", undefined, "Ready...");
    statusText.graphics.font = ScriptUI.newFont("MS Sans Serif", "REGULAR", 20);




    function findCandidLayerByName(container, targetNumber) {
        var subLayers = container.layers;
        for (var i = 0; i < subLayers.length; i++) {
            var layerItem = subLayers[i];
            if (layerItem.typename === "LayerSet") {
                var found = findCandidLayerByName(layerItem, targetNumber);
                if (found !== null) return found;
            } else if (!layerItem.isBackgroundLayer) {
                var cleanName = layerItem.name.toLowerCase().replace(/\s+/g, "");
                var targetMatch = "candid" + targetNumber;
                if (cleanName === targetMatch) {
                    return layerItem;
                }
            }
        }
        return null;
    }

    function getAllTargetSlots(container) {
        var slots = [];
        function scan(currentContainer) {
            var subLayers = currentContainer.layers;
            for (var i = 0; i < subLayers.length; i++) {
                var layerItem = subLayers[i];
                if (layerItem.typename === "LayerSet") {
                    scan(layerItem);
                } else if (!layerItem.isBackgroundLayer && layerItem.visible) {
                    var cleanName = layerItem.name.toLowerCase().replace(/\s+/g, "");

                    if (cleanName.indexOf("msimg") !== -1 || cleanName.indexOf("candid") !== -1) {
                        var bounds = layerItem.bounds;
                        var width = bounds[2] - bounds[0];
                        var height = bounds[3] - bounds[1];
                        var orientation = (width > height) ? "L" : "P";

                        slots.push({
                            layerObj: layerItem,
                            layerName: layerItem.name,
                            orientation: orientation,
                            x: parseInt(bounds[0], 10),
                            y: parseInt(bounds[1], 10)
                        });
                    }
                }
            }
        }
        scan(container);
        return slots;
    }

    function getSelectedRGB() {
        var rgbColor = { r: 255, g: 255, b: 255 };
        var selectedColorText = colorDropdown.selection.text;
        if (selectedColorText.indexOf("Black") !== -1) { rgbColor = { r: 0, g: 0, b: 0 }; }
        else if (selectedColorText.indexOf("Red") !== -1) { rgbColor = { r: 255, g: 0, b: 0 }; }
        else if (selectedColorText.indexOf("Yellow") !== -1) { rgbColor = { r: 255, g: 255, b: 0 }; }
        else if (selectedColorText.indexOf("Blue") !== -1) { rgbColor = { r: 255, g: 0, b: 255 }; }
        return rgbColor;
    }

    btnScanPhotos.onClick = function () {
        var currentDefault = getLastFolder();
        var tempFolder = Folder.selectDialog("Select Photos Folder", currentDefault);
        if (tempFolder != null) {
            
            saveLastFolder(tempFolder.fsName);
            win.update();
            var fileList = tempFolder.getFiles(/\.(jpg|jpeg|png|tif|tiff)$/i);
            masterQueuePhotos = [];
            var oldDialogs = app.displayDialogs;
            app.displayDialogs = DialogModes.NO;

            for (var j = 0; j < fileList.length; j++) {
                try {
                    statusText.text = "Loading Photos: " + (j + 1) + " / " + fileList.length
                    var openDoc = app.open(fileList[j]);
                    var orientation = (openDoc.width > openDoc.height) ? "L" : "P";
                    masterQueuePhotos.push({ fsName: fileList[j].fsName, orientation: orientation, used: false });
                    openDoc.close(SaveOptions.DONOTSAVECHANGES);
                } catch (e) { }
            }
            app.displayDialogs = oldDialogs;
            saveMasterMemory(masterQueuePhotos);
            updateQueueUI();
            statusText.text = fileList.length + " Photos Loaded Successfully Click STEP: 2"
        }

        // alert("Photos Loaded Successfully. Click STEP: 2")


    }

    btnResetQueue.onClick = function () {
        if (confirm("Do you want to reset master photo memory and save location?")) {
            masterQueuePhotos = [];
            if (dbFile.exists) dbFile.remove();
            if (lastFolderFile.exists) lastFolderFile.remove();
            if (lastSaveFolderFile.exists) lastSaveFolderFile.remove();
            updateQueueUI();
            statusText.text = "Ready..."
        }
    }

    function generateAlbumSheet(activeDoc) {
        masterQueuePhotos = loadMasterMemory();

        if (masterQueuePhotos.length == 0) {
            alert("Error: Photos missing! Please load photos first.");
            return;
        }

        var targetSlots = getAllTargetSlots(activeDoc);
        var processSlots = [];

        for (var i = 0; i < targetSlots.length; i++) {
            var nameClean = targetSlots[i].layerName.toLowerCase();
            if (nameClean.indexOf("msimg") !== -1 && nameClean.indexOf("_filled") === -1 && nameClean.indexOf("family") === -1) {
                processSlots.push(targetSlots[i]);
            }
        }

        if (processSlots.length == 0) {
            alert("Missing Layers. Please rename MSIMG");
            return;
        }

        processSlots.sort(function (a, b) {
            var numA = parseInt(a.layerName.match(/\d+/), 10);
            var numB = parseInt(b.layerName.match(/\d+/), 10);
            if (isNaN(numA)) numA = 0;
            if (isNaN(numB)) numB = 0;
            if (numA !== numB) return numA - numB;
            return a.x - b.x;
        });

        win.update();

        var placedCount = 0;
        var strokeIdx = strokeDropdown.selection.index;
        var strokeVal = 0;
        if (strokeIdx > 0) {
            strokeVal = parseInt(strokeDropdown.selection.text.replace(" px", ""), 10);
        }

        for (var k = 0; k < processSlots.length; k++) {
            var slot = processSlots[k];

            for (var m = 0; m < masterQueuePhotos.length; m++) {
                var masterImg = masterQueuePhotos[m];

                if (masterImg.used === true) continue;

                if (masterImg.orientation === slot.orientation) {
                    var currentFile = new File(masterImg.fsName);

                    if (!currentFile.exists) {
                        masterImg.used = true;
                        continue;
                    }

                    activeDoc.activeLayer = slot.layerObj;
                    var origSlotName = slot.layerObj.name;
                    openCopyPasteAndMask(currentFile, slot.layerObj, activeDoc);

                    slot.layerObj.name = origSlotName + "_filled";

                    // if (strokeIdx > 0 && strokeVal > 0) {
                    //     var rgbColor = getSelectedRGB();
                    //     applyLayerStroke(slot.layerObj, strokeVal, rgbColor);
                    // } else {
                    //     clearLayerStroke(slot.layerObj);
                    // }

                    try {
                        if (currentFile.exists) {
                            var parentFolder = currentFile.parent;
                            var usedFolder = new Folder(parentFolder + "/USED_PHOTOS");
                            if (!usedFolder.exists) { usedFolder.create(); }
                            var targetFilePath = usedFolder + "/" + currentFile.name;
                            if (currentFile.rename(targetFilePath)) {
                                masterImg.fsName = targetFilePath;
                            }
                        }
                    } catch (err) { }

                    masterImg.used = true;
                    placedCount++;
                    break;
                }
            }
        }

        saveMasterMemory(masterQueuePhotos);
        updateQueueUI();
    }

    btnProcess.onClick = function () {

        if (app.documents.length == 0) return;


        var docs = [];

        for (var i = 0; i < app.documents.length; i++) {
            docs.push(app.documents[i]);
        }

        for (var k = 0; k < docs.length; k++) {
            if (!docs[k]) continue;
            statusText.text = "Busy... Creating sheet " + (k + 1) + " / " + docs.length
            app.activeDocument = docs[k];
            generateAlbumSheet(docs[k]);
        }

        statusText.text = "Album creation completed successfully"
        statusText.graphics.foregroundColor = statusText.graphics.newPen(
            statusText.graphics.PenType.SOLID_COLOR,
            [1 / 255, 247 / 255, 1 / 255, 1],
            1
        );
    }


    function applyStroke(activeDoc) {
        var targetSlots = getAllTargetSlots(activeDoc);

        var strokeIdx = strokeDropdown.selection.index;
        var strokeVal = 0;
        if (strokeIdx > 0) {
            strokeVal = parseInt(strokeDropdown.selection.text.replace(" px", ""), 10);
        }
        var rgbColor = getSelectedRGB();

        win.update();

        for (var i = 0; i < targetSlots.length; i++) {
            var slotLayer = targetSlots[i].layerObj;
            if (strokeIdx === 0) {
                clearLayerStroke(slotLayer);
            } else if (strokeVal > 0) {
                applyLayerStroke(slotLayer, strokeVal, rgbColor);
            }
        }

        win.update();
    }

    btnStrokeOnly.onClick = function () {

        var docs = [];

        for (var i = 0; i < app.documents.length; i++) {
            docs.push(app.documents[i]);
        }

        for (var k = 0; k < docs.length; k++) {

            if (!docs[k]) continue;

            app.activeDocument = docs[k];
            applyStroke(docs[k]);
        }

    }

    function openCopyPasteAndMask(file, slotLayer, mainDoc) {
        var oldDialogs = app.displayDialogs;
        app.displayDialogs = DialogModes.NO;

        var photoDoc = app.open(file);
        photoDoc.selection.selectAll();
        photoDoc.selection.copy();
        photoDoc.close(SaveOptions.DONOTSAVECHANGES);

        app.displayDialogs = oldDialogs;

        app.activeDocument = mainDoc;
        mainDoc.activeLayer = slotLayer;
        mainDoc.paste();

        var pastedLayer = mainDoc.activeLayer;

        try {
            var desc = new ActionDescriptor();
            var ref = new ActionReference();
            ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
            desc.putReference(charIDToTypeID('null'), ref);
            executeAction(charIDToTypeID('GrpL'), desc, DialogModes.NO);
        } catch (e) { }

        fitToSlot(slotLayer, pastedLayer);
    }

    function fitToSlot(slotLayer, photoLayer) {
        function getLayerBounds(layer) {
            var bounds = layer.bounds;
            return { w: bounds[2] - bounds[0], h: bounds[3] - bounds[1], x: bounds[0], y: bounds[1] };
        }
        var s = getLayerBounds(slotLayer);
        var p = getLayerBounds(photoLayer);
        var scaleX = (s.w / p.w) * 100;
        var scaleY = (s.h / p.h) * 100;
        var scale = Math.max(scaleX, scaleY);
        photoLayer.resize(scale, scale, AnchorPosition.MIDDLECENTER);
        var pNew = getLayerBounds(photoLayer);
        var sX = s.x + (s.w / 2); var sY = s.y + (s.h / 2);
        var pX = pNew.x + (pNew.w / 2); var pY = pNew.y + (pNew.h / 2);
        photoLayer.translate(sX - pX, sY - pY);
    }

    function applyLayerStroke(targetLayer, strokeSize, rgbColorObj) {
        try {
            app.activeDocument.activeLayer = targetLayer;

            var idset = stringIDToTypeID("set");
            var desc = new ActionDescriptor();
            var idnull = stringIDToTypeID("null");
            var ref = new ActionReference();
            ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("layerEffects"));
            ref.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
            desc.putReference(idnull, ref);

            var idto = stringIDToTypeID("to");
            var descEffects = new ActionDescriptor();
            var idframeFX = stringIDToTypeID("frameFX");
            var descStroke = new ActionDescriptor();

            descStroke.putBoolean(stringIDToTypeID("enabled"), true);
            descStroke.putEnumerated(stringIDToTypeID("present"), stringIDToTypeID("present"), stringIDToTypeID("stroke"));
            descStroke.putEnumerated(stringIDToTypeID("style"), stringIDToTypeID("frameStyle"), stringIDToTypeID("insetFrame"))
            descStroke.putEnumerated(stringIDToTypeID("paintType"), stringIDToTypeID("frameFill"), stringIDToTypeID("solidColor"));
            descStroke.putUnitDouble(stringIDToTypeID("size"), stringIDToTypeID("pixelsUnit"), strokeSize);
            descStroke.putUnitDouble(stringIDToTypeID("opacity"), stringIDToTypeID("percentUnit"), 100.0);

            var idcolor = stringIDToTypeID("color");
            var descColor = new ActionDescriptor();
            descColor.putDouble(stringIDToTypeID("red"), rgbColorObj.r);
            descColor.putDouble(stringIDToTypeID("green"), rgbColorObj.g);
            descColor.putDouble(stringIDToTypeID("blue"), rgbColorObj.b);
            descStroke.putObject(idcolor, stringIDToTypeID("RGBColor"), descColor);

            descEffects.putObject(idframeFX, idframeFX, descStroke);
            desc.putObject(idto, stringIDToTypeID("layerEffects"), descEffects);
            executeAction(idset, desc, DialogModes.NO);
        } catch (e) { }
    }

    function clearLayerStroke(targetLayer) {
        try {
            app.activeDocument.activeLayer = targetLayer;
            var iddelete = stringIDToTypeID("delete");
            var desc = new ActionDescriptor();
            var idnull = stringIDToTypeID("null");
            var ref = new ActionReference();
            ref.putClass(stringIDToTypeID("frameFX"));
            ref.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
            desc.putReference(idnull, ref);
            executeAction(iddelete, desc, DialogModes.NO);
        } catch (e) { }
    }







    win.center();
    win.show();
}

launchProQueuePanel();