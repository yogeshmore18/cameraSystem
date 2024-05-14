
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { saveAs } from 'file-saver';

const STLViewer = () => {
   const [object, setObject] = useState(null);
   const [button, setButton] = useState(false);
   const [markers, setMarkers] = useState([]); // stores markers
   const [selectedArea, setSelectedArea] = useState(null); // stores selected area vertices

   // handle uploaded file
   const handleObjectChange = (event) => {
      const file = event.target.files[0];

      if (file) {
         const objectURL = URL.createObjectURL(file);
         setObject(objectURL);
      }
   };

   // button to toggle marking
   const buttonLabel = button ? "Stop Marking points" : "Start Marking points";
   const handleButtonClick = () => {
      setButton(!button);
   };
   const PlotButton = () => {
      return <button onClick={handleButtonClick}>{buttonLabel}</button>;
   };

   // mark on objects
   const Marker = ({ position }) => {
      return ( 
         <mesh position={position}>
            {/* marker point is a sphere */}
            <sphereGeometry args={[0.3, 50, 39]} />
            <meshBasicMaterial color={0xff0000} />
         </mesh>
      );
   };

   // 3D model renderer
   const ShowSTL = ({ url, onMarkerClick, selectedArea }) => {
      const geom = useLoader(STLLoader, url);
      const ref = useRef();
      const { camera } = useThree();
      const [highlightedArea, setHighlightedArea] = useState(null);

      useEffect(() => {
         camera.lookAt(ref.current.position);
      }, [camera]);

      useEffect(() => {
         if (selectedArea && selectedArea.length === 3) {
            const triangle = new THREE.Triangle(selectedArea[0], selectedArea[1], selectedArea[2]);
            const geometry = new THREE.BufferGeometry().setFromPoints(triangle.getPoints(new THREE.Vector3()));
            setHighlightedArea(geometry);
         }
      }, [selectedArea]);

      const handleCanvasClick = (event) => {
         if (markers.length >= 4 || !button) return; // Allow marking only 4 points
         
         const { offsetX, offsetY } = event.nativeEvent;
         const x = (offsetX / window.innerWidth) * 2 - 1;
         const y = -(offsetY / window.innerHeight) * 2 + 1;

         const raycaster = new THREE.Raycaster();
         raycaster.setFromCamera({ x, y }, camera);
         const intersects = raycaster.intersectObject(ref.current, true);

         if (intersects.length > 0) {
            const markerPosition = intersects[0].point;
            setMarkers((prevMarkers) => [
               ...prevMarkers,
               { position: markerPosition },
            ]);
            onMarkerClick(markerPosition);
         }

         // When 4 points are marked, calculate the area
         if (markers.length === 3) {
            const vertices = markers.map(marker => marker.position);
            const area = calculateArea(vertices);
            setSelectedArea(area);
         }
      };

      const calculateArea = (vertices) => {
         // Calculate area using cross product of vectors
         const AB = new THREE.Vector3().subVectors(vertices[1], vertices[0]);
         const AC = new THREE.Vector3().subVectors(vertices[2], vertices[0]);
         const cross = new THREE.Vector3().crossVectors(AB, AC);
         const area = 0.5 * cross.length();
         return area;
      };

      return (
         <>
            <mesh
               ref={ref}
               scale={0.09}
               rotation-x={-1.5}
               rotation-z={1.5}
               dispose={null}
               onClick={handleCanvasClick}
            >
               <primitive object={geom} attach="geometry" />
               <meshStandardMaterial color="beige" />
            </mesh>
            {markers.map((marker, index) => (
               <Marker key={index} position={marker.position} />
            ))}
            {/* Highlighted area */}
            {highlightedArea && (
               <mesh geometry={highlightedArea}>
                  <meshBasicMaterial color="yellow" transparent opacity={0.5} />
               </mesh>
            )}
         </>
      );
   };

   const handleMarkerClick = (position) => {
      console.log("Co-ordinates:", position);
   };

   useEffect(() => {
      console.log("Object: ", object);
      console.log("Button: ", button);
      console.log("Markers: ", markers);
   });

   return (
      <>
         <div style={{ textAlign: 'center' }}>
            <input
               type="file"
               accept=".stl"
               onChange={handleObjectChange}
               style={{
                  padding: '10px',
                  marginBottom: '20px',
                  border: '2px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                  cursor: 'pointer'
               }}
            />
         </div>
         <div style={{ textAlign: 'center' }} >
            {object && (
               <>
                  <PlotButton />
                  <p>Selected area: {selectedArea}</p>
                  <Canvas
                     style={{
                        width: "100vw",
                        height: "100vh",

                     }}
                     shadowMap
                     camera={{ position: [0, 70, 100], fov: 15 }}
                  >
                     <ShowSTL url={object} onMarkerClick={handleMarkerClick} selectedArea={selectedArea} />
                     <Environment preset="night" />
                     <OrbitControls />
                  </Canvas>
               </>
            )}
         </div>
      </>
   );
};

export default STLViewer;