import { useEffect, useRef, useState } from "react";
import "./Colors.css"
import "./STLViewer.css"
import * as THREE from "three";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Line, OrbitControls, Text } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { Box, Button, MenuItem, Select } from "@mui/material";
import UndoIcon from '@mui/icons-material/Undo';
import SaveMakrkersAndIssue from "./SaveMarkersAndIssue";
import InputFilesUpload from "./FilesUpload";
import SelectedAreasList from "./Edit_Delete_Co-ordinates";
import Fab from '@mui/material/Fab';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ColorPicker from "./ColorPicker";
import SideNav from "./SideNav";
import Swal from 'sweetalert2'
import Tooltip from '@mui/material/Tooltip';
// import debounce from 'lodash/debounce';
import RestartAltSharpIcon from '@mui/icons-material/RestartAltSharp';

const STLViewer = () => {

   // Function to get data from local storage
   const getLocalStorage = () => {
      let data = localStorage.getItem("data");
      if (data) {
         return JSON.parse(data);
      } else {
         return null;
      }
   };

// // Retrieve data from local storage
const retrievedData = getLocalStorage();

// if(retrievedData)
// {
//    console.log("=>", retrievedData.area);
// }

   const [object, setObject] = useState(retrievedData?retrievedData.object:null);
   const [button, setButton] = useState(false);
   const [markers, setMarkers] = useState([]); // stores markers
   const [selectedIssue, setselectedIssue] = useState(''); //store the issue 
   const [filename, setfilename] = useState('')
   const [area, setArea] = useState([]);
   const [issue, setIssue] = useState('');
   const [markersRadius, setMarkersRadius] = useState(2);
   const [modelColor, setModelColor] = useState(retrievedData?retrievedData.modelColor:"beige");
   const orbitControls = useRef();

   useEffect(()=>{
      const data={
         object,
         area,
         issue,
         modelColor,
      }
      
      localStorage.setItem("data",JSON.stringify(data))
    },[object,area,issue,modelColor])

   // Effect to clear the local storage on page refresh
   useEffect(() => {
      const handleRefresh = () => {
         localStorage.clear();
      };

      // Add an event listener for the beforeunload event
      window.addEventListener('beforeunload', handleRefresh);

   }, []);
  
   // handle uploaded file
   const handleObjectChange = (file) => {
      // const file = event.target.files[0];
      if (file) {
         const objectURL = URL.createObjectURL(file);
         setfilename(file.name)
         setObject(objectURL);
         setArea([])
         setMarkers([])
         setIssue('')
         setselectedIssue('')
         setMarkersRadius(2)
      }
   };

   const PlotButton = () => {
      return (
         <div >
            <Button variant="outlined" onClick={handleButtonClick} style={{ marginLeft: 20, marginRight: 15 }}>{buttonLabel}</Button>
            <Tooltip title="UNDO" arrow><Button variant="outlined" startIcon={<UndoIcon />} onClick={handleUndo} style={{ marginRight: 15 }}></Button></Tooltip>
            <IssueDropDown />
            <Button variant="contained" color="warning" style={{ marginRight: '10px' }} onClick={handleArea}>Save Selected Area</Button>
            <SaveMakrkersAndIssue filename={filename} area={area} issue={issue} />
            {/* <SelectColor/> */}
         </div>
      )
   };

   const IssueDropDown = () => {
      return (
         <>
            <Select value={selectedIssue} onChange={handleissue} displayEmpty
               inputProps={{ 'aria-label': 'Select an issue' }} style={{ marginRight: 15 }}>
               <MenuItem value="" disabled>
                  {selectedIssue === '' ? 'Select an issue' : ''}
               </MenuItem>
               <MenuItem value="Paint is too thick">Paint is too thick</MenuItem >
               <MenuItem value="Paint is too low">Paint is too low</MenuItem >
               <MenuItem value="Paint drops on selected part">Paint drops on selected part</MenuItem >
            </Select>
         </>
      )
   }

   // button to toggle marking
   const buttonLabel = button ? "Stop Selecting area" : "Start Selecting area";
   const handleButtonClick = () => {
      setButton(!button);
   };

   // handle marker removal (undo)
   const handleUndo = () => {
      if (markers.length > 0) {
         const updatedMarkers = [...markers];
         updatedMarkers.pop(); // remove the last marker
         setMarkers(updatedMarkers);
      }
   };

   const handleissue = (event) => {
      setselectedIssue(event.target.value)
   }

   const handleArea = (event) => {
      if (markers.length >= 4 && selectedIssue !== '') {
         setArea((prevarea) => [...prevarea, markers]); //saving selected area
         setIssue((previssue) => [...previssue, selectedIssue]);
         setMarkers([]);
         setselectedIssue('');

         // alert("Area saved successfully")
         Swal.fire({
            text: "Area saved successfully.",
            timer: 3000,
            position: 'bottom',
            showConfirmButton: false,
            background: '#B5EAAA'
         });
      }
      else if (selectedIssue === '') {
         // alert("select issue");
         Swal.fire({
            text: "Please select the Issue before saving Area",
            showConfirmButton: false,
            position: 'bottom',
            background: '#FBF6D9'
         });
      }

      else if (markers.length < 4) {
         Swal.fire({
            text: "Area is not  properly selected [Use 4 points to select area !]",
            showConfirmButton: false,
            position: 'bottom',
            background: '#FBF6D9'
         });
         // alert("Area is not  properly selected [Use 4 points to select area !]")
      }
   }

   const deleteArea = (index) => {
      setArea((prevAreas) => prevAreas.filter((_, i) => i !== index));
      setIssue((prevIssue) => prevIssue.filter((_, i) => i !== index));
   };

   const edit = (index, newIssue) => {
      console.log("edit=>", newIssue);
      const updatedIssue = [...issue]

      updatedIssue[index] = newIssue
      setIssue(updatedIssue)
   }

   const increaseMarkerRadius = () => {
      setMarkersRadius(markersRadius + 0.5)

   }

   const decreaseMarkerRadius = () => {
      if (markersRadius !== 0)
         setMarkersRadius(markersRadius - 0.5)
   }

   const handleModelColor = (color) => {
      setModelColor(color)
   }

   //reset function for reseting the MODEL position
   const resetControll = () => {
      if (orbitControls.current) {
         orbitControls.current.reset();
      }
   }

   // 3D model renderer
   const ShowSTL = ({ url }) => {
      const geom = useLoader(STLLoader, url);
      const ref = useRef();
      const { camera } = useThree();

      useEffect(() => {
         const boundingBox = new THREE.Box3();
         boundingBox.setFromObject(ref.current);
         const center = boundingBox.getCenter(new THREE.Vector3());
         // // Move the model to the center
         // const position = ref.current.position.clone()
         ref.current.position.sub(center);
         // console.log("center =>>>>>>>>" +center.x, center.y, center.z );
         // console.log("point of origin =>>>>>>>>" +position.x, position.y, position.z );
         // console.log(" updatedposition point of origin =>>>>>>>>" +updatedposition.x, updatedposition.y, updatedposition.z );
         camera.lookAt(ref.current.position);

      }, [camera]);

      // useEffect(() => {
      //    camera.lookAt(ref.current.position);
      // }, [camera]);

      let lastClickTime = 0;
      const debounceTime = 300;

      const handleCanvasClick = (event) => {
         const currentTime = new Date().getTime();
         if (currentTime - lastClickTime < debounceTime) {
            return;
         }
         lastClickTime = currentTime;

         if (!ref.current) {
            // Ensure ref.current is not null before proceeding
            return;
         }

         if (markers.length >= 4 && button) {
            // alert("You can only plot 4 points.")
            Swal.fire({
               text: "You can only plot 4 points.",
               showConfirmButton: false,
               position: 'bottom',
               background: '#FBF6D9'
            });
            return;
         }

         const { offsetX, offsetY, target } = event.nativeEvent;
         const { clientWidth, clientHeight } = target;
         const x = (offsetX / clientWidth) * 2 - 1; //2 is scaling factor NDC // -1 left edge of canvas ,1 right edge
         const y = -(offsetY / clientHeight) * 2 + 1;   // -1 bottom edge of canvas ,1 top edge   

         const raycaster = new THREE.Raycaster();
         // update the picking ray with the camera and pointer position
         raycaster.setFromCamera({ x, y }, camera);

         // calculate objects intersecting the picking ray
         const intersects = raycaster.intersectObject(ref.current, true);

         if (intersects.length > 0 && button) {
            const intersection = intersects[0].point;
            const markerPosition = ref.current.worldToLocal(intersection)
            // console.log("Co-ordinates=============>>",markerPosition);
            setMarkers((prevMarkers) => [
               ...prevMarkers,
               { position: markerPosition },
            ]);
         }
      };

      // mark on objects
      const Marker = ({ position }) => {
         return (
            <mesh position={position}>
               {/* maker point is a sphere */}
               <sphereGeometry args={[markersRadius, 50, 50]} />
               <meshBasicMaterial color={0xff0000} />
            </mesh>
         );
      };

      function createAreaGeometry(markerPositions) {
         const geometry = new THREE.BufferGeometry();
         const vertices = [];

         // Iterate over each marker position to create vertices
         markerPositions.forEach(marker => {
            vertices.push(marker.x, marker.y, marker.z);
         });

         const indices = [
            0, 1, 3,
            1, 2, 3,
         ];
         const verticesArray = new Float32Array(vertices);
         // console.log(verticesArray);
         geometry.setIndex(indices);
         geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));
         geometry.computeVertexNormals();

         return geometry;
      }

      function getAreaColor(issue) {
         // console.log(issue);
         const colorMap = {
            "Paint is too thick": 0xff0000,
            "Paint is too low": 0xFFA500,
            "Paint drops on selected part": 0x800080,
         };
         return colorMap[issue]
      }

      return (
         <>
            <mesh
               ref={ref}
               scale={[0.05, 0.05, 0.05]}
               rotation-x={-1.5}
               rotation-z={1.3}
               onClick={handleCanvasClick}
            >
               <primitive object={geom} attach="geometry" />
               <meshStandardMaterial color={modelColor} />
               {/* Displaying markers on mesh */}
               {markers.map((marker, index) => (
                  <Marker key={index} position={marker.position} />
               ))}
               {/* Connecting the Selected co-ordinates  */}
               {markers.length >= 2 && (
                  <group>
                     {markers.map((marker, index) => {
                        if (index < markers.length - 1) {
                           const startPoint = marker.position;
                           const endPoint = markers[index + 1].position;
                           return (
                              <Line
                                 key={index}
                                 points={[startPoint, endPoint]}
                                 lineWidth={1}
                                 color={0xff0000} // Specify the color of the line
                              />
                           );
                        } else if (index === markers.length - 1) {
                           const startPoint = marker.position;
                           const endPoint = markers[0].position;
                           return (
                              <Line
                                 key={index}
                                 points={[startPoint, endPoint]}
                                 lineWidth={1}
                                 color={0xff0000} // Specify the color of the line
                              />
                           );
                        }
                        return null;
                     })}
                  </group>
               )}

               {area.map((area, areaIndex) => (
                  <group key={areaIndex}>
                     {area.map((markers, index) => (
                        <Marker key={index} position={markers.position} />
                     ))}
                     {/* Connecting the selected co-ordinate */}
                     {area.length >= 2 && (
                        <group>
                           {area.map((marker, index) => {
                              if (index < area.length - 1) {
                                 const startPoint = marker.position;
                                 const endPoint = area[index + 1].position;
                                 return (
                                    <Line
                                       key={index}
                                       points={[startPoint, endPoint]}
                                       lineWidth={1}
                                       color={0xff0000}
                                    />
                                 );
                              }
                              else if (index === area.length - 1) {
                                 const startPoint = marker.position;
                                 const endPoint = area[0].position;
                                 return (
                                    <Line
                                       key={index}
                                       points={[startPoint, endPoint]}
                                       lineWidth={1}
                                       color={0xff0000}
                                    />
                                 );
                              }
                              return null;
                           })}
                           {/* Creating and adding custom geometry for the area */}
                           <mesh>
                              <bufferGeometry
                                 attach="geometry"
                                 {...createAreaGeometry(area.map(marker => marker.position))}
                              />
                              <meshBasicMaterial
                                 attach="material"
                                 color={getAreaColor(issue[areaIndex])}
                                 transparent
                                 opacity={0.2} // Adjust opacity as needed
                                 side={THREE.DoubleSide} // Ensure both sides of the polygon are visible
                              />
                           </mesh>
                        </group>
                     )}

                     <Text
                        position={area[0].position}
                        fontSize={10}
                        color="black"
                        textAlign="center"
                        letterSpacing={-0.05}
                        lineHeight={1.4}
                        outlineWidth={3}
                        outlineColor="white"
                        depthOffset={-50} // Depth offset to prevent z-fighting
                        // onUpdate={(self) => {
                        //    // Calculate direction to the camera
                        //    const cameraDirection = new THREE.Vector3();
                        //    self.getWorldPosition(cameraDirection);
                        //    cameraDirection.sub(camera.position).normalize();

                        //    // Set the rotation to face the camera
                        //    self.lookAt(self.position.clone().add(cameraDirection));
                        // }}
                     >
                        {`Area ${areaIndex + 1}`}
                     </Text>
                  </group>
               ))}
            </mesh>
         </>
      );
   };

   useEffect(() => {
      // console.log("Object: ", object);
      // console.log("Button: ", button);
      // console.log("Markers: ", markers);
      // console.log("report: ", selectedIssue);
      // console.log("area ==>", area);
      // console.log("Issue ==>", issue);
   });
   return (
      <>
         <Box sx={{ display: 'flex' }}>
            <SideNav />
            <div className="STLViewer-container">
               <div className="first-div">
                  <div style={{ textAlign: 'center', width: '100px', height: '700px', margin: '10px' }}>
                     <InputFilesUpload onChange={handleObjectChange} />
                  </div>
                  <div style={{ width: '100%', height: '100%' }}>
                     <div style={{ textAlign: 'center', marginBottom: '20px', marginLeft: '10px' }} ><PlotButton />
                     </div>
                     <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Canvas
                           style={{
                              position: "relative",
                              width: "97%",
                              height: '80%',
                              border: "1px solid black",
                              backgroundColor: "#EAEAE5",
                              margin: "10px"
                           }}
                           camera={{ position: [20, 50, 100], fov: 35 }}   //fov-field of view ,determmines how wide camera vision is
                        >
                           {/* Ambient light with low intensity to simulate night lighting */}
                           <ambientLight intensity={0.1} color="#ffffff" />

                           {/* Hemispherical light to simulate uniform lighting from all directions */}
                           <hemisphereLight intensity={0.5} skyColor="#ffffff" groundColor="#000000" />

                           {object && <ShowSTL url={object} />}
                           {/* <Environment preset="night" /> */}
                           <OrbitControls ref={orbitControls} />
                        </Canvas>
                        <Tooltip title="Reset view" arrow><Button onClick={resetControll} style={{ position: 'absolute', top: '10px', left: '20px' }}>
                           <RestartAltSharpIcon />
                        </Button>
                        </Tooltip>
                     </div>
                  </div>
               </div>
               <div className="second-div">
                  <div className="markerSizeButton">
                     <h4 style={{ marginRight: '5px' }}>Pointer size:</h4>
                     <Fab size="small" style={{ margin: '5px' }} onClick={decreaseMarkerRadius} aria-label="increase">
                        <RemoveIcon style={{ color: 'red' }} />
                     </Fab>
                     <Fab size="small" onClick={increaseMarkerRadius} aria-label="decrease">
                        <AddIcon style={{ color: 'green' }} />
                     </Fab>
                  </div>
                  <div className="selectedArea">
                     <h4 className="selectedAreaHeading">Selected Area </h4>
                     <SelectedAreasList areas={area} issue={issue} onDelete={deleteArea} onEdit={edit} />
                  </div>
                  <div className="colorPicker">
                     <ColorPicker onColorChange={handleModelColor} />
                  </div>
               </div>
            </div>
         </Box>
      </>
   );
};

export default STLViewer;