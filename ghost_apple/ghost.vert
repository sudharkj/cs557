#version 330 compatibility

out vec3 vEyeDir;
out vec3 vMCposition;
out vec3 vNormal;

void
main( )
{
    vec4 vertex = gl_Vertex;
	
    vMCposition.xyz     = vertex.xyz;
    vNormal             = gl_Normal;

    vec3 ECposition = ( gl_ModelViewMatrix * vertex ).xyz;
    vEyeDir         = ECposition.xyz - vec3( 0., 0., 0. );      // vector from the point to the eye position

    gl_Position = gl_ModelViewProjectionMatrix * vertex;
}
