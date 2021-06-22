/*let $ShaderCode = {
};*/

const $ShaderCode = new Map();

window.onload = async () => {
	let shader_list = [];
	try {
		await fetch("/shaderlist").then(res => res.json()).then((data) => {
			shader_list = data;
		});

		let counter = 0;
		for(const each_shader of shader_list) {
			const url = "res/ShaderCode/" + each_shader + "/";
			const shaders = {
				vert: "",
				frag: ""
			};
			fetch(url + "vertex.glsl").then(res => res.text()).then((data) => {
				shaders.vert = data;
				counter ++;
				if(counter == shader_list.length * 2)
					everythingLoaded();
			});
			fetch(url + "fragment.glsl").then(res => res.text()).then((data) => {
				shaders.frag = data;
				counter ++;
				if(counter == shader_list.length * 2)
					everythingLoaded();
			});
			$ShaderCode.set(each_shader, shaders);
		}
	} catch(error) {
		console.error(error);
	}
}
