<template>
  <div class="header-item">
    开始时间：
    <el-date-picker v-model="sdt" type="date" format="YYYY-MM-DD" :disabled-date="startDisabledDate"
                    value-format="YYYY-MM-DD" placeholder="开始时间" style="width: 160px"></el-date-picker>
    &nbsp; &nbsp;结束时间：
    <el-date-picker v-model="edt" type="date" format="YYYY-MM-DD" :disabled-date="endDisabledDate"
                    value-format="YYYY-MM-DD" placeholder="结束时间" style="width: 160px"></el-date-picker>
  </div>

</template>
<script>
import dayjs from "dayjs";

export default {
  name: "DateRangerPickerComponent",
  props: {
    startTime:String,
    endTime: String
  },
  data() {
    return {
      sdt: '',
      edt: '',
      startDisabledDate: this.handStartDisabledDate,
      endDisabledDate: this.handEndDisabledDate
    }
  },
  watch:{
    startTime:{
      handler(val){
        this.sdt = val
      },
      immediate: true
    },
    endTime:{
      handler(val){
        this.edt = val
      },
      immediate: true
    },
    sdt: {
      handler(val){
        this.$emit('update:updateStartTime',val)
      }
    },
    edt: {
      handler(val){
        this.$emit('update:updateEndTime',val)
      }
    },
  },
  methods:{
    handStartDisabledDate(time){
      let day = dayjs(time).format('YYYY-MM-DD');
      return dayjs(this.edt).isBefore(day)
    },
    handEndDisabledDate(time){
      let day = dayjs(time).format('YYYY-MM-DD');
      return dayjs(this.sdt).isAfter(day)
    },
  }
}
</script>
<style scoped lang="scss">

</style>