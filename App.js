import React from 'react';
import * as Three from 'three';
var OrbitControls = require('three-orbit-controls')(Three);

const styles = {
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    button: {
        boxSizing: 'border-box',
        padding: 10,
        borderRadius: 4,
        textAlign: 'center',
        border: '1px solid black',
        margin: 5,
        transition: '0.2s',
        cursor: 'pointer'
    },
    selected: {
        color: 'white',
        backgroundColor: 'black'
    }
};

// Create render container
var scene = new Three.Scene();
scene.background = new Three.Color(0xf0f0f0);

// Define camera & camera starting position
var camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 200;
camera.position.y = 200;

// Define renderer
var renderer = new Three.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allTowers: [['red', 'yellow', 'blue'], ['blue', 'orange', 'yellow', 'green']],
            currentTower: ['red', 'yellow', 'blue'],
        };
        // this.setScene = this.setScene.bind(this);
        this.setTower = this.setTower.bind(this);
    }

    //
    // componentDidMount() {
    //     fetch('/api/data')
    //   .then(resp => {
    //       return resp.json();
    //   }
    //     )
    //   .then(towerData => {
    //       this.setState({allTowers: towerData});
    //   });
    // }

    setTower(i) {
        this.setState({
            currentTower: this.state.allTowers[i],
            currentIndex: i
        });
    }


    setScene() {
        var mouse;
        var raycaster;
        var isShiftDown = false;
        var objects = [];
        var plane;


        // Visualizes floor in a defined grid pattern
        var gridHelper = new Three.GridHelper(1000, 100);
        scene.add(gridHelper);

        // Defines what the onHover displays as the mouse moves accross the grid
        // var rollOverGeoHeight = (this.state.selectedTower.length * 10) + 20;
        var rollOverGeo = new Three.BoxBufferGeometry(10, 10, 10);
        var rollOverMaterial = new Three.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
        var rollOverMesh = new Three.Mesh(rollOverGeo, rollOverMaterial);
        scene.add(rollOverMesh);


        // Define raycaster, the function that determines where the mouse is and how it interacts with the objects it hovers over
        raycaster = new Three.Raycaster();
        mouse = new Three.Vector2();
        var geometry = new Three.PlaneBufferGeometry(1000, 1000);
        geometry.rotateX(-Math.PI / 2);
        plane = new Three.Mesh(geometry, new Three.MeshBasicMaterial({visible: false}));
        scene.add(plane);
        objects.push(plane);

        // Lights
        var sunlight = new Three.PointLight(0x404040, 0.5);
        sunlight.position.set(0, 50, 0);
        sunlight.castShadow = true;
        scene.add(sunlight);

        var corner1 = new Three.PointLight(0x404040, 0.5);
        corner1.position.set(50, 20, 20);
        corner1.castShadow = true;
        scene.add(corner1);

        var corner2 = new Three.PointLight(0x404040, 0.5);
        corner2.position.set(-50, 20, -20);
        corner2.castShadow = true;
        scene.add(corner2);

        var hemiLight = new Three.HemisphereLight(0xffffbb, 0x080820, 0.6);
        scene.add(hemiLight);

        // Camera control definition, movement, and properties
        var controls = new OrbitControls(camera);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.minDistance = 75;
        controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI / 2;
        // controls.staticMoving = true;
        // controls.addEventListener( 'change', render );

        // EventListeners for user input
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', (e) => onDocumentMouseDown(e, this.state.currentTower), false);
        document.addEventListener('keydown', onDocumentKeyDown, false);
        document.addEventListener('keyup', onDocumentKeyUp, false);

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            // render();
        }

        // Defines display of skeleton as mouse moves around environment
        function onDocumentMouseMove(event) {
            event.preventDefault();
            mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(objects);
            if (intersects.length > 0) {
                var intersect = intersects[0];
                rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
                rollOverMesh.position.y = 5;
                rollOverMesh.position.divideScalar(5).floor().multiplyScalar(5);
            }
            render();
        }

        // Places currently selected tower upon mouseclick
        function onDocumentMouseDown(event, tower) {
            event.preventDefault();
            mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(objects);
            if (intersects.length > 0) {
                var intersect = intersects[0];
                // delete cube
                if (isShiftDown) {
                    if (intersect.object !== plane) {
                        scene.remove(intersect.object);
                        objects.splice(objects.indexOf(intersect.object), 1);
                    }
                } else {
                    var towaaa = ['red', 'yellow', 'blue','red', 'yellow', 'blue','red', 'yellow', 'blue','red', 'yellow', 'blue','red', 'yellow', 'blue'];



                    towaaa.map((element, k) => {
                        var geometry3 = new Three.BoxGeometry(10, 5, 10);

                        var material3 = new Three.MeshStandardMaterial({
                            color: element,
                            roughness: 0.91,
                            metalness: 0.28,

                        });
                        var voxel = new Three.Mesh(geometry3, material3);
                        voxel.position.copy(intersect.point).add(intersect.face.normal);
                        var yVal;
                        if (k === 0) {
                            yVal = 2.5;
                        } else {
                            yVal = 2.5 + (k * 5);
                        }
                        voxel.position.divideScalar(5).floor().multiplyScalar(5).setY(yVal);
                        scene.add(voxel);
                        objects.push(voxel);
                    });
                    var geometry7 = new Three.CylinderGeometry( 2, 2, 2.5 + ((towaaa.length-1) * 5), 32 );
                    var material = new Three.MeshBasicMaterial( {color: towaaa[towaaa.length-1]} );
                    var cylinder = new Three.Mesh( geometry7, material );
                    cylinder.position.copy(intersect.point).add(intersect.face.normal);

                    var yVal =15;

                    cylinder.position.divideScalar(5).floor().multiplyScalar(5).setY(yVal);
                    scene.add( cylinder );
                    objects.push(cylinder)
                }
                render();
            }
        }

        // EventListener function for deleting pieces
        function onDocumentKeyDown(event) {
            event.preventDefault();
            switch (event.keyCode) {
                case 16:
                    isShiftDown = true;
                    break;
                default:
            }
        }

        // EventListener for placing towers
        function onDocumentKeyUp(event) {
            switch (event.keyCode) {
                case 16:
                    isShiftDown = false;
                    break;
                default:
            }
        }

        // Render function for environment upon change
        function render() {
            renderer.render(scene, camera);
        }
        animate();
        console.log('animation running');
    }

    render() {
        return (<div>
           {this.setScene()}
           <div style={styles.buttonContainer}>
             {this.state.allTowers.map((tower, x) => (
               <span style={Object.assign({}, styles.button, this.state.currentIndex === x && styles.selected)} onClick={() => this.setTower(x)}>{tower.name}</span>)
             )}
           </div>
       </div>);
    }
}


export default App;
