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

# Shaders

**This part of the renderer is subject to change**

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

**Using the Shader Program with renderer.draw.shader()**

In order to use the shader program, you need to note 3 things:

* When specifying the data for the attributes, note that the shape is a rectangle and the vertices start at the top left and go counterclockwise.

* The data for the attributes should be in the form of one big array with data representing each vertex being right next to one another without any kind of separation. An example is shown below:

```javascript
const tex_coordinates = [
    0, 1,//top left
    1, 1,//top right
    1, 0,//bottom right
    0, 0 //bottom left
];
const attributes = [
    {
        name: "a_texCoord",
        content: tex_coordinates,
        allVert: false
    }
];
//allVert is default to false. When it is set to true, you only need to pass in one set of data for the attributes and it will apply to every vertices (I can't think of a creative variable name so I am stuck with "allVert" for now).
```



* The positions are defined for you. You do not need to pass in your own data for the position. However, you might need to change the name of the position variable if your shader do not call it "a_position". Below is an example of how to change the name from "a_position" to just "position".

```javascript
//I will not use this because my position is called "a_position"
const properties = {
    position: "position"
};
```

The final step now is to call the renderer.draw.shader() method. This method requires you to specify the shader, the x position, the y position, the width, and the height. There are 2 optional parameters, they are: the attributes**(if the only attributes you use is the position)** and properties**(attributes must be defined at least with a [] if properties is passed in)**.

```Javascript
renderer.draw.shader(shader, 0, 0, 800, 600, attributes);
```

**You can see why this is subject to change, it is really long and complicated**

