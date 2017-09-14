import {RelationType, RelationMethod} from "../domains/Common/Constants";
/**
 * Created by Piggat on 8/10/2017.
 */
export class LoopBackUtils {
    /**
     * Xử lý một promise, sử dụng callback
     * @param promise
     * @param callback
     */
    public static processPromiseCallback(promise: Promise<any>, callback) {
        promise.then((data)=> {
            callback(null, data);
        }).catch((err) => {
            callback(err);
        });
    }

    /**
     * Disable tất cả remote methods của một relation nào đó, trừ một số method
     * @param Model
     * @param relation
     * @param type
     * @param exludes Do not disable those methods
     */
    public static disableAllRelationMethods(Model, relation, type: RelationType, exludes: string[] = []) {
        let includes = [];
        let methods = [];
        switch (type) {
            case RelationType.hasManyThrough:
                includes = [RelationMethod.deleteAllRelationObject, RelationMethod.createRelationObject,
                    RelationMethod.updateRelationObject, RelationMethod.findRelationObjectById,
                    RelationMethod.deleteRelationObject, RelationMethod.checkRelation, RelationMethod.createRelation,
                    RelationMethod.removeRelation, RelationMethod.findAllRelationObject, RelationMethod.countRelationObject
                ];
                break;
            case RelationType.hasMany:
                includes = [RelationMethod.deleteAllRelationObject, RelationMethod.createRelationObject,
                    RelationMethod.updateRelationObject, RelationMethod.findRelationObjectById,
                    RelationMethod.deleteRelationObject, RelationMethod.findAllRelationObject, RelationMethod.countRelationObject
                ];
                break;
            case RelationType.belongsTo:
                includes = [RelationMethod.findAllRelationObject];
                break;
        }

        for (let method of includes) {
            if (exludes.indexOf(method) === -1) {
                methods.push(method);
            }
        }

        for (let method of methods) {
            Model.disableRemoteMethodByName(method + relation);
        }
    }

    /**
     * Disable một danh sách các relation remote methods
     * @param Model
     * @param relation
     * @param methods
     */
    public static disableRelationMethods(Model, relation, methods: string[]) {
        for (let method of methods) {
            Model.disableRemoteMethodByName(method + relation);
        }
    }
}