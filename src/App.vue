<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-spacer></v-spacer>
      <v-toolbar-title class="bar-title">Travel Translator</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<style>
.bar-title {
  font-family: "Leckerli One", cursive;
  color: #ffffff;
  font-size: 24px !important;
}
</style>
