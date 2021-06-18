let $RendererVariable={WebGL:{Binding:{Shader:void 0,BufferObject:void 0,FrameBuffer:null,TextureSlot:0,Textures:[]},MaxVertexCount:1e4},Texture:{Type:{Image:0,ByteArray:1}},Math:{Type:{Matrix4:0,Vector4:1}}};const Renderer={Uniform:{Integer:0,Float:1,Vector2:2,Vector3:3,Vector4:4,Matrix4:5,IntegerArray:6},MaxTextureSlot:void 0};class $Renderer_Matrix4{constructor(e){if(this.matrix=new Array(16),this.type=$RendererVariable.Math.Type.Matrix4,e)for(const t in e)this.matrix[t]=e[t];else this.identity()}multiply(e){if(e.type!=$RendererVariable.Math.Type.Matrix4&&e.type!=$RendererVariable.Math.Type.Vector4)return void console.error("[ERROR] The Matrix cannot be multiplied");const t=this.multiplyRaw(e.matrix);return e.type==$RendererVariable.Math.Type.Matrix4?new $Renderer_Matrix4(t):e.type==$RendererVariable.Math.Type.Vector4?"Vector class not created yet :(":void 0}multiplyRaw(e){const t=Math.floor(e.length/4);let r=new Array(4*t);for(let i=0;i<4;i++)for(let a=0;a<t;a++){const n=this.matrix[4*i]*e[a],o=this.matrix[4*i+1]*e[1*t+a],s=this.matrix[4*i+2]*e[2*t+a],h=this.matrix[4*i+3]*e[3*t+a];r[i*t+a]=n+o+s+h}return r}transpose(){const e=new Array(16);for(let t=0;t<16;t++){const r=t%4,i=Math.floor(t/4);e[4*r+i]=this.matrix[4*i+r]}this.matrix=e}identity(){for(let e=0;e<16;e++)this.matrix[e]=e%5==0?1:0}inverse(){let e=new Array(16);e[0]=this.$adjugateMatrixValue(5,10,15,11,14,6,9,13,7),e[1]=-this.$adjugateMatrixValue(4,10,15,11,14,6,8,12,7),e[2]=this.$adjugateMatrixValue(4,9,15,11,13,5,8,12,7),e[3]=-this.$adjugateMatrixValue(4,9,14,10,13,5,8,12,6),e[4]=-this.$adjugateMatrixValue(1,10,15,11,14,2,9,13,3),e[5]=this.$adjugateMatrixValue(0,10,15,11,14,2,8,12,3),e[6]=-this.$adjugateMatrixValue(0,9,15,11,13,1,8,12,3),e[7]=this.$adjugateMatrixValue(0,9,14,10,13,1,8,12,2),e[8]=this.$adjugateMatrixValue(1,6,15,7,14,2,5,13,3),e[9]=-this.$adjugateMatrixValue(0,6,15,7,14,2,4,12,3),e[10]=this.$adjugateMatrixValue(0,5,15,7,13,1,4,12,3),e[11]=-this.$adjugateMatrixValue(0,5,14,6,13,1,4,12,2),e[12]=-this.$adjugateMatrixValue(1,6,11,7,10,2,5,9,3),e[13]=this.$adjugateMatrixValue(0,6,11,7,10,2,4,8,3),e[14]=-this.$adjugateMatrixValue(0,5,11,7,9,1,4,8,3),e[15]=this.$adjugateMatrixValue(0,5,10,6,9,1,4,8,2);let t=0;for(let r=0;r<4;r++)t+=this.matrix[r]*e[r];if(console.log(t),0==t)return!1;const r=new Array(16);for(let t=0;t<16;t++){const i=t%4,a=Math.floor(t/4);r[4*i+a]=e[4*a+i]}for(const e in r)this.matrix[e]=r[e]/t;return!0}print(){for(let e=0;e<4;e++){const t=4*e;console.log(this.matrix[t]+" "+this.matrix[t+1]+" "+this.matrix[t+2]+" "+this.matrix[t+3])}}$adjugateMatrixValue(e,t,r,i,a,n,o,s,h){const u=this.matrix;return u[e]*(u[t]*u[r]-u[i]*u[a])-u[n]*(u[o]*u[r]-u[i]*u[s])+u[h]*(u[o]*u[a]-u[t]*u[s])}}function $Renderer_RotateZMatrix(e,t){const r=[Math.cos(t),-Math.sin(t),0,0,Math.sin(t),Math.cos(t),0,0,0,0,1,0,0,0,0,1];return new $Renderer_Matrix4(e.multiplyRaw(r))}function $Renderer_TranslateMatrix(e,t,r,i){i||(i=0);const a=[1,0,0,t,0,1,0,r,0,0,1,i,0,0,0,1];return new $Renderer_Matrix4(e.multiplyRaw(a))}function $Renderer_ScaleMatrix(e,t,r,i){i||(i=1);const a=[t,0,0,0,0,r,0,0,0,0,i,0,0,0,0,1];return new $Renderer_Matrix4(e.multiplyRaw(a))}function $Renderer_Camera2D(e,t,r,i){return new $Renderer_Matrix4([2/(t-e),0,0,-(t+e)/(t-e),0,2/(r-i),0,-(r+i)/(r-i),0,0,1,0,0,0,0,1])}class $Renderer_TextureBuffer{constructor(e,t,r){this.$m_gl=e,this.width=t,this.height=r,this.$m_framebuffer,this.$m_texture,this.$m_renderbuffer}create(){const e=this.$m_gl;this.$m_framebuffer=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,this.$m_framebuffer),this.$m_texture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.$m_texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,this.width,this.height,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST);const t=$RendererVariable.WebGL.Binding.TextureSlot,r=$RendererVariable.WebGL.Binding.Textures[t];e.bindTexture(e.TEXTURE_2D,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.$m_texture,0),this.$m_renderbuffer=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,this.$m_renderbuffer),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_STENCIL,this.width,this.height),e.bindRenderbuffer(e.RENDERBUFFER,null),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.RENDERBUFFER,this.$m_renderbuffer),e.bindFramebuffer(e.FRAMEBUFFER,$RendererVariable.WebGL.Binding.FrameBuffer)}bind(){if($RendererVariable.WebGL.Binding.FrameBuffer!=this.$m_framebuffer){const e=this.$m_gl;e.bindFramebuffer(e.FRAMEBUFFER,this.$m_framebuffer),$RendererVariable.WebGL.Binding.FrameBuffer=this.$m_framebuffer}}bindTexture(e){const t=this.$m_gl;if(!Renderer.MaxTextureSlot)return void console.error("[ERROR] Renderer has not been initialized properly!");if(e>Renderer.MaxTextureSlot)return void console.error(`[ERROR] The max texture slot of ${Renderer.MaxTextureSlot} has been reached`);const r=$RendererVariable.WebGL.Binding.TextureSlot;$RendererVariable.WebGL.Binding.Textures[e]!=this.$m_texture&&(e!=r&&(t.activeTexture(t.TEXTURE0+e),$RendererVariable.WebGL.Binding.TextureSlot=e),t.bindTexture(t.TEXTURE_2D,this.$m_texture),$RendererVariable.WebGL.Binding.Textures[r]=this.$m_texture)}}function $Renderer_BindDefaultFrameBuffer(e){null!=$RendererVariable.WebGL.Binding.FrameBuffer&&(e.bindFramebuffer(e.FRAMEBUFFER,null),$RendererVariable.WebGL.Binding.FrameBuffer=null)}const $ShaderCode={default:{vert:"\n\t\t\tattribute vec3 a_position;\n\t\t\tattribute vec4 a_color;\n\t\t\tattribute vec2 a_texCoord;\n\n\t\t\tuniform mat4 u_projection;\n\n\t\t\tvarying vec4 v_color;\n\t\t\tvarying vec2 v_texCoord;\n\n\t\t\tvoid main() {\n\t\t\t\tv_texCoord = a_texCoord;\n\t\t\t\tv_color = a_color;\n\t\t\t\tgl_Position = u_projection * vec4(a_position, 1.0);\n\t\t\t}\n\t\t",frag:"\n\t\t\tprecision mediump float;\n\n\t\t\tvarying vec4 v_color;\n\t\t\tvarying vec2 v_texCoord;\n\n\t\t\tuniform sampler2D u_texture;\n\n\t\t\tvoid main() {\n\t\t\t\tgl_FragColor = texture2D(u_texture, v_texCoord) * vec4(v_color);\n\t\t\t}\n\t\t"}};class $Renderer_Shader{constructor(e,t,r,i,a){this.$m_gl=e,this.$createProgram(t,r),this.$setupAttribute(i),a&&this.$setupUniform(a),this.$setupIndexBuffer(),this.bind()}setAttribData(e,t){const r=this.$m_gl;if(this.$m_attributeLocations.has(e)){this.bind();const i=this.$m_attributeLocations.get(e);i!=$RendererVariable.WebGL.Binding.BufferObject&&(r.bindBuffer(r.ARRAY_BUFFER,i),$RendererVariable.WebGL.Binding.BufferObject=i),r.bufferData(r.ARRAY_BUFFER,new Float32Array(t),r.DYNAMIC_DRAW)}}setIndices(e){const t=this.$m_gl;this.bind(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.$m_ibo),$RendererVariable.WebGL.Binding.BufferObject=this.$m_ibo,t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(e),t.DYNAMIC_DRAW)}setUniform(e,t){const r=this.$m_gl;if(this.$m_uniformLocations.has(e)){this.$m_uniformData.set(e,t);const i=this.$m_uniformLocations.get(e),a=i.type;a==Renderer.Uniform.Float?r.uniform1f(i.location,t):a==Renderer.Uniform.Vector2?r.uniform2f(i.location,...t):a==Renderer.Uniform.Vector3?r.uniform3f(i.location,...t):a==Renderer.Uniform.Vector4?r.uniform4f(i.location,...t):a==Renderer.Uniform.Matrix4?r.uniformMatrix4fv(i.location,!0,t):a==Renderer.Uniform.Integer?r.uniform1i(i.location,t):a==Renderer.Uniform.IntegerArray&&r.uniform1iv(i.location,t)}}bind(){const e=this.$m_gl;$RendererVariable.WebGL.Binding.Shader!=this.$m_program&&(e.useProgram(this.$m_program),e.bindVertexArray(this.$m_vao),$RendererVariable.WebGL.Binding.Shader=this.$m_program)}$setupIndexBuffer(){const e=this.$m_gl;this.$m_ibo=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.$m_ibo),$RendererVariable.WebGL.Binding.BufferObject=this.$m_ibo}$setupAttribute(e){const t=this.$m_gl;this.$m_vao=t.createVertexArray(),t.bindVertexArray(this.$m_vao),this.$m_attributeLocations=new Map;for(const r of e){const e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e),$RendererVariable.WebGL.Binding.BufferObject=e;const i=t.getAttribLocation(this.$m_program,r.name);this.$m_attributeLocations.set(r.name,e),t.vertexAttribPointer(i,r.size,t.FLOAT,!1,0,0),t.enableVertexAttribArray(i)}}$setupUniform(e){const t=this.$m_gl;this.$m_uniformLocations=new Map;for(const r of e){const e=t.getUniformLocation(this.$m_program,r.name);this.$m_uniformLocations.set(r.name,{location:e,type:r.type})}this.$m_uniformData=new Map}$createProgram(e,t){const r=this.$m_gl,i=this.$compileShader(r.VERTEX_SHADER,e),a=this.$compileShader(r.FRAGMENT_SHADER,t);this.$m_program=r.createProgram(),r.attachShader(this.$m_program,i),r.attachShader(this.$m_program,a),r.linkProgram(this.$m_program),r.getProgramParameter(this.$m_program,r.LINK_STATUS)||console.error(`[ERROR] Linking Shader Program ${r.getProgramInfoLog(this.$m_program)}`)}$compileShader(e,t){const r=this.$m_gl,i=r.createShader(e);return r.shaderSource(i,t),r.compileShader(i),r.getShaderParameter(i,r.COMPILE_STATUS)||console.error(`[ERROR] Compiling Shader ${r.getShaderInfoLog(i)}`),i}}class Texture{constructor(e,t){this.$m_gl=e,this.$m_type="string"==typeof t?$RendererVariable.Texture.Type.Image:$RendererVariable.Texture.Type.ByteArray,this.$m_source=t}load(e){const t=new Image;t.onload=()=>{const r=this.$createCanvas(t.width,t.height,t);this.$createWebGLImage(r,{width:r.width,height:r.height}),"function"==typeof e&&e()},t.src=this.$m_source,t.setAttribute("crossOrigin","")}createTexture(e){this.$createWebGLImage(this.$m_source.data,{width:this.$m_source.width,height:this.$m_source.height}),"function"==typeof e&&e()}bindTexture(e){const t=this.$m_gl;if(!Renderer.MaxTextureSlot)return void console.error("[ERROR] Renderer has not been initialized properly!");if(e>Renderer.MaxTextureSlot)return void console.error(`[ERROR] The max texture slot of ${Renderer.MaxTextureSlot} has been reached`);const r=$RendererVariable.WebGL.Binding.TextureSlot;$RendererVariable.WebGL.Binding.Textures[e]!=this.$m_texture&&(e!=r&&(t.activeTexture(t.TEXTURE0+e),$RendererVariable.WebGL.Binding.TextureSlot=e),t.bindTexture(t.TEXTURE_2D,this.$m_texture),$RendererVariable.WebGL.Binding.Textures[r]=this.$m_texture)}$createWebGLImage(e,t){const r=this.$m_gl,i=r.createTexture();this.$m_texture=i,this.bindTexture(0),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,t.width,t.height,0,r.RGBA,r.UNSIGNED_BYTE,e),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST)}$createCanvas(e,t,r){const i=document.createElement("canvas");i.width=e,i.height=t;const a=i.getContext("2d");return a.fillStyle="black",a.fillRect(0,0,i.width,i.height),a.scale(1,-1),a.drawImage(r,0,-i.height),i}}const $R={Create:{Renderer:e=>new $Renderer_Main(e),Matrix4:e=>new $Renderer_Matrix4(e),Camera2D:(e,t,r,i)=>new $Renderer_Camera2D(e,t,r,i)},Apply:{Rotation:(e,t)=>$Renderer_RotateZMatrix(e,t),Translate:(e,t,r,i)=>$Renderer_TranslateMatrix(e,t,r,i),Scale:(e,t,r,i)=>$Renderer_ScaleMatrix(e,t,r,i)}};class $Renderer_Main{constructor(e){this.$m_canvas=document.getElementById(e.canvas),this.$m_gl=this.$m_canvas.getContext("webgl2"),this.$m_properties={canvasSize:{width:e.canvasWidth||this.$m_canvas.width,height:e.canvasHeight||this.$m_canvas.height}},this.$m_vertexCount=0,this.$m_attributes=[],this.$m_indices=[],this.$setupRendering(),this.$loadDefaultTextures(),this.draw={rect:(e,t,r,i,a)=>{a||(a={}),this.$drawImage(this.$m_whiteTexture,e,t,r,i,a)},image:(e,t,r,i,a,n)=>{n||(n={}),this.$drawImage(e,t,r,i,a,n)},shader:(e,t,r,i,a,n,o)=>{o||(o={}),this.$drawShaders(e,t,r,i,a,n,o)}},this.create={texture:e=>{const t=new Texture(this.$m_gl,e);return t.load(),t},shader:(e,t,r,i)=>new $Renderer_Shader(this.$m_gl,e,t,r,i),textureBuffer:(e,t)=>{const r=new $Renderer_TextureBuffer(this.$m_gl,e,t);return r.create(),r}}}flush(){this.$m_vertexCount>0&&this.$render(this.$m_currentBoundProgram)}setCamera(e){this.flush(),this.$m_shaderProgram.setUniform("u_projection",e.matrix)}$drawShaders(e,t,r,i,a,n,o){o.textureBuffer?($RendererVariable.WebGL.Binding.FrameBuffer!=o.textureBuffer.$m_framebuffer&&this.flush(),o.textureBuffer.bind()):(null!=$RendererVariable.WebGL.Binding.FrameBuffer&&this.flush(),$Renderer_BindDefaultFrameBuffer(this.$m_gl));let s=[];if(o.texture)for(const e in o.texture)$RendererVariable.WebGL.Binding.Textures[e]!=o.texture[e].$m_texture&&s.push({texture:o.texture[e],slot:e});if(s.length>0){this.flush();for(const e of s)e.texture.bindTexture(e.slot)}(e!=this.$m_currentBoundProgram||this.$m_vertexCount+4>$RendererVariable.WebGL.MaxVertexCount)&&this.$render(this.$m_currentBoundProgram),n||(n=[]);const h=[t,r,0,t+i,r,0,t+i,r+a,0,t,r+a,0];if(o.transformation)for(let e=0;e<4;e++){const t=[h[3*e],h[3*e+1],h[3*e+2],1],r=o.transformation.multiplyRaw(t);h[3*e]=r[0],h[3*e+1]=r[1],h[3*e+2]=r[2]}for(const e of n)e.allVert&&e.content.push(...e.content,...e.content,...e.content);n.push({name:o.position||"a_position",content:h});for(let e=0;e<n.length;e++){let t=!1;for(let r=0;r<this.$m_attributes.length;r++)if(n[e].name==this.$m_attributes[r].name){this.$m_attributes[r].content.push(...n[e].content),t=!0;break}t||this.$m_attributes.push(n[e])}this.$m_indices.push(this.$m_vertexCount,this.$m_vertexCount+1,this.$m_vertexCount+2,this.$m_vertexCount,this.$m_vertexCount+2,this.$m_vertexCount+3),this.$m_vertexCount+=4,this.$m_currentBoundProgram=e}$drawImage(e,t,r,i,a,n){let o=[255,255,255,255];if("object"==typeof n.color)switch(n.color.length){case 1:o=[n.color[0],n.color[0],n.color[0],255];break;case 2:o=[n.color[0],n.color[0],n.color[0],n.color[1]];break;case 3:o=[n.color[0],n.color[1],n.color[2],255];break;case 4:o=[...n.color]}for(let e=0;e<o.length;e++)o[e]=o[e]/255;const s=[{name:"a_color",content:o,allVert:!0},{name:"a_texCoord",content:[0,1,1,1,1,0,0,0],allVert:!1}];n.texture=[e],this.$drawShaders(this.$m_shaderProgram,t,r,i,a,s,n)}$render(e){const t=this.$m_gl;for(const t of this.$m_attributes)e.setAttribData(t.name,t.content);e.setIndices(this.$m_indices),e.bind(),t.drawElements(t.TRIANGLES,this.$m_indices.length,t.UNSIGNED_SHORT,0),this.$clearAttribs(),this.$m_vertexCount=0}$clearAttribs(){this.$m_attributes=[],this.$m_indices=[]}$loadDefaultTextures(){const e={data:new Uint8Array([255,255,255,255]),width:1,height:1};this.$m_whiteTexture=new Texture(this.$m_gl,e),this.$m_whiteTexture.createTexture()}$setupRendering(){const e=this.$m_gl;e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),Renderer.MaxTextureSlot=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT);const t=[{name:"u_projection",type:Renderer.Uniform.Matrix4},{name:"u_texture",type:Renderer.Uniform.Integer}],r=[2/this.$m_properties.canvasSize.width,0,0,-1,0,2/-this.$m_properties.canvasSize.height,0,1,0,0,1,0,0,0,0,1];this.$m_shaderProgram=new $Renderer_Shader(e,$ShaderCode.default.vert,$ShaderCode.default.frag,[{name:"a_position",size:3},{name:"a_color",size:4},{name:"a_texCoord",size:2}],t),this.$m_shaderProgram.setUniform("u_projection",r),this.$m_shaderProgram.setUniform("u_texture",0),this.$m_shaderProgram.bind(),this.$m_currentBoundProgram=this.$m_shaderProgram}}
