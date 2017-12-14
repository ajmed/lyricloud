import {LogService} from "./log/log.service";
import {Injectable} from "@angular/core";
import * as d3 from 'd3v4'
import wordCloud from 'd3-cloud'

@Injectable()
export class D3cloudService {

  wordCloud
  width = 512
  height = 512

  constructor(private log: LogService) {
  }


  draw(words) {
    let fill = d3.scaleOrdinal(d3.schemeCategory10)
    d3.select('#word-cloud-canvas')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(150,150)')
      .selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', function(d) { return d.size + 'px' } )
      .style('font-family', 'Impact')
      .style('fill', function(d, i) { return fill(i); })
      .attr('text-anchor', 'middle')
      .attr('transform', function(d) { return `translate(${d.x}, ${d.y}) rotate(${d.rotate})` })
      .text(function(d) { return d.text })
  }

  mapWords(words) {
    return words.map(word => { return {text: word, size: 10 + Math.random() * 90} })
  }

  start(canvas, words) {
    this.wordCloud = wordCloud()
      .size([this.width, this.height])
      .words(this.mapWords(words))
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      /*.on("word", (wordObject) => { this.onWordPlaced(wordObject) })*/
      .on("end", this.draw)
      .start();
  }

  /*private onWordPlaced(wordObject) {
    wordObject.fillStyle = "green"
    console.log(wordObject)
  }*/
}
