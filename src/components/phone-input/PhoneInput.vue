<!-- Вввод телефона с выбором страны -->

<template>
  <v-row>
    <!-- Выбор страны -->
    <v-col cols="3" class="pa-0">
      <v-select v-model="countryCode"
        :items="countriesList"
        
        @input="validateFormatPhone"
        item-text="name"
        item-value="code"
        width="25%" class="mt-0">
        <template v-slot:append>
          <v-icon>expand_more</v-icon>
        </template>

        <template v-slot:selection="{ item }">
          <img v-if="$vuetify.breakpoint.xsOnly" :src="`https://www.countryflags.io/${item.code}/flat/16.png`">
          <img v-else :src="`https://www.countryflags.io/${item.code}/flat/24.png`">
          
          <span class="ml-1">{{ item.code }}</span>
        </template>
        <template v-slot:item="{ item }">
          <img :src="`https://www.countryflags.io/${item.code}/flat/32.png`">
          <span class="ml-1">{{ item.code }}</span>
        </template>
      </v-select>
    </v-col>

    <!-- Номер телефона -->
    <v-col cols="9" class="pa-0">
      <v-text-field v-model="phoneInput"
        :error-messages="errors"
        @input="validateFormatPhone"
        class="mt-0">
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
  import countries from "country-flag-emoji";
  import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';

  export default {
    props: ['error'],

    data: () => ({
      countriesList: countries.list,
      countryCode: '',
      phoneInput: '',
      errors: []
    }),

    watch: {
      // Следим за свойством, если оно становится true,
      // запускаем проверку телефона, чтобы отобразить
      // соответствующую ошибку
      error(newValue) {
        if(newValue) this.validateFormatPhone();
      }
    },

    methods: {
      // Проверяем и форматируем телефон
      validateFormatPhone() {
        this.errors = [];
        let errors = [];
        
        if(!this.phoneInput || !this.countryCode) {
          if(!this.phoneInput) errors.push('Input phone number');
          if(!this.countryCode) errors.push('Pick a counry');

          this.errors = errors;
          this.$emit('phone-change', null);

          return;
        }

        const phoneNumber =
          parsePhoneNumberFromString(this.phoneInput, this.countryCode);
        
        if(phoneNumber && phoneNumber.isValid()) {
          // Если телефон существует выпускаем событие
          // с соотвествующим объектом
          this.$emit('phone-change', {
            countryCode: this.countryCode,
            phoneNumber: this.phoneInput
          });

          this.phoneInput = phoneNumber.formatNational();
        
        } else {
          // Если не существует - выпускаем с null
          this.$emit('phone-change', null);

          this.errors = ['Invalid phone number'];
        }
      }
    }
  }
</script>
