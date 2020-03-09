#version 330 compatibility

const float PI		= 3.14159;

// uniform float uLightX, uLightY, uLightZ;

uniform sampler3D Noise3;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

out vec3 vMCposition;
out vec3 vNormal;
out vec3 vEyeDir;

void
main( )
{
	vMCposition.xyz = gl_Vertex.xyz;
	vNormal = gl_Normal;
	
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vEyeDir = ECposition - vec3(0., 0., 0.);    // vector from eye to pt
	
	vec3 vertex = gl_Vertex.xyz;
	vec4 nv  = texture3D( Noise3, uNoiseFreq * vertex );
	vec3 n = 0.01 * uNoiseAmp * nv.xyz;                             // -1. -> 1.
	//vertex += n;
	
	gl_Position = gl_ModelViewProjectionMatrix * vec4( vertex, 1. );
}
