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

function $Renderer_Camera2D(left, right, top, down) {
	const projection_matrix = [
		2 / (right - left), 0, 0, -(right + left)/(right - left),
		0, 2 / (top - down), 0, -(top + down)/(top - down),
		0, 0, 1, 0,
		0, 0, 0, 1
	];
	return new $Renderer_Matrix4(projection_matrix);
}
