
import XEUtils from "xe-utils";

const CookiesUtil = {
    set(key, val) {

        key = window.location.origin + "#" + key;

        if (null == val) {
            sessionStorage.removeItem(key)
            return;
        }

        if ('object' === typeof val) {
            sessionStorage.setItem(key, XEUtils.toJSONString(val));
        } else {
            sessionStorage.setItem(key, val);
        }

    },
    get(key) {
        key = window.location.origin + "#" + key;
        let val = sessionStorage.getItem(key);
        if (null == val || '' === val) {
            return null;
        }
        if (XEUtils.startsWith(val, '{') && XEUtils.endsWith(val, "}")) {
            return XEUtils.toStringJSON(val);
        }
        if (XEUtils.startsWith(val, "[") && XEUtils.endsWith(val, "]")) {
            return XEUtils.toStringJSON(val);
        }
        if ('true' === val) {
            return true;
        }
        if ('false' === val) {
            return false;
        }


        return val;
    },
    remove(key) {
        key = window.location.origin + "#" + key;
        sessionStorage.removeItem(key)
    }
}

export default CookiesUtil;
