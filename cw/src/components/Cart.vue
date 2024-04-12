<template>
    <div>
      <h2>Shopping Cart</h2>
      <div v-for="item in cart" :key="item.cartKey">
        <h3>{{ item.subject }}</h3>
        <p>Location: {{ item.location }}</p>
        <p>Price: {{ item.price }} AED</p>
        <button @click="removeFromCart(item)">Remove from Cart</button>
      </div>
      <div>
        <br>
        <label>Name:</label>
        <input v-model="localName" placeholder="Your Name">
        <span v-if="!isNameValid" style="color: red;">Name must not contain numbers/special characters.</span>
        <label>Phone:</label>
        <input v-model="localPhone" placeholder="Your Phone Number">
        <span v-if="!isPhoneValid" style="color: red;">Phone No. must be between 10 and 12 digits.</span>
      </div>
      <br>
      <button @click="placeOrder" :disabled="cart.length === 0">Place Order</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ShoppingCart',
    props: ['cart', 'customerName', 'customerPhone'],
    data() {
      return {
        localName: '',
        localPhone: '',
      };
    },
    watch: {
      customerName(value) {
        this.localName = value;
      },
      customerPhone(value) {
        this.localPhone = value;
      },
    },
    computed: {
      isNameValid() {
        return /^[A-Za-z\s]+$/.test(this.localName) && this.localName.length > 1;
      },
      isPhoneValid() {
        return /^\d{10,12}$/.test(this.localPhone);
      },
    },
    methods: {
      removeFromCart(item) {
        this.$emit('remove-from-cart', item);
      },
      placeOrder() {
  if (this.isNameValid && this.isPhoneValid) {
    // Calculate the quantity of each item in the cart
    const groupedItems = this.cart.reduce((acc, item) => {
      if (!acc[item._id]) {
        acc[item._id] = { id: item._id, quantity: 0 };
      }
      acc[item._id].quantity++;
      return acc;
    }, {});

    // Convert grouped items into an array
    const orderItems = Object.values(groupedItems);

    // Emit the place-order event with the order data
    this.$emit('place-order', {
      customerName: this.localName,
      customerPhone: this.localPhone,
      items: orderItems, // Use the orderItems array instead of this.cart
    });
  } else {
    alert('Please correct the errors before placing your order.');
  }
},
    },
  };
  </script>
  
  <style>
  </style>
  