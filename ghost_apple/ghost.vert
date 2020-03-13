#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

out vec3 vMCposition;
out vec3 vNormal;
out vec3 vLf;
out vec3 vEf;

void
main( )
{
    vec4 vertex = gl_Vertex;
	
    vMCposition.xyz     = vertex.xyz;
    vNormal             = gl_Normal;

    vec3 ECposition = ( gl_ModelViewMatrix * vertex ).xyz;
    vLf = eyeLightPosition - ECposition.xyz;        // vector from the point to the light position
    vEf = vec3( 0., 0., 0. ) - ECposition.xyz;      // vector from the point to the eye position 

    gl_Position = gl_ModelViewProjectionMatrix * vertex;
}
