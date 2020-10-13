<template>
  <div class="home" @click="showMsg">
    <img src="../assets/logo.png" alt="" srcset="">
    home
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    showMsg() {
      console.log(123);
    },
  },
};
</script>
