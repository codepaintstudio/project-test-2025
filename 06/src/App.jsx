import { useState, useMemo } from 'react'

// 商品数据
const productsData = [
    { id: 1, name: 'MacBook Pro', price: 12999, stock: 5 },
    { id: 2, name: 'iPhone 15', price: 5999, stock: 10 },
    { id: 3, name: 'AirPods Pro', price: 1999, stock: 0 },
    { id: 4, name: 'iPad Air', price: 4599, stock: 3 },
    { id: 5, name: 'Apple Watch', price: 2999, stock: 8 },
    { id: 6, name: 'Magic Mouse', price: 799, stock: 15 }
]

// 商品卡片组件
function ProductCard({ product, onAddToCart }) {
    return (
        // TODO_01 (10分): 完善商品卡片JSX结构
        // 要求：
        // 1. 显示商品名称、价格和库存信息
        // 2. 添加"加入购物车"按钮，点击时调用onAddToCart
        // 3. 当库存为0时，按钮应该禁用并显示"缺货"
        // 4. 使用合适的CSS类名来匹配样式
        
        <div className="product-card">
            <h3>{product.name}</h3>
            <p className="price">¥{product.price}</p>
            <p className="stock">库存：{product.stock}</p>
            <button 
                className="add-btn"
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
            >
                {product.stock === 0 ? '缺货' : '加入购物车'}
            </button>
        </div>
    )
}

// 购物车项目组件
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
    return (
        // TODO_02 (10分): 完善购物车项目JSX结构
        // 要求：
        // 1. 显示商品名称、单价、数量和小计
        // 2. 添加"+"和"-"按钮来增减商品数量
        // 3. 当数量为1时，"-"按钮应该变成"删除"按钮
        // 4. 正确计算并显示小计金额
        
        <div className="cart-item">
            <span className="item-name">{item.name}</span>
            <span className="item-price">¥{item.price}</span>
            <div className="quantity-controls">
                <button 
                    className={item.quantity === 1 ? "qty-btn remove-btn" : "qty-btn"}
                    onClick={() => item.quantity === 1 ? onRemove(item) : onDecrease(item)}
                >
                    {item.quantity === 1 ? '删除' : '-'}
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                    className="qty-btn"
                    onClick={() => onIncrease(item)}
                >
                    +
                </button>
            </div>
            <span className="subtotal">¥{(item.price * item.quantity).toFixed(2)}</span>
        </div>
    )
}

// 主应用组件
function ShoppingCartApp() {
    const [cartItems, setCartItems] = useState([])
    
    // TODO_03 (10分): 使用useMemo实现购物车统计
    // 要求：
    // 1. 使用useMemo创建totalPrice，计算购物车总价
    // 2. 使用useMemo创建totalQuantity，计算商品总数量
    // 3. 使用useMemo创建isCartEmpty，判断购物车是否为空
    
    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    }, [cartItems])
    
    const totalQuantity = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0)
    }, [cartItems])
    
    const isCartEmpty = useMemo(() => {
        return cartItems.length === 0
    }, [cartItems])
    
    // 添加商品到购物车
    const addToCart = (product) => {
        if (product.stock <= 0) {
            alert('商品库存不足！')
            return
        }
        
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id)
            
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    return prevItems.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                } else {
                    alert('已达到该商品的最大库存量！')
                    return prevItems
                }
            } else {
                return [...prevItems, {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    maxStock: product.stock
                }]
            }
        })
    }
    
    // TODO_02 (10分): 实现购物车操作函数
    // 要求：
    // 1. 完成increaseQuantity函数：增加商品数量（不能超过库存）
    // 2. 完成decreaseQuantity函数：减少商品数量（为1时应移除商品）
    // 3. 完成removeFromCart函数：从购物车中移除商品
    
    const increaseQuantity = (item) => {
        setCartItems(prevItems => {
            return prevItems.map(cartItem => {
                if (cartItem.id === item.id) {
                    if (cartItem.quantity < cartItem.maxStock) {
                        return { ...cartItem, quantity: cartItem.quantity + 1 }
                    } else {
                        alert('已达到该商品的最大库存量！')
                        return cartItem
                    }
                }
                return cartItem
            })
        })
    }
    
    const decreaseQuantity = (item) => {
        setCartItems(prevItems => {
            return prevItems.map(cartItem => {
                if (cartItem.id === item.id && cartItem.quantity > 1) {
                    return { ...cartItem, quantity: cartItem.quantity - 1 }
                }
                return cartItem
            })
        })
    }
    
    const removeFromCart = (item) => {
        setCartItems(prevItems => {
            return prevItems.filter(cartItem => cartItem.id !== item.id)
        })
    }
    
    // 结算功能
    const checkout = () => {
        if (cartItems.length === 0) {
            alert('购物车是空的！')
            return
        }
        
        alert(`结算成功！总金额：¥${totalPrice.toFixed(2)}`)
        setCartItems([])
    }
    
    return (
        <div className="container">
            <h1>🛒 React购物车应用</h1>
            
            {/* 商品列表部分 */}
            <div className="products-section">
                <h2>商品列表</h2>
                <div className="products-grid">
                    {productsData.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                        />
                    ))}
                </div>
            </div>

            {/* 购物车部分 */}
            <div className="cart-section">
                <h2>购物车</h2>
                
                <div className="cart-items">
                    {/* TODO_03: 使用条件渲染显示空购物车提示或购物车商品列表 */}
                    {/* 提示：使用 isCartEmpty 来判断显示内容 */}
                    
                    {isCartEmpty ? (
                        <div className="cart-empty">
                            <p>购物车是空的，快去选购商品吧！</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onIncrease={increaseQuantity}
                                onDecrease={decreaseQuantity}
                                onRemove={removeFromCart}
                            />
                        ))
                    )}
                </div>

                <div className="cart-summary">
                    <div className="summary-row">
                        <span>商品数量：<strong>{totalQuantity}</strong> 件</span>
                    </div>
                    <div className="summary-row total">
                        <span>总计：<strong>¥{totalPrice.toFixed(2)}</strong></span>
                    </div>
                    <button className="checkout-btn" onClick={checkout}>
                        结算
                    </button>
                </div>
            </div>
        </div>
    )
}

function App() {
    return <ShoppingCartApp />
}

export default App
