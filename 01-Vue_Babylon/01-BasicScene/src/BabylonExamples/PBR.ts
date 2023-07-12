import {
    Scene, 
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    CubeTexture,
    PBRMaterial,
    Texture,
    Color3,
    GlowLayer,
} from "@babylonjs/core";

export class PBR {

    scene: Scene;
    engine: Engine;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();

        this.CreateEnvironment();

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
        hemiLight.intensity = 0.0;

        const envTex = CubeTexture.CreateFromPrefilteredData("./textures/skybox/environmentMap.env", scene);
        scene.environmentTexture = envTex;
        scene.createDefaultSkybox(envTex, true);
        //scene.environmentIntensity = 0.25;

        return scene;
    }

    CreateEnvironment():void {
        const ground = MeshBuilder.CreateGround("ground", {width:10, height:10}, this.scene);

        const ball = MeshBuilder.CreateSphere("ball", {diameter:1}, this.scene);
        ball.position = new Vector3(0,1,0);

        ground.material = this.CreateFloor();
        ball.material = this.CreateSphere();
    }

    CreateFloor():PBRMaterial {

        const pbr = new PBRMaterial("pbr", this.scene);

        pbr.albedoTexture = new Texture("./textures/PBR/floor/asphalt_02_diff_1k.jpg", this.scene);

        pbr.bumpTexture = new Texture("./textures/PBR/floor/asphalt_02_nor_gl_1k.jpg", this.scene);
        pbr.invertNormalMapX = true;
        pbr.invertNormalMapY = true;

        pbr.useAmbientOcclusionFromMetallicTextureRed = true;
        pbr.useRoughnessFromMetallicTextureGreen = true;
        pbr.useMetallnessFromMetallicTextureBlue = true; 
        pbr.metallicTexture = new Texture("./textures/PBR/floor/asphalt_02_arm_1k.jpg", this.scene);
        
        return pbr;
    }

    CreateSphere():PBRMaterial {

        const pbr = new PBRMaterial("pbr", this.scene);

        pbr.environmentIntensity = 0.5;

        pbr.albedoTexture = new Texture("./textures/PBR/sphere/Sci-fi_Wall_011_basecolor.jpg", this.scene);

        pbr.bumpTexture = new Texture("./textures/PBR/sphere/Sci-fi_Wall_011_normal.jpg", this.scene);
        pbr.invertNormalMapX = true;
        pbr.invertNormalMapY = true;

        pbr.useAmbientOcclusionFromMetallicTextureRed = true;
        pbr.useRoughnessFromMetallicTextureGreen = true;
        pbr.useMetallnessFromMetallicTextureBlue = true; 
        pbr.metallicTexture = new Texture("./textures/PBR/sphere/Sci-fi_Wall_011_arm.jpg", this.scene);
        
        pbr.emissiveTexture = new Texture("./textures/PBR/sphere/Sci-fi_Wall_011_emissive.jpg", this.scene);
        pbr.emissiveColor = new Color3(1.0, 1.0, 1.0);
        pbr.emissiveIntensity = 3.0;

        const glowLayer = new GlowLayer("glow", this.scene);
        glowLayer.intensity = 0.5;
        
        return pbr;
    }


   
}
