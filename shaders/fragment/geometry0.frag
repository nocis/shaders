
#version 150

// uniform : user input uniform variables 
// in      : vertex attribute defined in vao

// vao : vertex array
// vbo : array buffer
// ebo : element array buffer ( indices )


//Each Blender material used to build mill-scene.egg has five textures in the following order.
//    Diffuse       : p3d_Texture0
//    Normal        : p3d_Texture1
//    Specular      : p3d_Texture2
//    Reflection    : p3d_Texture3
//    Refraction    : p3d_Texture4



uniform sampler2D p3d_Texture1;
uniform vec2 normalMapsEnabled;

// output from vertex shader!!!
in vec2 normalCoord;

in vec3 vertexNormal; // z , out of surface
in vec3 binormal;     // y , binormals and tangents can associated with the Nth texture
in vec3 tangent;      // x , binormals and tangents can associated with the Nth texture

in vec4 vertexPosition; // view space unprojected position!!!
                        // gl_Position after vertex shader is in clip space ( different w for different vertices )
                        // gl_Position in fragment shader  is in canonical view volume (cvv) space has NDC coord(-1, 1)
                        //                                     ( after clipping and divided by w )


out vec4 positionOut;
out vec4 normalOut;

void main()
{
    // vertex normal was used to calculate the lighting. 
    // However, the normal map provides us with different normals to use when calculating the lighting. 
    // In the fragment shader, you need to swap out the vertex normals for the normals found in the normal map

    // get tangent space normals color 
    vec4 normalTex = texture( p3d_Texture1, normalCoord );

    // flat normal map : The only color it contains is flat blue (red = 128, green = 128, blue = 255). 
    // This color represents a unit (length one) normal pointing in the positive z-axis (0, 0, 1).
    // unit normal (0, 0, 1) == flat blue (0.5, 0.5, 1)
    vec3 normal = normalize(normalTex.xyz * 2.0 - 1.0);


    // transform normals from tangent space to view space.
    // -- using tangent, binormal, normal bases for every vertex normal !!!! 
    normal = normalize( mat3( tangent, binormal, vertexNormal)* normal);

    // use vertex normal if do not have normalTexture
    normal = normal * normalMapsEnabled.x + normalize(vertexNormal) * (1-normalMapsEnabled.x);


    positionOut = vertexPosition;
    normalOut   = vec4(normal, 1);
}