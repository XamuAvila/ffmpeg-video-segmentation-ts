#!/bin/bash

# Check if there are 5 arguments
if [ $# -ne 5 ]; then
  echo "Usage: $0 <480p_file> <720p_file> <1080p_file> <audio_file> <output_dir>"
  exit 1
fi

# Set the output directory and MPD file name
OUTPUT_DIR="$5"
MPD_OUTPUT_FILE="$OUTPUT_DIR/video.mpd"

# Generate the multi-bitrate MPD file using MP4Box
MP4Box -dash 5000 -rap -profile dashavc264:live -out "$MPD_OUTPUT_FILE" "$1#video" "$2#video" "$3#video" "$4#audio"
