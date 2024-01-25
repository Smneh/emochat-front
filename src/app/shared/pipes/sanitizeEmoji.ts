import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import emojiRegex from 'emoji-regex';

@Pipe({
  name: 'sanitizeEmoji'
})
export class SanitizeEmoji implements PipeTransform {

  constructor(private sanitized: DomSanitizer) { }
  transform(value: unknown, ...args: unknown[]): unknown {
    var result;
    let content: any = value;
    while ((result = emojiRegex().exec(content)) !== null) {
      content = content.replace(this.emojiRegex, this.getEmojiImage(result[0]));
    }
    return this.sanitized.bypassSecurityTrustHtml(content)
  }

  getEmojiImage(emoji) {
    const code = this.emojiUnicode(emoji);
    return '<img class="post-emoji emojioneemoji" src="/assets/images/emoji/64/' + code + '.png">';
  }

  emojiUnicode(emoji) {
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
  };

  emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
}
