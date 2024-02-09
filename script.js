var video = document.createElement("video");
video.setAttribute('id', 'video');
video.setAttribute('width', '720');
video.setAttribute('height', '560');
video.setAttribute('autoplay', 'muted');
document.body.appendChild(video);


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://storage.googleapis.com/model1-bucket/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://storage.googleapis.com/model1-bucket/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('https://storage.googleapis.com/model1-bucket/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://storage.googleapis.com/model1-bucket/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  // document.getElementById("video").style.display = "inline"
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  // document.body.remove("video")
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetection = faceapi.resizeResults(detection, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    const { x, y, width, height } = resizedDetection.detection._box
    canvas.getContext('2d').fillRect(x, y, width, height)

    faceapi.draw.drawDetections(canvas, resizedDetection)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetection)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetection)
  }, 100)
  // document.getElementById("video").style.display = "none"
})