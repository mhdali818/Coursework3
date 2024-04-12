<template>
    <header>
        
      <h1>{{ WebAppName }}</h1>

      <div class="header-controls">
      <div>
        <label>Sort by:</label>
        <select v-model="sortOption" @change="updateSortOption">
          <option value="subject">Subject</option>
          <option value="location">Location</option>
          <option value="price">Price</option>
          <option value="spaces">Spaces</option>
        </select>
        <br>
        <label>Order:</label>
        <select v-model="orderOption" @change="updateOrderOption">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div>
        <label>Search:</label>
        <input :value="searchQuery" @input="updateSearchQuery" placeholder="Search lessons..." />
      </div>
      <button @click="toggleCheckout" :disabled="!cart.length" class="checkout-button">
        <span class="fas fa-cart-plus"></span> Checkout ({{ cart.length }})
      </button>
    </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'AppHeader',
    props: ['WebAppName', 'cart', 'sortAttribute', 'sortOrder', 'searchQuery'],
    data() {
      return {
        sortOption: 'subject',
        orderOption: 'asc'
      };
    },
    
    methods: {
      toggleCheckout() {
        this.$emit('toggle-checkout');
      },
      updateSortOption() {
    console.log('Sorting option updated:', this.sortOption);
    this.$emit('update:sortAttribute', this.sortOption);
  },
  updateOrderOption() {
    console.log('Order option updated:', this.orderOption);
    this.$emit('update:sortOrder', this.orderOption);
  },
  
      updateSearchQuery(event) {
        this.$emit('update:searchQuery', event.target.value);
      }
    }
    
  };


  
  </script>
  
  <style>
.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkout-button {
  margin-left: 10px;
}
  </style>