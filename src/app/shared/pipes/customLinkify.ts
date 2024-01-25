import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import emojiRegex from 'emoji-regex';

@Pipe({
  name: 'customLinkify'
})
export class CustomLinkifyPipe implements PipeTransform {
  constructor(private _domSanitizer: DomSanitizer) {}

  transform(value: any, args?: any): any {
    var result;
    let content: any = value;
    while ((result = emojiRegex().exec(content)) !== null) {
      content = content.replace(this.customEmojiRegex, this.getEmojiImage(result[0]));
    }
    return this._domSanitizer.bypassSecurityTrustHtml(this.customStylize(content));
  }

  private customStylize(text: string): string {
    let stylizedText: string = '';
    if (text && text.length > 0) {
      for (let t of text.split(" ")) {
        if (t.startsWith("http") && t.length>1){
          stylizedText +=  `<a href="${t}" target="_blank">${t}</a> `;
        } else {
          stylizedText += t + " ";
        }
      }
      return stylizedText;
    } else {
      return text;
    }
  }

  private customEmojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

  private getEmojiImage(emoji) {
    const code = this.customEmojiUnicode(emoji);
    return ' ' + '<img class="post-emoji emojioneemoji" src="/assets/images/emoji/64/' + code + '.png">' + ' ';
  }

  private customEmojiUnicode(emoji) {
    var comp;
    if (emoji.length === 1) {
      comp = emoji.charCodeAt(0);
    }
    comp = (
      (emoji.charCodeAt(0) - 0xD800) * 0x400
      + (emoji.charCodeAt(1) - 0xDC00) + 0x10000
    );
    if (comp < 0) {
      comp = emoji.charCodeAt(0);
    }
    return comp.toString("16");
  }
}
