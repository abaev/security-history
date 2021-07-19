<!-- Диалог смены пароля -->
<template>
  <v-dialog value="true" max-width="400"
    persistent>
    <v-card>
      <v-card-title class="sh-h6">
        Change password
      </v-card-title>
      
      <v-card-text>
        <v-text-field v-model="oldPassword"
          :rules="[required]"
          :error-messages="error && !oldPassword
            ? 'Fill this field' : ''"
          label="Old password" type="password"
          class="mt-6">
        </v-text-field>

        <v-text-field v-model="newPassword"
          :rules="[required]"
          :type="visibile ? 'text' : 'password'"
          :error-messages="error && !newPassword
            ? 'Fill this field' : ''"
          label="New password"
          class="mt-6">
          <template v-slot:append>
            <span @click="visibile = !visibile"
              class="clickable">
              <v-icon v-if="visibile">visibility</v-icon>
              <v-icon v-else>visibility_off</v-icon>
            </span>
          </template>
        </v-text-field>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-btn @click="changePassword"
          :small="$vuetify.breakpoint.xsOnly"
          :large="$vuetify.breakpoint.smAndUp"
          rounded depressed 
          class="px-4 sh-btn-primary">
          Change password
        </v-btn>

        <v-btn @click="$emit('close')"
          :small="$vuetify.breakpoint.xsOnly"
          :large="$vuetify.breakpoint.smAndUp"
          rounded outlined
          class="px-4 sh-btn-secondary">
          Cancel
        </v-btn>
      </v-card-actions>

      <!-- Кнопка X в правом верхнем углу -->
      <v-btn icon absolute
        @click="$emit('close')"
        class="close-button">
        <v-icon >
          close
        </v-icon>
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ChangePasswordDialog',

    data: () => ({
      oldPassword: '',
      newPassword: '',
      visibile: false,
      error: false
    }),

    methods: {
      required(value) {
        return value ? true : 'Fill this field';
      },

      changePassword() {
        // Убедимся, что поля заполнены
        this.error = false;

        if(this.required(this.oldPassword) !== true
          || this.required(this.newPassword) !== true) {
          this.error = true;
          return;
        }

        // Поля заполнены, перадаем в родительский
        // компонент для отправки
        this.$emit('password-change', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .close-button {
    top: $spacer;
    right: $spacer;
  }
</style>