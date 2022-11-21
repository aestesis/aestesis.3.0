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

    constructor({ width, height, fragmentShader, iChannel0, iChannel1, iChannel2, iChannel3 }) {
        this.material = new RawShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: simpleVertexShader,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new Vector3(width, height, 0) },
                ...iChannel0 ? { iChannel0: iChannel0 } : {},
                ...iChannel1 ? { iChannel0: iChannel1 } : {},
                ...iChannel2 ? { iChannel0: iChannel2 } : {},
                ...iChannel3 ? { iChannel0: iChannel3 } : {},
            }
        });
        this.target = new SimpleRenderTarget({
            material: this.material, width: width, height: height
        });
        this.fill = new SimpleCopy({ texture: this.target.texture });
        this.startTime = Date.now();
    }
    render(renderer) {
        this.material.uniforms.iTime.value = (Date.now() - this.startTime) / 1000;
        this.target.render(renderer);
        this.fill.render(renderer);
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
export default FxToy;
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

