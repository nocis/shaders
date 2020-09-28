#version 150

out vec4 fragColor;

void main() {
  fragColor = vec4(0, 1, 0, 1);
  //a fragment affects at most one screen pixel but a single pixel can be affected by many fragments.
}
