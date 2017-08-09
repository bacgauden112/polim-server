/**
 * Created by Piggat on 8/8/2017.
 */
export = function(Model) {
    Model.getExchangeRate = function(ctx, appliedTime ,next) {
        next();
    }
}