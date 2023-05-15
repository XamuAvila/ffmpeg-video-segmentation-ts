#!/bin/bash
# This script extracts audio from a video file and saves it to a specified output path.

if [ $# -ne 2 ]; then
    echo "Usage: $0 input_video_file output_audio_file"
    exit 1
fi

input_file="$1"
output_file="$2"

ffmpeg -i "$input_file" -c:a copy -vn -f mp4 "$output_file"

echo "Audio extracted from \"$input_file\" and saved as \"$output_file\""
