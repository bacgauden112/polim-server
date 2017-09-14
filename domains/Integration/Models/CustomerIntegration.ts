/**
 * Created by anhdq on 14/09/2017.
 */
import {LoopBackUtils} from "../../../libs/LoopBackUtils";
import {RelationType} from "../../Common/Constants";

export = function(Model) {
    LoopBackUtils.disableAllRelationMethods(Model, 'customer', RelationType.belongsTo);
    LoopBackUtils.disableAllRelationMethods(Model, 'integration', RelationType.belongsTo);
}