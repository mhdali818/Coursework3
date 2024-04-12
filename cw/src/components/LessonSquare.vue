<template>
  <div class="lesson-square">
    <img :src="lesson.image" :alt="lesson.subject">
    <h2>{{ lesson.subject }}</h2>
    <p>Location: {{ lesson.location }}</p>
    <p>Price: {{ lesson.price }} AED</p>
    <p>Spaces: {{ lesson.spaces }}</p>
    <button @click="addToCart" :disabled="lesson.spaces === 0">Add to cart</button>
  </div>
</template>

<script>
export default {
  name: 'LessonSquare',
  props: ['lesson'],
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.lesson);
    }
  }
}
</script>

<style>
.lesson-square {
            width: 180px;
            padding: 10px;
            margin: 10px;
            border: 1px solid #ccc;
            text-align: center; 
        }

        .lesson-square img {
            width: 180px; 
            height: auto;
            border-radius: 100%; 
        }

        
</style>
