<template>
  <div class=boxForm>
    <h1>CONTACT US</h1>
    <p>Feel free to leave a message! </p>
    <form>
        <input type="text" class=inputForm id="fname" name="fname" placeholder="First Name" autocomplete="off" required><br>
        <input type="text" class=inputForm id="lname" name="lname" placeholder="Last Name" autocomplete="off" required><br>
        <input type="text" class=inputForm id="email" name="email" placeholder="Email" autocomplete="off" required><br>
        <textarea rows=5 class=inputForm id="msg" name="msg" placeholder="Message" autocomplete="off" required></textarea><br>
        <div class=subBtn><input class=btn type="submit" value="Send Message!"></div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Contact'
}