import React from "react";

import * as THREE from "three";

const PolygonMesh = ({ markers }) => {
    const shape = new THREE.Shape();
    shape.moveTo(markers[0].position.x, markers[0].position.y);
    for (let i = 1; i < markers.length; i++) {
        shape.lineTo(markers[i].position.x, markers[i].position.y);
    }
    shape.lineTo(markers[0].position.x, markers[0].position.y);

    const extrudeSettings = { depth: 14.5, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });

    return <mesh geometry={geometry} material={material} />;
};

export default PolygonMesh;
 {/* Create a polygon mesh to fill the area enclosed by markers */}
            {/* {markers.length >= 3 && <PolygonMesh markers={markers} />} */}