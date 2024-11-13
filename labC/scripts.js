let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

// Function to save the raster map as canvas
document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        if (err) throw err;
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");

        // Set rasterMap size to canvas size (e.g., 400x600)
        rasterMap.width = canvas.width;
        rasterMap.height = canvas.height;
        rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

        // Hide Get Location and Save Button, show Puzzle Button
        document.getElementById("getLocation").style.display = "none";
        document.getElementById("saveButton").style.display = "none";
        document.getElementById("puzzleButton").style.display = "block";
    });
});

// Function to get location and set map view
document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
        document.getElementById("locationCoords").textContent = `Location coordinates: latitude(${lat.toFixed(6)}), longitude(${lon.toFixed(6)})`;
    }, positionError => {
        console.error(positionError);
    });
});

document.getElementById("puzzleButton").addEventListener("click", function() {
    let rasterMap = document.getElementById("rasterMap");
    let tileContainer = document.getElementById("puzzle-tiles");
    let targetContainer = document.getElementById("puzzle-target");

    // Clear previous tiles
    tileContainer.innerHTML = "";
    targetContainer.innerHTML = "";

    // Set the size of each tile to 1/4 of the rasterMap width and height
    let tileWidth = rasterMap.width / 4;
    let tileHeight = rasterMap.height / 4;
    let tiles = [];

    // Create and shuffle tiles
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let tile = document.createElement("canvas");
            tile.width = tileWidth;
            tile.height = tileHeight;
            tile.draggable = true;
            tile.classList.add("tile");

            // Draw the portion of the raster map onto the tile
            let ctx = tile.getContext("2d");
            ctx.drawImage(rasterMap, col * tileWidth, row * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);

            tile.id = `tile_${row}_${col}`;
            tiles.push(tile);

            // Drag and drop event listeners for tiles
            tile.addEventListener("dragstart", function(e) {
                e.dataTransfer.setData("tile-id", e.target.id);
            });
        }
    }

    // Shuffle tiles and append to tileContainer
    tiles = tiles.sort(() => Math.random() - 0.5);

    // Set tileContainer as a 4x4 grid
    tileContainer.style.display = "grid";
    tileContainer.style.gridTemplateColumns = `repeat(4, ${tileWidth}px)`;
    tileContainer.style.gridTemplateRows = `repeat(4, ${tileHeight}px)`;

    tileContainer.style.marginLeft = "12px";

    tiles.forEach(tile => tileContainer.appendChild(tile));

    // Create target grid to match rasterMap size
    targetContainer.style.width = `${rasterMap.width}px`;
    targetContainer.style.height = `${rasterMap.height}px`;
    targetContainer.style.display = "grid";
    targetContainer.style.gridTemplateColumns = `repeat(4, ${tileWidth}px)`;
    targetContainer.style.gridTemplateRows = `repeat(4, ${tileHeight}px)`;

    // Create the 4x4 grid for placing tiles
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let placeholder = document.createElement("div");
            placeholder.style.width = `${tileWidth}px`;
            placeholder.style.height = `${tileHeight}px`;
            placeholder.style.border = "1px solid black";
            placeholder.classList.add("tile-placeholder");
            placeholder.dataset.targetId = `tile_${row}_${col}`;

            // Dragover event to allow drop
            placeholder.addEventListener("dragover", function(e) {
                e.preventDefault();
            });

            // Drop event for each grid cell
            placeholder.addEventListener("drop", function(e) {
                e.preventDefault();

                let tileId = e.dataTransfer.getData("tile-id");
                let draggedTile = document.getElementById(tileId);

                // If the placeholder already has a tile, swap them
                if (e.target.childElementCount === 1) {
                    let existingTile = e.target.firstElementChild;

                    // Swap: move existing tile back to original container of dragged tile
                    let originalParent = draggedTile.parentNode;
                    originalParent.appendChild(existingTile);
                    e.target.appendChild(draggedTile);
                } else if (e.target.childElementCount === 0){
                    // Place the dragged tile if the target is empty
                    e.target.appendChild(draggedTile);
                }

                // Check if puzzle is complete after placing a tile
                checkPuzzleCompletion();
            });

            targetContainer.appendChild(placeholder);
        }
    }

    // Swap targetContainer and tileContainer in the DOM
    let parent = tileContainer.parentNode;
    parent.appendChild(targetContainer); // Move targetContainer after tileContainer
    parent.appendChild(tileContainer);   // Move tileContainer after targetContainer

    // Function to check puzzle completion
    function checkPuzzleCompletion() {
        let isComplete = true;

        // Loop through each placeholder and verify the correct tile is placed
        document.querySelectorAll(".tile-placeholder").forEach(placeholder => {
            let tile = placeholder.firstElementChild;
            if (!tile || tile.id !== placeholder.dataset.targetId) {
                isComplete = false;
            }
        });

        // Show alert if all tiles are in the correct position
        if (isComplete) {
            alert("Puzzle completed successfully!");
            console.log("Puzzle completed successfully!")
        }
    }
});
