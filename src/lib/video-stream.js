import { VideoRTC } from "./video-rtc.js";

/**
 * This is example, how you can extend VideoRTC player for your app.
 * Also you can check this example: https://github.com/AlexxIT/WebRTC
 */
export class VideoStream extends VideoRTC {
  constructor() {
    super();
    this.lastReceivedTimestamp = null;
    this.checkInterval = null;
  }
  /**
   * Custom GUI
   */
  oninit() {
    console.debug("stream.oninit");
    super.oninit();
    this.startReceivingCheck();
  }

  startReceivingCheck() {
    this.checkInterval = setInterval(() => {
      if (
        this.lastReceivedTimestamp &&
        Date.now() - this.lastReceivedTimestamp > 10000
      ) {
        // 10 seconds timeout
        console.error("No data received for 10 seconds.");
        this.onNoDataReceived();
      }
    }, 5000); // check every 5 seconds
  }

  onNoDataReceived() {
    console.error("Socket is not receiving data.");
    // Handle the case when no data is received
  }

  onconnect() {
    console.debug("stream.onconnect");
    const result = super.onconnect();
    if (result) this.divMode = "loading";
    return result;
  }

  ondisconnect() {
    console.debug("stream.ondisconnect");
    super.ondisconnect();
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  onopen() {
    console.debug("stream.onopen");
    const result = super.onopen();

    this.onmessage["stream"] = (msg) => {
      console.debug("stream.onmessge", msg);
      switch (msg.type) {
        case "error":
          this.divError = msg.value;
          break;
        case "mse":
        case "hls":
        case "mp4":
        case "mjpeg":
          this.divMode = msg.type.toUpperCase();
          break;
      }
    };

    return result;
  }

  onclose() {
    console.debug("stream.onclose");
    return super.onclose();
  }

  onpcvideo(ev) {
    console.debug("stream.onpcvideo");
    super.onpcvideo(ev);

    if (this.pcState !== WebSocket.CLOSED) {
      this.divMode = "RTC";
    }
  }
}

customElements.define("video-stream", VideoStream);
