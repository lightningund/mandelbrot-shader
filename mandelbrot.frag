vec2 complexSquare(vec2 num) {
    return vec2(num.x * num.x - num.y * num.y, 2.0 * num.x * num.y);
}

vec3 hsv2rgb(vec3 c) {
  vec3 k = vec3(1.0, 2.0 / 3.0, 1.0 / 3.0);
  vec3 p = abs(fract(c.xxx + k.xyz) * 6.0 - 3.0);
  return c.z * mix(k.xxx, clamp(p - 1.0, 0.0, 1.0), c.y);
}

const float shrinkPerFrame = 0.995;
const int iterations = 1000;
const vec2 zoomPoint = vec2(-0.1502, 0.8998);
// const vec2 zoomPoint = vec2(0, 0);

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 viewPointSize = vec2(4.0, 4.0) * (pow(shrinkPerFrame, float(iFrame % 2000)));
    // vec2 viewPointSize = vec2(4.0, 4.0) / ((cos(float(iFrame) / 500.0) + 1.0) * 100000.0 + 1.0);
    // vec2 viewPointSize = vec2(4.0, 4.0);
    vec2 viewPointStart = zoomPoint - viewPointSize / 2.0;
    vec2 viewPointEnd = zoomPoint + viewPointSize / 2.0;

    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.xy;
	vec2 complexCoords = uv * viewPointSize + viewPointStart;

    // Time varying pixel color
    vec3 col = vec3(0, 0, 0);

    vec2 point = complexCoords.xy;

    for(int i = 0; i < iterations; i ++) {
        point = complexSquare(point);
        point += complexCoords;

        if(dot(point, point) > 4.0) {
            col.xyz = vec3(float(i * 8 % 256) / 256.0, 1, 1);
            break;
        }
    }

    // Output to screen
    fragColor = vec4(hsv2rgb(col), 1.0);
}