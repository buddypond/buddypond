export default class Eyes {
  constructor(bp, options = {}) {
    this.bp = bp;
    this.options = options;

    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.faceLandmarker = null;
    this.running = false;
    this.lastVideoTime = -1;

    return this;
  }

  async init() {
    this.html = `
      <div class="eyes-app" style="width:100%;height:100%;background:#111;color:white;display:flex;flex-direction:column;">
        <div style="padding:8px;">
          <button class="eyes-start">Start Camera</button>
          <button class="eyes-stop">Stop</button>
          <span class="eyes-status">Idle</span>
        </div>
        <div class="eyes-stage" style="position:relative;flex:1;overflow:hidden;background:#000;">
          <video class="eyes-video" autoplay playsinline muted style="position:absolute;width:100%;height:100%;object-fit:cover;transform:scaleX(-1);"></video>
          <canvas class="eyes-canvas" style="position:absolute;width:100%;height:100%;transform:scaleX(-1);"></canvas>
        </div>
      </div>
    `;

    const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/+esm');

    const filesetResolver = await vision.FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
    );

    this.faceLandmarker = await vision.FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false
    });

    return 'loaded Eyes';
  }

  async open() {
    if (!this.win) {
      this.win = await this.bp.window(this.window());

      const root = this.win.content || this.win.body || document.querySelector('#eyes');
      const el = root.querySelector ? root : document;

      this.video = el.querySelector('.eyes-video');
      this.canvas = el.querySelector('.eyes-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.status = el.querySelector('.eyes-status');

      el.querySelector('.eyes-start').onclick = () => this.startCamera();
      el.querySelector('.eyes-stop').onclick = () => this.stopCamera();
    }

    return this.win;
  }

  window() {
    return {
      id: 'eyes',
      title: 'Eyes',
      icon: 'desktop/assets/images/icons/icon_buddy-frog_64.webp',
      position: 'center',
      parent: $('#desktop')[0],
      width: 850,
      height: 600,
      content: this.html,
      resizable: true,
      closable: true,
      onClose: () => {
        this.stopCamera();
        this.win = null;
      }
    };
  }

  async startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    this.video.srcObject = stream;
    await this.video.play();

    this.running = true;
    this.status.textContent = 'Detecting eyes...';

    requestAnimationFrame(() => this.loop());
  }

  stopCamera() {
    this.running = false;

    if (this.video?.srcObject) {
      for (const track of this.video.srcObject.getTracks()) {
        track.stop();
      }
      this.video.srcObject = null;
    }

    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (this.status) {
      this.status.textContent = 'Stopped';
    }
  }

  loop() {
    if (!this.running) return;

    const video = this.video;

    if (video.readyState >= 2 && video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = video.currentTime;

      this.resizeCanvas();

      const result = this.faceLandmarker.detectForVideo(
        video,
        performance.now()
      );

      this.draw(result);
    }

    requestAnimationFrame(() => this.loop());
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = Math.floor(rect.width * dpr);
    const height = Math.floor(rect.height * dpr);

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  draw(result) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (!result.faceLandmarks?.length) {
      this.status.textContent = 'No face detected';
      return;
    }

    this.status.textContent = 'Face detected';

    const lm = result.faceLandmarks[0];

    this.drawEyeLinerGuide(ctx, lm, 'left', w, h);
    this.drawEyeLinerGuide(ctx, lm, 'right', w, h);
  }

  point(lm, index, w, h) {
    return {
      x: lm[index].x * w,
      y: lm[index].y * h
    };
  }

  drawEyeLinerGuide(ctx, lm, side, w, h) {
    // MediaPipe FaceMesh landmark indexes
    const indexes = side === 'left'
      ? {
          inner: 133,
          outer: 33,
          upper: [246, 161, 160, 159, 158, 157, 173],
          browTail: 46
        }
      : {
          inner: 362,
          outer: 263,
          upper: [466, 388, 387, 386, 385, 384, 398],
          browTail: 276
        };

    const inner = this.point(lm, indexes.inner, w, h);
    const outer = this.point(lm, indexes.outer, w, h);
    const browTail = this.point(lm, indexes.browTail, w, h);
    const upper = indexes.upper.map(i => this.point(lm, i, w, h));

    const eyeWidth = this.dist(inner, outer);

    // Wing direction: from outer eye corner toward brow tail
    let wingDir = {
      x: browTail.x - outer.x,
      y: browTail.y - outer.y
    };

    wingDir = this.normalize(wingDir);

    const wingLength = eyeWidth * 0.35;

    const wingEnd = {
      x: outer.x + wingDir.x * wingLength,
      y: outer.y + wingDir.y * wingLength
    };

    // Draw upper lash-line guide
    ctx.save();

    ctx.lineWidth = Math.max(3, eyeWidth * 0.035);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(255, 0, 180, 0.9)';
    ctx.shadowBlur = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(inner.x, inner.y);

    for (const p of upper) {
      ctx.lineTo(p.x, p.y);
    }

    ctx.lineTo(outer.x, outer.y);
    ctx.stroke();

    // Draw wing
    ctx.beginPath();
    ctx.moveTo(outer.x, outer.y);
    ctx.lineTo(wingEnd.x, wingEnd.y);
    ctx.stroke();

    // Draw pink anatomy points for debugging
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 0, 180, 0.9)';

    for (const p of [inner, outer, browTail, ...upper]) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  normalize(v) {
    const len = Math.hypot(v.x, v.y) || 1;
    return {
      x: v.x / len,
      y: v.y / len
    };
  }
}