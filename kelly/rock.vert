#version 330 compatibility

const float PI		= 3.14159;

uniform float uLightX, uLightY, uLightZ;

uniform float  uA;
uniform float  uB;
uniform float  uC;
uniform float  uD;

out vec3 vMCposition;
out vec3 vEyeDir;

void
main( )
{
	vMCposition.xyz = gl_Vertex.xyz;
	float r = sqrt(vMCposition.x * vMCposition.x + vMCposition.y * vMCposition.y);
	vMCposition.z = uA * cos(2 * PI * uB * r + uC) * exp(-uD * r);
	
	vec4 vertex = vec4(vMCposition, 1.);
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	
	vEyeDir = ECposition - vec3(0., 0., 0.);    // vector from eye to pt
	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}
