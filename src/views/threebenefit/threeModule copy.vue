<template>
  <v-card class="threeModuleComponent">
    <h1>精益：为益而打开做事的过程，找到蓝色问题，精准解决</h1>
    <div class="main">
      <div class="top">
        <div class="title">
          <span>标题内容：</span>
          <input
            type="text"
            placeholder="请输入标题内容"
            style="padding: 0 10px"
            v-model="form.title"
          />
        </div>
        <div class="title">
          <span>课题目标：</span>
          <input
            type="text"
            placeholder="请输入课题目标"
            style="padding: 0 10px"
            v-model="form.blueProblem"
          />
        </div>
      </div>
      <hr style="border-color: rgba(67, 126, 226, 0.3)" />
      <div class="content">
        <div class="left">
          <p class="title">精：精准</p>
          <div class="problemAndcounterm">
            <div class="blueProblem labelLeft">
              <div class="label">蓝色问题：</div>
              <ul>
                <li v-for="(e, i) of blueProblemList" :key="i">
                  <div
                    class="content"
                    :class="[
                      blueProblemList.length > 1 &&
                      i != blueProblemList.length - 1
                        ? 'borBottomNone'
                        : '',
                    ]"
                  >
                    <span class="index">{{ e.orderNo }}</span
                    ><input v-model="e.text" type="text" />
                  </div>
                  <div class="btn">
                    <span class="insert" @click="blueProblemInsert(i)">+</span
                    ><span
                      v-if="e.orderNo != 1"
                      class="del"
                      @click="blueProblemDel(i)"
                      >-</span
                    >
                  </div>
                </li>
              </ul>
            </div>
            <div class="countermeasure labelLeft">
              <div class="label">精准施策：</div>
              <ul>
                <li v-for="(e, i) of countermeasureList" :key="i">
                  <div
                    class="content"
                    :class="[
                      countermeasureList.length > 1 &&
                      i != countermeasureList.length - 1
                        ? 'borBottomNone'
                        : '',
                    ]"
                  >
                    <span class="index">{{ e.orderNo }}</span
                    ><input v-model="e.text" type="text" />
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- 流程 -->
          <div class="flow">
            <div class="flowBox">
              <div
                v-for="(e, i) of ysLeanUnderlyingLogicProcessList"
                :key="i"
                class="flowItem po-re"
              >
                <textarea
                  v-model="e.content"
                  placeholder="请输入流程信息"
                ></textarea>
                <em
                  :class="{
                    empty: i == ysLeanUnderlyingLogicProcessList.length - 1,
                  }"
                  ><img src="../../assets/u16.png" alt=""
                /></em>
                <div class="tools po-ab">
                  <span @click="insert(i)" class="insert">+</span>
                  <span
                    v-if="ysLeanUnderlyingLogicProcessList.length > 1"
                    @click="del(i)"
                    class="del"
                    >-</span
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- 流程-end -->
          <div class="thirdMain">
            <div class="item" v-for="(e, i) of asyncList" :key="i">
              <p>{{ e.label }}：</p>
              <div class="txt">
                <textarea
                  v-model="form[e.key]"
                  :placeholder="'请输入' + e.label"
                ></textarea>
              </div>
            </div>
          </div>
          <!-- 四个 -->
        </div>
        <div class="right">
          <p class="title">益：三益</p>
          <div class="benefit" v-for="(benefit, i) of benefit" :key="i">
            <p class="label">{{ benefit.label }}：</p>
            <div class="input">
              <textarea
                v-model="form[benefit.key]"
                :placeholder="'请输入' + benefit.label"
              ></textarea>
            </div>
          </div>
          <img src="../../assets/u8.png" alt="" />
          <textarea v-model="form.waste" placeholder="请输入详情描述">
          </textarea>
        </div>
      </div>
    </div>
    <v-card-actions>
      <v-btn
        class="closeBtn"
        style="color: white; text-align: center; display: none"
        color="blue"
        @click="close"
        >关闭</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
import { add, edit } from "@/api/benefit";

export default {
  props: ["form", "eventType"],
  data() {
    return {
      ysLeanUnderlyingLogicProcessList: [],
      countermeasureList: [{ orderNo: 1 }],
      blueProblemList: [{ orderNo: 1 }],
      benefit: [
        {
          label: "客户",
          key: "customerBenefits",
        },
        {
          label: "员工",
          key: "employeeBenefits",
        },
        {
          label: "财务",
          key: "financialBenefits",
        },
      ],
      asyncList: [
        {
          label: "消断",
          key: "breakpoint",
        },
        {
          label: "提效",
          key: "improveEfficiency",
        },
        {
          label: "前置",
          key: "front",
        },
        {
          label: "并行",
          key: "parallel",
        },
      ],
    };
  },
  computed: {},
  mounted() {
    this.ysLeanUnderlyingLogicProcessList = this.form
      .ysLeanUnderlyingLogicProcessList.length
      ? this.form.ysLeanUnderlyingLogicProcessList
      : [{ orderNo: 0, content: "" }];
    let bp = [{ orderNo: "1", text: "" }];
    let cm = [{ orderNo: "1", text: "" }];
    if (this.form.ysLeanUnderlyingLogicAccurateList) {
      bp = [];
      cm = [];
      const formBp = JSON.parse(
        JSON.stringify(this.form.ysLeanUnderlyingLogicAccurateList)
      );
      formBp.forEach((e) => {
        bp.push({
          orderNo: e.orderNo,
          text: e.blueProblem,
        });
        cm.push({
          orderNo: e.orderNo,
          text: e.preciseStrategy,
        });
      });
    }
    this.blueProblemList = bp;
    this.countermeasureList = cm;
  },
  methods: {
    setBlueProblemIndex() {
      let blueList = JSON.parse(JSON.stringify(this.blueProblemList));
      let countermeasureList = JSON.parse(
        JSON.stringify(this.countermeasureList)
      );
      blueList.forEach((e, i) => {
        e.orderNo = i + 1;
      });
      this.blueProblemList = blueList;
      countermeasureList.forEach((e, i) => {
        e.orderNo = i + 1;
      });
      this.countermeasureList = countermeasureList;
    },
    blueProblemInsert(i) {
      if (this.blueProblemList.length == 5) {
        this.$message.warning("最多添加5条数据");
        return;
      }
      this.blueProblemList.splice(i + 1, 0, {});
      this.countermeasureList.splice(i + 1, 0, {});
      this.setBlueProblemIndex();
    },
    blueProblemDel(i) {
      this.blueProblemList.splice(i, 1);
      this.countermeasureList.splice(i, 1);
      this.setBlueProblemIndex();
    },
    close() {
      this.$emit("close");
    },
    flowAdd() {
      this.ysLeanUnderlyingLogicProcessList.push({
        orderNo: this.ysLeanUnderlyingLogicProcessList.length,
        text: "",
      });
    },
    saveDataStructure() {
      this.form.ysLeanUnderlyingLogicProcessList =
        this.ysLeanUnderlyingLogicProcessList;
      let blueProblemList = JSON.parse(JSON.stringify(this.blueProblemList));
      let countermeasureList = JSON.parse(
        JSON.stringify(this.countermeasureList)
      );
      let problemList = [];
      blueProblemList.forEach((e, i) => {
        countermeasureList.forEach((item, i) => {
          if (e.orderNo === item.orderNo) {
            problemList.push({
              orderNo: e.orderNo,
              blueProblem: e.text,
              preciseStrategy: item.text,
            });
          }
        });
      });
      this.form.ysLeanUnderlyingLogicAccurateList = problemList
    },
    add(cb) {
      this.saveDataStructure();
      add(this.form).then((res) => {
        cb(res)
      });
    },
    edit(cb) {
      this.saveDataStructure();
      edit(this.form).then((res) => {
        cb(res);
      });
    },

    del(i) {
      if (this.ysLeanUnderlyingLogicProcessList.length > 1) {
        this.ysLeanUnderlyingLogicProcessList.splice(i, 1);
        this.sort(this.ysLeanUnderlyingLogicProcessList);
      }
    },
    insert(i) {
      this.ysLeanUnderlyingLogicProcessList.splice(i + 1, 0, {});
      this.sort(this.ysLeanUnderlyingLogicProcessList);
    },
    sort(arr) {
      arr.forEach((e, i) => {
        e.orderNo = i;
      });
    },
  },
};
</script>
<style lang='less'>
.po-ab {
  position: absolute;
}
.po-re {
  position: relative;
}
</style>
<style lang='less' scoped>
.borderR {
  border-radius: 5px;
}
.borBottomNone {
  border-bottom: none !important;
}
* {
  font-size: 18px;
}
input {
  border: 1px solid #cccccc;
  .borderR;
}
.threeModuleComponent {
  overflow: hidden;
  margin-top: 80px !important;
}
.main {
  padding: 0 30px;
  .top {
    overflow: hidden;
    margin: 30px 0;
    & > * {
      float: left;
      width: 50%;
      display: flex;
      align-items: center;
      &:first-child {
        padding-right: 20px;
      }
      input {
        flex: 1;
        height: 50px;
      }
    }
  }
  .content {
    .left {
      float: left;
      width: 65%;
    }
    .right {
      float: right;
      width: 33%;
      margin-left: 2%;
      & > img {
        width: 96%;
        margin-left: 2%;
      }
      & > textarea {
        width: 100%;
        height: 100px;
      }
    }
    .left,
    .right {
      & > .title {
        font-size: 24px !important;
        margin: 30px 0;
      }
    }
  }
}
.v-card__actions {
  overflow: hidden;
  .closeBtn {
    float: right;
  }
}

.benefit {
  display: flex;
  align-items: center;
  margin: 20px 0;
  .input {
    flex: 1;
    textarea {
      width: 100%;
    }
  }
}

.problemAndcounterm {
  .countermeasure {
    margin-top: 40px;
  }
  .labelLeft {
    display: flex;
    & > *:not(.label) {
      flex: 1;
    }
  }
  li {
    & > * {
      float: left;
    }
    .content {
      width: calc(100% - 80px);
      display: flex;
      border: solid 1px #ccc;
      height: 50px;
      .borderR;
      .index {
        height: 30px;
        line-height: 30px;
        padding: 10px;
        position: relative;
        display: inline-block;
        &::after {
          content: "";
          width: 2px;
          height: 80%;
          position: absolute;
          top: 40%;
          right: 0;
          background: #999;
        }
      }
      input {
        border: none;
        outline: none;
        width: 100%;
        padding-left: 10px;
      }
    }
    .btn {
      width: 80px;
      .insert {
        background: #437ee2;
      }
      .del {
        background: #e25743;
      }
      & > * {
        @w: 24px;
        display: inline-block;
        width: @w;
        height: @w;
        color: white;
        text-align: center;
        line-height: @w;
        border-radius: @w;
        margin-left: 16px;
        cursor: pointer;
      }
    }
  }
}
li {
  list-style: none;
}
.wasteMain {
  display: flex;
  justify-content: space-between;
}
.flow {
  margin-top: 50px;
  min-height: 326px;
  .add {
    background: blue;
    display: inline-block;
  }
  span {
    display: block;
    margin: 6px 0;
    border-radius: 100%;
    width: 20px;
    height: 20px;
    color: white;
    text-align: center;
    line-height: 16px;
    cursor: pointer;
  }
  .flowBox {
    overflow: hidden;
    padding-top: 40px;
    .flowItem {
      width: 20%;
      float: left;
      display: flex;
      align-items: center;
      margin-bottom: 36px;
      &:hover {
        .po-ab {
          display: block;
        }
      }
      @textareaH: 100px;
      textarea {
        width: 100%;
        height: @textareaH;
        max-height: @textareaH;
        min-height: @textareaH;
        outline: none;
      }
      em {
        width: 33px;
        height: 30px;
        display: inline-block;
        margin-left: 10px;
        margin-right: 10px;
        overflow: hidden;
      }
      em.empty {
        text-indent: 100px;
      }
    }
    .po-ab {
      right: 50px;
      top: -15px;
      display: none;
      span {
        display: inline-block;
        margin-left: 15px;
      }
      .del {
        background: #e25743;
      }

      .insert {
        background: #437ee2;
      }
    }
  }
}
.thirdMain {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  p {
    text-align: center;
  }
  textarea {
    height: 260px;
  }
}
h1 {
  text-align: center;
  background: rgba(67, 126, 226, 0.1);
  height: 100px;
  font-size: 36px;
  line-height: 100px;
}
textarea {
  padding: 5px 10px;
  border: 1px solid #cccccc;
  .borderR;
}
</style>