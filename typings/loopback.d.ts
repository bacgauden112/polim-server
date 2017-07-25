/**
 * Created by Piggat on 06/09/2016.
 */
declare namespace LoopBack {
    import EventParams = DataStructures.EventParams;
    export interface LoopBackBase {
        ():LoopBackApplication;
        version:string;
        mime:string;
        isBrowser:boolean;
        isServer:boolean;
        registry:Registry;
        faviconFile:string;

        autoAttach();
        /** Look up a modelName class by name from all models created by loopback.createModel(). Throw an error when no such modelName exists.*/
        getModel(name:string):any;
        configureModel(modelCtor, config):void;
        createDataSource(name, options):void;
        createModel(config);
        createModel(name, properties, options);
        findModel();
        getDefaultDataSourceForType();
        getModelByType();
        if();
        memory();
        memory(name:string);
        remoteMethod(fn, options);
        setDefaultDataSourceForType(type, dataSource);
        template();

        connector(name, connector)
    }

    interface LoopBackApplication {
        start: () => void;
        models:any
    }

    interface Registry {
        addACL(acls:Object[], acl:Object);
        autoAttach();
        configureModel(modelCtor, config);
        createDataSource(name, options);
        createModel(name, properties, options)
        createModel(config);
        findModel(modelName);
        getDefaultDataSourceForType(type:string);
        getModel(modelName);
        getModelByType(modelType)
        memory([name]);
        setDefaultDataSourceForType(type, dataSource);
    }

    interface AccessContext {
        (context:Object):AccessContext;
        addPrincipal(principalType:string, principalId, principalName:string):boolean;
        getAppId():any;
        getUserId():any;
        isAuthenticated():boolean;
    }

    interface Context {
        principals;
        model();
        modelName:string;
        modelId:string;
        property:string;
        method:string;
        accessType:string;
        accessToken;
    }

    interface AccessRequest {
        (model:string, property:string, accessType:string, permission:string):AccessRequest;
        exactlyMatches(acl);
        isAllowed():boolean;
        isWildcard():boolean;
    }

    interface Principal {
        (type:string, id, name:string):Principal;
        equals(p:Principal);
    }

    interface PersistedModel {
        dataSource:any

        bulkUpdate(updates, callback)
        changes(since, filter, callback)
        checkpoint(callback)
        count(where, callback)
        count(where): Promise<any>
        create(obj:Object, callback)
        create(obj:Object): Promise<any>
        create(objs:Object[])
        createChangeStream(options, callback)
        createUpdates(deltas, callback)
        currentCheckpoint(callback)
        destroyAll(where, callback)
        destroyAll(where): Promise<void>
        destroyById(id, callback)
        diff(since, remoteChanges, callback)
        enableChangeTracking()
        exists(id): Promise<boolean>
        exists(id, callback)
        find(filter, callback)
        find(filter): Promise<any>
        findById(id, filter, callback)
        findById(id, filter): Promise<any>
        findById(id): Promise<any>
        findById(id, options: OperationOptions): Promise<any>
        findOne(filter): Promise<any>
        findOne(filter, callback)
        findOrCreate(filter, data, callback)
        findOrCreate(filter, data): Promise<any>
        getChangeModel()
        getIdName()
        getSourceId(callback)
        handleChangeError(err)
        rectifyChange(id, callback)
        replaceById(id, data, options, callback)
        replaceById(id, data, callback)
        replaceById(id, data): Promise<any>
        replaceById(id, data, options): Promise<any>
        replaceOrCreate(data, callback)
        replaceOrCreate(data, options, callback)
        replicate(since, targetModel, options, [callback])
        replicate(since, targetModel, options)
        replicate(since, targetModel, callback)
        replicate(since, targetModel)
        replicate(targetModel, options, [callback])
        replicate(targetModel, options)
        replicate(targetModel, callback)
        replicate(targetModel)
        updateAll(where, data, callback)
        updateAll(data, callback)
        upsert(data, callback)

        destroy(callback)
        getId()
        getIdName()
        isNewRecord()
        reload(callback)
        replaceAttributes(data, options, callback)
        replaceAttributes(data, callback)
        save(options, callback)
        save(callback)
        setId(val)
        updateAttribute(name, value, callback)
        updateAttributes(data, callback)
        updateAttributes(data, options, callback)

        observe(event:string, callback: (ctx:any, next: any) => void)

        remoteMethod(fn, options: Object)
        disableRemoteMethod(name: string, isStatic: boolean)
        disableRemoteMethodByName(name: string)
        beforeRemote(methodName, func: (ctx: any, next: any) => void)
        beforeRemote(methodName, func: (ctx: any, modelInstance: any, next: any) => void)
        afterRemote(methodName, func: (ctx: any, next: any) => void)
        afterRemote(methodName, func: (ctx: any, modelInstance: any, next: any) => void)
        afterRemoteError(methodName, func: (ctx:any, next:any) => void)

        validatesPresenceOf(...args:string[])
        validatesPresenceOf(field, options)
        validatesLengthOf(field, options)
        validatesInclusionOf(field, options)
        validatesExclusionOf(field, options)
        validatesAbsenceOf(field, errMsg:Object)
        validatesNumericalityOf(field, options)
        validatesUniquenessOf(field, options)
        validate(propertyName, validatorFn, options)
        validateAsync(propertyName, validatorFn, options)

        beginTransaction(options: any): Promise<Transaction>


        getter: ()=> any[]
        setter: ((val: any)=> any)[]

        //emitEvent(event: string, owner, params):void;
        emitEvent(model, event: string, owner, params):void;
        basicDisable():void;
        basicDisable(excluded: string[]):void;
        emitOperationHook(options: {include?:string[], exclude?:string[], keepOrigin?: boolean}): void;
        emitOperationHook(): void;
        disableRelation(relation, type: number, exludes: string[]): void;
        addLogEvent(remote: string, eventName: string, description: ((instance)=>string)|string, scope,commentClass, columnTitle: Object)
        addLogEvent(remote: string, eventName: string, description: ((instance)=>string)|string, scope,commentClass)
        logEvent(model, commentClass, eventName, description, scope, params: EventParams):void;
        hasMetaFields():void;

        prototype:any;
    }

    interface IRemoteMethodCallback {
        (error: any, response: any):void,
        (error: any):void,
        promise: any;
    }

    interface Error {
        constructor(msg: string)
        statusCode: string
        code: string
    }

    interface Transaction {
        commit() : Promise<void>
        rollback(): Promise<void>
        observe(eventName: string, func: (context,next) => void): void
    }

    interface OperationOptions {
        transaction?: any
    }
}

declare module "loopback" {
    export = LoopBack;
}
