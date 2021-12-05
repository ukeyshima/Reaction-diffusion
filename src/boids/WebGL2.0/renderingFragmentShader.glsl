#version 300 es
precision mediump float;

uniform sampler2D texture;

layout(location = 0) out vec4 outColor;

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    float A = texelFetch(texture, coord, 0).r;
    float B = texelFetch(texture, coord, 0).g;

    outColor = vec4(vec3(A - B), 1.0);
}