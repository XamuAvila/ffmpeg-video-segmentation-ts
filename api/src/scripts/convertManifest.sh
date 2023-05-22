#!/bin/bash

# dash 5000: This specifies that the DASH manifest should be split into segments of 5 seconds.

# profile dashavc264:live: This specifies that the output format should be compatible with the DASH AVC/H.264 video codec for live streaming.

# url-template: This enables URL templating, which allows the player to easily retrieve the correct segment for playback.

# segment-timeline: This specifies that the DASH manifest should use a timeline-based indexing scheme, which allows for greater precision when seeking within a video.

# Check if there are 5 arguments
if [ $# -ne 5 ]; then
  echo "Usage: $0 <480p_file> <720p_file> <1080p_file> <audio_file> <output_dir>"
  exit 1
fi

# Set the output directory and MPD file name
OUTPUT_DIR="$5"
MPD_OUTPUT_FILE="$OUTPUT_DIR/video.mpd"

# Generate the multi-bitrate MPD file using MP4Box
MP4Box -dash 5000 -profile dashavc264:live -url-template -segment-timeline -out "$MPD_OUTPUT_FILE" "$1#video" "$2#video" "$3#video" "$4#audio" -url-template -base-url  "http://localhost:4000/videos/" 
