// buildAtlasJson.js
// Run this after you have your resized frames in frames_resized/
// It will sort them alphabetically (like montage did), assign indices, and build a JSON mapping.

const fs = require("fs");
const path = require("path");

// Path where your final 64x64 frames are
const framesDir = path.join(__dirname, "frames_resized");

// These are your animations and expected frame counts
const animationsConfig = {
  celebrate: 6,
  eat: 4,
  idle: 4,
  sick: 3,
  walk: 6,
};

function buildAtlas() {
  const files = fs.readdirSync(framesDir).sort(); // alphabetic = montage order

  let currentIndex = 0;
  const animations = {};

  for (const [anim, count] of Object.entries(animationsConfig)) {
    animations[anim] = {
      start_index: currentIndex,
      count,
      // tweak fps here if you want slower animations
      fps:
        anim === "idle"
          ? 2
          : anim === "sick"
          ? 2
          : anim === "eat"
          ? 3
          : anim === "walk"
          ? 4
          : 3, // celebrate
    };
    currentIndex += count;
  }

  const json = {
    frame_size: [64, 64],
    atlas_size: [512, 512],
    columns: 8,
    animations,
  };

  fs.writeFileSync(
    path.join(__dirname, "assets/capy_atlas.json"),
    JSON.stringify(json, null, 2)
  );

  console.log("✅ capy_atlas.json rebuilt with correct mapping!");
}

buildAtlas();
