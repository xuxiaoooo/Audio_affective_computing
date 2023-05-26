/*
 * @Author: xuxiaoooo
 * @Date: 2023-05-21 22:13:45
 * @LastEditors: xuxiaoooo 1078446778@qq.com
 * @LastEditTime: 2023-05-24 19:49:36
 * @FilePath: /audio_affective_computing_mini_prog_front/aac/src/app.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { createApp } from 'vue'
import './app.scss'
import { Toast, Dialog } from '@nutui/nutui-taro';

const App = createApp({
  onShow (options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(Toast).use(Dialog);

export default App
