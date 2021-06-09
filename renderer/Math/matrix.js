class $Matrix4 {
	/* @param{optional Array} */
	constructor(matrix) {
		if(matrix)
			this.matrix = matrix;
		else
			this.identity();
	}

	identity() {
		this.matrix = [];
		for(let i=0;i<16;i++)
			this.matrix[i] = (i % 5 == 0)?1:0;

		console.log(this.matrix);
	}
}

/*
.multiply(Matrix4)
.multiply(Vector4)
.transpose()
.inverse()
.getDeterminent()

.matrix
.identity()
*/
