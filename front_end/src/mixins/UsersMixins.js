import { mapActions, mapGetters, mapState } from 'vuex';

import feathersClient from 'feathers-client';

export default {
  computed: {
    ...mapState('users', {
      areUsersLoading: 'isFindPending',
      usersPagination: 'pagination'
    }),
    ...mapGetters('users', {
      findUsersInStore: 'find',
      listUsers: 'list'
    })
  },
  methods: {
    ...mapActions('users', {
      findUsers: 'find'
    })
  },
  async created() {
    console.log('usersMixin was loaded');

    feathersClient.service('users').on('created', data => {
      console.log(`User created - ${data.title}`);
    });

    try {
      await this.findusers({});
      console.log('found users');
    } catch (e) {
      console.error(e);
    }
  }
};
