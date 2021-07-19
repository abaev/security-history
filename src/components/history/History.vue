<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" class="sh-h6">
        Security history
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-text-field v-model="inputs.name"
          :rules="[required('Fill this field')]"
          :error-messages="error && !inputs.name
            ? 'Fill this field' : ''"
          placeholder="Account name"
          label="Name">
        </v-text-field>

        <v-select v-model="inputs.timezoneName"
          :items="timezoneList"
          :rules="[required('Select timezone')]"
          :error-messages="error && !inputs.timezoneName
            ? 'Select timezone' : ''"
          label="Time zone" class="mt-6">
          <template v-slot:append>
            <v-icon>expand_more</v-icon>
          </template>
        </v-select>

        <v-select v-model="inputs.addressCountryCode"
          :items="countryList"
          :rules="[required('Select a country')]"
          :error-messages="error && !inputs.addressCountryCode
            ? 'Select a country' : ''" 
          item-text="name"
          item-value="code"
          label="Address" class="mt-6">
          <template v-slot:append>
            <v-icon>expand_more</v-icon>
          </template>
        </v-select>

        <v-text-field v-model="inputs.addressLine1"
          :rules="[required('Fill this field')]"
          :error-messages="error && !inputs.addressLine1
            ? 'Fill this field' : ''"
          placeholder="Address line 1">
        </v-text-field>

        <v-text-field v-model="inputs.addressLine"
          :rules="[required('Fill this field')]"
          :error-messages="error && !inputs.addressLine
            ? 'Fill this field' : ''"
          placeholder="Address line ">
        </v-text-field>

        <v-text-field v-model="inputs.postalCode"
          :rules="[required('Fill this field')]"
          :error-messages="error && !inputs.postalCode
            ? 'Fill this field' : ''"
          placeholder="Postal code">
        </v-text-field>

        <v-text-field v-model="inputs.password"
          :rules="[required('Fill this field')]"
          :error-messages="error && !inputs.password
            ? 'Fill this field' : ''"
          label="Password" type="password"
          class="mt-6">
        </v-text-field>

        <p @click="showChangePassword = true"
          class="change-password clickable">
          Change password
        </p>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-text-field v-model="inputs.email"
          :rules="[required('Fill this field'), validateEmail]"
          :error-messages="error && (!inputs.email || emailError)
            ? emailError || 'Fill this field' : ''" 
          type="email"
          label="Email">
        </v-text-field>
        
        <PhoneInput @phone-change="phone = $event"
          :error="phoneError"
          class="mt-6 px-3"/>
      </v-col>
    </v-row>

    <!-- Кнопки Save, Cancel, Close account -->
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col>
            <!-- Сообщение со статусом отправки -->
            <p v-if="sendingMessage">
              {{sendingMessage}}
            </p>

            <v-row justify="space-between"
              :class="{'d-inline-flex': $vuetify.breakpoint.smAndUp}">
              <v-col class="pr-1">
                <v-btn :block="$vuetify.breakpoint.xsOnly"
                  @click="send"
                  large 
                  rounded depressed 
                  class="px-12 sh-btn-primary">
                  Save
                </v-btn>
              </v-col>

              <v-col class="pl-1">
                <v-btn :block="$vuetify.breakpoint.xsOnly" large
                  rounded outlined
                  class="px-12 sh-btn-secondary">
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

          <v-col align="right">
            <v-spacer></v-spacer>
            <v-btn large rounded right
              class="px-12 sh-btn-default"
              depressed>
              Close account
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Диалоговое окно изменения пароля -->
    <ChangePasswordDialog v-if="showChangePassword"
      @close="showChangePassword = false"
      @password-change="changePassword($event);
        showChangePassword = false"/>
  </v-container>
</template>

<script>
  import moment from 'moment-timezone';
  import countryList from '@/country.list.json';
  import PhoneInput from '@/components/phone-input/PhoneInput';
  import ChangePasswordDialog from '@/components/change-password-dialog/ChangePasswordDialog';
  import api from '@/api/APIMixin.js';

  export default {
    name: 'History',

    components: { PhoneInput, ChangePasswordDialog },

    mixins: [api],

    data: () => ({
      timezoneList: moment.tz.names(),
      countryList,
      inputs: {
        name: '',
        timezoneName: '',
        addressCountryCode: '',
        addressLine1: '',
        addressLine: '',
        postalCode: '',
        password: '',
        email: ''
      },

      phone: null,
      error: false,
      emailError: '',
      phoneError: false,

      showChangePassword: false,
      sendingMessage: ''
    }),

    methods: {
      // Проверяем, что поле заполнено, возвращаем
      // текст сообщения об ошибке, если не заполнено
      required(errorMessage) {
        return inputValue => {
          return this.isExists(inputValue) || errorMessage;
        };
      },

      // Проверяем, что значение существует
      isExists(value) {
        if(typeof value === 'string') {
          return !!value.trim();
        
        } else return !!value;
      },

      // Проверяем email
      validateEmail(email) {
        if(typeof email !== 'string'
          || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.trim())) {
          return 'Invalid email';
        
        } else return true;
      },

      // Отправляем данные
      send() {
        // Проверим, что все поля заполнены
        this.error = false;
        this.emailError = '';
        this.phoneError = false;
        this.sendingMessage = '';

        for(let i in this.inputs) {
          if(!this.isExists(this.inputs[i])) {
            this.error = true;
            break;
          }
        }

        // Проверим, корректен ли имэйл
        if(this.inputs.email &&
          this.validateEmail(this.inputs.email) !== true) {
          this.error = true;
          this.emailError = 'Invalid email'
        }

        // Проверим телефон
        if(!this.phone) {
          this.phoneError = true;
        }

        if(!this.error && !this.phoneError) {
          // Всё заполнено/проверено, отправляем
          this.sendingMessage = 'Saving...';
          this.apiSandData(this.inputs)
            .then(() => {
              this.sendingMessage = 'Data has been saved';
            })
            // Для простототы не делал вывод пользователю
            // при ошибке, это былобы всё-равно похоже на
            // вывод об успешной отпрвке
            .catch(error => console.log(error));
        }
      },

      // Изменяем пароль
      changePassword(event) {
        this.sendingMessage = 'Changing password...';
        this.apiChangePassword(event)
          .then(() => {
            this.sendingMessage = 'Password has been changed';
          })
          // Для простототы не делал вывод пользователю
          // при ошибке, это былобы всё-равно похоже на
          // вывод об успешной отпрвке
          .catch(error => console.log(error));
      }
    }
  }
</script>

<style lang="scss" scoped>
  .change-password {
    font-weight: 600;
    color: $sh-primary-color;
  }
</style>
