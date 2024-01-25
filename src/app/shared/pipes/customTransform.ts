import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'customTransform'
})
export class CustomTransformPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    value = this.customUnescape(value);
    value = this.transformToLinks(value);
    value = this.transformToMention(value);
    value = this.transformToHashtag(value);
    return value;
  }

  transformToMention(text) {
    var re = /\s([@][\w_-]+)/g;
    return text.replace(re, (match) => {
      return `<a class='hashtag' href="">${match}</a>`;
    });
  }

  transformToHashtag(text) {
    var re = /(#[A-Za-z0-9\-\.\_]+(?:\s|$))/g;
    return text.replace(re, `<span class='hashtag'>$1</span>`);
  }

  transformToLinks(text) {
    var re = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g;
    return text.replace(re, `<a target='_blank' href='$1'>$1</a>`);
  }

  private customUnescape(value: string): string {
    return unescape(value);
  }
}
