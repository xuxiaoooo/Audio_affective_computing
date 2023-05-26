<template>
  <view class="container">
    <view class="text-wrapper">
      &ensp;&ensp;&ensp;&ensp;{{ text }}
    </view>
    <view>
      <nut-button class="btn" :style="buttonStyle" typex="primary" @click="startOrStopRecord">{{isRecording ? '停止录音' : '开始录音'}}</nut-button>
    </view>
    <nut-toast :msg="page.state.msg" :visible="page.state.show" :type="page.state.type" :cover="page.state.cover" :duration="page.state.duration"/>
    <nut-dialog content="是否确认上传？" :visible="dialogvisible" @cancel="onCancel" @ok="onOk" />
  </view>
</template>

<script lang="ts">
import Taro from '@tarojs/taro';
import { reactive, toRefs, onMounted, ref, computed } from 'vue';

export default {
  name: 'Index',
  setup() {
    const state = reactive({
      text: '有一次，北风和太阳正在争论谁比较有本事。他们正好看到有个人走过，那个人穿著一件斗篷。他们就说了，谁可以让那个人脱掉那件斗篷，就算谁比较有本事。于是，北风就拼命地吹。怎料，他吹得越厉害，那个人就越是用斗篷包紧自己。最后，北风没办法，只好放弃。接著，太阳出来晒了一下，那个人就立刻把斗篷脱掉了。于是，北风只好认输了。',
      show: false,
      isRecording: false,
      recorderManager: null as any,
      recordPath: null as any
    });

    const dialogvisible = ref(false);

    const page = {
      state: reactive({
        msg: 'toast',
        type: 'text',
        show: false,
        cover: false,
        center: true,
        duration: 500,
      }),
    };

    const buttonStyle = computed(() => ({
      backgroundColor: state.isRecording ? 'brown' : 'cornflowerblue'
    }));

    const openToast = (type: string, msg: string, cover: boolean = false, duration: number = 500) => {
      page.state.show = true;
      page.state.msg = msg;
      page.state.type = type;
      page.state.cover = cover;
      page.state.center = true;
      page.state.duration = duration;
    };

    const countdown = async () => {
      for (let i = 3; i > 0; i--) {
        openToast('text', `${i}`);
        await new Promise(r => setTimeout(r, 1000));
      }
      page.state.show = false;
      return true;
    };

    const options = {
      duration: 120000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'wav',
      frameSize: 50
    }

    const startOrStopRecord = async () => {
      if (!state.isRecording) {
        if (await countdown()) {
          state.recorderManager.start(options);
          state.isRecording = true;
        }
      } else {
        state.recorderManager.stop();
        state.isRecording = false;
        dialogvisible.value = true;
      }
    };

    const onCancel = () => {
      dialogvisible.value = false;
    };
    
    const onOk = () => {
      if (state.recordPath) {
        openToast('loading','上传中...')
        upload(state.recordPath).then((res: any) => {
          if (res.success) {
            openToast('success','上传成功');
            Taro.navigateTo({
              url: '/pages/report/index'
            })
          } else {
            openToast('fail','上传失败');
          }
        }).catch((error: any) => {
            openToast('fail','上传失败');
        });
      } else {
      }
    };


    const upload = (file) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate an error during upload
          resolve({ success: true });
          // reject({ success: false });
        }, 2000);
      });
    };

    onMounted(() => {
      state.recorderManager = Taro.getRecorderManager();
      state.recorderManager.onError((res) => {
        console.log('录音失败了！')
      })
      state.recorderManager.onStop((res: any) => {
        state.recordPath = res.tempFilePath;
        console.log('录音收到！'+res.tempFilePath)
      });
    });

    return {
      ...toRefs(state),
      startOrStopRecord,
      page,
      onCancel,
      onOk,
      dialogvisible,
      buttonStyle,
    };
  }
};
</script>

<style scss>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 20px;
  height: calc(100vh - 40px);
}

.text-wrapper {
  width: 95%;
  height: 65%;
  overflow: auto;
  padding: 30px;
  margin: 20px;
  box-sizing: border-box;
  border: 2px solid #eee;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 20pt;
}

.btn {
  width: 200px;  /* set to desired size */
  height: 200px; /* same as width */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 50%; /* make it round */
  margin-top: 30px;
  font-size: 20pt;
  color: white;
}
</style>
