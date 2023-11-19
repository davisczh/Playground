
import * as THREE from 'three';
export var onBeforeRender = function() {

    var v = new THREE.Vector3();

    return function onBeforeRender( renderer, scene, camera, geometry, material, group ) {

        // this is one way. adapt to your use case.
        if ( v.subVectors( camera.position, this.position ).dot( this.userData.normal ) < 0 ) {

            geometry.setDrawRange( 0, 0 ); // it is too late to set visible = false, so do this, instead

        }

    };

}();

export var onAfterRender = function( renderer, scene, camera, geometry, material, group ) {

    geometry.setDrawRange( 0, Infinity );

};


