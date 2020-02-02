#version 120

uniform float LightX, LightY, LightZ;

flat varying vec3 Nf;
     varying vec3 Ns;
flat varying vec3 Lf;
     varying vec3 Ls;
flat varying vec3 Ef;
     varying vec3 Es;

vec3 eyeLightPosition = vec3( LightX, LightY, LightZ );


void
main( )
{ 

	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;

	Nf = normalize( gl_NormalMatrix * gl_Normal );	// surface normal vector
	Ns = Nf;

	Lf = eyeLightPosition - ECposition.xyz;		// vector from the point
									// to the light position
	Ls = Lf;
	Ef = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point
									// to the eye position 
	Es = Ef;

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
