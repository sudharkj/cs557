#version 330 compatibility

in vec3  vNf;
in vec3  vLf;
in vec3  vEf;
in vec2  vST;

uniform float uKa, uKd, uKs;
uniform float uShininess;
uniform vec3 uSpecularColor;

uniform float Timer;

void
main( )
{	
    vec3 color = vec3( vST.x, vST.y, abs(sin(2 * 3.14 * Timer)) );

	vec3 Normal = normalize(vNf);
	vec3 Light = normalize(vLf);
	vec3 Eye = normalize(vEf);
	
	vec3 ambient = uKa * color;
	float d = max( dot( Normal, Light ), 0. );
	vec3 diffuse = uKd * d * color;
	float s = 0.;
	if( dot( Normal, Light ) > 0. )		// only do specular if the light can see the point
	{
		vec3 ref = normalize( 2. * Normal * dot( Normal, Light ) - Light );
		s = pow( max( dot( Eye, ref ),0. ), uShininess );
	}
	vec3 specular = uKs * s * uSpecularColor;
	
    gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1.0 );
	//gl_FragColor = vec4( color, 1.0 );
}
