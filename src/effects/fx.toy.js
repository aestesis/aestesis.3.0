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
    RGBFormat,
    BufferGeometry,
    BufferAttribute,
    RawShaderMaterial,
    Vector2,
    Vector3,
} from 'three';
//////////////////////////////////////////////////////////////////////////////////////////////////
import {
    SimpleRenderTarget,
    SimpleCopy,
    simpleVertexShader,
    SimpleTexture
} from '../helpers/simple';
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
export class FxToy {
    // Shows how to use the mouse input (only left button supported):
    //
    //      iMouse.xy  = mouse position during last button down
    //  abs(iMouse.zw) = mouse position during last button click
    // sign(iMouse.z)  = button is down
    // sign(uMouse.w)  = button is clicked

    // Input - Keyboard    : https://www.shadertoy.com/view/lsXGzf
    // Input - Microphone  : https://www.shadertoy.com/view/llSGDh
    // Input - Mouse       : https://www.shadertoy.com/view/Mss3zH
    // Input - Sound       : https://www.shadertoy.com/view/Xds3Rr
    // Input - SoundCloud  : https://www.shadertoy.com/view/MsdGzn
    // Input - Time        : https://www.shadertoy.com/view/lsXGz8
    // Input - TimeDelta   : https://www.shadertoy.com/view/lsKGWV
    // Inout - 3D Texture  : https://www.shadertoy.com/view/4llcR4

    constructor({ width, height, fragmentShader, uniforms }) {
        this.width = width;
        this.height = height;
        uniforms = uniforms || {};
        this.material = new RawShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: simpleVertexShader,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new Vector3(width, height, 0) },
                ...uniforms
            }
        });
        this.target = new SimpleRenderTarget({
            material: this.material, width: width, height: height
        });
        this.startTime = Date.now();
        if (uniforms.iMouse) {
            this.mouse = {
                random: new FxRandom({ length: 8, transform: (v) => (v * 0.4 + 0.8) * 0.1 })
            };
        }
    }
    render(renderer) {
        this.material.uniforms.iTime.value = (Date.now() - this.startTime) / 1000;
        if (this.material.uniforms.iMouse) {
            this.iMouseAnimate();
        }
        this.target.render(renderer);
    }
    get texture() {
        return this.target.texture;
    }
    get time() {
        return this.material.uniforms.iTime.value;
    }
    iMouseAnimate() {
        const rnd = this.mouse.random.n;
        const time = this.time;
        const mw = this.width * 0.5;
        const mh = this.height * 0.5;
        this.material.uniforms.iMouse.value.x = (Math.sin(time * rnd[0]) + Math.sin(time * rnd[1])) * mw + mw;
        this.material.uniforms.iMouse.value.y = (Math.sin(time * rnd[2]) + Math.sin(time * rnd[3])) * mh + mh;
        this.material.uniforms.iMouse.value.z = (Math.sin(time * rnd[4]) + Math.sin(time * rnd[5])) * mw + mw;
        this.material.uniforms.iMouse.value.w = (Math.sin(time * rnd[6]) + Math.sin(time * rnd[7])) * mh + mh;
    }
    static from({ element, width, height }) {
        if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        return new FxToy({ width: width, height: height, fragmentShader: element.textContent });
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
export class FxRandom {
    constructor({ length, transform }) {
        this.n = [];
        if (transform) {
            for (let i = 0; i < length; i++) {
                this.n.push(transform(Math.random()));
            }
        } else {
            for (let i = 0; i < length; i++) {
                this.n.push(Math.random());
            }
        }
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
export default FxToy;
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

