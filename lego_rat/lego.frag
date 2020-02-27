#version 330 compatibility

uniform vec4 uColor;

in float gLightIntensity;

void
main( )
{
    gl_FragColor = vec4( uColor.rgb, 1. );  // default color
    gl_FragColor.rgb *= gLightIntensity;    // apply lighting model
}
