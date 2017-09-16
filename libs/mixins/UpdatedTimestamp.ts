/**
 * Created by Piggat on 9/14/2016.
 */
import {isArray} from "util";
import {SecurityService} from "../../domains/System/Services/SecurityService";
export = function(Model, options) {
    let creatorProperty = options.creator;
    let modifierProperty = options.modifier;

    Model.observe('before save', function event(ctx, next) { //Observe any insert/update event on Model
        let instance = ctx.instance || ctx.data; // || ctx.currentInstance;
        let isUpdate = instance.id > 0;
        if (!ctx.instance && ctx.data) {
            isUpdate = true;
        }
        if (instance) {
            if (isArray(options.properties)) {
                for (let property in options.properties) {
                    let propertyName:string;
                    let isCreatedOnly:boolean;

                    let propertyData = options.properties[property];
                    if (typeof(propertyData)==='string') {
                        propertyName = propertyData;
                        isCreatedOnly = false;
                    }
                    else {
                        propertyName = propertyData.name;
                        isCreatedOnly = propertyData.isCreatedOnly;
                    }

                    if (isCreatedOnly && isUpdate) {
                        // do not create timestamp if it's createdOnly and being updated
                    }
                    else {
                        instance[propertyName] = new Date();
                    }
                }
            }
        }
        next();
    });

    Model.beforeRemote('create', (ctx, instance, next) => {
        if (creatorProperty) {
            ctx.args.data[creatorProperty] = SecurityService.getCurrentCustomerId(ctx) || SecurityService.getCurrentUserId(ctx);
        }
        if (modifierProperty) {
            delete ctx.args.data[modifierProperty];
        }
        return next();
    });

    Model.beforeRemote('replaceById', (ctx, instance, next)=> {
        if (modifierProperty) {
            ctx.args.data[modifierProperty] = SecurityService.getCurrentCustomerId(ctx) || SecurityService.getCurrentUserId(ctx);
        }
        if (creatorProperty) {
            delete ctx.args.data[creatorProperty];
        }
        return next();
    });
};