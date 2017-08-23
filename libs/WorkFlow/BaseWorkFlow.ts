import {WorkFlowStep, WorkFlowStepCollection} from "./WorkFlowStep";
//import PermissionService from "../../UserManagement/services/PermissionService";
/**
 * Created by Piggat on 2/15/2017.
 */
export class BaseWorkFlow {
    private _steps;
    private _stepsMap:any;
    private _stepsValues:any;
    private _objectProperty: string;
    private _lockEndingStep: boolean;

    constructor(objectProperty, lockEndingStep: boolean = false) {
        this._steps = [];
        this._stepsMap = {};
        this._stepsValues = {};
        this._objectProperty = objectProperty;
        this._lockEndingStep = lockEndingStep;
    }

    get LockEndingStep() {
        return this._lockEndingStep;
    }

    /**
     * Thêm một bước mới (status mới) trong WorkFlow
     * @param step
     * @param value
     */
    public addStep(step: WorkFlowStep, value = 0): WorkFlowStep {
        step.WorkFlow = this;
        this._steps.push(step);
        this._stepsMap[step.Name] = step;
        if (!this._stepsValues[step.Name] || value > 0) {
            this._stepsValues[step.Name] = value;
        }
        return step;
    }

    /**
     * Tại một bước trong WorkFlow
     * @param step
     * @returns {any}
     */
    public at(step: string):WorkFlowStep {
        if (!this._stepsMap[step]) {
            throw new Error('Step not exists!');
        }
        return this._stepsMap[step];
    }

    /**
     * Trả về một StepCollection các step nằm sau một bước nào đó
     * @param stepName
     * @param included
     * @returns {WorkFlowStepCollection}
     */
    public after(stepName: string, included:boolean = false):WorkFlowStepCollection {
        let collection = new WorkFlowStepCollection();
        let val = this._stepsValues[stepName];
        for (let step in this._stepsValues) {
            if (this._stepsValues.hasOwnProperty(step)
                && this._stepsValues[step] > val || (included && this._stepsValues[step] == val)) {
                collection.addStep(this.at(step));
            }
        }
        return collection;
    }

    /**
     * Trả về một StepCollection các step nằm trước một bước nào đó
     * @param stepName
     * @param included
     * @returns {WorkFlowStepCollection}
     */
    public before(stepName: string, included:boolean = false):WorkFlowStepCollection {
        let collection = new WorkFlowStepCollection();
        let val = this._stepsValues[stepName];
        for (let step in this._stepsValues) {
            if (this._stepsValues.hasOwnProperty(step)
                && this._stepsValues[step] < val || (included && this._stepsValues[step] == val)) {
                collection.addStep(this.at(step));
            }
        }
        return collection;
    }

    /**
     * Trả về một StepCollection các step từ trước một bước cho đến bước đó
     * @param stepName
     */
    public upTo(stepName:string): WorkFlowStepCollection {
        return this.before(stepName, true);
    }

    /**
     * Trả về một StepCollection các step bắt đầu từ một bước nào đó trở về sau
     * @param stepName
     * @returns {WorkFlowStepCollection}
     */
    public upFrom(stepName:string): WorkFlowStepCollection {
        return this.after(stepName, true);
    }

    /**
     * Kiểm tra đối tượng có khả năng chuyển sang bước stepName hay không
     * @param object
     * @param stepName
     */
    public hasAbilityToGoTo(object, stepName) {
        let currentStepName = object[this._objectProperty];
        return this.at(currentStepName).hasAbilityToGoTo(stepName);
    }

    /**
     * Kiểm tra trên đối tượng có khả năng thực hiện một thao tác hay không
     * @param object
     * @param action
     * @returns {boolean}
     */
    public hasAbilityToDo(object, action) {
        let currentStepName = object[this._objectProperty];
        return this.at(currentStepName).hasAbilityToDo(action);
    }

    /**
     * Kiểm tra một user có quyền chuyển sang bước stepName đối với đối tượng object hay không
     * @param user
     * @param object
     * @param stepName
     * @returns {Promise<boolean>}
     */
    public async hasPermissionToGoTo(user, object, stepName) {
        let currentStepName = object[this._objectProperty];

        let permissions = this.at(currentStepName).hasRequiredPermission(stepName);

        if (permissions.length == 0) {
            return true;
        }

        // let service:PermissionService = PermissionService.getInstance();
        // for (let permission of permissions) {
        //     let isAllowed = await service.isAllow(user, permission);
        //     if (isAllowed) {
        //         return true;
        //     }
        // }
        // return false;
        return true;
    }

    /**
     * Chuyển workflow thành một đối tượng json
     * @returns {{objectProperty: string, lockEndingStep: boolean, stepsValues: any, steps: Array}}
     */
    public toJSON() {
        let steps = [];
        for (let step of this._steps) {
            steps.push(step.toJSON());
        }

        return {
            objectProperty: this._objectProperty,
            lockEndingStep: this._lockEndingStep,
            stepsValues: this._stepsValues,
            steps: steps
        }
    }

    /**
     * Từ một đối tượng json, rebuild thành một workflow
     * @param json
     * @returns {BaseWorkFlow}
     */
    public static fromJSON(json) {
        let workFlow = new BaseWorkFlow(json.objectProperty, json.lockEndingStep);

        for (let step of json.steps) {
            let workFlowStep = WorkFlowStep.fromJSON(step);
            workFlow.addStep(workFlowStep);
        }
        workFlow._stepsValues = json.stepsValues;

        return workFlow;
    }
}