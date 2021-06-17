# Loading Images

**Loading Texture**

You can use the following line of code to load your image

```javascript
const texture = renderer.create.texture("<source>");
```

# Transformation Matrices

**Creating the Matrix**

In order to add transformation to your shapes, you need to first create a 4x4 matrix like below:

```javascript
let matrix = $R.Create.Matrix4();
```

**Applying the transformation**

Now, you can apply different types of transformations to the matrix.

```javascript
//translation
/* @param {Matrix, number, number, (optional)number} */
matrix = $R.Apply.Translate(matrix, x, y, z);

//scale
/* @param {Matrix, number, number, (optional)number} */
matrix = $R.Apply.Scale(matrix, x, y, z);

//rotation (z-axis)
/* @param {Matrix, angle} */
matrix = $R.Apply.Rotation(matrix, angle);

//reset all transformations
matrix.identity();
//or
matrix = $R.Create.Matrix4();
```

The reason why you need to pass in the matrix variable is because the library need to multiply your original matrix by the new transformation matrix. This means that when you apply a translation followed by a rotation, the affected shape will first translate, then rotate.

**Using the matrix**

```javascript
const properties = {
	transformation: matrix
};
```

The transformation matrix can be passed in through the properties variable. This variable could then be passed into any method that is drawing a shape.

# 2D Camera

The renderer will create a camera based on the canvas width and height by default. If you feel the need to create your own camera, you can use the following code. You can repeat this line every frame if you want your camera to change every frame.

```javascript
/* @param {number, number, number, number} */
const camera = $R.Create.Camera2D(left, right, top, bottom);
```

* **left**: referring to the x position of the left side of your screen.
* **right**: referring to the x position of the right side of your screen.
* **top**: referring to the y position of the top part of your screen.
* **bottom**: referring to the y position of the bottom part of your screen.

Once you defined these variables, you can adjust the x and y position of your 2D camera as well as the width and height.

In order for the camera to be put in effect, you must use the following line of code:

```javascript
renderer.setCamera(camera);
```

