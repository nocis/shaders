#version 150


uniform vec2 pi;
uniform vec2 gamma;

uniform vec4 backgroundColor0;
uniform vec4 backgroundColor1;

uniform sampler2D positionTexture0;
uniform sampler2D positionTexture1;
uniform sampler2D smokeMaskTexture;

uniform vec3 origin; // envNP view space pos
uniform vec2 nearFar;
uniform vec2 sunPosition;
uniform vec2 enabled;

out vec4 fragColor;


void main()
{

    float fogMin = 0.00;
    float fogMax = 0.97;
    
    vec2 texSize = textureSize(positionTexture0, 0).xy;
    vec2 texCoord = gl_FragCoord.xy / texSize;

    vec4 smokeMask = texture(smokeMaskTexture, texCoord);
    vec4 position0 = texture(positionTexture0, texCoord);
    vec4 position1 = texture(positionTexture1, texCoord);

    // calculate the relative y coord in scene space ( maybe is center of bottom? )
    // because the fog depends on the height!!!
    position0.y -= origin.y;
    position1.y -= origin.y;
    
    
    float near = nearFar.x;
    float far  = nearFar.y;
    

    
    if (position0.a <= 0) { position0.y = far; }
    if (position1.a <= 0) { position1.y = far; }

    // smooth out the smoke
    vec4 position = position1;
    position.xyz = mix(position0.xyz, position1.xyz, smokeMask.r); 

    float random = fract(10000 * sin( ( gl_FragCoord.x * 104729 + gl_FragCoord.y * 7639) * pi.y ));

    //simulate the sun movement
    vec4 bgdColor0 = backgroundColor0;
    vec4 bgdColor1 = backgroundColor1;
    // gamma correction
    bgdColor0.rgb = pow(backgroundColor0.rgb, vec3(gamma.x));
    bgdColor1.rgb = pow(backgroundColor1.rgb, vec3(gamma.x));

    vec4 color = mix( bgdColor0, bgdColor1, 1.0 - clamp(random * 0.1 + texCoord.y, 0.0, 1.0) );

    // sin (sunpos * PI / 180) 
    float sunPos = max(0.2, -1 * sin(sunPosition.x * pi.y));

    color.rgb *= sunPos;
    color.b    = mix(color.b + 0.05, color.b, sunPos);

    // height diff from 0 to 1
    float intensity = clamp((position.y - near) / (far - near), fogMin, fogMax);

    fragColor = vec4(color.rgb, intensity);
    fragColor = fragColor * enabled.x;
    // check fragColor = vec4(vec3(position.y),1);
}
