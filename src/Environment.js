import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Trees from './Trees.js'
export default class Environment
{
    constructor()
    {
        this.scene = new THREE.Scene()
        this.world = new THREE.Group()
        this.scene.add(this.world)

        this.initialise()
        console.log(sizes)
    }


    initialise()
    {

        const sizes = {}
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        const camera = new THREE.PerspectiveCamera(100, sizes.width/ sizes.height, 0.1, 100)
        camera.position.set(1, 1, 3)
        this.scene.add(camera)

        this.light()
        this.planet()
        this.road(-8.5, 8.5)
        this.house()
        this.warehouse()
        this.trees()
        this.rocks(0.4, 0.75, 0.5, 0.1)
        this.rocks(0.3, 0.9, 0.3, 0.05)
        this.rocks(0.8, 0.3, 0.5, 0.05)


        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true} )
        renderer.setSize(sizes.width, sizes.height)
        renderer.setClearColor( 0xadd8e6, 0);
        document.body.append(renderer.domElement)

        const cameraControls = new OrbitControls(camera, renderer.domElement)
        cameraControls.zoomSpeed = 0.3
        cameraControls.enableDamping = true
        cameraControls.dampingFactor = 0.01

        window.addEventListener('resize', () =>
        {
            // Update size
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
        
            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
        
            // Update renderer
            renderer.setSize(sizes.width, sizes.height)
        })

        const tick = () =>
        {
            const time = Date.now()
        
            cameraControls.update()
        
            renderer.render(this.scene, camera)
        
            // il réappelle tick a chaque frame
            window.requestAnimationFrame(tick)
        }
        tick()
    }

    trees()
    {
        this.trees = new Trees()
        this.world.add(this.trees.group)
    }

    light()
    {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        // DIRECTIONAL LIGHT
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
        dirLight.position.x += 20
        dirLight.position.y += 20
        dirLight.position.z += 20
        dirLight.castShadow = true
        dirLight.shadow.mapSize.width = 4096;
        dirLight.shadow.mapSize.height = 4096;
        const d = 10;
        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;
        dirLight.position.z = -25;

        let target = new THREE.Object3D();
        target.position.z = -30;
        dirLight.target = target;
        dirLight.target.updateMatrixWorld();

        dirLight.shadow.camera.lookAt(0, 0, -30);
        this.scene.add(dirLight);
    }

    planet()
    {
        const planet = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 16 ),
            new THREE.MeshPhongMaterial({ color: 0xC2E221})
        )
        this.world.add(planet)
    }

    road(y, x)
    {
        const pathGroup = new THREE.Group()
        this.world.add(pathGroup)
        pathGroup.rotateY(y)
        pathGroup.rotateX(x)

        class CustomSinCurve extends THREE.Curve
        {

            constructor( scale = 1 )
            {
                super();
                this.scale = scale;
            }
            getPoint( t, optionalTarget = new THREE.Vector3() )
            {
                const tx = t * 6;
                const ty = t * 6;
                const tz = 1;
                return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
            }
        }

        const textureLoader = new THREE.TextureLoader()

        const wallColorTexture = textureLoader.load('texture/wall/wall_color.jpg')
        const wallAmbientOcclusionTexture = textureLoader.load('texture/wall/wall_amb_occ.jpg')
        const wallHeightTexture = textureLoader.load('texture/wall/wall_height.png')
        const wallNormalTexture = textureLoader.load('texture/wall/wall_normal.jpg')
        const wallRoughnessTexture = textureLoader.load('texture/wall/wall_rough.jpg')
        wallColorTexture.repeat.x = 0.2
        wallColorTexture.repeat.y = 15
        wallColorTexture.wrapS = THREE.RepeatWrapping
        wallColorTexture.wrapT = THREE.RepeatWrapping
        wallColorTexture.rotation = Math.PI * 1

        const material = new THREE.MeshStandardMaterial(
            {
                // side: THREE.DoubleSide,
                map : wallColorTexture,
                color: 0xc6c6c6,
                normalMap: wallNormalTexture,
                displacementMap: wallHeightTexture,
                displacementScale: 0.01,
                // roughnessMap: wallRoughnessTexture
            }
        )

        const path = new CustomSinCurve(0.01);
        const way = new THREE.Mesh(
            new THREE.TubeGeometry( path, 1, 1, 100, false ),
            material
        )
        way.position.z =-0.01
        pathGroup.add( way );

        const sideWalk = new THREE.Mesh(
            new THREE.TorusGeometry( 1, 0.010, 16, 100 ),
            new THREE.MeshPhongMaterial( { color: 0xC6c6c6, } )
        )
        sideWalk.rotation.y = Math.PI * 0.50
        sideWalk.rotateX(11.79)
        pathGroup.add(sideWalk)

        const sideWalk2 = new THREE.Mesh(
            new THREE.TorusGeometry( 1, 0.010, 16, 100 ),
            new THREE.MeshPhongMaterial( { color: 0xC6c6c6, } )
        )
        sideWalk2.rotation.y = Math.PI * -0.50
        sideWalk2.rotateX(-11.78)
        sideWalk2.position.y = 0.065
        sideWalk2.position.x = 0.065
        pathGroup.add(sideWalk2)
    }

    house()
    {
        const houseGroup = new THREE.Group()
        this.world.add(houseGroup)
        houseGroup.position.x = 0.1
        houseGroup.rotation.z = -0.1
        houseGroup.rotation.x = 0.3
        houseGroup.position.z = 0.3
        houseGroup.position.y = 1

        const houseKaio = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 16, 0, 6.29, 0, 2 ),
            new THREE.MeshPhongMaterial({ color: 0xD3A01D,
            // wireframe: true
        })
        )
        houseGroup.add(houseKaio)

        const houseColor = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 16, 0, 6.29, 0, 1.1 ),
            new THREE.MeshPhongMaterial({ color: 0xffffff,
            // wireframe: true
            })
        )
        houseColor.position.y = 0.001
        houseGroup.add(houseColor)

        const houseColor2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 16, 0, 6.29, 0, 0.9 ),
            new THREE.MeshPhongMaterial({ color: 0xD3A01D,
            // wireframe: true
            })
        )
        houseColor2.position.y = 0.002
        houseGroup.add(houseColor2)

        const houseColor3 = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 16, 0, 6.29, 0, 0.5 ),
            new THREE.MeshPhongMaterial({ color: 0xffffff,
            // wireframe: true
            })
        )
        houseColor3.position.y = 0.003
        houseGroup.add(houseColor3)

        const houseAntenaBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.01, 40),
            new THREE.MeshPhongMaterial({ color: 0xc6c6c6,
                // wireframe: true
                })
        )
        houseAntenaBase.position.y = 0.2
        houseGroup.add(houseAntenaBase)

        const houseAntena = new THREE.Mesh(
            new THREE.CylinderGeometry(0.005, 0.005, 0.2, 40),
            new THREE.MeshPhongMaterial({ color: 0xc6c6c6,
                // wireframe: true
                })
        )
        houseAntena.position.y = 0.3
        houseGroup.add(houseAntena)

        const houseAntenaTop = new THREE.Mesh(
            new THREE.SphereGeometry(0.01, 32, 16),
            new THREE.MeshPhongMaterial({ color: 0xc6c6c6,
                wireframe: true
                })
        )
        houseAntenaTop.position.y = 0.4
        houseGroup.add(houseAntenaTop)
    }

    warehouse()
    {
        const warehouseGroup = new THREE.Group()
        this.world.add(warehouseGroup)
        warehouseGroup.position.y = 0.75
        warehouseGroup.position.x = 0.7
        warehouseGroup.position.z = 0.3
        warehouseGroup.rotation.x = 1.9
        warehouseGroup.rotation.y = -0.7
        // warehouseGroup.rotation.z = -0.7
        
        const warehouseElement = new THREE.Mesh(
            new THREE.CylinderGeometry( 0.2, 0.2, 0.5, 30, 30, true),
            new THREE.MeshStandardMaterial({
                color: 0xD5A325, 
                // wireframe : true,
                side: THREE.DoubleSide,
            }),
        )

        const warehouseElement2 = new THREE.Mesh(
            new THREE.CylinderGeometry( 0.15, 0.15, 0.5, 30, 30, true),
            new THREE.MeshBasicMaterial({
                color: 0xD5A325, 
                // wireframe : true,
                side: THREE.DoubleSide,
            }),
        )

        const warehouseElement3 = new THREE.Mesh(
            new THREE.RingGeometry( 0.2, 0.15, 30, 1, 0, 6.5 ),
            new THREE.MeshBasicMaterial( {
                // wireframe : true,
                color: 0xBAC797,
                side: THREE.DoubleSide
            } )
        )
        warehouseElement3.rotation.x = Math.PI * 0.5
        warehouseElement3.position.y = Math.PI * 0.08

        const warehouseElement4 = new THREE.Mesh(
            new THREE.CircleGeometry( 0.15, 32 ),
            new THREE.MeshBasicMaterial( {
            // color: 0xff00ff,
            color: 0xAFB10C,
            // wireframe : true,
            } )
        )
        warehouseElement4.rotation.x = Math.PI * -0.5
        warehouseElement4.position.y = Math.PI * 0.07

        const warehouseDoorGroup = new THREE.Group()
        warehouseGroup.add(warehouseDoorGroup)

        const warehouseDoorElement = new THREE.Mesh(
            new THREE.CylinderGeometry( 0.1, 0., 0.5, 4, 1, true),
            new THREE.MeshBasicMaterial( {
                // color: 0xff00ff,
                color: 0xBAC797,
                // wireframe: true,
                side: THREE.DoubleSide,
            })
        )
        warehouseDoorElement.rotation.y = Math.PI * -0.25
        warehouseDoorElement.position.z = 0.1

        const warehouseDoorElement2 = new THREE.Mesh(
            new THREE.CylinderGeometry( 0.12, 0.12, 0.5, 4, 1, true),
            new THREE.MeshBasicMaterial( {
                // color: 0xff00ff,
                color: 0xBAC797,
                // wireframe: true,
                side: THREE.DoubleSide,
            })
        )
        warehouseDoorElement2.rotation.y = Math.PI * -0.25
        warehouseDoorElement2.position.z = 0.1

        const warehouseDoorElement3 = new THREE.Mesh(
            new THREE.PlaneGeometry( 0.13,0.13),
            new THREE.MeshBasicMaterial( {
                color: 0xffffff,
                // wireframe: true,
                side: THREE.DoubleSide,
            })
        )
        warehouseDoorElement3.rotation.x = Math.PI * -0.50
        warehouseDoorElement3.position.y = 0.24
        warehouseDoorElement3.position.z = 0.1

        const warehouseDoorElement4 = new THREE.Mesh(
            // new THREE.RingGeometry( 5, 5, 4, 1, 0, 6.5 ),
            new THREE.RingGeometry( 0.12, 0.10,4,1,0,),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide
            })
        )
        warehouseDoorElement4.rotation.x = Math.PI * -0.50
        warehouseDoorElement4.rotation.z = Math.PI * -0.25
        warehouseDoorElement4.position.y = 0.25
        warehouseDoorElement4.position.z = 0.1

        
        warehouseGroup.add( warehouseElement )
        warehouseGroup.add( warehouseElement2)
        warehouseGroup.add( warehouseElement3)
        warehouseGroup.add( warehouseElement4)
        warehouseDoorGroup.add( warehouseDoorElement)
        warehouseDoorGroup.add( warehouseDoorElement2)
        warehouseDoorGroup.add( warehouseDoorElement3)
        warehouseDoorGroup.add( warehouseDoorElement4)
    }

    rocks(y, x, z, size)
    {
        const rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(size,0),
            new THREE.MeshPhongMaterial({
                color:0xc6c6c6,
                // wireframe: true
            })
        )
        rock.position. y = y
        rock.position. x = x
        rock.position. z = z
        this.world.add(rock)
    }
}