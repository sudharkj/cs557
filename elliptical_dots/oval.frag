#version 330 compatibility

in vec4  vColor;
in float vLightIntensity;
in vec2  vST;

uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform vec4  uSquareColor;

void
main( )
{
	float halfSize = max(uAd, uBd)/2.;
	float s = vST.s;
	float t = vST.t;
	float sp = 2. * s;		// good for symtrical objects
	float tp = t;
	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( sp / uAd );
	int numint = int( tp / uBd );

	gl_FragColor = vColor;		// default color

	float scenter = float(numins)*uAd + Ar;
	float tcenter = float(numint)*uBd + Br;
	float ds = abs(sp - scenter);	// 0. <= ds <= sp
	float dt = abs(tp - tcenter);	// 0. <= dt <= tp
	float maxDist = (ds * ds) / (Ar * Ar) + (dt * dt) / (Br * Br);
	float d = smoothstep( halfSize-uTol, halfSize+uTol, maxDist );
	gl_FragColor = mix( uSquareColor, vColor, d );

	gl_FragColor.rgb *= vLightIntensity;	// apply lighting model
}
