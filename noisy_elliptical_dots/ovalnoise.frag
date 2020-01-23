#version 330 compatibility

in vec4  vColor;
in vec3  vMCposition;
in vec3  vECposition;
in float vLightIntensity;
in vec2  vST;

uniform float uAd;
uniform float uBd;
uniform sampler3D Noise3;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;
uniform float uTol;
uniform vec4  uSquareColor;
uniform bool  uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;

vec3
ChromaDepth( float d )
{
	d = clamp( d, 0., 1. );
	
	float r = 6. * ( d - ( 5. / 6. ) );
	float g = 0.;
	float b = 1. - 6. * ( d - ( 5. / 6. ) );
	
	if( d <= (5./6.) )
	{
		r = 6. * ( d - (4./6.) );
		g = 0.;
		b = 1.;
	}

	if( d <= (4./6.) )
	{
		r = 0.;
		g = 1.  -  6. * ( d - (3./6.) );
		b = 1.;
	}

	if( d <= (3./6.) )
	{
		r = 0.;
		g = 1.;
		b = 6. * ( d - (2./6.) );
	}

	if( d <= (2./6.) )
	{
		r = 1.  -  6. * ( d - (1./6.) );
		g = 1.;
		b = 0.;
	}

	if( d <= (1./6.) )
	{
		r = 1.;
		g = 6. * d;
	}

	return vec3(r, g, b);
}

void
main( )
{
	vec2 st = vST.st;
	float sp = 2. * st.s;		// good for spheres
	float tp = st.t;
	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( sp / uAd );
	int numint = int( tp / uBd );

	// read the glman noise texture and convert it to a range of [-1.,+1.]:

	vec4 nv  = texture3D( Noise3, uNoiseFreq * vMCposition );
	float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
	n = uNoiseAmp * (n - 2.);                             // -1. -> 1.

	// determine the color based on the noise-modified (s,t):

	float sc = float(numins) * uAd  +  Ar;
	float ds = abs(sp - sc);                   // wrt ellipse center
	float tc = float(numint) * uBd  +  Br;
	float dt = abs(tp - tc);                   // wrt ellipse center

	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = sqrt( ds*ds + dt*dt + n);
	float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

	ds *= scale;                            // scale by noise factor
	ds /= Ar;                               // ellipse equation

	dt *= scale;                            // scale by noise factor
	dt /= Br;                               // ellipse equation

	float maxDist = ds * ds + dt * dt;

	float d = smoothstep( 1. - uTol, 1. + uTol, maxDist );

	vec4 visibleColor = uSquareColor;
	if ( uUseChromaDepth ) {
		float t = ( 2. / 3. ) * ( vECposition.z - uChromaRed ) / ( uChromaBlue - uChromaRed );
		t = clamp( t, 0., 2./3. );
		visibleColor.rgb = ChromaDepth( t );
	}
	gl_FragColor = mix( visibleColor, vec4(vColor.rgb, uAlpha), d );

	gl_FragColor.rgb *= vLightIntensity;	// apply lighting model

	if (gl_FragColor.a == 0.)
		discard;
}
