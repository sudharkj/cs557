#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;

out vec3  vNf;
out vec3  vLf;
out vec3  vEf;
out vec2  vST;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

void
main( )
{
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	
	vNf = normalize( gl_NormalMatrix * gl_Normal );	// surface normal vector
	vLf = eyeLightPosition - ECposition.xyz;		// vector from the point to the light position
	vEf = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point to the eye position 
	
	vST = gl_MultiTexCoord0.st;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
