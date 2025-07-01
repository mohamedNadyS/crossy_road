import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { mergeGeometries } from 'https://unpkg.com/three@0.160.0/examples/jsm/utils/BufferGeometryUtils.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js?module';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.set(300,-300,300)

const renderer = new THREE.WebGLRenderer();
const dLight = new THREE.DirectionalLight(0xffff00, 0.6);
dLight.position.set(-100,-100,200);
dLight.castShadow = true;
const aLight = new THREE.AmbientLight(0xffffff,0.6);

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );
new OrbitControls(camera,renderer.domElement);
renderer.setAnimationLoop(animate);

const metadata = [
  {
    type: "forest",
    trees:[
      {palce:-17,height:5},
      {palce:-13,height:4},
      {palce:-8,height:6},
      {palce:-1,height:5},
      {palce:4,height:6},
      {palce:10,height:4},
      {palce:13,height:6},
    ],
  },
  {
    type: "car",
    speed: "1",
    direction: false,
    vehicles:[{intialTile:2,color:0xff0000}],
  },
];

function turtle_creating() {
  const unit = 0.8;
  const shellU = unit*1.2;

  const Umat = new THREE.MeshStandardMaterial({color:0xf6d596});
  const Smat = new THREE.MeshStandardMaterial({color:0x19c38c, flatShading : true});
  const parts =[];
  const UnitC = new THREE.BoxGeometry(unit,unit,unit);
  const head = UnitC.clone();
  const neck = new THREE.BoxGeometry(unit*0.5,unit*0.5,unit*0.8);
  neck.translate(0,0,unit);
  parts.push(neck);
  head.translate(0,0,unit+unit*0.7);
  parts.push(head);

  const leg = new THREE.BoxGeometry(unit*0.5,unit*1.4,unit*0.5);
  const FRleg = leg.clone();
  FRleg.translate(0.5,-0.6,0.4);
  const FLleg = leg.clone();
  FLleg.translate(-0.5,-0.6,0.4);
  const BRleg = leg.clone();
  BRleg.translate(0.5,-0.6,-0.4);
  const BLleg = leg.clone();
  BLleg.translate(-0.5,-0.6,-0.4);
  parts.push(FRleg);
  parts.push(FLleg);
  parts.push(BRleg);
  parts.push(BLleg);

  const skinS = mergeGeometries(parts);

  const shellS = new THREE.OctahedronGeometry(unit*1.5,0);
  shellS.translate(0,0,0);
  shellS.scale(1,1,0.8);
  const skin = new THREE.Mesh(skinS,Umat);
  const shell = new THREE.Mesh(shellS,Smat);
  shell.position.z = 0;
  skin.add(shell);

  const eyeS = new THREE.PlaneGeometry(0.17,0.12);
  const eyeMat = new THREE.MeshBasicMaterial({color:0x000000,side:THREE.DoubleSide});
  const Leye = new THREE.Mesh(eyeS,eyeMat);
  const Reye = Leye.clone();
  Leye.position.set(unit*0.30,0.2,unit*2+unit*0.77);
  Reye.position.set(-unit*0.30,0.2,unit*2+unit*0.8);
  Leye.lookAt(camera.position);
  Reye.lookAt(camera.position);
  skin.add(Leye,Reye);
  return skin;
}
const position ={currentrow:0,currenttile:0};
const movements = [];
function MOVE(direction){
  movements.push(direction);
}
function stepC(){
  const direction = movements.shift();
  if (direction === "forward") position.currentrow += 1;
  if (direction === "backward") position.currentrow -= 1;
  if (direction === "left") position.currenttile -= 1;
  if (direction === "right") position.currenttile += 1;
}

window.addEventListener("keydown",(event)=>{
  if (event.key === "ArrowUp"){
    event.preventDefault();
    MOVE("forward");
  } 
    else if(event.key ==="ArrowRight"){
      event.preventDefault;
      MOVE("right");
    }
    else if(event.key ==="ArrowDown"){
      event.preventDefault();
      MOVE("backword");
    }
    else if(event.key ==="ArrowLeft"){
      event.preventDefault();
      MOVE("left");
    }
});


const moveClock = new THREE.Clock(false);

export function animatePlayer() {
  if (!movements.length) return;

  if (!moveClock.running) moveClock.start();

  const stepTime = 0.2;
  const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);

  setPosition(progress);
  setRotation(progress);

  if (progress >= 1) {
    stepCompleted();
    moveClock.stop();
  }
}

function setPosition(progress) {
  const startX = position.currenttile * TileSize;
  const startY = position.currentrow * TileSize;
  let endX = startX;
  let endY = startY;

  if (movements[0] === "left") endX -= TileSize;
  if (movements[0] === "right") endX += TileSize;
  if (movements[0] === "forward") endY += TileSize;
  if (movements[0] === "backward") endY -= TileSize;

  turtle.position.x = THREE.MathUtils.lerp(startX, endX, progress);
  turtle.position.y = THREE.MathUtils.lerp(startY, endY, progress);
  turtle.position.z = Math.sin(progress * Math.PI) * 8;
}

function setRotation(progress) {
  let endRotation = 0;
  if (movements[0] == "forward") endRotation = 0;
  if (movements[0] == "left") endRotation = Math.PI / 2;
  if (movements[0] == "right") endRotation = -Math.PI / 2;
  if (movements[0] == "backward") endRotation = Math.PI;

  turtle.rotation.z = THREE.MathUtils.lerp(turtle.rotation.z,endRotation,progress);
}


function sun_creating(){
  const sunS = new THREE.SphereGeometry(2,32,32);
  const sunMat = new THREE.MeshBasicMaterial({color:0xffe066});
  const sun = new THREE.Mesh(sunS,sunMat);
  sun.position.set(-6,6,-6);
  scene.add(sun);
  const sunLight =new THREE.PointLight(0xfff2a0,1.5,100,2);
  sunLight.position.set(-6,6,-6);
  scene.add(sunLight);
  return sun;
}

const turtle = turtle_creating();
turtle.rotation.y += 0;
const sun = sun_creating();

const Fmap = new THREE.Group();


const maxTile = 20;
const minTile = -20;
const TileRow = maxTile-minTile+1;
const TileSize = 3;


function grasses(rowIndex){
  const grassGroup = new THREE.Group();
  grassGroup.position.y = rowIndex*TileSize;
  const grassS = new THREE.PlaneGeometry(TileRow*TileSize,TileSize);
  const grassMat = new THREE.MeshLambertMaterial( {color: 0xbaf455, side: THREE.DoubleSide} );
  const grass = new THREE.Mesh( grassS, grassMat );
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = -1.25;
  grassGroup.add( grass );
  return grassGroup;
}

function startMap(){
  for (let rowIndex=0;rowIndex>-5;rowIndex--){
    const grass = grasses(rowIndex);
    Fmap.add(grass);
  }
  addRows();
}

function addRows(){
  metadata.forEach((rowData, index)=>{
    const rowIndex =index +1;

    if (rowData.type=="forest"){
      const row = grasses(rowIndex)
      rowData.trees.forEach(({palce,height})=>{
        const sevenTrees = Tree(palce,height);
        row.add(sevenTrees);
      });
      mapLinear.add(row)
    }
    else if(rowData.type=="car"){
      const row = Road(rowIndex);
      rowData.vehicles.forEach((vehicle)=>{
        const car = Car(
          vehicle.intialTile,
          rowData.direction,
          vehicle.color
        );
        row.add(car);
    });
    Fmap.add(row);
  }
  });
}
function Wheel(xposi){
  const wheelG = new THREE.BoxGeometry(0.5,1.8,0.5);
  const wheelMat = new THREE.MeshLambertMaterial({color:0x222222, flatShading:true})
  const wheel = new THREE.Mesh(wheelG,wheelMat);
  wheel.position.x =x;
  wheel.position.z = 1;
  return wheel;
}

function Car(intialTile,direction,color){
  const carGroup = new THREE.Group();
  carGroup.position.x=intialTile*TileSize;
  if (!direction)carGroup.rotation.z = Math.PI;
  const bodyG = new THREE.BoxGeometry(3,1.6,0.7);
  const bodyMat = new THREE.MeshLambertMaterial({color,flatShading:true});
  const body = new THREE.Mesh(bodyG,bodyMat);
  body.position.z = 12;
  carGroup.add(body);
  const cabinG = new THREE.BoxGeometry(2.4,1.3,0.5);
  const cabinMat = new THREE.MeshLambertMaterial({color:0xffffff, flatShading:true});
  const cabin = new THREE.Mesh(cabinG,cabinMat);
  cabin.position.x=-0.3;
  cabin.position.z=13;
  carGroup.add(cabin);
  const frontW = Wheel(1.3);
  const backW = Wheel(-1.3);
  carGroup.add(frontW);
  carGroup.add(backW);
  return carGroup;
}
function Road(rowIndex){
  const roadGroup = new THREE.Group();
  road.position.y = rowIndex*TileSize;
  const roadG = new THREE.PlaneGeometry(TileRow*TileSize,TileSize);
  const roadMat = new THREE.MeshLambertMaterial({color:0x454a59});
  const road = new THREE.Mesh(roadG,roadMat);
  roadGroup.add(road);

  return roadGroup;
}

function Tree(palce,height){
  const tree = new THREE.Group();
  tree.position.x = palce*TileSize;
  const trunkG = new THREE.BoxGeometry(1,2,1);
  const trunkMat = new THREE.MeshLambertMaterial({color:0x743c16,flatShading:true});
  const trunk = new THREE.Mesh(trunkG,trunkMat);
  const leavesG = new THREE.BoxGeometry(1,height,2);
  const leavesMat = new THREE.MeshLambertMaterial({color:0x606c38,flatShading:true});
  const leaves = new THREE.Mesh(leavesG,leavesMat);
  leaves.position.y=height/2 +2;
  tree.add(trunk);
  tree.add(leaves);
  return tree;

}
scene.add(camera);
scene.add(dLight);
scene.add(aLight);
scene.add(turtle);
scene.add( Fmap );
scene.background =new THREE.Color(0xa0d8f0);
camera.position.set(5,2,10);
camera.lookAt(0,1,1);
function animate(){
  animatePlayer();
  renderer.render( scene, camera );
}

