var container, stats;
var camera, scene, renderer;

init();
animate();

// Generate a random world.
function generateRandomWorld() {
  var world = {
    dimensions: 50,
    tileSize: 100,
    matrix: []
  };

  ROT.RNG.setSeed(new Date().getTime());
  var map = new ROT.Map.Digger(world.dimensions, world.dimensions);
  map.create();
  rooms = map.getRooms();

  var row, col;

  for (row = 0; row < world.dimensions; row++) {
    world.matrix[row] = [];
    for (column = 0; column < world.dimensions; column++) {
      world.matrix[row][column] = 0;
    }
  }

  rooms.forEach(function (room) {
    for (row = room.getTop(); row <= room.getBottom(); row++) {
      for (col = room.getLeft(); col <= room.getRight(); col++) {
        world.matrix[row-1][col-1] = 1;
      }
    }

    room.getDoors(function (col, row) {
      world.matrix[row-1][col-1] = 1;
    });
  });

  var corridors = map.getCorridors();

  corridors.forEach(function (corridor) {
    var startX, startY, endX, endY;
    if (corridor._endX > corridor._startX) {
      startX = corridor._startX;
      endX = corridor._endX;
    }
    else {
      startX = corridor._endX;
      endX = corridor._startX;
    }
    if (corridor._endY > corridor._startY) {
      startY = corridor._startY;
      endY = corridor._endY;
    }
    else {
      startY = corridor._endY;
      endY = corridor._startY;
    }

    for (col = startX; col <= endX; col++) {
      for (row = startY; row <= endY; row++) {
        world.matrix[row-1][col-1] = 1;
      }
    }
  });

  return world;
}

// Adds gridlines to the scene.
function attachGrid(scene, world) {
  var gridSize = (world.tileSize * world.dimensions / 2);
  var geometry = new THREE.Geometry();
  for(var i = -gridSize; i <= gridSize; i += world.tileSize) {
    geometry.vertices.push(new THREE.Vector3(-gridSize, 0, i));
    geometry.vertices.push(new THREE.Vector3( gridSize, 0, i));

    geometry.vertices.push(new THREE.Vector3(i, 0, -gridSize));
    geometry.vertices.push(new THREE.Vector3(i, 0,  gridSize));
  }

  var gridlineMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );
  var grid = new THREE.Line( geometry, gridlineMaterial, THREE.LinePieces );
  scene.add(grid);
}

// Adds wall geometry to the scene.
function attachWalls(scene, world) {
  var geometry = new THREE.BoxGeometry(world.tileSize, world.tileSize, world.tileSize);
  //var geometry = new THREE.BoxGeometry(world.tileSize, world.tileSize, world.tileSize);
  var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: 0.5 } );

  var currentY, currentZ;
  for (var row = 0; row < world.dimensions; row++) {
    currentY = -(world.tileSize * world.dimensions / 2) + (row * world.tileSize);
    for (var column = 0; column < world.dimensions; column++) {
      currentZ = -(world.tileSize * world.dimensions / 2) + (column * world.tileSize);

      if (world.matrix[row][column]) {
        var cube = new THREE.Mesh( geometry, material );
        cube.position.x = currentY + world.tileSize/2;
        cube.position.y = world.tileSize/2;
        cube.position.z = currentZ + world.tileSize/2;

        scene.add(cube);
      }
    }
  }
}

// Add lights to the scene.
function attachLighting(scene) {
  var ambientLight = new THREE.AmbientLight(0xb00000);
  scene.add(ambientLight);

  var directionalLightOne = new THREE.DirectionalLight(0xf48904);
  directionalLightOne.position.x = -0.4487526705580578;
  directionalLightOne.position.y = 0.6113634376366548;
  directionalLightOne.position.z = 0.6518096254184219;
  directionalLightOne.position.normalize();
  scene.add(directionalLightOne);

  var directionalLightTwo = new THREE.DirectionalLight(0xcdae3e);
  directionalLightTwo.position.x = 0.9335272125194505;
  directionalLightTwo.position.y = 0.3286791567439238;
  directionalLightTwo.position.z = -0.1431675780607048;
  directionalLightTwo.position.normalize();
  scene.add(directionalLightTwo);
}

function init() {
  var world = generateRandomWorld();

  container = document.createElement('div');
  document.body.appendChild(container);

  // Create the camera
  camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000);
  camera.position.x = 200;
  camera.position.y = 500;
  camera.position.z = 200;

  // Fill the scene.
  scene = new THREE.Scene();

  attachGrid(scene, world);
  attachWalls(scene, world);
  attachLighting(scene, world);

  // Put a canvas render in the page.
  renderer = new THREE.CanvasRenderer();
  renderer.setClearColor(0xF2F6F0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Put a FPS stat gauge in the page.
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild(stats.domElement);

  window.addEventListener("keydown", function(e) {
    if (e.keyCode) {
      if (e.keyCode == 37) {
        // Left
        console.log('left');
        camera.position.x -= 100;
      }
      else if (e.keyCode == 38) {
        // Up
        console.log('up');
        camera.position.z -= 100;
      }
      else if (e.keyCode == 39) {
        // Right
        console.log('right');
        camera.position.x += 100;
      }
      else if (e.keyCode == 40) {
        // Down
        console.log('down');
        camera.position.z += 100;
      }
    }
  });

  camera.lookAt(scene.position);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.left = window.innerWidth / - 2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / - 2;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}