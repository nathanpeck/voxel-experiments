var THREE     = require('three');
var Voxel     = require('voxel');
var VoxelMesh = require('./src/dependencies/voxel-mesh.js');
var ROT       = require('rot-js');

function generateRandomWorld() {
  var world = {
    dimensions: 50,
    matrix: []
  };

  ROT.RNG.setSeed(new Date().getTime());
  var map = new ROT.Map.Digger(world.dimensions, world.dimensions, {
    dugPercentage: .7
  });
  map.create();
  rooms = map.getRooms();

  var row, col;

  for (row = 0; row < world.dimensions; row++) {
    world.matrix[row] = [];
    for (column = 0; column < world.dimensions; column++) {
      world.matrix[row][column] = 1;
    }
  }

  rooms.forEach(function (room) {
    for (row = room.getTop(); row <= room.getBottom(); row++) {
      for (col = room.getLeft(); col <= room.getRight(); col++) {
        world.matrix[row][col] = 0;
      }
    }

    room.getDoors(function (col, row) {
      world.matrix[row][col] = 0;
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
        world.matrix[row][col] = 0;
      }
    }
  });

  return world;
}

var world = generateRandomWorld();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.shadowMapEnabled = true;
//renderer.shadowMapCullFace = THREE.CullFaceBack;
renderer.setClearColor( 0xffffff );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// Put in the floor
var floor = new THREE.Mesh(
  new THREE.CubeGeometry(world.dimensions, world.dimensions, 1),
  new THREE.MeshLambertMaterial({color: 0x4F4F4F})
);
floor.receiveShadow = true;
floor.castShadow = true;
floor.position.x = world.dimensions/2;
floor.position.y = world.dimensions/2;
scene.add(floor);


var voxelData = Voxel.generate([0,0,0], [world.dimensions, world.dimensions, 2], function(x,y,z) {
  if (z == 0 || z == 1) {
    return world.matrix[y][x]
  }
  else {
    return 0;
  }
})

var voxelMesh = new VoxelMesh(voxelData, Voxel.meshers.greedy, THREE.Vector3(1, 1, 1), THREE);
var material = new THREE.MeshLambertMaterial({
  color: 0x808080
});
var walls = voxelMesh.createSurfaceMesh(material);
walls.castShadow = true;
walls.receiveShadow = true;
scene.add(walls);

camera.position.z = 30;
camera.position.x = 25;
camera.position.y = 25;

var ambientLight = new THREE.AmbientLight(0x202020);
scene.add(ambientLight);

var light = new THREE.DirectionalLight(0xFFFFFF);
light.position.set(50, 50, 400);
light.target.position.set(0, 50, 0);
light.castShadow = true;
light.shadowMapWidth = 10048;
light.shadowMapHeight = 10048;
light.shadowBias = 0.0001;
light.shadowMapCullFace = THREE.CullFaceBack;
light.shadowDarkness = 0.3;
//light.shadowCameraVisible = true; // only for debugging

light.shadowMapType = THREE.PCFShadowMap;
light.shadowMapSoft = true;

light.shadowCameraNear = 0;
light.shadowCameraFar = 600;
light.shadowCameraFov = 100;
scene.add(light);

var render = function () {
  requestAnimationFrame( render );
  renderer.render(scene, camera);
};

render();


window.addEventListener("keydown", function(e) {
  if (e.keyCode) {
    if (e.keyCode == 37) {
      camera.position.x -= 1;
    }
    else if (e.keyCode == 38) {
      camera.position.y += 1;
    }
    else if (e.keyCode == 39) {
      camera.position.x += 1;
    }
    else if (e.keyCode == 40) {
      camera.position.y -= 1;
    }
  }
});