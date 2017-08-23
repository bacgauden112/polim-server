/**
 * Created by Piggat on 10/19/2016.
 */
declare namespace Models {
    import OperationOptions = LoopBack.OperationOptions;
    //import EventParams = DataStructures.EventParams;
    export interface ModelInstance {
        getId?(): any
        save?(): Promise<any>
        save?(options: OperationOptions): Promise<any>
        reload?(): Promise<any>
        reload?(options: OperationOptions): Promise<any>
        isNewInstance?: boolean
        destroy?(): Promise<any>
        destroy?(options: OperationOptions): Promise<any>
        updateAttributes?(data, options: OperationOptions): Promise<ModelInstance>
        updateAttributes?(data): Promise<ModelInstance>
        patchAttributes?(data, options: OperationOptions): Promise<ModelInstance>
        patchAttributes?(data): Promise<ModelInstance>
        setMetaField?(key, label, value): Promise<any>
        getMetaField?(key): Promise<any>
        getMetaFields?(): Promise<any>
    }

    export interface BelongToRelation<T> {
        getAsync?(): Promise<T>
        update?(): Promise<void>
        destroy?(): Promise<void>
        (condOrRefresh?): Promise<T>
    }

    export interface HasManyRelation<T> {
        (condOrRefresh, options): Promise<T[]>
        (condOrRefresh): Promise<T[]>
        getAsync?(filter): Promise<T[]>
        getAsync?(): Promise<T[]>
        findById?(id): Promise<T>
        exists?(): Promise<boolean>
        updateById?(id, data): Promise<void>
        destroyById?(id): Promise<void>
        count?(where?): Promise<number>
        create(object:T): Promise<T>
        create(object:T, tx): Promise<T>
    }
}