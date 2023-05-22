//
// This example assumes you are importing mux-embed from npm
// View this code on codesandbox: https://codesandbox.io/s/mux-data-dash-js-react-irp99
//
import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";
import ControlBar from "./ControlBar";

import "./icomoon.ttf";
import "./styles.css";
import "./controlbar.css";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const src =
    //  "https://d39n744uhkvepr.cloudfront.net/localhost/files/video/out.mpd";
    "http://localhost:4000/videounreal_10_20_58";
  //  "https://dash.akamaized.net/digitalprimates/fraunhofer/480p_video/heaac_2_0_with_video/Sintel/sintel_480p_heaac2_0.mpd"

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      playerRef.current = dashjs.MediaPlayer().create();
      playerRef.current.updateSettings({
        streaming: {
          abr: {
            useDefaultABRRules: true,
            ABRStrategy: 'abrThroughput',
          }
        }
      })

      // abrThroughput is a bitrate selection strategy used with Adaptive Bitrate (ABR) streaming. It is based on selecting the highest possible bitrate that has a throughput value lower than the current bandwidth estimate of the player. This means that the player will select the highest quality stream that it believes can be downloaded smoothly without buffering, based on the current network conditions.
      // The abrThroughput strategy also takes into account the buffer level and the time required to download new segments of content. The goal of this strategy is to always choose the highest available quality, without causing frequent buffering or stalling due to insufficient network bandwidth.
      // By using this strategy, the player can provide the best viewing experience for the viewer by providing the highest possible video quality that their device and network connection can handle without issues.

      // useDefaultABRRules: This enables or disables the player's default ABR rules.
      // ABRStrategy: This specifies the strategy for selecting bitrates. Here, the "abrThroughput" 
      // strategy is being used which selects the highest bitrate that has a throughput value lower than the current bandwidth estimate of the player.
      // additionalAbrRules: This is an object that contains additional ABR rules. The following rules are being set to the values shown:
      // insufficientBufferRule: true: This rule triggers an ABR switch if the buffer level falls below a certain threshold.
      // switchHistoryRule: false: This rule sets whether past quality switches should be considered while selecting a new quality.
      // droppedFramesRule: false: This rule sets whether dropped frames should affect the ABR logic.
      // abandonRequestsRule: false: This rule sets whether content requests that don't succeed within a certain time limit should be abandoned.

      playerRef.current.initialize(video, src, true);
      playerRef.current.attachView(video);

      const controlbar = new ControlBar(playerRef.current);
      //Player is instance of Dash.js MediaPlayer;
      controlbar.initialize();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="container">
      <div class="dash-video-player">
        <div class="videoContainer" id="videoContainer">
          <video
            slot="media"
            controls={false}
            ref={videoRef}
            style={{ width: "100%" }}
            preload="auto"
            autoplay="true"
          />
          <div id="videoController" class="video-controller unselectable">
            <div id="playPauseBtn" class="btn-play-pause" title="Play/Pause">
              <span id="iconPlayPause" class="icon-play"></span>
            </div>
            <span id="videoTime" class="time-display">
              00:00:00
            </span>
            <div
              id="fullscreenBtn"
              class="btn-fullscreen control-icon-layout"
              title="Fullscreen"
            >
              <span class="icon-fullscreen-enter"></span>
            </div>
            <div
              id="bitrateListBtn"
              class="control-icon-layout"
              title="Bitrate List"
            >
              <span class="icon-bitrate"></span>
            </div>
            <input
              type="range"
              id="volumebar"
              class="volumebar"
              value="0"
              min="0"
              max="1"
              step=".01"
            />
            <div id="muteBtn" class="btn-mute control-icon-layout" title="Mute">
              <span id="iconMute" class="icon-mute-off"></span>
            </div>
            <div
              id="trackSwitchBtn"
              class="control-icon-layout"
              title="A/V Tracks"
            >
              <span class="icon-tracks"></span>
            </div>
            <div
              id="captionBtn"
              class="btn-caption control-icon-layout"
              title="Closed Caption"
            >
              <span class="icon-caption"></span>
            </div>
            <span id="videoDuration" class="duration-display">
              00:00:00
            </span>
            <div class="seekContainer">
              <div id="seekbar" class="seekbar seekbar-complete">
                <div id="seekbar-buffer" class="seekbar seekbar-buffer"></div>
                <div id="seekbar-play" class="seekbar seekbar-play"></div>
              </div>
            </div>
            <div id="thumbnail-container" class="thumbnail-container">
              <div id="thumbnail-elem" class="thumbnail-elem"></div>
              <div id="thumbnail-time-label" class="thumbnail-time-label"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
