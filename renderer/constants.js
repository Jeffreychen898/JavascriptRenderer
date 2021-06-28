const Renderer = {
	Uniform: {
		Integer: 0,
		Float: 1,
		Vector2: 2,
		Vector3: 3,
		Vector4: 4,
		Matrix4: 5,
		IntegerArray: 6
	},
	MaxTextureSlot: undefined,
	Blending: {
		Default: 0,
		Add: 1
	}
}

let $RendererVariable = {
	WebGL: {
		Binding: {
			Shader: undefined,
			BufferObject: undefined,
			FrameBuffer: null,
			TextureSlot: 0,
			Textures: []
		},
		Blending: Renderer.Blending.Default,
		MaxVertexCount: 10000
	},
	Texture: {
		Type: {
			Image: 0,
			ByteArray: 1
		}
	},
	Math: {
		Type: {
			Matrix4: 0,
			Vector4: 1
		}
	},
};
