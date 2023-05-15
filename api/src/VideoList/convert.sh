#!/bin/sh

# Check if input and output file paths are provided
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]
then
  echo "Usage: $0 <input_file_path> <output_file_path> <width> <height>"
  exit 1
fi

# Run ffmpeg command with dynamic width and height values
ffmpeg -i "$1" -an -c:v libx264 -vf "scale=w=$3:h=$4:force_original_aspect_ratio=decrease" "$2"
