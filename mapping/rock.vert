#version 330 compatibility

const float PI		= 3.14159;

uniform float uLightX, uLightY, uLightZ;

uniform float  uA;
uniform float  uB;
uniform float  uC;
uniform float  uD;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

out vec3 vMCposition;
out vec3 vLf;
out vec3 vEf;

void
main( )
{
	vMCposition.xyz = gl_Vertex.xyz;
	float r = sqrt(vMCposition.x * vMCposition.x + vMCposition.y * vMCposition.y);
	vMCposition.z = uA * cos(2 * PI * uB * r + uC) * exp(-uD * r);
	
	vec4 vertex = vec4(vMCposition, 1.);
	vec3 ECposition = ( gl_ModelViewMatrix * vertex ).xyz;
	vLf = eyeLightPosition - ECposition.xyz;		// vector from the point to the light position
	vEf = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point to the eye position 

	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}
