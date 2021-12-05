#version 300 es
precision mediump float;

uniform sampler2D texture;
uniform float da;
uniform float db;
uniform float f;
uniform float k;

layout(location = 0) out vec4 outColor;

vec3 laplacian(ivec2 coord) {
    vec3 sum = vec3(0.0);
    sum += texelFetch(texture, coord, 0).rgb * -1.0;
    sum += texelFetch(texture, coord + ivec2(-1, 0), 0).rgb * 0.2;
    sum += texelFetch(texture, coord + ivec2(1, 0), 0).rgb * 0.2;
    sum += texelFetch(texture, coord + ivec2(0, -1), 0).rgb * 0.2;
    sum += texelFetch(texture, coord + ivec2(0, 1), 0).rgb * 0.2;
    sum += texelFetch(texture, coord + ivec2(-1, -1), 0).rgb * 0.05;
    sum += texelFetch(texture, coord + ivec2(-1, 1), 0).rgb * 0.05;
    sum += texelFetch(texture, coord + ivec2(1, -1), 0).rgb * 0.05;
    sum += texelFetch(texture, coord + ivec2(1, 1), 0).rgb * 0.05;
    return sum;
}

void main(void) {
    ivec2 coord = ivec2(gl_FragCoord.xy);
    vec3 color = texelFetch(texture, coord, 0).rgb;
    vec3 l = laplacian(coord);

    float A = color.r;
    float B = color.g;

    A = A + da * l.r - A * B * B + f * (1.0 - A);
    B = B + db * l.g + A * B * B - (k + f) * B;

    color = vec3(A, B, 0.0);

    outColor = vec4(color, 1.0);
}