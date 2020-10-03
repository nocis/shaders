#version 150



uniform sampler2D p3d_Texture0;
uniform sampler2D positionTexture;

uniform vec2 isSmoke;


// in from vertex shader
in vec4 vertexPosition;
in vec2 normalCoord; 
in vec3 vertexNormal;
in vec3 binormal;
in vec3 tangent;
in vec2 diffuseCoord;
in vec4 vertexColor;


out vec4 positionOut;
out vec4 smokeMaskOut;

void main()
{
    // smoke NP has its own diffuseColor
    vec4 diffuseColor = texture( p3d_Texture0, diffuseCoord );

    // stretch to fit gl_FragCoord
    // gl_FragCoord contains the window relative coordinate (x, y, z, 1/w) \
    // map fragments' coords to UVs: divide x by width, y by height
    vec2 texSize  = textureSize(positionTexture, 0).xy;
    vec2 texCoord = gl_FragCoord.xy / texSize;

    // positions without smoke particles, 
    // blend(mix) with vertexPosition(has smoke positions) 
    //
    vec4 position = texture(positionTexture, texCoord);

    positionOut = diffuseColor.a > 0 ? vertexPosition : position;
    
    // the vertex color of nonsmoke vertex is (1,1,1,1)
    // smoke vertex color is (0.x, 0.x, 0.x, 1)
    // smoke diffuseColor is ( , , , var )
    smokeMaskOut = diffuseColor * vertexColor * vertexColor * isSmoke.x;
    
    // check
    // smokeMaskOut = vec4(vec3(diffuseColor.a),1);

    // rgb to gray
    // R*0.299 + G*0.587 + B*0.114
    smokeMaskOut.rgb = vec3( smokeMaskOut.r*0.299 + smokeMaskOut.g*0.587 + smokeMaskOut.b*0.114 );
}