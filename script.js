var video = document.createElement("video");
video.setAttribute('id', 'video');
video.setAttribute('width', '720');
video.setAttribute('height', '560');
video.setAttribute('autoplay', 'muted');
document.body.appendChild(video);
document.getElementById("video").style.display = "none";

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
    // console.log(video)
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
  // document.getElementById("video").style.display = "none"
})