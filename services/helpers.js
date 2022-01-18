import { Platform } from "react-native";
const RC_APIKEY = Platform.select({
    ios: [ 'appl_snLPpXRhihqDKmJYGOaLJqhbgod' ],
    android: [ 'goog_ShNNaoOZgriAhANEJfkInwwthDJ' ]
});
export const helpers = {
    premiumPlan: 'associate.13d.monthly',
    RC_APIKEY: RC_APIKEY[0],
    RC_ENTITLEMENT: 'associated'
}