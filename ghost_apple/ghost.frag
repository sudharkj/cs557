#version 330 compatibility

const vec4 WHITE_ICE = vec4(.82, .94, .89, 1.);

uniform float uKa, uKd, uKs;
uniform float uShininess;
uniform vec4  uSpecularColor;

uniform float           uEta;
uniform samplerCube     uRefractUnit;

uniform sampler3D Noise3;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

in vec3 vMCposition;
in vec3 vNormal;
in vec3 vLf;
in vec3 vEf;

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
    vec3 Light = normalize(vLf);
    vec3 Eye = normalize(vEf);

    vec4 ambient = uKa * color;
    float d = max( dot(Normal, Light), 0. );
    vec4 diffuse = uKd * d * color;
    float s = 0.;
    if( dot(Normal, Light) > 0. )        // only do specular if the light can see the point
    {
        vec3 ref = normalize( 2. * Normal * dot(Normal, Light) - Light );
        s = pow( max( dot(Eye, ref), 0. ), uShininess );
    }
	vec3 refractVector = refract( -Eye, Normal, uEta );
	vec4 refractColor  = textureCube( uRefractUnit, refractVector);
	refractColor       = mix( refractColor, WHITE_ICE, .4 );
    vec4 specular = uKs * s * refractColor;

    gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );
}
