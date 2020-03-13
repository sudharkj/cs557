#version 330 compatibility

const vec4 WHITE_ICE = vec4(.82, .94, .89, 1.);

uniform float           uEta;
uniform samplerCube     uRefractUnit;

uniform sampler3D Noise3;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

in vec3 vEyeDir;
in vec3 vMCposition;
in vec3 vNormal;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
    float cx = cos( angx );
    float sx = sin( angx );
    float cy = cos( angy );
    float sy = sin( angy );

    // rotate about x:
    float yp =  n.y*cx - n.z*sx;    // y'
    n.z      =  n.y*sx + n.z*cx;    // z'
    n.y      =  yp;
    // n.x     =  n.x;

    // rotate about y:
    float xp =  n.x*cy + n.z*sy;    // x'
    n.z      = -n.x*sy + n.z*cy;    // z'
    n.x      =  xp;
    // n.y      =  n.y;

    return normalize( n );
}

void
main( )
{
    vec4 color = WHITE_ICE;

    vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
    float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
    angx *= uNoiseAmp;

    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy, vMCposition.z+0.5) );
    float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
    angy *= uNoiseAmp;

    vec3 Normal = RotateNormal(angx, angy, vNormal);
	vec3 refractVector = refract( vEyeDir, Normal, uEta );
	vec4 refractColor  = textureCube( uRefractUnit, refractVector);
	refractColor       = mix( refractColor, WHITE_ICE, .4 );

    gl_FragColor = vec4( refractColor.rgb, 1. );
}
