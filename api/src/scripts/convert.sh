#!/bin/sh

# -an: This option tells FFmpeg to strip the audio from the input file.

# -c:v libx264: This option sets the video codec to H.264 (also known as libx264), which is a commonly used standard for video compression.

# -vf "scale=w=$3:h=$4:force_original_aspect_ratio=decrease": This option applies a video filter to scale down the input video to the 
# desired width and height while maintaining its original aspect ratio. The values of $3 and $4 
# represent the desired output width and height, respectively, which will also be passed 
# in as arguments by the user. The force_original_aspect_ratio=decrease parameter 
# ensures that the video is always scaled down without distorting its original aspect ratio.


# Check if input and output file paths are provided
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]
then
  echo "Usage: $0 <input_file_path> <output_file_path> <width> <height>"
  exit 1
fi

# Run ffmpeg command with dynamic width and height values
ffmpeg -i "$1" -an -c:v libx264 -vf "scale=w=$3:h=$4:force_original_aspect_ratio=decrease" "$2"
