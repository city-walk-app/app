<script setup>
  import { ref } from 'vue'

  /** 选中的 */
  const active = ref()

  /** 会员价格 */
  const packages = [
    { title: '一个月', price: 3.99 },
    { title: '一季度', price: 9.99 },
    { title: '一年', price: 19.99 },
    { title: '永久', price: 39.99 },
  ]

  /** 会员权益 */
  const equitys = [
    '尊贵会员身份标识',
    '添加作者联系方式优先服务',
    '通过会员天数获得更多闪电',
    '帮助我们更快成长',
  ]

  /**
   * 切换套餐
   */
  const changePackage = (index) => {
    active.value = index
  }
</script>

<template>
  <div class="supporter">
    <!-- 头部信息 -->
    <div class="header">
      <div class="title">
        <i class="city-icon icon-huiyuan" />
        开通会员
      </div>

      <div class="equitys">
        <div class="equity-item" v-for="(item, index) in equitys" :key="index">
          {{ item }}
        </div>
      </div>
    </div>

    <!-- 身体内容 -->
    <div class="body">
      <div class="package-list">
        <div
          :class="[
            'package-item',
            active
              ? index === active - 1
                ? 'package-item-active'
                : 'package-item-not'
              : '',
          ]"
          v-for="(item, index) in packages"
          :key="index"
          @click="changePackage(index + 1)"
        >
          <div class="package-item-title">{{ item.title }}</div>
          <div class="package-item-price">¥{{ item.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .supporter {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-image: linear-gradient(to bottom, #ffd6c8 0%, #f9f5ee 100%);
    padding: 90px 40px 170px 40px;

    // 头部
    .header {
      padding-left: 5px;
      box-sizing: border-box;

      // 标题
      .title {
        font-size: 25px;
        color: #d8931c;
        display: flex;
        align-items: center;

        .city-icon {
          font-size: 30px;
          color: #d8931c;
          margin-right: 6px;
        }
      }

      // 权益
      .equitys {
        margin-top: 16px;
        padding-left: 3px;
        box-sizing: border-box;

        .equity-item {
          font-size: 16px;
          line-height: 28px;
          display: flex;
          align-items: center;

          &:before {
            content: '';
            display: block;
            width: 3.6px;
            height: 3.6px;
            background: red;
            border-radius: 50%;
            margin-right: 9px;
          }
        }
      }
    }

    // 身体
    .body {
      width: 100%;

      .package-list {
        margin-top: 40px;

        .package-item {
          width: 100%;
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          box-sizing: border-box;
          margin-bottom: 8px;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(45px);
          box-shadow: rgba(0, 0, 0, 0.03) 0px 2px 6px 0px;
          border: 2px solid transparent;
          transition: 0.26s;

          &:nth-child(1) {
            border-radius: 20px 20px 20px 3px;
          }

          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4) {
            border-radius: 3px 20px 20px 3px;
          }

          // 会员标题
          .package-item-title {
            font-size: 16px;
            color: #111;
          }

          // 会员价格
          .package-item-price {
            font-size: 15px;
            font-weight: bold;
            color: #d8931c;
          }

          &.package-item-active {
            border: 2px solid #d8931c;
          }

          &.package-item-not {
            opacity: 0.6;
          }
        }
      }
    }
  }
</style>
