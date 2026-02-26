import {mapState, mapActions} from "vuex";
import userApi from "@/api/user-api";
import UrlUtils from "@/utils/url-utils";


let LoginThirdSystemMixin = {
    data() {
        return {
            sysKey: null,
            localTicket: null,
            bind: false,
            fullLoading: false,
            isError: false,
            errorMsg: '',
            autoToIndex: false,
            omsLoading: false
        }
    },
    computed: {
        ...mapState(["token"]),
    },
    created() {
        this.handleAutoLogin();
    },
    methods: {
        ...mapActions([ "setUserInfo","setToken"]),

        handleAutoLogin() {
            let token = UrlUtils.getUrlSearchQueryString("token");
            if (token) {
                this.fullLoading = true;
                // TODO 需要移除地址栏的token参数
                this.setToken("Bearer " + token).then(() => {
                    this.onSetTokenSuccess();
                })
            }

        },
        onSetTokenSuccess() {
            return userApi.getUseInfo().then(res => {
                this.setUserInfo(res);
            }).then(() => {
                this.fullLoading = false;
                router.push("/index");
            }).catch((error) => {
                this.fullLoading = false;
                this.onError(error)
            })
        },
        onError(msg) {
            this.isError = true;
            this.errorMsg = msg;
        }
    }
};

export default LoginThirdSystemMixin;
