const { createApp } = Vue;

createApp({
    data() {
        return {
            // 商品数据
            products: [
                { id: 1, name: 'MacBook Pro', price: 12999, stock: 5 },
                { id: 2, name: 'iPhone 15', price: 5999, stock: 10 },
                { id: 3, name: 'AirPods Pro', price: 1999, stock: 0 },
                { id: 4, name: 'iPad Air', price: 4599, stock: 3 },
                { id: 5, name: 'Apple Watch', price: 2999, stock: 8 },
                { id: 6, name: 'Magic Mouse', price: 799, stock: 15 }
            ],
            
            // 购物车数据
            cartItems: []
        }
    },
    
    computed: {
        // TODO_03 (10分): 创建计算属性
        // 要求：
        // 1. 创建totalPrice计算属性，计算购物车总价
        // 2. 创建totalQuantity计算属性，计算商品总数量
        // 3. 创建isCartEmpty计算属性，判断购物车是否为空
        
        totalPrice() {
            // 在这里计算购物车总价
            return 0;
        },
        
        totalQuantity() {
            // 在这里计算商品总数量
            return 0;
        },
        
        isCartEmpty() {
            // 在这里判断购物车是否为空
            return true;
        }
    },
    
    methods: {
        // 添加商品到购物车
        addToCart(product) {
            // 检查库存
            if (product.stock <= 0) {
                alert('商品库存不足！');
                return;
            }
            
            // 检查购物车中是否已有该商品
            const existingItem = this.cartItems.find(item => item.id === product.id);
            
            if (existingItem) {
                // 如果已存在，增加数量（但不能超过库存）
                if (existingItem.quantity < product.stock) {
                    existingItem.quantity++;
                } else {
                    alert('已达到该商品的最大库存量！');
                }
            } else {
                // 如果不存在，添加新商品到购物车
                this.cartItems.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    maxStock: product.stock
                });
            }
        },
        
        // TODO_02 (10分): 实现购物车商品数量增减功能
        // 要求：
        // 1. 完成increaseQuantity方法：增加商品数量（不能超过库存）
        // 2. 完成decreaseQuantity方法：减少商品数量
        // 3. 完成removeFromCart方法：从购物车中移除商品
        
        increaseQuantity(item) {
            // 在这里实现增加数量的逻辑
            // 提示：需要检查是否超过最大库存量
        },
        
        decreaseQuantity(item) {
            // 在这里实现减少数量的逻辑
            // 提示：当数量减到0时应该移除商品
        },
        
        removeFromCart(item) {
            // 在这里实现移除商品的逻辑
            // 提示：使用数组的findIndex和splice方法
        },
        
        // 结算功能（额外功能，不计分）
        checkout() {
            if (this.cartItems.length === 0) {
                alert('购物车是空的！');
                return;
            }
            
            alert(`结算成功！总金额：¥${this.totalPrice.toFixed(2)}`);
            this.cartItems = [];
        }
    }
}).mount('#app');