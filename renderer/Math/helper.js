function $Renderer_RotateZMatrix(matrix, angle) {
	const transformation_matrix = [
		Math.cos(angle), -Math.sin(angle), 0, 0,
		Math.sin(angle), Math.cos(angle), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
	return new $Renderer_Matrix4(matrix.multiplyRaw(transformation_matrix));
}

function $Renderer_TranslateMatrix(matrix, x, y, z) {
	if(!z) z = 0;
	const transformation_matrix = [
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, z,
		0, 0, 0, 1
	];
	return new $Renderer_Matrix4(matrix.multiplyRaw(transformation_matrix));
}

function $Renderer_ScaleMatrix(matrix, x, y, z) {
	if(!z) z = 1;
	const transformation_matrix = [
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	];
	return new $Renderer_Matrix4(matrix.multiplyRaw(transformation_matrix));
}
