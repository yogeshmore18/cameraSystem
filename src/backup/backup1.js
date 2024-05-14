import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { Colors } from "./Colors";

const style = {
   width: "100vw",
   height: "100vh",
};

const STL8 = () => {
   const [object, setObject] = useState(null); // stores file to render
   const [button, setButton] = useState(false); // toggle plotting
   const [markers, setMarkers] = useState([]); // stores markers
   const [currentColor, setCurrentColor] = useState(null); // stores the current color

   // handle uploaded file
   const handleObjectChange = (event) => {
      const file = event.target.files[0];

      if (file) {
         const objectURL = URL.createObjectURL(file); // creates URL of the uploaded file
         setObject(objectURL);
      }
   };

   // button to toggle plotting
   const buttonLabel = button ? "Stop Plotting" : "Start Plotting";
   const handleButtonClick = () => {
      setButton(!button);
   };
   const PlotButton = () => {
      return <button onClick={handleButtonClick}>{buttonLabel}</button>;
   };

   // mark on objects
   const Marker = ({ position, color }) => {
      return (
         <mesh position={position}>
            {/* plotted point is a sphere */}
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshBasicMaterial color={color} />
         </mesh>
      );
   };

   // handles color of point to be plotted
   const handleDropdownColor = (dropdownColor) => {
      setCurrentColor(dropdownColor);
   };

   // 3D model renderer
   const Model = ({ url, onMarkerClick }) => {
      const geom = useLoader(STLLoader, url);
      const ref = useRef();
      const { camera } = useThree();

      useEffect(() => {
         camera.lookAt(ref.current.position);
      }, [camera]);

      // normalise the co-ordinates
      const handleCanvasClick = (event) => {
         const { offsetX, offsetY } = event.nativeEvent;
         const x = (offsetX / window.innerWidth) * 2 - 1;
         const y = -(offsetY / window.innerHeight) * 2 + 1;

         const raycaster = new THREE.Raycaster();
         raycaster.setFromCamera({ x, y }, camera);
         const intersects = raycaster.intersectObject(ref.current, true);

         if (intersects.length > 0 && button && currentColor) {
            const markerPosition = intersects[0].point;
            setMarkers((prevMarkers) => [
               ...prevMarkers,
               { position: markerPosition, color: currentColor },
            ]);
            onMarkerClick(markerPosition);
         }
      };

      return (
         <>
            <mesh
               ref={ref}
               scale={0.09}
               rotation-x={-1.5}
               rotation-z={1.5}
               castShadow
               receiveShadow
               dispose={null}
               onClick={handleCanvasClick}
            >
               <primitive object={geom} attach="geometry" />
               <meshStandardMaterial color="beige" />
            </mesh>
            {markers.map((marker, index) => (
               <Marker
                  key={index}
                  position={marker.position}
                  color={marker.color}
               />
            ))}
         </>
      );
   };

   // dropdown
   const Dropdown = () => {
      return (
         <form>
            <label>Select Color</label>
            <select
               onChange={(e) => {
                  handleDropdownColor(e.target.value);
               }}
               value={currentColor}
            >
               <option value="">--Select Color--</option>
               {Colors.map((x) => (
                  <option key={x} value={x}>
                     {x}
                  </option>
               ))}
            </select>
         </form>
      );
   };

   // logging positions of marker
   const handleMarkerClick = (position) => {
      console.log("Co-ordinates:", position);
   };

   useEffect(() => {
      console.log("Object: ", object);
      console.log("Button: ", button);
      console.log("Markers: ", markers);
      console.log("CurrentColor: ", currentColor);
   });

   return (
      <>
      <div style={{ textAlign: 'center' }}>
         <input type="file" accept=".stl" onChange={handleObjectChange}
          style={{
            padding: '10px',
            marginBottom: '20px',
            border: '2px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9',
            cursor: 'pointer'
          }} />
          </div>
         {object && (
            <>
               <PlotButton />
               {button && <Dropdown />}
               <Canvas
                  style={style}
                  shadowMap
                  camera={{ position: [0, 70, 100], fov: 15 }}
               >
                  <ambientLight intensity={0.5} />
                 
                  <Suspense fallback={null}>
                     <Model url={object} onMarkerClick={handleMarkerClick} />
                  </Suspense>
                  <Environment preset="night"/>
                  <OrbitControls />
               </Canvas>
            </>
         )}
      </>
   );
};

export default STL8;
