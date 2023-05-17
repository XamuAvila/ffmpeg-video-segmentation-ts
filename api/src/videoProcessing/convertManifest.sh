#!/bin/bash

# Check if at least one argument was passed when running the script
if [ $# -lt 1 ]; then
    echo "Please provide the input video name as the first argument."
    echo "You may optionally provide the audio file name as the second argument."
    echo "You may also optionally provide the output directory path as the third argument."
    exit 1
fi

# Assign the input video name to a variable
input_video=$1

# If two arguments were passed, assign the second argument to the audio file name variable
if [ $# -ge 2 ]; then
    audio_file=$2
else
    # If only one argument was passed, assume the default audio file name
    audio_file=audio.mp4
fi

# If a third argument was provided, use it as the output directory
if [ $# -eq 3 ]; then
    output_dir=$3
else
    # If no third argument was provided, use the current working directory as the output directory
    output_dir=.
fi

# Run the MP4Box command with the specified parameters, input video, and audio file
MP4Box -dash 2000 -frag 2000 -rap -profile dashavc264:live \
    -out ${output_dir}/video.mpd \
    ${input_video}_1080.mp4#video:id=${input_video}_1080 \
    ${input_video}_720.mp4#video:id=${input_video}_720 \
    ${input_video}_480.mp4#video:id=${input_video}_480 \
    ${audio_file}#audio:id=audio_1
