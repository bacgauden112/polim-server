/**
 * Created by Piggat on 11/29/2016.
 */

const signed = 'ăâđêôơưàảãạáằẳẵặắầẩẫậấèẻẽẹéềểễệế'
+'ìỉĩịíòỏõọóồổỗộốờởỡợớùủũụúừửữựứỳỷỹỵý'
+'ĂÂĐÊÔƠƯÀẢÃẠÁẰẲẴẶẮẦẨẪẬẤÈẺẼẸÉỀỂỄỆẾÌỈĨỊÍ'
+'ÒỎÕỌÓỒỔỖỘỐỜỞỠỢỚÙỦŨỤÚỪỬỮỰỨỲỶỸỴÝĐÐ';

const unsigned = 'aadeoouaaaaaaaaaaaaaaaeeeeeeeeee'
+'iiiiiooooooooooooooouuuuuuuuuuyyyyy'
+'AADEOOUAAAAAAAAAAAAAAAEEEEEEEEEEIIIII'
+'OOOOOOOOOOOOOOOUUUUUUUUUUYYYYYDD';

export class StringNormalizer {
    public static normalize(str:string):string {
        return StringNormalizer.trimDoubleSpace(StringNormalizer.unsign(str.trim())).toLowerCase();
    }

    public static unsign(str: string):string {
        let result = [];
        for (let ii = 0; ii < str.length; ii++) {
            let index = signed.indexOf(str[ii]);
            if (index > -1) {
                result.push(unsigned[index]);
            }
            else {
                result.push(str[ii]);
            }
        }
        return result.join('');
    }

    public static trimDoubleSpace(str: string):string {
        while (str.indexOf('  ') > -1) {
            str = str.replace('  ', ' ');
        }
        return str;
    }

    public static keepOnlyCharacter(str:string, keepSpace = true):string {
        let result = [];
        for (let ii = 0; ii <str.length; ii++) {
            let char = str[ii];
            if ((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || (keepSpace && char == ' ')) {
                result.push(char);
            }
        }
        return result.join('');
    }

    public static async createMarkdownFromMessage(message) {
        // let sanitizeHtml = require('sanitize-html');
        // message = sanitizeHtml(message, {
        //     allowedTags: [],
        //     allowedAttributes: []
        // }); //default we remove all tags

        //first we encode html
        // let htmlencode = require('htmlencode');
        // message = htmlencode.htmlEncode(message);

        //then, we escape markdown

        let urlRegex = /((?:http|https):\/\/)?[\w\-_]+(\.[\w\-_]{2,})([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/g;
        let match = urlRegex.exec(message);
        let replacer = [];

        let md5 = require('md5');

        while (match != null) {
            let matchedText = match[0];

            if (matchedText.length <= 5) {
                continue;
            }

            let url = "";
            if (!url) {
                //giữ nguyên
                url = match[0];
                if (!match[1]) {
                    url = 'http://' + url;
                }
                url = `[${matchedText}](${url})`;
            }

            replacer.push({search: matchedText, replace: url, id: md5(matchedText)});
            match = urlRegex.exec(message);
        }

        for (let rep of replacer) {
            message = message.replace(rep.search, rep.id);
        }

        message = this.espaceMarkdown(message); // => "\\#1! We're \\#1!"

        for (let rep of replacer) {
            message = message.replace(rep.id, rep.replace);
        }

        return message;
    }

    static markDownReplacements = [
    [ /\*/g, '\\*' ],
    [ /#/g, '\\#' ],
    // [ /\//g, '\\/' ],
    [ /\(/g, '\\(' ],
    [ /\)/g, '\\)' ],
    [ /\[/g, '\\[' ],
    [ /\]/g, '\\]' ],
    // [ /\</g, '\\<' ],
    // [ /\>/g, '\\>' ],
    [ /_/g, '\\_' ]
    ];
    public static espaceMarkdown(string) {
        return this.markDownReplacements.reduce(
            function(string, replacement) {
                return string.replace(replacement[0], replacement[1])
            },
            string)
    }
}