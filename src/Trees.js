import * as THREE from 'three'

export default class Trees
{
    constructor()
    {
        this.group = new THREE.Group()

        // PLANE
        const geometry = new THREE.SphereBufferGeometry(0.1, 128, 128);
        const sphere = new THREE.Mesh(geometry,
            new THREE.MeshStandardMaterial
            ({
                color: 0x00FF00,
            }));
        sphere.receiveShadow = true;
        sphere.castShadow = true;
        sphere.rotation.x = - Math.PI / 4;
        sphere.position.z = 0.3;
        sphere.position.x= 0.8;
        sphere.position.y= 1.7;
        this.group.add(sphere);

        const count = geometry.attributes.position.count;
        
        const position_clone = JSON.parse(JSON.stringify(geometry.attributes.position.array));
        const normals_clone = JSON.parse(JSON.stringify(geometry.attributes.normal.array));
        const damping = 0.2;

        // ANIMATE
        // function animate()
        // {
            const now = Date.now() / 200;

            // iterate all vertices
            for (let i = 0; i < count; i++)
            {
                // indices
                const ix = i * 3
                const iy = i * 3 + 1
                const iz = i * 3 + 2

                // use uvs to calculate wave
                const uX = geometry.attributes.uv.getX(i) * Math.PI * 16
                const uY = geometry.attributes.uv.getY(i) * Math.PI * 16

                // calculate current vertex wave height
                const xangle = (uX + now)
                const xsin = Math.sin(xangle) * damping
                const yangle = (uY + now)
                const ycos = Math.cos(yangle) * damping

                // set new position
                geometry.attributes.position.setX(i, position_clone[ix] + normals_clone[ix] * (xsin + ycos))
                geometry.attributes.position.setY(i, position_clone[iy] + normals_clone[iy] * (xsin + ycos))
                geometry.attributes.position.setZ(i, position_clone[iz] + normals_clone[iz] * (xsin + ycos))
            }
            geometry.computeVertexNormals();
            geometry.attributes.position.needsUpdate = true;

        //     requestAnimationFrame(animate);
        // }
        // animate();

        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry( 0.05, 0.05, 1.3, 32 ),
            new THREE.MeshPhongMaterial( {color: 0x582900,
            // wireframe: true
            } )
        )
        trunk.position.y = 1
        trunk.position.x = 0.45
        trunk.position.z = 0.3
        trunk.rotation.z = -0.4
        this.group.add(trunk)
    }
}