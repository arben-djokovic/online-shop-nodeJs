class Order{
    constructor(items){
        this.items = items,
        this.totalPrice = 0,
        this.totalPrice = items.reduce((total, item) => total + item.price, 0);
        this.numOfItems = items.length
    }
    // addItem(item) {

    // }
}