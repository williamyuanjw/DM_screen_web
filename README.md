# DM_screen_web

### 介绍

🔥🔥Vue3 + TS + Echarts 优秀可视化数据大屏解决方案，包括移动端与 PC 端的响应式适配处理<br>
账号：yuan<br>
密码：123456

### 项目地址

[http://124.221.177.11/#/login](http://124.221.177.11/#/login)

`gitee开源地址`：[https://gitee.com/yuanjinwei/DM_screen_web](https://gitee.com/yuanjinwei/DM_screen_web)

`github开源地址`：[https://github.com/williamyuanjw/DM_screen_web](https://github.com/williamyuanjw/DM_screen_web)

### 软件架构

`node v16.14.2`

### 项目展示

- 登录页

![img](https://file.atomgit.com/uploads/issue/1695822755285_4550.png '#left')

- PC 端首页

![img](https://file.atomgit.com/uploads/issue/1695822828995_9272.png '#left')

- 小于 576px 设备效果

![img](https://file.atomgit.com/uploads/issue/1695822798143_2264.jpg '#left')

### 操作文档

登录项目之后，在首页以关注度图表为例

1. 图表可支持左右滑动，图表内长按鼠标左滑或者右滑进行不同月份的展示
2. 右上角从左到右图标的功能分别为：切换至折线图、切换至柱状图、详情弹窗
3. 打开详情弹窗后可以通过下拉搜索框进行输入搜索选择要添加至图表的项目，也可进行删除

![img](https://file.atomgit.com/uploads/issue/1695822851010_5935.png '#left')

![img](https://file.atomgit.com/uploads/issue/1695822869354_7460.png '#left')

项目中间部分的雷达图和虚拟列表可以进行交互，点击列表的项目可以添加至雷达图，点击雷达图某个项目可以展示详情，点击 remove 可以移除

![img](https://file.atomgit.com/uploads/issue/1695822890128_1217.png '#left')

![img](https://file.atomgit.com/uploads/issue/1695822908470_5895.png '#left')

### 使用说明

1.  `npm install 或 yarn`
2.  `npm run dev`
3.  `代码提交需要符合 Eslint、Commitlint、Stylelint 等规范`
4.  `使用前请在 vscode 安装 Prettier Eslint Stylelint 等插件，方便格式化代码`

### 项目亮点

- 实现对不同大小的屏幕/设备的**良好适配**以及针对小屏幕设备有不同的**布局以及兼容**
- **不定高无限滚动加载虚拟列表**的实现，控制列表渲染数据量的同时实现列表**无限滚动**
<table>
  <tr>
    <th>参数/事件</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>
      <b>dataSource</b>
    </td>
    <td>传入的数组</td>
    <td>Array</td>
    <td>必传</td>
  </tr>
  <tr>
    <td>
      <b>loading</b>
    </td>
    <td>分页加载loading状态</td>
    <td>Boolean</td>
    <td>必传</td>
  </tr>
  <tr>
    <td>
      <b>estimatedHeight</b>
    </td>
    <td>每一项的初始高度，用于传入渲染后再通过计算得到不定高列表的真实高度</td>
    <td>Number</td>
    <td>必传</td>
  </tr>
	<tr>
		<td>
			<b>@scrollEnd</b>
		</td>
		<td>列表滚动到底部触发的方法</td>
		<td>Function</td>
		<td>-</td>
	</tr>
</table>

```html
<virtual-list
	:data-source="github.dataSource"
	:loading="github.loading"
	:estimated-height="30"
	@scroll-end="github.addData"
	class="virtual-list"
>
	<template #item="{ item }">
		<a-tooltip placement="top" color="rgba(73, 146, 255, 0.8)">
			<template #title>
				<span>项目名：{{ item.name }}</span>
			</template>
			<div class="virtual-list-item" @click="radarFirst.chart.addRadarData(item.name)">
				<span class="virtual-list-item-col">{{ item.name }}</span>
				<span class="virtual-list-item-col">{{ item.influence }}</span>
				<span class="virtual-list-item-col">{{ item.trend }}</span>
				<span class="virtual-list-item-col">{{ item.response }}</span>
				<span class="virtual-list-item-col">{{ item.activity }}</span>
				<span class="virtual-list-item-col">{{ item.github }}</span>
			</div>
		</a-tooltip>
	</template>
</virtual-list>
```

- Echarts 图表相关 hooks 的封装，提高如折柱混合图、图表详情弹窗的**代码复用性**
- 实现下拉搜索选择框、列表与**图表之间的增删交互**，根据文档**解决**雷达图等图表增删时的**异常问题**
- 使用 transition 标签以及**图片预加载**来优化图片未加载完全等导致的**用户视觉体验**问题
- 实现 Echarts 等组件的**按需加载**。在打包过程中对项目大体积模块进行分块打包以及优化项目字体文件大小

### 参与贡献

1.  `根据 dev 分支创建新分支`
2.  `在新分支上开发 提交代码时 pull dev 分支的代码再提交`
3.  `之后在 gitee 上发起代码合并请求，请求将代码合并至 master`
4.  `有问题与想法欢迎大家提Issues`
