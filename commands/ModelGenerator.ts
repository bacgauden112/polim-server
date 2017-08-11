/**
 * Created by Piggat on 10/18/2016.
 */
//node commands/ModelGenerator.js --file Logistics/

let argv = require('minimist')(process.argv.slice(2));
let fs = require('fs');
let file = argv.file;
let path = require('path');

if (path.extname(file) != '.json') {
    console.error('You must choose model json file not ' + path.extname(file));
    process.exit();
}

let modelConfig = require(path.join('..',file) );
let dir = path.dirname(file);

let modelName = modelConfig.name;
let properties = modelConfig.properties;
let relations = modelConfig.relations;

//region -- get prototype function --
let tsFile = file.replace('.json', '.ts');
let tsContent:string;
if (fs.existsSync(tsFile)) {
    tsContent = fs.readFileSync(tsFile);
}
else {
    tsContent = '';
}
//endregion

function convertType(type) {
    switch (type) {
        case 'date': return 'Date';
        case 'array': return 'any[]';
        case 'Number': return 'number';
        default: return type;
    }
}

let Handlebars = require("handlebars");

let model:any = {};
model.name = modelName;
//region -- Properties --
let modelProperties = [];
for (let propertyName in properties) {
    if (propertyName == 'id') continue;
    let property = properties[propertyName];

    let modelProperty = {
        name: propertyName,
        type: convertType(property.type)
    };
    modelProperties.push(modelProperty);
}
model.properties = modelProperties;
//endregion
model.relations = relations;

//region -- get model template --
let template = path.join(__dirname,'ModelTemplate.hbs');
let modelTemplate:string;
if (fs.existsSync(template)) {
    modelTemplate = fs.readFileSync(template);
}
else {
    modelTemplate = '';
}
//endregion

let render = Handlebars.compile(modelTemplate.toString());
let content = render(model);

fs.writeFile(path.join(dir, 'Interfaces', modelName + ".d.ts"), content, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log(`The model instance type definition for ${modelName} has been generated!`);
});
