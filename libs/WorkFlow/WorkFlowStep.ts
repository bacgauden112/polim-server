import {BaseWorkFlow} from "./BaseWorkFlow";
/**
 * Created by Piggat on 2/15/2017.
 */
export class WorkFlowStep {
    private _workFlow: BaseWorkFlow;
    private _canDo: string[];
    private _canNotDo: string[];
    private _name:string;
    private _canChangeTo: string[];
    private _canNotChangeTo: string[];
    private _canOnlyChangeToWithPermission;
    private _mustHasPermission:string[];
    private _isFreeStep: boolean;
    private _isEndingStep: boolean;

    /**
     * Khởi tạo step với key là name, isFreeStep quy định xem step này có thể tự do đến từ mọi trạng thái khác không
     * @param name
     * @param isFreeStep
     */
    constructor(name: string, isFreeStep: boolean = false) {
        this._name = name;
        this._canChangeTo = [];
        this._canDo = [];
        this._canNotDo = [];
        this._canNotChangeTo = [];
        this._isFreeStep = isFreeStep;
        this._canOnlyChangeToWithPermission = {};
        this._mustHasPermission = [];
        this._isEndingStep = false;
    }

    set WorkFlow(value) {
        if (this._workFlow) {
            throw new Error('Step has been added to work flow, do not add same step more than 1 time');
        }
        this._workFlow = value;
    }

    get Name() {
        return this._name;
    }

    get MustHasPermission() {
        return this._mustHasPermission;
    }

    /**
     * Có thể thực hiện hành động
     * @param action
     */
    public canDo(action) {
        let canNotActIndex = this._canNotDo.indexOf(action);
        if (canNotActIndex > -1) {
            this._canNotDo.splice(canNotActIndex, 1);
        }

        this._canDo.push(action);
        return this;
    }

    /**
     * Không được phép thực hiện thao tác
     * @param action
     */
    public canNotDo(action) {
        let canActIndex = this._canDo.indexOf(action);
        if (canActIndex > -1) {
            this._canDo.splice(canActIndex, 1);
        }

        this._canNotDo.push(action);
        return this;
    }

    /**
     * Trạng thái cuối, không quay ngược
     */
    public isEndingStep() {
        this._isEndingStep = true;
    }

    /**
     * Có thể chuyển sang bước stepName
     * @param stepName
     */
    public canGoTo(stepName: string): WorkFlowStep {
        let canNotGoIndex = this._canNotChangeTo.indexOf(stepName);
        if (canNotGoIndex > -1) {
            this._canNotChangeTo.splice(canNotGoIndex, 1);
        }

        this._canChangeTo.push(stepName);
        return this;
    }

    /**
     * Cần phải có quyền permission thì mới được phép chuyển sang bước stepName
     * @param permission
     * @param stepName
     */
    public mustHavePermissionToGoTo(permission: string,stepName: string): WorkFlowStep {
        if (!this._canOnlyChangeToWithPermission[stepName]) {
            this._canOnlyChangeToWithPermission[stepName] = [];
        }
        this._canOnlyChangeToWithPermission[stepName].push(permission);
        return this;
    }

    public mustHavePermissionToGoToThis(permission): WorkFlowStep {
        this._mustHasPermission.push(permission);
        return this;
    }

    /**
     * Không thể chuyển sang bước stepName (nếu có sẽ overwrite canChangeTo)
     * @param stepName
     */
    public canNotGoTo(stepName: string): WorkFlowStep {
        let canGoIndex = this._canChangeTo.indexOf(stepName);
        if (canGoIndex > -1) {
            this._canChangeTo.splice(canGoIndex, 1);
        }

        this._canNotChangeTo.push(stepName);
        return this;
    }

    /**
     * Kiểm tra xem từ bước này có thể chuyển sang bước stepName hay không
     * @param stepName
     * @returns {boolean}
     */
    public hasAbilityToGoTo(stepName: string) {
        if (this._canNotChangeTo.length > 0) {
            for (let step of this._canNotChangeTo) {
                if (stepName == step) {
                    return false;
                }
            }
        }

        if (this._canChangeTo.length === 0 && this._isFreeStep) {
            return true;
        }

        for (let step of this._canChangeTo) {
            if (stepName == step) {
                return true;
            }
        }
        return false;
    }

    /**
     * Kiểm tra xem ở bước này có thể thực hiện hành động actionName hay không
     * @param actionName
     * @returns {boolean}
     */
    public hasAbilityToDo(actionName: string) {
        if (this._isEndingStep && this._workFlow.LockEndingStep) {
            return false; //khóa khi ở trạng thái cuối
        }

        for (let action of this._canNotDo) {
            if (actionName == action) {
                return false;
            }
        }

        for (let action of this._canDo) {
            if (actionName == action) {
                return true;
            }
        }
        return false;
    }

    /**
     * Kiểm tra xem để chuyển sang bước này có cần bắt buộc phải có quyền nào hay không và trả về danh sách quyền
     * @param stepName
     */
    public hasRequiredPermission(stepName: string) {
        let result = [];
        if (this._canOnlyChangeToWithPermission[stepName]) {
            result = result.concat(this._canOnlyChangeToWithPermission[stepName]);
        }
        result = result.concat(this._workFlow.at(stepName).MustHasPermission);
        return result;
    }

    /**
     * Đưa đối tượng này thành một đối tượng JSON
     * @returns {{name: string, canChangeTo: string[], canNotChangeTo: string[], canDo: string[], canNotDo: string[], isFreeStep: boolean, isEndingStep: boolean, canOnlyChangeToWithPermission: any, mustHavePermission: string[]}}
     */
    public toJSON() {
        return {
            name: this._name,
            canChangeTo: this._canChangeTo,
            canNotChangeTo: this._canNotChangeTo,
            canDo: this._canDo,
            canNotDo: this._canNotDo,
            isFreeStep: this._isFreeStep,
            isEndingStep: this._isEndingStep,
            canOnlyChangeToWithPermission: this._canOnlyChangeToWithPermission,
            mustHavePermission: this._mustHasPermission
        }
    }

    /**
     * Từ một đối tượng JSON, biến nó thành một step
     * @param json
     * @returns {WorkFlowStep}
     */
    public static fromJSON(json):WorkFlowStep {
        let step = new WorkFlowStep(json.name, json.isFreeStep);
        step._canChangeTo = json.canChangeTo;
        step._canNotChangeTo = json.canNotChangeTo;
        step._canDo = json.canDo;
        step._canNotDo = json.canNotDo;
        step._isEndingStep = json.isEndingStep;
        step._canOnlyChangeToWithPermission = json.canOnlyChangeToWithPermission;
        step._mustHasPermission = json.mustHavePermission;
        return step;
    }
}

export class WorkFlowStepCollection {
    private _steps;

    constructor() {
        this._steps = [];
    }

    public addStep(step: WorkFlowStep) {
        this._steps.push(step);
    }

    public canDo(action: string) {
        for (let step of this._steps) {
            step.canDo(action);
        }
        return this;
    }

    /**
     * Không được phép thực hiện thao tác
     * @param action
     */
    public canNotDo(action:string) {
        for (let step of this._steps) {
            step.canDo(action);
        }
        return this;
    }
}