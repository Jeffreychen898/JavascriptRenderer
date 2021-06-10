class $Matrix4 {
	/* @param{optional Array} */
	constructor(matrix) {
		this.matrix = new Array(16);
		this.type = $RendererVariable.Math.Type.Matrix4;

		if(matrix) {
			for(const i in matrix)
				this.matrix[i] = matrix[i];
		}
		else
			this.identity();
	}

	/* @param {Matrix4 | Vector4} */
	multiply(data) {
		if(data.type != $RendererVariable.Math.Type.Matrix4 &&
			data.type != $RendererVariable.Math.Type.Vector4) {
			console.error("[ERROR] The Matrix cannot be multiplied");
			return;
		}

		const num_of_columns = Math.floor(data.matrix.length / 4);
		let result = new Array(4 * num_of_columns);

		for(let i=0;i<4;i++) {
			for(let j=0;j<num_of_columns;j++) {
				const v1 = this.matrix[i * 4] * data.matrix[j];
				const v2 = this.matrix[i * 4 + 1] * data.matrix[1 * num_of_columns + j];
				const v3 = this.matrix[i * 4 + 2] * data.matrix[2 * num_of_columns + j];
				const v4 = this.matrix[i * 4 + 3] * data.matrix[3 * num_of_columns + j];
				result[i * 4 + j] = v1 + v2 + v3 + v4;
			}
		}

		if(data.type == $RendererVariable.Math.Type.Matrix4)
			return new $Matrix4(result);
		else if(data.type == $RendererVariable.Math.Type.Vector4)
			return "Vector class not created yet :(";
		else
			return undefined;
	}

	transpose() {
		const new_matrix = new Array(16);
		for(let i=0;i<16;i++) {
			const col = i % 4;
			const row = Math.floor(i / 4);
			new_matrix[col * 4 + row] = this.matrix[row * 4 + col];
		}
		this.matrix = new_matrix;
	}

	identity() {
		for(let i=0;i<16;i++)
			this.matrix[i] = (i % 5 == 0)?1:0;
	}

	inverse() {
		//create adjugate matrix
		let adjugate_matrix = new Array(16);

		adjugate_matrix[0] =  this.$adjugateMatrixValue(5, 10, 15, 11, 14, 6, 9, 13, 7);
		adjugate_matrix[1] = -this.$adjugateMatrixValue(4, 10, 15, 11, 14, 6, 8, 12, 7);
		adjugate_matrix[2] =  this.$adjugateMatrixValue(4, 9, 15, 11, 13, 5, 8, 12, 7);
		adjugate_matrix[3] = -this.$adjugateMatrixValue(4, 9, 14, 10, 13, 5, 8, 12, 6);
		adjugate_matrix[4] = -this.$adjugateMatrixValue(1, 10, 15, 11, 14, 2, 9, 13, 3);
		adjugate_matrix[5] =  this.$adjugateMatrixValue(0, 10, 15, 11, 14, 2, 8, 12, 3);
		adjugate_matrix[6] = -this.$adjugateMatrixValue(0, 9, 15, 11, 13, 1, 8, 12, 3);
		adjugate_matrix[7] =  this.$adjugateMatrixValue(0, 9, 14, 10, 13, 1, 8, 12, 2);
		adjugate_matrix[8] =  this.$adjugateMatrixValue(1, 6, 15, 7, 14, 2, 5, 13, 3);
		adjugate_matrix[9] = -this.$adjugateMatrixValue(0, 6, 15, 7, 14, 2, 4, 12, 3);
		adjugate_matrix[10] =  this.$adjugateMatrixValue(0, 5, 15, 7, 13, 1, 4, 12, 3);
		adjugate_matrix[11] = -this.$adjugateMatrixValue(0, 5, 14, 6, 13, 1, 4, 12, 2);
		adjugate_matrix[12] = -this.$adjugateMatrixValue(1, 6, 11, 7, 10, 2, 5, 9, 3);
		adjugate_matrix[13] =  this.$adjugateMatrixValue(0, 6, 11, 7, 10, 2, 4, 8, 3);
		adjugate_matrix[14] = -this.$adjugateMatrixValue(0, 5, 11, 7, 9, 1, 4, 8, 3);
		adjugate_matrix[15] =  this.$adjugateMatrixValue(0, 5, 10, 6, 9, 1, 4, 8, 2);

		//find determinant
		let determinant = 0;
		for(let i=0;i<4;i++)
			determinant += this.matrix[i] * adjugate_matrix[i];
		console.log(determinant);

		if(determinant == 0)
			return false;

		//transpose
		const new_matrix = new Array(16);
		for(let i=0;i<16;i++) {
			const col = i % 4;
			const row = Math.floor(i / 4);
			new_matrix[col * 4 + row] = adjugate_matrix[row * 4 + col];
		}

		//multiply determinant
		for(const i in new_matrix)
			this.matrix[i] = new_matrix[i] / determinant;

		return true;
	}

	print() {
		for(let i=0;i<4;i++) {
			const index = i * 4;
			console.log(this.matrix[index] + " " + this.matrix[index + 1] + " "
			+ this.matrix[index + 2] + " " + this.matrix[index + 3]);
		}
	}

	/* @private */
	$adjugateMatrixValue(a, b, c, d, e, f, g, h, i) {
		const m = this.matrix;
		return m[a]*(m[b]*m[c] - m[d]*m[e]) - m[f]*(m[g]*m[c] - m[d]*m[h]) + m[i]*(m[g]*m[e] - m[b]*m[h]);
	}
}
