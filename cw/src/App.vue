<template>
  <div id="app">
    <Header :WebAppName="WebAppName" :cart="cart" :sortAttribute="sortAttribute" :sortOrder="sortOrder" :searchQuery="searchQuery" @toggle-checkout="toggleCheckout" @update:sortAttribute="updateSortAttribute" @update:sortOrder="updateSortOrder" @update:searchQuery="updateSearchQuery" @fetch-lessons="fetchLessons"/>

    <main>
      <div v-if="showProduct">
        <LessonSquare v-for="lesson in filteredLessons" :key="lesson._id" :lesson="lesson" @add-to-cart="addToCart" />
      </div>
      <div v-else>
        <Cart :cart="cart" :customerName="customerName" :customerPhone="customerPhone" :nameValid="nameValid" :phoneValid="phoneValid" @remove-from-cart="removeFromCart" @place-order="placeOrder" />
      </div>
    </main>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import LessonSquare from './components/LessonSquare.vue';
import Cart from './components/Cart.vue';

export default {
  name: 'App',
  components: {
    Header,
    LessonSquare,
    Cart
  },
  data() {
    return {
      WebAppName: 'After Hour Adventures',
      showProduct: true,
      sortAttribute: 'subject',
      sortOrder: 'asc',
      searchQuery: '',
      lessons: [],
      cart: [],
      customerName: '',
      customerPhone: ''
    };
  },
  created() {
    this.fetchLessons();
  },
  methods: {
    fetchLessons() {
      fetch(`http://localhost:3000/lessons`)
        .then(response => response.json())
        .then(data => {
          this.lessons = data;
        })
        .catch(error => console.error('Error fetching lessons:', error));
    },
    addToCart(lesson) {
      this.cart.push({ ...lesson, cartKey: Date.now() });
      lesson.spaces--;
    },
    removeFromCart(cartItem) {
      const index = this.cart.findIndex(item => item.cartKey === cartItem.cartKey);
      if (index > -1) {
        this.cart.splice(index, 1);
        const lesson = this.lessons.find(lesson => lesson._id === cartItem._id);
        if (lesson) lesson.spaces++;
      }
    },
    placeOrder(orderData) {
      fetch('http://localhost:3000/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Order placed:', data);
          alert('Order has been placed. Thank you.');
          this.cart = [];
          this.customerName = '';
          this.customerPhone = '';
          this.showProduct = true;
        })
        .catch(error => {
          console.error('Error placing order:', error);
          alert('Failed to place order.');
        });
    },

    toggleCheckout() {
      this.showProduct = !this.showProduct;
    },

    updateSortAttribute(attribute) {
    console.log('Sort attribute updated:', attribute);
    this.sortAttribute = attribute;
    this.$emit('update:sortAttribute', this.sortAttribute);
  },
  updateSortOrder(order) {
    console.log('Sort order updated:', order);
    this.sortOrder = order;
    this.$emit('update:sortOrder', this.sortOrder);
  },
  updateSearchQuery(query) {
    console.log('Search query updated:', query);
    this.searchQuery = query;
  },
  },

  
  computed: {
    filteredLessons() {
    console.log('Recalculating filteredLessons...');
    let filtered = this.lessons.slice(); 
    const searchLower = this.searchQuery.toLowerCase();
    filtered = filtered.filter(lesson => {
      const subject = lesson.subject ? lesson.subject.toLowerCase() : '';
      const location = lesson.location ? lesson.location.toLowerCase() : '';
      const description = lesson.description ? lesson.description.toLowerCase() : '';
      return subject.includes(searchLower) || location.includes(searchLower) || description.includes(searchLower);
    });
    return filtered.sort((a, b) => {
      const modifier = this.sortOrder === 'desc' ? -1 : 1;
      if (this.sortAttribute === 'price' || this.sortAttribute === 'spaces') {
        return (a[this.sortAttribute] - b[this.sortAttribute]) * modifier;
      } else {
        return a[this.sortAttribute].localeCompare(b[this.sortAttribute]) * modifier;
      }
    });
  },
  }
}
</script>

<style scoped>
main {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }
</style>
