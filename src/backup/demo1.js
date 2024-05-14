import { StlViewer } from 'react-stl-viewer';
import { useState } from "react";

function App() {
  const [stlFile, setStlFile] = useState(null);
  const [markings, setMarkings] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setStlFile(URL.createObjectURL(file));
    }
  };

  const handleDoubleClick = (event) => {
    // Get the STL viewer element
    const viewer = document.getElementById('stlViewer');

    // If viewer element exists, proceed with calculations
    if (viewer) {
      // Get the position of the STL viewer relative to the viewport
      const rect = viewer.getBoundingClientRect();

      // Calculate the coordinates of the double click relative to the viewer
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Add the marking to the list of markings
      setMarkings([...markings, { x, y }]);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <input type="file" onChange={handleFileChange} accept=".stl"
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
      {stlFile && (
        <div style={{ width: '100%', height: '600px' }}>
          <StlViewer
            id="stlViewer" // Add id to the StlViewer component
            url={stlFile}
            style={{ top: 0, left: 0, width: '100vw', height: '100vh' }}
            modelColor="#B92C2C"
            backgroundColor="#EAEAEA"
            rotate={true}
            orbitControls={true}
            enableZoom={true}
            onDoubleClick={handleDoubleClick} // Add onDoubleClick event handler
          />
          {/* Render markings */}
          {markings.map((marking, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: marking.x,
                top: marking.y,
                width: '20px',
                height: '20px',
                backgroundColor: 'blue',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none', // Prevent markings from blocking interaction with STL viewer
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
