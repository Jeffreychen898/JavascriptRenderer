# Loading Images

**Loading Texture**

You can use the following line of code to load your image

```javascript
const texture = renderer.create.texture("<source>");
```

# Loading Fonts

You can use the following code to create the Font object.

```javascript
const font = renderer.create.font("<source>");
```

However, the font is not loaded yet. You have to use the loadFont method to load the font. This method contains an optional parameter that takes in a function. This function is executed when the font is fully loaded.

```javascript
font.loadFont(() => {
	//the font is finished loading
});
```

# Shapes

### Creating the shape

When you draw shapes, you have to first create a shape. The method below takes in 2 optional parameters: **properties**, and **shader**.

#### Extra Properties

* **position attribute name**: If you are using your own shader program, your position attribute variable may be under a different name. You can pass in that name under the key **position** in the properties variable.
* **textures**: If you are using your own shader program, you may also want to bind different textures. You can pass in an **array** of textures under the key **texture** in the properties.

```javascript
const shape = renderer.create.shape();
/* @param {JSONObject} */
const shape = renderer.create.shape(properties);
/* @param {JSONObject, Shader} */
const shape = renderer.create.shape(properties, shader);
```

### Adding vertices

The next step is to add vertices to your shape. In order for your shape to be rendered onto the screen, it must contain 3 or more vertices.

```javascript
/* @param {Shape, number, number} */
renderer.draw.vertices(shape, x, y);
/* @param {Shape, number, number, Array} */
renderer.draw.vertices(shape, x, y, attributes);
```

If you are using a different shader program, you may have other attributes(aside from position) that you may want to add in your vertices. You can pass it in the fourth parameter, which takes in an array of  JSON Objects. For each JSON Object, you have to pass in the name of your attribute and the values in the form of an array.

```javascript
const attributes = [
    {name: "a_color", values: [1, 0, 0, 1]}
];
```

### Drawing the shape

Once the shape is created and the vertices are set, you can start drawing the shape. If your shape is not going to change in any way, you can repeatedly render it without having to repeatedly create the shape.

```javascript
renderer.draw.shape(shape);
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

If you are looking to modify the camera of a texture buffer, you must call the setCamera method from the texture buffer class.

```javascript
textureBuffer.setCamera(camera);
```

# Texture Buffer

If you want to render your shapes to a buffer before rendering it to your screen, you can use a texture buffer. In order to create a texture buffer, you must include the following line of code:

```javascript
const texture_buffer = renderer.create.textureBuffer(width, height);
```

**Rendering to the texture buffer**

```Javascript
const properties = {
	textureBuffer: texture_buffer
}
```

You can pass the texture buffer into the properties variable, which can then be passed into any method used to render a shape.

**Rendering the texture buffer**

The render buffer can be treated as an Image. You should be able to replace any argument requiring a texture with a texture buffer unless specified otherwise.

# Resizing the canvas

If you resize the canvas, you need to call the resizeCanvas method

```javascript
/* @param {number, number} */
renderer.resizeCanvas(new_width, new_height);
/* @param {number, number, boolean(default: true)} */
renderer.resizeCanvas(new_width, new_height, adjustCamera)
```

If the canvas is resized, the camera remains the same if you do not adjust the camera. This may lead to your shapes being stretched in ways you may not expect. This is why the adjustCamera variable defaults to true. If you want to preserve the camera for some reason, you may pass "false" into the third parameter.

# Shaders

**Source Code**

If you are using your own shader program, you first need to store your source code in a variable somewhere. Here is an example below:

```javascript
const vert = `
attribute vec3 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projection;

varying vec2 v_texCoord;

void main() {
	v_texCoord = a_texCoord;
	gl_Position = u_projection * vec4(a_position, 1.0);
}
`;
const frag = `
varying vec2 v_texCoord;

uniform sampler2D u_texture;

void main() {
	gl_FragColor = texture2D(u_texture, v_texCoord);
}
`;
```

**Specifying attributes and uniforms**

In order to create your own shader program, you also need to provide information about the attributes and uniforms to the renderer. Here is an example below:

```javascript
const attributes = [
    {
        name: "a_position",
        size: 3
    },
    {
        name: "a_texCoord",
        size: 2
    }
];
const uniforms = [
    {
        name: "u_projection",
        type: Renderer.Uniform.Matrix4
    },
    {
        name: "u_texture",
        type: Renderer.Uniform.Integer
    }
];
```

In the example above, I have 2 attributes. One of the attribute is given the variable name "a_position" and the size is 3 **(vec3)**. The other attribute is given the variable name "a_texCoord" and the size is 2 **(vec2)**.

The example also show that I have 2 uniform variables. One of the uniform variable is given the variable name "u_projection" and the type is a matrix 4x4 **(specified by Renderer.Uniform.Matrix4)**. The other uniform variable is given the name "u_texture" and the type is an integer **(specified by Renderer.Uniform.Integer)**. The sampler2D relies on the integer I pass in later to determine which texture slot it will pull the texture from. The sampler2D can also be an array. In this case, the type needs to be specified with Renderer.Uniform.IntegerArray.

The next step is to define the values that will make up the uniforms. The example is below:

```javascript
const matrix = $R.Create.Camera2D(0, 800, 0, 600);
const texSlot = 0;
```

**Putting the pieces together**

To finally create the shader program, you need to pass in everything you just defined. The example is below:

```javascript
const shader = renderer.create.shader(vert, frag, attributes, uniforms);
```

Once you created the shader, you then need to pass in the data for the uniform variables. However, one thing to note is that due to the use of batch rendering, changing the uniforms will affect every shape in batch. IF you are setting the uniform several times per frame, you might want to consider resetting each batch **using renderer.flush()** before setting the uniforms.

```javascript
shader.setUniform("u_projection", matrix);
shader.setUniform("u_texture", texSlot);
```
