//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    WebGLRenderTarget,
    OrthographicCamera,
    RGBAFormat,
    BufferGeometry,
    BufferAttribute,
    RawShaderMaterial,
    TextureLoader,
    CubeTextureLoader,
    NearestFilter,
    RepeatWrapping,
    Vector2,
} from 'three';
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
export const simpleVertexShader = `precision highp float;
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 1.0, 1.0);
}`;
//////////////////////////////////////////////////////////////////////////////////////////////////
const textureFragmentShader = `precision highp float;
uniform sampler2D texture;
uniform vec2 resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  gl_FragColor = vec4(texture2D(texture, uv).rgb, 1.0);
}`;
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
export class Simple {
    constructor({ material }) {
        this.scene = new Scene();
        this.camera = new OrthographicCamera();
        this.geometry = new BufferGeometry();
        const vertices = new Float32Array([
            -1.0, -1.0,
            3.0, -1.0,
            -1.0, 3.0
        ]);
        this.geometry.setAttribute('position', new BufferAttribute(vertices, 2));
        this.triangle = new Mesh(this.geometry, material);
        this.triangle.frustumCulled = false;
        this.scene.add(this.triangle);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
export class SimpleRenderTarget {
    constructor({ material, width, height }) {
        this.target = new WebGLRenderTarget(width, height, {
            format: RGBAFormat,
            stencilBuffer: false,
            depthBuffer: false,
        });
        this.simple = new Simple({ material: material });
    }
    get texture() {
        return this.target.texture;
    }
    render(renderer) {
        renderer.setRenderTarget(this.target);
        renderer.render(this.simple.scene, this.simple.camera);
        renderer.setRenderTarget(null);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
export class SimpleCopy {
    constructor({ texture }) {
        this.resolution = new Vector2();
        this.material = new RawShaderMaterial({
            fragmentShader: textureFragmentShader,
            vertexShader: simpleVertexShader,
            uniforms: {
                texture: { value: texture },
                resolution: { value: this.resolution },
            },
        });
        this.simple = new Simple({ material: this.material });
    }
    get texture() {
        return this.material.uniforms.texture.value;
    }
    set texture(t) {
        this.material.uniforms.texture.value = t;
    }
    render(renderer) {
        renderer.getDrawingBufferSize(this.resolution);
        renderer.render(this.simple.scene, this.simple.camera);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
export class SimpleTexture {
    constructor({ href }) {
        const loader = new TextureLoader();
        const texture = this.texture = loader.load(href);
        texture.minFilter = NearestFilter;
        texture.magFilter = NearestFilter;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
export class JpegCubeMap {
    constructor({ href }) {
        this.texture = new CubeTextureLoader()
            .setPath(href)
            .load([
                'px.jpg',
                'nx.jpg',
                'py.jpg',
                'ny.jpg',
                'pz.jpg',
                'nz.jpg'
            ]);
    }
}
export class PngCubeMap {
    constructor({ href }) {
        this.texture = new CubeTextureLoader()
            .setPath(href)
            .load([
                'px.png',
                'nx.png',
                'py.png',
                'ny.png',
                'pz.png',
                'nz.png'
            ]);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
