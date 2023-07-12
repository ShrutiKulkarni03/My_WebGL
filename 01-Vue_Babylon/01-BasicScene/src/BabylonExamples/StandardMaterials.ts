import {
    Scene, 
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    StandardMaterial,
    Texture,
} from "@babylonjs/core";

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

        const camera = new FreeCamera("camera", new Vector3(0,1,-5), this.scene);
        camera.attachControl();
        camera.speed = 0.25;

        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), this.scene);
        hemiLight.intensity = 1.0;

        const ground = MeshBuilder.CreateGround("ground", {width:10, height:10}, this.scene);

        const ball = MeshBuilder.CreateSphere("ball", {diameter:1}, this.scene);
        ball.position = new Vector3(0,1,0);

        ground.material = this.CreateGroundMaterial();
        ball.material = this.CreateBallMaterial();



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

    CreateBallMaterial():StandardMaterial{

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

    }
}
