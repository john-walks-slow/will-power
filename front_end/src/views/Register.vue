<template>
  <div class="container">
    <!-- <img class="logo" :src="LOGO" alt="" srcset="" /> -->
    <el-form title="Log In" :model="form" :rules="rules" ref="form">
      <el-form-item
        prop="email"
        :error="errorOnRegister ? 'Use a different email' : ''"
      >
        <el-input
          v-model="form.email"
          placeholder="Enter your email"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          v-model="form.password"
          placeholder="Enter your password"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password2">
        <el-input
          show-password
          v-model="form.password2"
          placeholder="Enter your password again"
        ></el-input>
      </el-form-item>
      <el-button
        class="button"
        @click="submitRegister()"
        :loading="isRegisterPending"
        >Register</el-button
      >
      <router-link class="linkLogin" to="/login">Go to log in</router-link>
    </el-form>
  </div>
</template>
<style scoped>
  .logo {
    width: 150px;
    margin-bottom: 20px;
  }
  .container {
    width: 300px;
    position: fixed;
    top: calc(50vh - 100px);
    left: calc(50vw - 150px);
  }
  .button {
    display: inline-block;
    margin-right: 15px;
    color: white;
    border-color: transparent;
    background-color: #62e9e3;
  }
  .linkLogin {
    text-decoration-line: underline;
    font-size: 0.9rem;
    color: #383838;
    display: inline-block;
  }
</style>

<script>
  import { ASSETS_UI } from 'assets';
  import { mapActions, mapState } from 'vuex';
  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Password cannot be empty'));
        } else if (value !== this.form.password) {
          callback(new Error('Password inconsistent!'));
        } else {
          callback();
        }
      };
      return {
        LOGO: ASSETS_UI['logo.png'],
        form: {
          email: '',
          password: '',
          password2: ''
        },
        rules: {
          password: [
            {
              required: true,

              message: 'Please enter your password',
              trigger: 'blur'
            },
            {
              min: 8,
              message: 'Password has to contains more than 8 characters',
              trigger: 'blur'
            }
          ],
          password2: [{ validator: validatePass2, trigger: 'blur' }],
          email: [
            {
              required: true,
              message: 'Please enter your email',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: 'Email incorrect',
              trigger: ['blur', 'change']
            }
          ]
        }
      };
    },
    methods: {
      ...mapActions('users', { register: 'create' }),
      submitRegister() {
        console.log('reg');
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.register({
              email: this.form.email,
              password: this.form.password
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    computed: {
      ...mapState('users', { isRegisterPending: 'isCreatePending' }),
      ...mapState('users', ['errorOnRegister'])
    },
    watch: {
      isRegisterPending(v, old) {
        if (v === false && old === true && !this.errorOnRegister) {
          this.$router.push('/login');
        }
      }
    }
  };
</script>
