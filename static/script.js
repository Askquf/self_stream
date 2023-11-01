feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const micOptions = document.querySelector('.audio-options>select')
const video = document.querySelector('video');
const audio = document.querySelector('audio')
const canvas = document.querySelector('canvas');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause] = buttons;

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};

const audioConstraints = {
    audio:  {
        sampleRate: 44100,
        channelCount: 2,
        autoGainControl: true,
        noiseSuppression: true,
        echoCancellation: true
    }
}

const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  console.log(devices)
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const audioDevices = devices.filter(device => device.kind === 'audioinput');
  console.log(audioDevices)
  const videoOptions = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  const audioOptions = audioDevices.map(audioDevice => {
    return `<option value="${audioDevice.deviceId}">${audioDevice.label}</option>`;
  });
  cameraOptions.innerHTML = videoOptions.join('');
  micOptions.innerHTML = audioOptions.join('');
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    audio.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value
      }
    };
    const updatedAudioConstraints = {
        ...audioConstraints,
        deviceId: {
            exact: micOptions.value
        }
    }
    startStream(updatedConstraints, updatedAudioConstraints);
  }
};

const startStream = async (constraints, audioConstraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints)
  handleStream(stream, audioStream);
};

const handleStream = (stream, audioStream) => {
  video.srcObject = stream;
  audio.srcObject = audioStream
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  streamStarted = true;
};

getCameraSelection();

const changeDevice = () => {
    const updatedConstraints = {
        ...constraints,
        deviceId: {
          exact: cameraOptions.value
        }
      };
      const updatedAudioConstraints = {
          ...audioConstraints,
          deviceId: {
              exact: micOptions.value
          }
      }
      startStream(updatedConstraints, updatedAudioConstraints);
};

cameraOptions.onchange = changeDevice
micOptions.onchange = changeDevice


const pauseStream = () => {
  video.pause();
  audio.pause()
  play.classList.remove('d-none');
  pause.classList.add('d-none');
};

pause.onclick = pauseStream;