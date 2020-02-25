#version 330 compatibility

uniform float uSCenter;
uniform float uTCenter;
uniform float uDs;
uniform float uDt;
uniform float uRotAngle;
uniform float uSharpFactor;
uniform sampler2D ImageUnit;
uniform float uMagFactor;
uniform float uDiam;
uniform bool circle; 

in vec2  vST;
in vec4  vColor;


vec3 doSharpening(vec2 st, vec2 a)
{
    vec2 stp0 = vec2(1./st.s,       0.);
    vec2 st0p = vec2(     0.,  1./st.t);
    vec2 stpp = vec2(1./st.s,  1./st.t);
    vec2 stpm = vec2(1./st.s, -1./st.t);

    vec3 i00   = texture2D( ImageUnit, a ).rgb;
    vec3 im1m1 = texture2D( ImageUnit, a-stpp ).rgb;
    vec3 ip1p1 = texture2D( ImageUnit, a+stpp ).rgb;
    vec3 im1p1 = texture2D( ImageUnit, a-stpm ).rgb;
    vec3 ip1m1 = texture2D( ImageUnit, a+stpm ).rgb;
    vec3 im10 =  texture2D( ImageUnit, a-stp0 ).rgb;
    vec3 ip10 =  texture2D( ImageUnit, a+stp0 ).rgb;
    vec3 i0m1 =  texture2D( ImageUnit, a-st0p ).rgb;
    vec3 i0p1 =  texture2D( ImageUnit, a+st0p ).rgb;
    vec3 target = vec3(0.,0.,0.);
    target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
    target += 2.*(im10+ip10+i0m1+i0p1);
    target += 4.*(i00);
    target /= 16.;
    return target;
}

void main()
{
    vec2 ires = textureSize(ImageUnit, 0);
    vec3 image = texture2D(ImageUnit, vST).rgb;
    bool inLens = false;

    float x = vST.s - uSCenter;
    float y = vST.t - uTCenter;

    if (circle && (x * x + y * y <= uDiam * uDiam / 4)) inLens = true;
    if (!circle && (x > -uDs && x < uDs && y > -uDt && y < uDt)) inLens = true;

    if (inLens) {
        x = (x / uMagFactor) + uSCenter;
        y = (y / uMagFactor) + uTCenter;
        float xd = x * cos(uRotAngle) - y * sin(uRotAngle);
        float yd = x * sin(uRotAngle) + y * cos(uRotAngle);

        vec2 newST = vec2(xd , yd);
        vec3 color = texture2D( ImageUnit, newST ).rgb;

        vec3 target = doSharpening(ires, newST);
        gl_FragColor= vec4(mix(target, color, uSharpFactor), 1.);
    } else gl_FragColor = vec4(image, 1.);
}
