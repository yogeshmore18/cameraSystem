import React, { useRef, startTransition } from 'react';
import { Canvas, useThree, useLoader } from 'react-three-fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

function STLViewer({ url }) {
  const groupRef = useRef();
  const { scene } = useLoader(STLLoader, url);

  const handleDoubleClick = (event) => {
    // Wrap the entire content of handleDoubleClick with startTransition
    startTransition(() => {
      // Here, you can implement logic to handle double-click events
      // and determine the part of the object clicked
      console.log('Double-clicked on the object');
    });
  };

  return (
    <Canvas>
      <scene ref={groupRef} onDoubleClick={handleDoubleClick}>
        <primitive object={scene} />
      </scene>
    </Canvas>
  );
}

export default STLViewer;
import { StlViewer } from 'react-stl-viewer';