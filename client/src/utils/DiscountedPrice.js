export const DiscountedPrice = (price,dis = 1)=>{
    const discounAmount = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discounAmount)
    return actualPrice
}