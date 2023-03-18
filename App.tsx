import React from 'react';
import { View} from 'react-native';
import Expo from 'expo';
import THREE from 'three';
import ExpoTHREE from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import {StatusBar} from "expo-status-bar";

const ts = Date.now();


const App = () => {
    const onContextCreate = async (webGlRenderingContext: ExpoWebGLRenderingContext) => {

        const aspect = webGlRenderingContext.drawingBufferWidth / webGlRenderingContext.drawingBufferHeight;
        // three.js implementation.
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            aspect,
            0.1,
            1000
        );
       /* webGlRenderingContext.canvas = {
            width: webGlRenderingContext.drawingBufferWidth,
            height: webGlRenderingContext.drawingBufferHeight,
        };*/

        // set camera position away from cube
        camera.position.z = 5;

        const renderer = new ExpoTHREE.Renderer({ gl: webGlRenderingContext });
        // set size of buffer to be equal to drawing buffer width
        renderer.setSize(webGlRenderingContext.drawingBufferWidth, webGlRenderingContext.drawingBufferHeight);

        // create cube
        // define geometry
        const pixelDensity = 2;
        const geometry = new THREE.BoxGeometry(1/pixelDensity, 1/pixelDensity, 1/pixelDensity);
        const material = new THREE.MeshBasicMaterial({
            color: "#B97375",
        });

        const matrixOfCubes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[][] = [];
        const mostLeftX = -2.5, highestY = -3 - pixelDensity * aspect, boxesInARow = 6 * pixelDensity,
            boxesInACol = Math.ceil(7 * pixelDensity/aspect)
        const row_inumerator = [...Array(boxesInARow).keys()]
        const col_inumerator = [...Array(boxesInACol).keys()]

        console.log(aspect)

        col_inumerator.forEach((_,y)=>{
            const rowOfCubes = row_inumerator.map((__,x)=>{
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(mostLeftX + x/pixelDensity, highestY + y/pixelDensity,0);
                return cube;
            })
            matrixOfCubes.push(rowOfCubes);
        })

        matrixOfCubes.forEach((rowOfCubes)=>{
            rowOfCubes.forEach((cube) => {scene.add(cube)})
        })



        // create render function
        const render = () => {
            requestAnimationFrame(render);
            matrixOfCubes.forEach((row) => {
                row.forEach((cube)=>{
                    const scaler =  Math.abs(Math.cos(Date.now() / 2000));
                    cube.scale.x = scaler
                    cube.scale.y = scaler
                    cube.scale.z = scaler
                })
            })
            // create rotate functionality
            // rotate around x axis
            //cube.rotation.x += 0.01;

            // rotate around y axis
            //cube.rotation.y += 0.01;

            renderer.render(scene, camera);
            webGlRenderingContext.endFrameEXP();
        };
        // call render
        render();
    };


    return (
        <View>
            <GLView
                onContextCreate={onContextCreate}
                // set height and width of GLView
                style={{ width: '100%', height: '100%', backgroundColor:'red' }}
            />
            <StatusBar hidden />
        </View>
    );
};

export default App;
