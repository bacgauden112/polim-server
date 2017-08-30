/**
 * Created by Piggat on 8/14/2017.
 */
(() => {
    let argv = require('minimist')(process.argv.slice(2));
    let fs = require('fs');
    let file = argv.file;
    let path = require('path');

    //region -- compile render function --
    let Handlebars = require("handlebars");

    Handlebars.registerHelper('json', function(context) {
        let string = JSON.stringify(context);
        return string.split(',').join(', ');
    });

    let jsTypes = ['string', 'number', 'boolean', 'Date', 'String', 'Number', 'Boolean'];

    Handlebars.registerHelper('displayType', function(property) {
        if (property.type == 'array' || property.type == 'Array') {
            let type = property.items.type.toLowerCase;
            if (type === 'string' || type === 'number'
                ||type === 'date' || type ==='boolean') {
                return `${property.items.type}[]`;
            }
            else {
                return new
                    Handlebars.SafeString(`<a href="${property.items.type}.html">${property.items.type}</a>[]`);
            }
        }
        else if (jsTypes.indexOf(property.type) >= 0 ) {
            return property.type;
        }
        else {
            return new Handlebars.SafeString(`<a href="${property.type}.html">${property.type}</a>`)
        }
    });

    Handlebars.registerHelper('linkify', function(string) {
        let result = string.replace(/\[(.*?)\]/g, "<a href='$1.html'>$1</a>");
        return new Handlebars.SafeString(result)
    });

    let template = path.join(__dirname, 'JsonSchema.hbs');
    let modelTemplate: string;
    if (fs.existsSync(template)) {
        modelTemplate = fs.readFileSync(template);
    }
    else {
        modelTemplate = '';
    }
    let render = Handlebars.compile(modelTemplate.toString());
    //endregion

    if (file) {
        genHTMLfile(render, file);
    }

    let dir = argv.dir;
    fs.readdir(dir, function(err, items) {
        for (let i=0; i<items.length; i++) {
            let filePath = path.join(dir, items[i]);
            genHTMLfile(render, filePath);
        }
    });

    function genHTMLfile(render, file) {
        let fs = require('fs');
        let path = require('path');
        if (path.extname(file) != '.json') {
            console.error('You must choose model json file not ' + path.extname(file));
            process.exit();
        }

        let schemaConfig = require(path.join('..', file));
        schemaConfig.gendate = new Date();

        let content = render(schemaConfig);

        fs.writeFile(path.join(__dirname, '../docs/', schemaConfig.name + ".html"), content, function (err) {
            if (err) {
                return console.log(err);
            }

            console.log(`HTML schema documents for ${schemaConfig.name} has been generated!`);
        });
    }
})();
