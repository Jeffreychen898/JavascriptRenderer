let $RendererVariable = {
	WebGL: {
		Binding: {
			Shader: undefined,
			BufferObject: undefined,
			TextureSlot: 0,
			Textures: []
		},
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
	}
};

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
	MaxTextureSlot: undefined
}
