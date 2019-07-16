var geometry7 = new Three.CylinderGeometry( 5, 5,- tower.length*5, 32 );
var material = new Three.MeshBasicMaterial( {color: 'green'} );
var cylinder = new Three.Mesh( geometry7, material );
cylinder.position.copy(intersect.point).add(intersect.face.normal);
cylinder.position.divideScalar( 5 ).floor().multiplyScalar( 5 ).addScalar(2.5);
scene.add( cylinder );
objects.push(cylinder)


import React from 'react';
import *as Three from 'three';
// import Detector from 'detector-js';
// var Detector = require('detector-js')(Three)
var OrbitControls = require('three-orbit-controls')(Three);


class App extends React.Component {
    constructor(props) {
        super(props);
    }

    setScene() {
        var mouse;
        var raycaster;
        var isShiftDown = false;
        var objects = [];
        var plane;
        let testArray = [['red', 'yellow', 'blue'], ['blue', 'orange ', 'yellow', 'green']];

        var scene = new Three.Scene();
        var camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        var renderer = new Three.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement); // ???

        scene.background = new Three.Color(0xf0f0f0);
        // var geometry = new Three.BoxGeometry(10, 10, 10);
        // var material = new Three.MeshLambertMaterial({
        //     color: 0xFF0000,
        //     transparent: true,
        //     opacity: 1,
        //     vertexColors: Three.FaceColors,
        //     morphTargets: true
        // });
        // var cube = new Three.Mesh(geometry, material);
        // scene.add(cube)
        var gridHelper = new Three.GridHelper( 1000, 100 );
        scene.add( gridHelper );

        // roll-over helpers
        var rollOverGeo = new Three.BoxBufferGeometry( 10, 10, 10 );
        var rollOverMaterial = new Three.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
        var rollOverMesh = new Three.Mesh( rollOverGeo, rollOverMaterial );
        scene.add( rollOverMesh );


        // var cubeGeo = new Three.BoxBufferGeometry( 10, 10, 10 );
        // var cubeMaterial = new Three.MeshBasicMaterial( { color: 0xfeb74c } );

        // raycaster

        raycaster = new Three.Raycaster();
        mouse = new Three.Vector2();
        var geometry = new Three.PlaneBufferGeometry( 1000, 1000 );
        geometry.rotateX( - Math.PI / 2 );
        plane = new Three.Mesh( geometry, new Three.MeshBasicMaterial( { visible: false } ) );
        scene.add( plane );
        objects.push( plane );

        //const testArray = ['red', 'yellow', 'blue'];
        var wireframeMaterial = new Three.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );

        // var array = testArray.map((element, i)=> {
        //     var geometry3 = new Three.BoxGeometry(10, 10, 10);
        //     var wireframe3 = new Three.Mesh( geometry3, wireframeMaterial );
        //
        //     var material3 = new Three.MeshLambertMaterial({
        //         color: element,
        //     });
        //
        //     var cube3 = new Three.Mesh(geometry3, material3);
        //     cube3.add(wireframe3)
        //     cube3.position.y = i * 10;
        //
        //     return scene.add(cube3)
        // })

        camera.position.z = 100;
        camera.position.y = 100;

        // Lights
        var sunlight = new Three.PointLight(0xffffff);
        sunlight.position.set(0, 50, 0);
        sunlight.castShadow = true;
        scene.add(sunlight);
        var corner1 = new Three.PointLight(0xffffff);
        corner1.position.set(50, 20, 20);
        corner1.castShadow = true;
        scene.add(corner1);
        var corner2 = new Three.PointLight(0xffffff);
        corner2.position.set(-50, 20, -20);
        corner2.castShadow = true;
        scene.add(corner2);
        var hemiLight = new Three.HemisphereLight( 0x0000ff, 0xFFFFFF, 0.6 );
        scene.add(hemiLight);
        // window.addEventListener('resize', this.onWindowResize, false)

        // onWindowResize() {
        //   camera.aspect = window.innerWidth / window.innerHeight;
				// camera.updateProjectionMatrix();
				// renderer.setSize( window.innerWidth, window.innerHeight );
        // }

        var controls = new OrbitControls(camera);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.minDistance = 20;
        controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI / 2;
        // controls.staticMoving = true;
        // controls.addEventListener( 'change', render );


  				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  				document.addEventListener( 'keydown', onDocumentKeyDown, false );
  				document.addEventListener( 'keyup', onDocumentKeyUp, false );


        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            render();

            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;
        }
        // function createTower(intersect, tower) {
        //     return testArray.map((element, i)=> {
        //         var geometry3 = new Three.BoxGeometry(10, 10, 10);
        //         var wireframe3 = new Three.Mesh( geometry3, wireframeMaterial );
        //
        //         var cubeMaterial = new Three.MeshStandardMaterial({
        //             color: 0xFF0fff,
        //             roughness: 0.9,
        //         });
        //
        //         var cube3 = new Three.Mesh(geometry3, cubeMaterial);
        //         cube3.add(wireframe3);
        //         cube3.position.copy(intersect.point).add(intersect.face.normal);
        //         cube3.position.divideScalar(10).floor().multiplyScalar(10).addScalar(5);
        //         scene.add(cube3);
        //         tower.push(cube3);
        //     });
        // }


        function onDocumentMouseMove( event ) {
            event.preventDefault();
            mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
            raycaster.setFromCamera( mouse, camera );
            var intersects = raycaster.intersectObjects( objects );
            if ( intersects.length > 0 ) {
                var intersect = intersects[ 0 ];
                rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
                rollOverMesh.position.divideScalar( 10 ).floor().multiplyScalar( 10 ).addScalar( 5 );
            }
            render();
        }
        function onDocumentMouseDown(event) {
            event.preventDefault();
            mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
            raycaster.setFromCamera( mouse, camera );
            var intersects = raycaster.intersectObjects(objects);
            if( intersects.length > 0) {
                var intersect = intersects[0];
                      // delete cube
                if ( isShiftDown ) {
                    if ( intersect.object !== plane ) {
                        scene.remove( intersect.object );
                        objects.splice( objects.indexOf( intersect.object ), 1 );
                    }
                      // create cube
                } else {
                    var a = 0;
                    testArray[a].forEach((element, i)=> {
                        var geometry3 = new Three.BoxGeometry(10, 10, 10);

                        var material3 = new Three.MeshLambertMaterial({
                            color: element,
                        });
                        var voxel = new Three.Mesh(geometry3, material3);
                        voxel.position.copy(intersect.point).add(intersect.face.normal);
                        voxel.position.y = i * 10;
                        voxel.position.divideScalar( 10 ).floor().multiplyScalar( 10 ).addScalar(5);
                        scene.add(voxel);
                        // group.add(voxel)
                        objects.push( voxel );
                    });

                }
                render();
            }
        }
        function onDocumentKeyDown( event ) {
            event.preventDefault();
            switch( event.keyCode ) {
                case 16: isShiftDown = true; break;
                default:
            }
        }
        function onDocumentKeyUp( event ) {
            switch ( event.keyCode ) {
                case 16: isShiftDown = false; break;
                default :
            }
        }

        function render() {
            renderer.render(scene, camera);
        }
        animate();
        console.log('animation running');
    }


    render() {
        return (
          <div>
            {this.setScene()}

        </div>
        );
    }
}

export default App;
