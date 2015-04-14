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
renderer.shadowMapSoft = true;

renderer.shadowCameraNear = 3;
renderer.shadowCameraFar = camera.far;
renderer.shadowCameraFov = 50;

renderer.shadowMapBias = 0.0039;
renderer.shadowMapDarkness = 0.5;
renderer.shadowMapWidth = 1024;
renderer.shadowMapHeight = 1024;
renderer.setClearColor( 0xffffff );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// Put in the floor
var floor = new THREE.Mesh(
  new THREE.CubeGeometry(world.dimensions, world.dimensions, 1),
  new THREE.MeshLambertMaterial({color: 0x4F4F4F})
);
floor.receiveShadow = true;
floor.position.x = world.dimensions/2;
floor.position.y = world.dimensions/2;
scene.add(floor);


var voxelData = Voxel.generate([0,0,0], [world.dimensions, world.dimensions, 2], function(x,y,z) {
  if (z == 1) {
    return world.matrix[y][x]
  }
})

var voxelMesh = new VoxelMesh(voxelData, Voxel.meshers.greedy, THREE.Vector3(1, 1, 1), THREE);
var material = new THREE.MeshLambertMaterial({
  color: 0x808080,
  overdraw: 0.5
});
var wireMesh = voxelMesh.createSurfaceMesh(material);
wireMesh.castShadow = true;
wireMesh.receiveShadow = true;
scene.add(wireMesh);

camera.position.z = 30;
camera.position.x = 25;
camera.position.y = 25;

var ambientLight = new THREE.AmbientLight(0x202020);
scene.add(ambientLight);

var directionalLightOne = new THREE.DirectionalLight(0xFFFFFF);
directionalLightOne.position.x = 1;
directionalLightOne.position.y = 1;
directionalLightOne.position.z = 10;
directionalLightOne.position.normalize();
directionalLightOne.castShadow = true;
scene.add(directionalLightOne);

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