import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoMapping } from '../../config/videoMapping';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const movieInfo = videoMapping[id];
    if (movieInfo) {
      setVideoInfo(movieInfo);
    } else {
      setError("Vidéo non disponible");
    }
  }, [id]);

  useEffect(() => {
    if (videoRef.current && videoInfo) {
      playerRef.current = new Plyr(videoRef.current, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'duration',
          'mute',
          'volume',
          'settings',
          'fullscreen'
        ],
        i18n: {
          play: 'Lecture',
          pause: 'Pause',
          mute: 'Muet',
          unmute: 'Activer le son',
          settings: 'Paramètres',
          fullscreen: 'Plein écran'
        }
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoInfo]);

  if (error) {
    return (
      <div className="video-player-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Retour
        </button>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Retour
      </button>
      <h1>{videoInfo?.title}</h1>
      <div className="plyr-container">
        <video
          ref={videoRef}
          className="plyr-video"
          crossOrigin="anonymous"
        >
          {videoInfo?.videoPath && (
            <source src={videoInfo.videoPath} type="video/mp4" />
          )}
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
