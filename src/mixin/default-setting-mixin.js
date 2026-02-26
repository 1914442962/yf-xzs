export default {
    data(){
        return {
            version: 'v' + process.env.VUE_APP_VERSION,
            projectName: process.env.VUE_APP_TITLE,
        }
    },
    methods:{


    }
}