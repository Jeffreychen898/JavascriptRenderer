class $Renderer_Font {
    /* @param {gl, String, number} */
    constructor(gl, path, size) {
        this.$m_gl = gl;
        this.$m_fontPath = path;
        this.$m_fontSize = size || 48;
    }

    /* @param {(optional) function} */
    loadFont(callback) {
        //load with opentype.js
        opentype.load(this.$m_fontPath, (err, font) => {
            if(err) {
                console.error(`[ERROR] Font ${this.$m_fontPath} failed to load!`);
                if(typeof(callback) == "function") callback(err);
                return;
            }
            const characters = this.$getLetterList();
            const canvas = this.$generateCanvas(font, characters);
            if(typeof(callback) == "function") callback();
        });
        //draw the texture onto a canvas
    }

    /* @param {number} */
    bindTexture(texSlot) {
		const gl = this.$m_gl;

		if(!Renderer.MaxTextureSlot) {
			console.error("[ERROR] Renderer has not been initialized properly!");
			return;
		}

		if(texSlot > Renderer.MaxTextureSlot) {
			console.error(`[ERROR] The max texture slot of ${Renderer.MaxTextureSlot} has been reached`);
			return;
		}

		const tex_slot = $RendererVariable.WebGL.Binding.TextureSlot;
		if($RendererVariable.WebGL.Binding.Textures[texSlot] != this.$m_texture) {
			if(texSlot != tex_slot) {
				gl.activeTexture(gl.TEXTURE0 + texSlot);
				$RendererVariable.WebGL.Binding.TextureSlot = texSlot;
			}

			gl.bindTexture(gl.TEXTURE_2D, this.$m_texture);
			$RendererVariable.WebGL.Binding.Textures[tex_slot] = this.$m_texture;
		}
    }

    /* @private */
    /* @param {Opentype Font, String} */
    $generateCanvas(font, characters) {
        //load the measurements
        const scale = 1 / font.unitsPerEm * this.$m_fontSize;
        const characterInfo = new Array(characters.length);
        let max_size = {
            x: 0,
            y: 0
        };
        for(let i=0;i<characters.length;i++) {
            const character = characters[i];
            const glyph = font.stringToGlyphs(character)[0];
            max_size.x = Math.max(max_size.x, glyph.xMax * scale);
            max_size.y = Math.max(max_size.y, glyph.yMax * scale - glyph.yMin * scale);
            characterInfo[i] = {
                xMin: glyph.xMin,
                xMax: glyph.xMax,
                yMin: glyph.yMin,
                yMax: glyph.yMax,
                advance: glyph.advanceWidth,
                uvLeft: 0
            };
        }

        //create canvas
        const main_canvas = document.createElement("canvas");
        main_canvas.width = characters.length * (max_size.x + 4);
        main_canvas.height = max_size.y;
        const main_ctx = main_canvas.getContext("2d");

        const sub_canvas = document.createElement("canvas");
        sub_canvas.width = max_size.x + 4;
        sub_canvas.height = max_size.y;
        const ctx = sub_canvas.getContext("2d");

        for(let i=0;i<characters.length;i++) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const position = {
                x: 2 - characterInfo[i].xMin * scale,
                y: characterInfo[i].yMax * scale
            };
            font.draw(ctx, characters[i], position.x, position.y, this.$m_fontSize);

            main_ctx.drawImage(sub_canvas, i * (max_size.x + 4), 0, max_size.x + 4, max_size.y);

            characterInfo[i].uvLeft = (i * (max_size.x + 4) + 2) / main_canvas.width;
        }

        //store the metadata
        this.fontMeasurements = new Map();
        for(let i=0;i<characterInfo.length;i++) {
            const width = characterInfo[i].xMax * scale;
            const height = characterInfo[i].yMax * scale - characterInfo[i].yMin * scale;

            const uv_coordinates = {
                left: characterInfo[i].uvLeft,
                right: characterInfo[i].uvLeft + (width / main_canvas.width),
                top: 0,
                bottom: height / main_canvas.height
            };

            const metadata = {
                x: characterInfo[i].xMin * scale,
                y: -characterInfo[i].yMax * scale,
                width: width,
                height: height,
                advance: characterInfo[i].advance * scale,
                uv: uv_coordinates
            };
            this.fontMeasurements.set(characters[i], metadata);
        }
        this.spacesSize = font.stringToGlyphs(" ")[0].advanceWidth * scale;
        
        //create the texture
        this.$createWebGLTexture(main_canvas);
    }

    /* @param{canvas} */
    $createWebGLTexture(canvas) {
        const gl = this.$m_gl;

        this.$m_texture = gl.createTexture();
        this.bindTexture(0);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    $getLetterList() {
        let str = "";

        for(let i=33;i<127;i++)
            str += String.fromCharCode(i);

        return str;
    }
}