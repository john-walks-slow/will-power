<template>
  <div class="container">
    <img class="logo" :src="LOGO" alt="" srcset="" />
    <el-form title="Log In" :model="form" :rules="rules" ref="form">
      <el-form-item prop="email" :error="isLoginError ? 'Login fail' : null">
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
          @keyup.enter.native="submitLogin"
        ></el-input>
      </el-form-item>
      <el-button class="button" @click="submitLogin" :loading="isLoginPending"
        >Log In</el-button
      >
      <router-link class="linkRegister" to="/register">Register</router-link>
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
  .linkRegister {
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
      return {
        LOGO: ASSETS_UI['logo.png'],
        form: {
          email: '',
          password: ''
        },
        rules: {
          password: [
            {
              required: true,

              message: 'Please enter your password',
              trigger: 'blur'
            },
            {
              min: 4,
              message: 'Password has to contains more than 4 characters',
              trigger: 'blur'
            }
          ],
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
      async submitLogin() {
        await this.logout();
        this.$refs['form'].validate(async valid => {
          if (valid) {
            console.log(this.authenticate);
            let result = await this.authenticate({
              strategy: 'local',
              email: this.form.email,
              password: this.form.password
            });
            if (result.accessToken) {
              this.$router.push('/');
            }
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      ...mapActions('auth', ['authenticate', 'logout'])
    },
    computed: {
      ...mapState('auth', {
        isLoginError: 'errorOnAuthenticate',
        isLoginPending: 'isAuthenticatePending',
        user: 'user'
      })
    },

    mounted() {}
  };
</script>
