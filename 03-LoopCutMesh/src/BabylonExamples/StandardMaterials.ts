import {
    Scene, 
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    StandardMaterial,
    Texture,
    PhysicsImpostor,
    Color3,
    Mesh,
    CSG,
} from "@babylonjs/core";

import cannon from "cannon";

export class StandardMaterials{

    scene: Scene;
    engine: Engine;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        });
    }

    CreateScene():Scene {

        const scene = new Scene(this.engine);

        window.CANNON = cannon;
        scene.enablePhysics();

        const camera = new FreeCamera("camera", new Vector3(0,1,-5), this.scene);
        camera.attachControl();
        camera.speed = 0.25;

        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), this.scene);
        hemiLight.intensity = 1.0;

        const ball = MeshBuilder.CreateSphere("ball", {diameter:1}, this.scene);
        ball.position = new Vector3(0,1,0);
        ball.isPickable = true;
        //ball.material = this.CreateBallMaterial();

        const ground = MeshBuilder.CreateGround("ground", {width:10, height:10}, this.scene);
        ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.PlaneImpostor, {mass: 0, restitution: 0.9}, scene);
        ground.isPickable = false;
        ground.material = this.CreateGroundMaterial();
        
        scene.onPointerDown = function(evt, pickresult){
            if(pickresult.hit) {
                console.log("inside onPointDown");
                SliceMesh(pickresult.pickedMesh, pickresult.pickedPoint, camera.rotation, scene);
            }
        }

        return scene;
    }

    CreateGroundMaterial():StandardMaterial{

        const groundMat = new StandardMaterial("groundMat", this.scene);

        const uvScale = 5;
        const texArray: Texture[] = [];

        //diffuse
        const diffuseTex = new Texture("./textures/floor/cobblestone_05_diff_1k.jpg", this.scene);
        groundMat.diffuseTexture = diffuseTex;
        texArray.push(diffuseTex);

        //normal
        const normalTex = new Texture("./textures/floor/cobblestone_05_nor_gl_1k.jpg", this.scene);
        groundMat.bumpTexture = normalTex;
        groundMat.invertNormalMapX = true;
        groundMat.invertNormalMapY = true;
        texArray.push(normalTex);

        //ao
        const aoTex = new Texture("./textures/floor/cobblestone_05_ao_1k.jpg", this.scene);
        groundMat.ambientTexture = aoTex;
        texArray.push(aoTex);

        //specular
        const specularTex = new Texture("./textures/floor/cobblestone_05_spec_1k.jpg", this.scene);
        groundMat.specularTexture = specularTex;
        texArray.push(specularTex);

        texArray.forEach((tex)=>{
            tex.uScale = uvScale;
            tex.vScale = uvScale;
        });

        return groundMat;


    }

    /*CreateBallMaterial():StandardMaterial{

        const ballMat = new StandardMaterial("ballMat", this.scene);

        const uvScale = 2;
        const texArray: Texture[] = [];

        //diffuse
        const diffuseTex = new Texture("./textures/sphere/metal_plate_diff_1k.jpg", this.scene);
        ballMat.diffuseTexture = diffuseTex;
        texArray.push(diffuseTex);

        //normal
        const normalTex = new Texture("./textures/sphere/metal_plate_nor_gl_1k.jpg", this.scene);
        ballMat.bumpTexture = normalTex;
        ballMat.invertNormalMapX = true;
        ballMat.invertNormalMapY = true;
        texArray.push(normalTex);

        //ao
        const aoTex = new Texture("./textures/sphere/metal_plate_ao_1k.jpg", this.scene);
        ballMat.ambientTexture = aoTex;
        texArray.push(aoTex);

        //specular
        const specularTex = new Texture("./textures/sphere/metal_plate_spec_1k.jpg", this.scene);
        ballMat.specularTexture = specularTex;
        ballMat.specularPower = 3.0;
        texArray.push(specularTex);

        texArray.forEach((tex)=>{
            tex.uScale = uvScale;
            tex.vScale = uvScale;
        });

        return ballMat;

    }*/
}

function SliceMesh(mesh:any, slicePoint:any, sliceRotation:any, scn:any): void {

    const boxSlicerSize = 100;
    const boxSlicer = Mesh.CreateBox("boxSlicer", boxSlicerSize, scn);
    boxSlicer.rotation = sliceRotation;
    boxSlicer.position = new Vector3(0.5 * boxSlicerSize + slicePoint.x, slicePoint.y, 0.5 * boxSlicerSize + slicePoint.z);

    const meshCSG = CSG.FromMesh(mesh);
    const slicerCSG = CSG.FromMesh(boxSlicer);
    
    const meshSliceSub = meshCSG.subtract(slicerCSG).toMesh(mesh.name + "_slice_left");
    meshSliceSub.physicsImpostor = new PhysicsImpostor(meshSliceSub, PhysicsImpostor.BoxImpostor, {mass: 10, restitution: 0.5}, scn);
    
    const meshSliceInt = meshCSG.intersect(slicerCSG).toMesh(mesh.name + "_slice_right");
    meshSliceInt.physicsImpostor = new PhysicsImpostor(meshSliceInt, PhysicsImpostor.BoxImpostor, {mass: 10, restitution: 0.5}, scn);
    
    mesh.dispose();
    boxSlicer.dispose();

}
