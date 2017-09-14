/**
 * Created by Piggat on 8/14/2017.
 */

/**
 * List of relation remote methods
 * @type {RelationMethod}
 */
export const RelationMethod = {
    findAllRelationObject: 'prototype.__get__',
    countRelationObject: 'prototype.__count__',
    deleteAllRelationObject : 'prototype.__delete__',
    //deleteRelationObject : 'prototype.__deleteById__',
    createRelationObject : 'prototype.__create__',
    updateRelationObject : 'prototype.__updateById__',
    findRelationObjectById: 'prototype.__findById__',
    deleteRelationObject : 'prototype.__destroyById__',
    checkRelation : 'prototype.__exists__',
    createRelation : 'prototype.__link__',
    removeRelation: 'prototype.__unlink__'
};

/**
 * List of relation type
 */
export enum RelationType {
    hasManyThrough,
    hasMany,
    belongsTo
}