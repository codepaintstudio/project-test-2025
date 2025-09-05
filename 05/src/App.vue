<script>
import { ref, computed } from 'vue'

export default {
  name: 'ShoppingCartApp',
  setup() {
    const products = ref([
      { id: 1, name: 'MacBook Pro', price: 12999, stock: 5 },
      { id: 2, name: 'iPhone 15', price: 5999, stock: 10 },
      { id: 3, name: 'AirPods Pro', price: 1999, stock: 0 },
      { id: 4, name: 'iPad Air', price: 4599, stock: 3 },
      { id: 5, name: 'Apple Watch', price: 2999, stock: 8 },
      { id: 6, name: 'Magic Mouse', price: 799, stock: 15 }
    ])

    const cartItems = ref([])

    const totalPrice = computed(() => {
      return cartItems.value.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    })

    const totalQuantity = computed(() => {
      return cartItems.value.reduce((total, item) => {
        return total + item.quantity
      }, 0)
    })

    const isCartEmpty = computed(() => {
      return cartItems.value.length === 0
    })

    const addToCart = (product) => {
      if (product.stock <= 0) {
        alert('商品库存不足！')
        return
      }

      const existingItem = cartItems.value.find(item => item.id === product.id)

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity++
        } else {
          alert('已达到该商品的最大库存量！')
        }
      } else {
        cartItems.value.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          maxStock: product.stock
        })
      }
    }

    const increaseQuantity = (item) => {
      if (item.quantity < item.maxStock) {
        item.quantity++
      } else {
        alert('已达到该商品的最大库存量！')
      }
    }

    const decreaseQuantity = (item) => {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        removeFromCart(item)
      }
    }

    const removeFromCart = (item) => {
      const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id)
      if (index > -1) {
        cartItems.value.splice(index, 1)
      }
    }

    const checkout = () => {
      if (cartItems.value.length === 0) {
        alert('购物车是空的！')
        return
      }

      alert(`结算成功！总金额：¥${totalPrice.value.toFixed(2)}`)
      cartItems.value.length = 0
    }

    return {
      products,
      cartItems,
      totalPrice,
      totalQuantity,
      isCartEmpty,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      checkout
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>🛒 Vue购物车应用</h1>
    
    <!-- 商品列表部分 -->
    <div class="products-section">
      <h2>商品列表</h2>
      <div class="products-grid">
        <!-- TODO_01 (10分): 使用v-for指令渲染商品列表 -->
        <!-- 要求：
             1. 遍历products数组
             2. 显示商品名称、价格和库存信息
             3. 添加"加入购物车"按钮，点击时调用addToCart方法
             4. 当库存为0时，按钮应该禁用并显示"缺货"
        -->
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="product-card"
        >
          <h3>{{ product.name }}</h3>
          <p class="price">¥{{ product.price }}</p>
          <p class="stock">库存：{{ product.stock }}</p>
          <button 
            class="add-btn" 
            :disabled="product.stock === 0"
            @click="addToCart(product)"
          >
            {{ product.stock === 0 ? '缺货' : '加入购物车' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 购物车部分 -->
    <div class="cart-section">
      <h2>购物车</h2>
      
      <!-- TODO_02 (10分): 实现购物车商品的增减功能 -->
      <!-- 要求：
           1. 使用v-for遍历cartItems数组
           2. 显示商品名称、单价、数量和小计
           3. 添加"+"和"-"按钮来增减商品数量
           4. 当数量为1时，"-"按钮应该变成"删除"按钮
      -->
      <div class="cart-items">
        <div 
          v-for="item in cartItems" 
          :key="item.id" 
          class="cart-item"
        >
          <span class="item-name">{{ item.name }}</span>
          <span class="item-price">¥{{ item.price }}</span>
          <div class="quantity-controls">
            <button 
              :class="item.quantity === 1 ? 'qty-btn remove-btn' : 'qty-btn'"
              @click="decreaseQuantity(item)"
            >
              {{ item.quantity === 1 ? '删除' : '-' }}
            </button>
            <span class="quantity">{{ item.quantity }}</span>
            <button 
              class="qty-btn"
              @click="increaseQuantity(item)"
            >
              +
            </button>
          </div>
          <span class="subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
      </div>

      <!-- TODO_03 (10分): 使用computed计算总价和条件渲染 -->
      <!-- 要求：
           1. 使用v-if/v-else条件渲染：当购物车为空时显示提示信息
           2. 创建computed属性计算购物车总价
           3. 显示购物车商品总数量
      -->
      <div v-if="isCartEmpty" class="cart-empty">
        <p>购物车是空的，快去选购商品吧！</p>
      </div>
      
      <div class="cart-summary">
        <div class="summary-row">
          <span>商品数量：<strong>{{ totalQuantity }}</strong> 件</span>
        </div>
        <div class="summary-row total">
          <span>总计：<strong>¥{{ totalPrice.toFixed(2) }}</strong></span>
        </div>
        <button class="checkout-btn" @click="checkout">结算</button>
      </div>
    </div>
  </div>
</template>
