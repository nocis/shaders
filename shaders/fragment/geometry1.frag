#version 150

// Reports the frame time of the current frame, for animations.
// This can make the texture "flow" over time!!!
uniform float osg_FrameTime;
uniform mat4 p3d_ProjectionMatrix;

uniform sampler2D flowTexture;
uniform sampler2D foamPatternTexture;
uniform vec2 normalMapsEnabled;
uniform vec2 flowMapsEnabled;

uniform sampler2D p3d_Texture1;
uniform sampler2D p3d_Texture3;
uniform sampler2D p3d_Texture4;


// in from vertex shader
in vec4 vertexPosition;
in vec2 normalCoord; 
in vec3 vertexNormal;
in vec3 binormal;
in vec3 tangent;
in vec2 diffuseCoord;


out vec4 positionOut;
out vec4 normalsOut;
out vec4 reflectionMaskOut;
out vec4 refractionMaskOut;
out vec4 foamMaskOut;

// because of set_stats for camera, only water part has flowmap and foamtexture
// also, water part has its own normalmap

void main()
{
    // （1）foam mask texture and （2）normal texture with flow disturbance

    // 1. flow maps map UV coordinates to 2D translations or flows.
    //    Flow maps use the red and green channels to store translations in the x and y direction
    //    (0,1)-->(-1,1)
    //    warning! : normal map converted to actual normals, flow map converted to translations 
    //               This translations indicate the flow directions and speed ( a vector )
    vec2 flow = texture(flowTexture,  normalCoord).xy;
    flow = flow * 2.0 - 1.0;
    //flow = vec2(0);

    // should I clamp? 
    flow.x = abs(flow.x) <= 0.02 ? 0.0 : flow.x;
    flow.y = abs(flow.y) <= 0.02 ? 0.0 : flow.y;

    // 1.2 applied flow translations to normals
    vec2 normalOffset = vec2( flowMapsEnabled.x * flow.x * osg_FrameTime, flowMapsEnabled.y * flow.y * osg_FrameTime);
    vec4 normalTex = texture( p3d_Texture1, normalCoord + normalOffset );

    // normalmap to normals
    vec3 normals = normalize( normalTex.xyz * 2.0 - 1.0 );

    // from tangent to view space
    normals = normalize( mat3(tangent, binormal, vertexNormal) * normals );

    // use vertex normal if do not have normalTexture
    normals = normals * normalMapsEnabled.x + normalize(vertexNormal) * (1-normalMapsEnabled.x);


    positionOut = vertexPosition;
    normalsOut = vec4(normals, 1);




    // 2. foma mask
    //    use a mask to indicate which part will be the water with foam
    //    foma mask animated by flow translations!


    // 2.1 calculate foam UV coord
    //     because normals x and y are continuous on a water convex surface(from negative to positive), 
    //     so we can using normals as UV to sample a texture
    // textureSize(sampler, lod)
    vec2 foamPatternTextureSize = textureSize(foamPatternTexture, 0);

    // first we need to transform normals to cvv and NDC, then scale them from (-1, 1) to (0, 1)
    // thus, we can map the "UV" to foamPatternTextureSize
    vec4 foamUvOffset = p3d_ProjectionMatrix * vec4(normalize(normals), 1.0);
    foamUvOffset.xyz /= foamUvOffset.w;

    
    // add some distortion by normals around the wave seems better!!!!  
    // try using gredient around normals?
    foamUvOffset.xy /= -foamPatternTextureSize;
    foamUvOffset.xy /= 10;


    // foam slower than the wave introduce more reality!!! 
    vec2 foamOffset = flowMapsEnabled * flow * osg_FrameTime * 0.3;
    vec2 foamUv = diffuseCoord + foamUvOffset.xy + foamOffset;

    foamMaskOut = texture( foamPatternTexture, foamUv );


    // 3. reflectionMask and refractionMask
    reflectionMaskOut = texture(p3d_Texture3, diffuseCoord);
    refractionMaskOut = texture(p3d_Texture4, diffuseCoord);

}