class AudioPlay {
  private endHourglass: string = 'http://fp-img.palxp.com/stickers/finish-01.mp3'
  private beganClockIn: string = 'http://fp-img.palxp.com/stickers/finish-00.mp3'
  private downer: string = 'http://fp-img.palxp.com/stickers/Downer-01.mp3'
  private audio: any = document.createElement('audio')
  constructor() {
    // this.endHourglass = require('../../assets/sound/finish-01.ogg')
    // this.beganClockIn = require('../../assets/sound/finish-00.ogg')
  }
  public play(name: string) {
    this.audio.src = (this as any)[name]
    // this.audio.volume = this.count === 1 ? 0 : 1
    if (this.audio.paused) {
      this.audio.play()
    } else {
      this.audio.load()
      this.audio.play()
    }
  }
}

export default AudioPlay
