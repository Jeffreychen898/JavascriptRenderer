# Starting Guide

## Basic Setup

HTML:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Javascript Renderer Setup</title>
        <script src="renderer.js"></script>
    </head>
    <body>
        <canvas id="canvasID" width=800 height=600></canvas>
        <script src="script.js"></script>
    </body>
</html>
```

Javascript:

```javascript
window.onload = () => {
	const config = {
        canvas: "canvasID",
        canvasWidth: 800,
        canvasHeight: 600
    };
    const renderer = $R.Create.Renderer(config);
    animationLoop(renderer);
}
function animationLoop(renderer) {
    //start drawing here
    renderer.flush();
    
    requestAnimationFrame(() => {
        animationLoop(renderer);
    });
}
```

### The flush() function

The flush function is used to flush all the shape out. When you are calling different rendering methods, the library will cache all the information you passed in. Whenever certain limits are reached, the shapes will finally be rendered out onto the screen **(Batch Rendering)**. This is done to optimize the rendering by drawing multiple shapes at once. However, by the end of each frame, the limit for your shapes will most likely not be reached. You must call flush to render all the remaining shapes out onto the screen.

## Drawing Methods

### Rectangle

* **x**: the x position of the shape
* **y**: the y position of the shape
* **width**: the width of the shape
* **height**: the height of the shape
* **properties**>: the properties of the shape, scroll all the way down for more details

```javascript
/* @param {number, number, number, number} */
renderer.draw.rect(x, y, width, height);
/* @param {number, number, number, number, JSONObject} */
renderer.draw.rect(x, y, width, height, properties);
```

### Image

* **texture**: The texture that will be drawn

* **x**: the x position of the shape
* **y**: the y position of the shape
* **width**: the width of the shape
* **height**: the height of the shape
* **properties**: the properties of the shape, scroll all the way down for more details

```javascript
/* @param {Texture, number, number, number, number} */
renderer.draw.image(texture, x, y, width, height);
/* @param {Texture, number, number, number, number, JSONObject} */
renderer.draw.image(texture, x, y, width, height, properties);
```

### Shaders

* **shader**: The shader to use to draw the shape
* **x**: the x position of the shape
* **y**: the y position of the shape
* **width**: the width of the shape
* **height**: the height of the shape
* **attributes**: the attributes that will be passed into the GLSL shader
* **properties** the properties of the shape, scroll all the way down for more details

```javascript
/* @param {Shader, number, number, number, number} */
renderer.draw.shader(shader, x, y, width, height);
/* @param {Shader, number, number, number, number, JSONArray} */
renderer.draw.shader(shader, x, y, width, height, attributes);
/* @param {shader, number, number, number, number, JSONArray, JSONObject} */
renderer.draw.shader(shader, x, y, width, height, attributes, properties)
```

### Properties

**Color**

The color of the shapes can be adjusted using the properties variable. Inside the variable, you can pass in a pair with the key "color" and the value as an array. If the shape is an image, the color will tint the image.

* If the color is not passed in, the color of the shape will use the default color. By default, the program will use the color white.
* If the length of the array is 1, the color of the shape will be grayscale. [grayscale]
* If the length of the array is 2, the color of the shape will be grayscale but you can set an alpha. [grayscale, alpha]
* If the length of the array is 3, you can set the color of the shape using RGB values. [red, green, blue]
* If the length of the array is 4, you can set the color of the shape using RGBA values. [red, green, blue, alpha]

**Transformation**

In order to transform the shapes, you can pass in a transformation matrix inside the properties variable. Inside the variable, you can pass in a pair with the key "transformation" and the Matrix class as the value.

**Texture Buffers**

The shapes can be rendered to different buffers. If no buffers are passed into the properties variable, the shape will be drawn directly onto the screen. Inside the properties variable, you can pass in a texture buffer with the key "textureBuffer" and the Texture Buffer class as the value.

**position attribute name**

If the properties is passed into a draw shader method, it will change what position variable is named in the shaders. By default, the name of the position variable is "a_position". In order to change the position variable name, you must pass in "position" as the key and the variable name in the form of a string as the value. If this variable in the properties is passed into any other methods, it will break the program. It is safe to pass this variable into the following method(s):

* renderer.draw.shader()

**example**

```javascript
const properties = {
    color: [255, 0, 0],
    transformation: matrix,
    textureBuffer: buffer,
    position: "a_position"
};
```

