
#version 150


// vertex attributes
in vec4 p3d_Vertex;
in vec3 p3d_Normal;
in vec3 p3d_Binormal;  // y , binormals and tangents can associated with the Nth texture
in vec3 p3d_Tangent;   // x , binormals and tangents can associated with the Nth texture

in vec4 p3d_Color;

uniform mat4 p3d_ModelViewMatrix;
uniform mat4 p3d_ProjectionMatrix;
uniform mat3 p3d_NormalMatrix;

in vec2 p3d_MultiTexCoord0; // UV for Nth texture , 0
in vec2 p3d_MultiTexCoord1; // UV for Nth texture , 1


// out to fragment shader

out vec4 vertexPosition; // view space unprojected position!!!

out vec2 normalCoord;   // normal texture coord

out vec3 vertexNormal; // z , out of surface
out vec3 binormal;     // y , binormals and tangents can associated with the Nth texture
out vec3 tangent;      // x , binormals and tangents can associated with the Nth texture


void main()
{

    // p3d_NormalMatrix transforms the vertex normal, binormal, and tangent vectors 
    // from model space to view space
    // Remember that in view space, all of the coordinates are relative to the camera's position

    vertexPosition = p3d_ModelViewMatrix * p3d_Vertex;
    gl_Position = p3d_ProjectionMatrix * vertexPosition;


    // bases from tangent space to view space
    vertexNormal = normalize(p3d_NormalMatrix * p3d_Normal);
    binormal     = normalize(p3d_NormalMatrix * p3d_Binormal);
    tangent      = normalize(p3d_NormalMatrix * p3d_Tangent);


    // output to the fragment shader, the UV coordinates for the normal map.
    normalCoord   = p3d_MultiTexCoord1;
}