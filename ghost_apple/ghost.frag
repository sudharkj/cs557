#version 330 compatibility

const float PI		= 3.14159;

uniform float  uA;
uniform float  uB;
uniform float  uC;
uniform float  uD;

uniform sampler3D Noise3;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

in vec3 vMCposition;
in vec3 vNormal;
in vec3 vEyeDir;

uniform float           uEta;
uniform float           uMix;
uniform samplerCube     uReflectUnit;
uniform samplerCube     uRefractUnit;

const vec4 WHITE = vec4(0.88, 0.9, 0.89, 1.);
const float ICE_REFRACTIVE_INDEX = 1.31;

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
	// n.x      =  n.x;

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
	vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= 100. * uNoiseAmp;
	
    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= 100. * uNoiseAmp;
	
	vec3 Normal = RotateNormal(angx, angy, vNormal);
	// vec3 Normal = vNormal;
	// vec3 vReflectVector = reflect(vEyeDir, Normal);
	
	vec3 vRefractVector = refract(vEyeDir, Normal, ICE_REFRACTIVE_INDEX);
	     //vRefractVector = refract(vRefractVector, Normal, -uEta);
	
	// vec4 reflectColor = textureCube(uReflectUnit, vReflectVector);
	vec4 refractColor = textureCube(uRefractUnit, vRefractVector);
	refractColor = mix(refractColor, WHITE, 0.4);
	//gl_FragColor = vec4( mix(refractColor, reflectColor, uMix).rgb, 1. );
	gl_FragColor = vec4( refractColor.rgb, 1. );
	//gl_FragColor = WHITE;
}
