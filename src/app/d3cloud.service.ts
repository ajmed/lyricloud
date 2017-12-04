import {LogService} from "./log/log.service";
import {Injectable} from "@angular/core";
import wordCloud from 'd3.layout.cloud'

@Injectable()
export class D3cloudService {

  wordCloud
  words = ["Hello", "world", "normally", "you", "want", "more", "words", "than", "this"]
    .map(function(d) {
      return {text: d, size: 10 + Math.random() * 90};
    });

  constructor(private log: LogService) {
  }

  end(words) { console.log(JSON.stringify(words)) }

  start(canvasHtmlElement) {
    this.wordCloud = wordCloud().size([960, 500])
      .canvas(() => { return canvasHtmlElement })
      .words(this.words)
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("word", (wordObject) => { this.onWordPlaced(wordObject) })
      .on("end", this.end)
      .start();
  }


  private onWordPlaced(wordObject) {
    wordObject.fillStyle = "green"
    console.log(wordObject)
  }
}
