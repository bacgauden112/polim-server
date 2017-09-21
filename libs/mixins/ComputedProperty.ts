/**
 * Created by Piggat on 9/21/2016.
 */
import {isArray} from "util";
export = function(Model, options) {
    Model.observe('before save', function event(ctx, next) { //Observe any insert/update event on Model
        let instance = ctx.instance; // || ctx.currentInstance;
        if (instance) { //replace by Id
            if (isArray(options.properties)) {
                for (let property in options.properties) {
                    let propertyName:string;

                    let propertyData = options.properties[property];
                    propertyName = propertyData.name;
                    let functionName = propertyData.function;

                    if (typeof instance[functionName] === 'function') {
                        instance[propertyName] = instance[functionName]();
                    }
                    else {
                        instance[propertyName] = Model[functionName](instance);
                    }
                }
            }
        } else { //updateAttributes
            let oldInstance = ctx.currentInstance;
            let newInstance = Object.assign(oldInstance, ctx.data);
            let updateData = ctx.data;

            if (isArray(options.properties)) {
                for (let property in options.properties) {
                    let propertyName:string;

                    let propertyData = options.properties[property];
                    propertyName = propertyData.name;
                    let functionName = propertyData.function;

                    if (typeof newInstance[functionName] === 'function') {
                        updateData[propertyName] = newInstance[functionName]();
                    }
                    else {
                        updateData[propertyName] = Model[functionName](newInstance);
                    }
                }
            }
        }
        next();
    });

    Model.afterInitialize = function () {
        if (isArray(options.properties)) {
            for (let property in options.properties) {
                let propertyName:string;
                let isBeforeSave:boolean;

                let propertyData = options.properties[property];
                propertyName = propertyData.name;
                isBeforeSave = propertyData.isBeforeSave;
                if (isBeforeSave) {
                    continue;
                }
                let functionName = propertyData.function;

                if (Model[functionName]) {
                    this[propertyName] = Model[functionName](this);
                }
            }
        }
    };
};