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
in vec3 vEyeDir;

uniform float           uEta;
uniform float           uMix;
uniform samplerCube     uReflectUnit;
uniform samplerCube     uRefractUnit;

const vec4 WHITE = vec4(1., 1., 1., 1.);

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
	float r = sqrt(vMCposition.x * vMCposition.x + vMCposition.y * vMCposition.y);
	float drdx = vMCposition.x / r;
	float drdy = vMCposition.y / r;
	float dzdr = 	  uA * cos(2. * PI * uB * r + uC) * 2. * PI * uB * exp(-uD * r)
					- uA * sin(2. * PI * uB * r + uC) * 2. * PI * uB * exp(-uD * r);
	float dzdx = dzdr * drdx;
	float dzdy = dzdr * drdy;
	
	vec3 tx = vec3(1., 0., dzdx);
	vec3 ty = vec3(0., 1., dzdy);
	vec3 normal = normalize(cross(tx, ty));
	
	vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
	
    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;
	
	vec3 Normal = RotateNormal(angx, angy, normal);
	vec3 vReflectVector = reflect(vEyeDir, Normal);
	vec3 vRefractVector = refract(vEyeDir, Normal, uEta);
	
	vec4 reflectColor = textureCube(uReflectUnit, vReflectVector);
	vec4 refractColor = textureCube(uRefractUnit, vRefractVector);
	refractColor = mix(refractColor, WHITE, .40);
	gl_FragColor = vec4( mix(refractColor, reflectColor, uMix).rgb, 1. );
}
